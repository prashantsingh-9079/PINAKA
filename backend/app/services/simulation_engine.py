import asyncio
import time
import math
import numpy as np
import logging
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Track, TrackHistory, Sensor, SystemEvent, Observation
from app.websocket.manager import ws_manager
from app.services.ekf_service import ExtendedKalmanFilter
from app.services.cluster_service import analyze_groups

logger = logging.getLogger("pinaka.simulation")

class SimulationEngine:
    def __init__(self):
        self.is_running = True
        self.is_paused = False
        self.speed_multiplier = 1.0
        self.scenario = "default"
        self.tick_rate_hz = 10
        self.start_time = time.time()
        self.radar_sweep_angle = 0.0
        self.ekf_filters = {}  # track_id -> ExtendedKalmanFilter
        self.tracks_state = []
        self._task = None

    def initialize_from_db(self, db: Session):
        """Loads tracks from database into live simulation state."""
        db_tracks = db.query(Track).all()
        self.tracks_state = []
        self.ekf_filters = {}

        for trk in db_tracks:
            item = {
                "id": trk.id,
                "callsign": trk.callsign,
                "classification": trk.classification,
                "x": trk.x,
                "y": trk.y,
                "alt": trk.alt,
                "lat": trk.lat,
                "lng": trk.lng,
                "velocity": trk.velocity,
                "heading": trk.heading,
                "climbRate": trk.climb_rate,
                "range": trk.range,
                "azimuth": trk.azimuth,
                "elevation": trk.elevation,
                "rcs": trk.rcs,
                "confidence": trk.confidence,
                "fusedSensors": trk.fused_sensors_json or ["camera", "radar"],
                "rfFrequency": trk.rf_frequency,
                "rfPower": trk.rf_power,
                "thermalSignature": trk.thermal_signature,
                "thermalTempMax": trk.thermal_temp_max,
                "opticalBBox": trk.bbox_json or {"x": 45, "y": 38, "w": 8, "h": 8},
                "verificationStatus": trk.verification_status,
                "operatorNotes": trk.operator_notes,
                "groupId": trk.group_id,
                "history": [],
                "isSimulated": True,
                "lastUpdated": trk.last_updated
            }

            # Seed initial history
            hist_records = db.query(TrackHistory).filter_by(track_id=trk.id).order_by(TrackHistory.timestamp).limit(20).all()
            for h in hist_records:
                item["history"].append({
                    "timestamp": h.timestamp,
                    "x": h.x,
                    "y": h.y,
                    "alt": h.alt,
                    "speed": h.speed,
                    "heading": h.heading,
                    "confidence": h.confidence,
                    "fusedSensors": h.fused_sensors_json or [],
                    "rcs": h.rcs
                })

            self.tracks_state.append(item)
            self.ekf_filters[trk.id] = ExtendedKalmanFilter(
                x=trk.x, y=trk.y, z=trk.alt,
                vx=math.cos(math.radians(trk.heading)) * trk.velocity / 36.0,
                vy=math.sin(math.radians(trk.heading)) * trk.velocity / 36.0,
                vz=trk.climb_rate
            )

    async def start(self):
        """Starts the background simulation tick loop."""
        self.is_running = True
        self.is_paused = False
        if self._task is None or self._task.done():
            self._task = asyncio.create_task(self._simulation_loop())
            logger.info("PINAKA Simulation Engine background task launched.")

    def pause(self):
        self.is_paused = True
        logger.info("PINAKA Simulation paused.")

    def resume(self):
        self.is_paused = False
        logger.info("PINAKA Simulation resumed.")

    def set_speed(self, speed: float):
        self.speed_multiplier = max(0.25, min(10.0, speed))
        logger.info(f"PINAKA Simulation speed set to {self.speed_multiplier}x.")

    def set_scenario(self, scenario_name: str, db: Session):
        self.scenario = scenario_name
        now = time.time()

        if scenario_name == "swarm-5":
            # 5 Synchronized Swarm in Wedge Formation
            swarm_tracks = []
            offsets = [(0, 0), (-5, 6), (5, 6), (-10, 12), (10, 12)]
            callsigns = ["SWARM-LEAD", "SWARM-WING-L", "SWARM-WING-R", "SWARM-TAIL-L", "SWARM-TAIL-R"]

            for i, (dx, dy) in enumerate(offsets):
                t_id = f"TRK-SW-{i+1}"
                item = {
                    "id": t_id,
                    "callsign": callsigns[i],
                    "classification": "Commercial Quadcopter",
                    "x": 48.0 + dx,
                    "y": 42.0 + dy,
                    "alt": 125.0 + i * 2,
                    "lat": 28.6139 + dy * 0.0001,
                    "lng": 77.2090 + dx * 0.0001,
                    "velocity": 52.0,
                    "heading": 135.0,
                    "climbRate": 0.0,
                    "range": 1320.0 + i * 40,
                    "azimuth": 44.0 + dx * 0.3,
                    "elevation": 5.4,
                    "rcs": -14.2,
                    "confidence": 0.98,
                    "fusedSensors": ["camera", "thermal", "radar", "rf"],
                    "rfFrequency": f"2.4{37 + i} GHz (Mesh Link)",
                    "rfPower": -64.0,
                    "thermalSignature": "ΔT +7.2°C / Brushless Core",
                    "thermalTempMax": 44.0,
                    "opticalBBox": {"x": 45 + dx, "y": 38 + dy, "w": 7, "h": 7},
                    "verificationStatus": "Under Review",
                    "operatorNotes": "5-UAV Synchronized Swarm Wedge Formation.",
                    "groupId": "SWARM-ALPHA-5",
                    "history": [],
                    "isSimulated": True,
                    "lastUpdated": now
                }
                swarm_tracks.append(item)
                self.ekf_filters[t_id] = ExtendedKalmanFilter(x=item["x"], y=item["y"], z=item["alt"])
            self.tracks_state = swarm_tracks

        elif scenario_name == "fpv-speed":
            t_id = "TRK-904"
            item = {
                "id": t_id,
                "callsign": "VORTEX-FAST",
                "classification": "FPV Drone",
                "x": 72.0,
                "y": 28.0,
                "alt": 45.0,
                "lat": 28.6210,
                "lng": 77.2185,
                "velocity": 125.0,
                "heading": 220.0,
                "climbRate": -2.5,
                "range": 2150.0,
                "azimuth": 68.2,
                "elevation": 1.2,
                "rcs": -19.5,
                "confidence": 0.94,
                "fusedSensors": ["camera", "radar", "rf"],
                "rfFrequency": "5.845 GHz (Band R, Ch 4) 800mW VTX",
                "rfPower": -58.2,
                "thermalSignature": "ΔT +14.2°C / 6S LiPo Stator",
                "thermalTempMax": 58.6,
                "opticalBBox": {"x": 70, "y": 26, "w": 5, "h": 5},
                "verificationStatus": "Verified Hostile",
                "operatorNotes": "High-Speed nap-of-the-earth FPV sprint.",
                "groupId": None,
                "history": [],
                "isSimulated": True,
                "lastUpdated": now
            }
            self.tracks_state = [item]
            self.ekf_filters[t_id] = ExtendedKalmanFilter(x=item["x"], y=item["y"], z=item["alt"])

        elif scenario_name == "avian-clutter":
            t1 = self.tracks_state[0] if self.tracks_state else None
            bird = {
                "id": "TRK-906",
                "callsign": "CLUTTER-BIRD-1",
                "classification": "Avian Clutter",
                "x": 34.0,
                "y": 22.0,
                "alt": 65.0,
                "lat": 28.6250,
                "lng": 77.2020,
                "velocity": 28.0,
                "heading": 95.0,
                "climbRate": 0.0,
                "range": 1650.0,
                "azimuth": 325.0,
                "elevation": 2.3,
                "rcs": -22.0,
                "confidence": 0.84,
                "fusedSensors": ["camera", "radar"],
                "rfFrequency": "None (Biological Target)",
                "rfPower": -95.0,
                "thermalSignature": "ΔT +1.2°C (Biological Wing Surface)",
                "thermalTempMax": 32.1,
                "opticalBBox": {"x": 32, "y": 20, "w": 4.5, "h": 4.5},
                "verificationStatus": "False Positive",
                "operatorNotes": "Micro-Doppler harmonics show 5.2 Hz wing beat.",
                "groupId": None,
                "history": [],
                "isSimulated": True,
                "lastUpdated": now
            }
            self.tracks_state = [t for t in [t1, bird] if t]
            for t in self.tracks_state:
                self.ekf_filters[t["id"]] = ExtendedKalmanFilter(x=t["x"], y=t["y"], z=t["alt"])
        else:
            self.initialize_from_db(db)

    def reset(self, db: Session):
        self.initialize_from_db(db)
        self.speed_multiplier = 1.0
        self.scenario = "default"

    async def _simulation_loop(self):
        """Asynchronous physics integration, EKF filtering, and WebSocket streaming."""
        last_time = time.time()
        last_db_sync = time.time()

        while self.is_running:
            now = time.time()
            dt = (now - last_time) * self.speed_multiplier
            last_time = now

            if not self.is_paused and dt > 0:
                # Update radar sweep angle
                self.radar_sweep_angle = (self.radar_sweep_angle + 90.0 * dt) % 360.0

                # Kinematic physics update for each track
                for trk in self.tracks_state:
                    t_id = trk["id"]
                    
                    # Velocity components
                    rad = math.radians(trk["heading"])
                    # Speed in sector percent per second (approx 50m / percent)
                    speed_pct_per_sec = (trk["velocity"] / 3.6) / 50.0
                    
                    vx = math.cos(rad) * speed_pct_per_sec * dt
                    vy = math.sin(rad) * speed_pct_per_sec * dt

                    new_x = trk["x"] + vx
                    new_y = trk["y"] + vy
                    new_heading = trk["heading"]

                    # Boundary reflection inside 12% - 88%
                    if new_x < 12.0 or new_x > 88.0:
                        new_heading = (180.0 - new_heading + 360.0) % 360.0
                        new_x = max(12.0, min(88.0, new_x))
                    if new_y < 12.0 or new_y > 88.0:
                        new_heading = (360.0 - new_heading) % 360.0
                        new_y = max(12.0, min(88.0, new_y))

                    # Subtle heading jitter
                    new_heading = (new_heading + np.random.uniform(-1.0, 1.0) + 360.0) % 360.0
                    
                    # Altitude gentle variance
                    new_alt = max(20.0, trk["alt"] + float(np.random.uniform(-0.3, 0.3)))

                    # Update via EKF
                    ekf = self.ekf_filters.get(t_id)
                    if ekf:
                        ekf.predict(dt)
                        filtered_state = ekf.update(np.array([new_x, new_y, new_alt]))
                        filtered_x, filtered_y, filtered_alt = filtered_state[:3]
                    else:
                        filtered_x, filtered_y, filtered_alt = new_x, new_y, new_alt

                    # Recompute range, azimuth, elevation from sensor origin (50, 50)
                    dx_m = (filtered_x - 50.0) * 50.0
                    dy_m = (filtered_y - 50.0) * 50.0
                    ground_dist = math.sqrt(dx_m * dx_m + dy_m * dy_m)
                    range_m = math.sqrt(ground_dist * ground_dist + filtered_alt * filtered_alt)
                    azimuth_deg = (math.degrees(math.atan2(dy_m, dx_m)) + 360.0) % 360.0
                    elevation_deg = math.degrees(math.atan2(filtered_alt, max(1.0, ground_dist)))

                    # Bounding box update
                    bbox_w = trk["opticalBBox"].get("w", 8.0)
                    bbox_h = trk["opticalBBox"].get("h", 8.0)
                    trk["opticalBBox"] = {
                        "x": max(5.0, min(88.0, filtered_x - bbox_w / 2.0)),
                        "y": max(5.0, min(88.0, filtered_y - bbox_h / 2.0)),
                        "w": bbox_w,
                        "h": bbox_h
                    }

                    trk["x"] = round(filtered_x, 2)
                    trk["y"] = round(filtered_y, 2)
                    trk["alt"] = round(filtered_alt, 1)
                    trk["heading"] = round(new_heading, 1)
                    trk["range"] = round(range_m, 1)
                    trk["azimuth"] = round(azimuth_deg, 1)
                    trk["elevation"] = round(elevation_deg, 1)
                    trk["lastUpdated"] = now

                    # History append (max 25 points)
                    trk["history"].append({
                        "timestamp": now,
                        "x": trk["x"],
                        "y": trk["y"],
                        "alt": trk["alt"],
                        "speed": trk["velocity"] + float(np.random.uniform(-0.5, 0.5)),
                        "heading": trk["heading"],
                        "confidence": trk["confidence"],
                        "fusedSensors": trk["fusedSensors"],
                        "rcs": trk["rcs"]
                    })
                    trk["history"] = trk["history"][-25:]

                # Swarm Group analytics update
                groups = analyze_groups(self.tracks_state)

                # Broadcast live telemetry over WebSocket
                payload = {
                    "type": "TELEMETRY_UPDATE",
                    "timestamp": now,
                    "radarSweepAngle": round(self.radar_sweep_angle, 1),
                    "tracks": [
                        {
                            "id": t["id"],
                            "callsign": t["callsign"],
                            "classification": t["classification"],
                            "position": {
                                "x": t["x"],
                                "y": t["y"],
                                "alt": t["alt"],
                                "lat": t.get("lat", 28.6139),
                                "lng": t.get("lng", 77.2090)
                            },
                            "velocity": t["velocity"],
                            "heading": t["heading"],
                            "climbRate": t["climbRate"],
                            "range": t["range"],
                            "azimuth": t["azimuth"],
                            "elevation": t["elevation"],
                            "rcs": t["rcs"],
                            "confidence": t["confidence"],
                            "fusedSensors": t["fusedSensors"],
                            "rfFrequency": t["rfFrequency"],
                            "rfPower": t["rfPower"],
                            "thermalSignature": t["thermalSignature"],
                            "thermalTempMax": t["thermalTempMax"],
                            "opticalBBox": t["opticalBBox"],
                            "verificationStatus": t["verificationStatus"],
                            "operatorNotes": t["operatorNotes"],
                            "groupId": t["groupId"],
                            "history": t["history"],
                            "lastUpdated": t["lastUpdated"],
                            "isSimulated": True
                        }
                        for t in self.tracks_state
                    ],
                    "groups": groups,
                    "system": {
                        "activeSensors": 4,
                        "latencyMs": round(14.2 + np.random.uniform(-0.4, 0.4), 1),
                        "ptpJitterUs": 0.18,
                        "isSimulated": True
                    }
                }

                await ws_manager.broadcast(payload)

                # Periodic sync to SQLite (every 5 seconds) to avoid disk I/O thrashing
                if now - last_db_sync > 5.0:
                    last_db_sync = now
                    try:
                        db = SessionLocal()
                        for t in self.tracks_state:
                            db_trk = db.query(Track).filter_by(id=t["id"]).first()
                            if db_trk:
                                db_trk.x = t["x"]
                                db_trk.y = t["y"]
                                db_trk.alt = t["alt"]
                                db_trk.velocity = t["velocity"]
                                db_trk.heading = t["heading"]
                                db_trk.range = t["range"]
                                db_trk.azimuth = t["azimuth"]
                                db_trk.elevation = t["elevation"]
                                db_trk.last_updated = t["lastUpdated"]
                        db.commit()
                        db.close()
                    except Exception as e:
                        logger.error(f"Error syncing tracks to DB: {e}")

            # Sleep 100ms
            await asyncio.sleep(1.0 / self.tick_rate_hz)

simulation_engine = SimulationEngine()
