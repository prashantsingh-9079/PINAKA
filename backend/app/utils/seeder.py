import time
import numpy as np
from sqlalchemy.orm import Session
from app.models import (
    Sensor, 
    Track, 
    TrackHistory, 
    Observation, 
    SystemEvent, 
    EvaluationBenchmark, 
    EnvironmentalTest, 
    ReferenceSnapshot, 
    SimulationSession
)

def seed_database(db: Session):
    """Populates the database with initial sensors, benchmark datasets, and baseline tracks."""
    # Check if already seeded
    if db.query(Sensor).first():
        return

    # 1. Sensors
    sensors = [
        Sensor(
            id="camera",
            name="EO Optical Gimbal",
            full_title="Electro-Optical High-Resolution Surveillance Pod",
            model="PINAKA-EO-4K80 Ultra Zoom",
            status="ONLINE",
            health_score=98.0,
            data_quality=96.0,
            last_observation="0.04s ago",
            latency_ms=14.8,
            throughput_mbps=185.4,
            time_sync_jitter_us=0.18,
            active_detections_count=5,
            firmware_version="v4.8.2-rtsp-opt",
            specs_json={
                "spectralBand": "Visible 380 - 750 nm",
                "resolution": "3840 x 2160 (4K UHD)",
                "frameRate": "60 FPS Ultra-Low Latency",
                "fov": "3.2° Narrow to 64° Wide Dynamic Zoom"
            }
        ),
        Sensor(
            id="thermal",
            name="LWIR Thermal Core",
            full_title="Long-Wave Infrared Microbolometer Sensor",
            model="FLIR-PINAKA Boson-640 LWIR",
            status="ONLINE",
            health_score=99.0,
            data_quality=97.0,
            last_observation="0.03s ago",
            latency_ms=11.2,
            throughput_mbps=92.0,
            time_sync_jitter_us=0.22,
            active_detections_count=6,
            firmware_version="v2.1.0-ir-calib",
            specs_json={
                "spectralBand": "LWIR 7.5 - 13.5 μm",
                "resolution": "640 x 512 Uncooled VOx",
                "frameRate": "60 Hz Synchronized",
                "fov": "18° x 14° Telephoto IR Lens"
            }
        ),
        Sensor(
            id="radar",
            name="X-Band 3D AESA Radar",
            full_title="Active Electronically Scanned Array Micro-Doppler Radar",
            model="PINAKA-AESA-3DX FMCW",
            status="ONLINE",
            health_score=97.0,
            data_quality=99.0,
            last_observation="0.08s ago",
            latency_ms=16.5,
            throughput_mbps=450.8,
            time_sync_jitter_us=0.12,
            active_detections_count=7,
            firmware_version="v5.3.1-doppler-dsp",
            specs_json={
                "frequency": "X-Band 9.4 - 9.8 GHz FMCW",
                "resolution": "Range: 0.5m | Azimuth: 0.8° | Elevation: 1.2°",
                "maxRange": "5,000 m (Instrumented)",
                "fov": "360° Continuous Electronic Beam Steering"
            }
        ),
        Sensor(
            id="rf",
            name="Passive RF SDR Array",
            full_title="Authorized RF Telemetry & C2 Protocol Scanner",
            model="SDR-PINAKA Hydra-4X Wideband",
            status="ONLINE",
            health_score=96.0,
            data_quality=94.0,
            last_observation="0.02s ago",
            latency_ms=8.4,
            throughput_mbps=120.5,
            time_sync_jitter_us=0.15,
            active_detections_count=5,
            firmware_version="v3.7.0-sdr-hop",
            specs_json={
                "frequency": "400 MHz - 6.0 GHz Continuous Real-time",
                "resolution": "100 kHz Channelization / 40 MHz Instantaneous BW",
                "spectralBand": "FHSS, DSSS, OcuSync 2/3/4, ExpressLRS, TBS Crossfire",
                "maxRange": "8,000 m Line-of-Sight"
            }
        ),
    ]
    db.add_all(sensors)

    # 2. Tracks & Histories
    now = time.time()
    tracks = [
        Track(
            id="TRK-801",
            callsign="SPECTRE-1",
            classification="Commercial Quadcopter",
            x=48.0,
            y=42.0,
            alt=124.0,
            lat=28.6139,
            lng=77.2090,
            velocity=48.5,
            heading=135.0,
            climb_rate=-0.4,
            range=1240.0,
            azimuth=42.5,
            elevation=5.7,
            rcs=-14.2,
            confidence=0.98,
            fused_sensors_json=["camera", "thermal", "radar", "rf"],
            rf_frequency="2.437 GHz (Ch 6) / OcuSync 3.0",
            rf_power=-64.2,
            thermal_signature="ΔT +7.4°C / 4x Brushless Rotors + ESC Hub",
            thermal_temp_max=44.2,
            bbox_json={"x": 45, "y": 38, "w": 8, "h": 8},
            verification_status="Under Review",
            operator_notes="Target maintains stationary perimeter hover near Sector Alpha.",
            group_id="SWARM-BRAVO-1",
            is_simulated=True,
            last_updated=now
        ),
        Track(
            id="TRK-802",
            callsign="SPECTRE-2",
            classification="Commercial Quadcopter",
            x=52.0,
            y=45.0,
            alt=128.0,
            lat=28.6145,
            lng=77.2105,
            velocity=51.2,
            heading=138.0,
            climb_rate=0.2,
            range=1380.0,
            azimuth=46.1,
            elevation=5.3,
            rcs=-13.8,
            confidence=0.97,
            fused_sensors_json=["camera", "thermal", "radar", "rf"],
            rf_frequency="2.437 GHz (Ch 6) / Secondary Telemetry Link",
            rf_power=-66.8,
            thermal_signature="ΔT +6.9°C / Motor Arm Cluster",
            thermal_temp_max=43.5,
            bbox_json={"x": 50, "y": 42, "w": 7.5, "h": 7.5},
            verification_status="Under Review",
            operator_notes="Flocking coordinate with TRK-801; delta distance: ~180m.",
            group_id="SWARM-BRAVO-1",
            is_simulated=True,
            last_updated=now
        ),
        Track(
            id="TRK-803",
            callsign="SPECTRE-3",
            classification="Commercial Quadcopter",
            x=45.0,
            y=47.0,
            alt=130.0,
            lat=28.6132,
            lng=77.2112,
            velocity=49.8,
            heading=136.0,
            climb_rate=0.1,
            range=1410.0,
            azimuth=44.2,
            elevation=5.2,
            rcs=-14.0,
            confidence=0.96,
            fused_sensors_json=["camera", "thermal", "radar", "rf"],
            rf_frequency="2.442 GHz (Ch 7) / Mesh Relay",
            rf_power=-68.4,
            thermal_signature="ΔT +7.1°C / ESC Radiators",
            thermal_temp_max=44.0,
            bbox_json={"x": 43, "y": 44, "w": 8, "h": 8},
            verification_status="Under Review",
            operator_notes="Rear echelon element of 3-ship candidate formation.",
            group_id="SWARM-BRAVO-1",
            is_simulated=True,
            last_updated=now
        ),
        Track(
            id="TRK-904",
            callsign="VORTEX-FAST",
            classification="FPV Drone",
            x=72.0,
            y=28.0,
            alt=45.0,
            lat=28.6210,
            lng=77.2185,
            velocity=118.4,
            heading=220.0,
            climb_rate=-3.2,
            range=2150.0,
            azimuth=68.2,
            elevation=1.2,
            rcs=-19.5,
            confidence=0.93,
            fused_sensors_json=["camera", "radar", "rf"],
            rf_frequency="5.845 GHz (Band R, Ch 4) / Analog VTX 800mW",
            rf_power=-58.2,
            thermal_signature="ΔT +14.2°C / Overclocked LiPo Pack + 6S Stator",
            thermal_temp_max=58.6,
            bbox_json={"x": 70, "y": 26, "w": 5, "h": 5},
            verification_status="Verified Hostile",
            operator_notes="High-speed, nap-of-the-earth contour flight. High agility evasive maneuvering.",
            group_id=None,
            is_simulated=True,
            last_updated=now
        ),
        Track(
            id="TRK-905",
            callsign="EAGLE-SCAN",
            classification="Fixed-Wing Drone",
            x=22.0,
            y=68.0,
            alt=480.0,
            lat=28.6040,
            lng=77.1950,
            velocity=82.0,
            heading=45.0,
            climb_rate=0.8,
            range=3420.0,
            azimuth=210.4,
            elevation=8.1,
            rcs=-8.5,
            confidence=0.99,
            fused_sensors_json=["camera", "thermal", "radar", "rf"],
            rf_frequency="915 MHz FHSS Telemetry / Microhard Link",
            rf_power=-61.0,
            thermal_signature="ΔT +9.5°C / Pusher Prop Motor Housing",
            thermal_temp_max=48.2,
            bbox_json={"x": 20, "y": 65, "w": 9, "h": 7},
            verification_status="Authorized Flight",
            operator_notes="Scheduled agricultural corridor survey corridor #IND-DEL-402.",
            group_id=None,
            is_simulated=True,
            last_updated=now
        ),
        Track(
            id="TRK-906",
            callsign="CLUTTER-BIRD-1",
            classification="Avian Clutter",
            x=34.0,
            y=22.0,
            alt=65.0,
            lat=28.6250,
            lng=77.2020,
            velocity=28.0,
            heading=95.0,
            climb_rate=-0.1,
            range=1650.0,
            azimuth=325.0,
            elevation=2.3,
            rcs=-22.0,
            confidence=0.84,
            fused_sensors_json=["camera", "radar"],
            rf_frequency="None (Silent / No RF Emission Detected)",
            rf_power=-95.0,
            thermal_signature="ΔT +1.2°C / Biological Wing Surface (Diffuse)",
            thermal_temp_max=32.1,
            bbox_json={"x": 32, "y": 20, "w": 4.5, "h": 4.5},
            verification_status="False Positive",
            operator_notes="Micro-Doppler spectral analysis confirms biological wing flapping frequency (5.2 Hz). No RF emission.",
            group_id=None,
            is_simulated=True,
            last_updated=now
        ),
    ]
    db.add_all(tracks)
    db.commit()

    # Add historical points for each track
    for trk in tracks:
        for i in range(5, 0, -1):
            t_offset = now - i * 15
            dx = (np.random.rand() - 0.5) * 2.0
            dy = (np.random.rand() - 0.5) * 2.0
            hist = TrackHistory(
                track_id=trk.id,
                timestamp=t_offset,
                x=trk.x + dx,
                y=trk.y + dy,
                alt=trk.alt + (np.random.rand() - 0.5) * 3,
                speed=trk.velocity + (np.random.rand() - 0.5) * 2,
                heading=trk.heading,
                confidence=trk.confidence,
                fused_sensors_json=trk.fused_sensors_json,
                rcs=trk.rcs
            )
            db.add(hist)

            # Also seed raw observations
            for s_id in trk.fused_sensors_json:
                obs = Observation(
                    id=f"OBS-{trk.id}-{s_id}-{int(t_offset)}",
                    sensor_id=s_id,
                    timestamp=t_offset,
                    track_id=trk.id,
                    x=trk.x + dx,
                    y=trk.y + dy,
                    alt=trk.alt,
                    speed=trk.velocity,
                    heading=trk.heading,
                    confidence=trk.confidence,
                    rcs=trk.rcs,
                    classification=trk.classification,
                    data_source="SIMULATED_TESTBED",
                    is_simulated=True
                )
                db.add(obs)

    # 3. Events
    events = [
        SystemEvent(
            id="EVT-108",
            timestamp="19:24:12 UTC",
            type="FUSION_LOCK",
            severity="alert",
            title="4-Sensor Fusion Lock Confirmed",
            message="TRK-801, TRK-802, TRK-803 validated with Optical, Thermal, Radar, and RF correlation (Confidence > 0.96).",
            track_id="TRK-801"
        ),
        SystemEvent(
            id="EVT-107",
            timestamp="19:23:45 UTC",
            type="RF_EMISSION",
            severity="warning",
            title="Unregistered VTX Emission Detected",
            message="Wideband SDR detected 5.8 GHz analog video transmission at 800mW from TRK-904.",
            track_id="TRK-904"
        ),
        SystemEvent(
            id="EVT-106",
            timestamp="19:22:18 UTC",
            type="GROUP_SPLIT",
            severity="info",
            title="Candidate Swarm Cohesion High",
            message="SWARM-BRAVO-1 maintains rigid V-formation geometry. Cohesion metric: 0.94.",
            track_id="TRK-802"
        ),
        SystemEvent(
            id="EVT-105",
            timestamp="19:20:05 UTC",
            type="OPERATOR_OVERRIDE",
            severity="info",
            title="Clutter Rejection Applied",
            message="TRK-906 reclassified to Avian Clutter by Operator based on micro-Doppler wing harmonics.",
            track_id="TRK-906"
        ),
        SystemEvent(
            id="EVT-104",
            timestamp="19:18:30 UTC",
            type="DETECTION",
            severity="info",
            title="Authorized Corridor Correlation",
            message="TRK-905 flight telemetry matched with DGCA Indian Skyways agricultural permit #402.",
            track_id="TRK-905"
        )
    ]
    db.add_all(events)

    # 4. Evaluation Benchmarks
    benchmarks = [
        EvaluationBenchmark(
            id="BM-1",
            metric_name="Precision (P)",
            vision_only_score=84.6,
            multi_sensor_score=98.4,
            improvement_delta="+13.8%",
            unit="%",
            description="Proportion of true positive drone detections against total positive classifications.",
            is_benchmark=True
        ),
        EvaluationBenchmark(
            id="BM-2",
            metric_name="Recall / Sensitivity (R)",
            vision_only_score=79.1,
            multi_sensor_score=97.2,
            improvement_delta="+18.1%",
            unit="%",
            description="Ability of the system to identify all airborne drone targets within sector volume.",
            is_benchmark=True
        ),
        EvaluationBenchmark(
            id="BM-3",
            metric_name="F1 Score (Harmonic Mean)",
            vision_only_score=81.7,
            multi_sensor_score=97.8,
            improvement_delta="+16.1%",
            unit="%",
            description="Balanced performance measure combining precision and recall under adverse conditions.",
            is_benchmark=True
        ),
        EvaluationBenchmark(
            id="BM-4",
            metric_name="False Positive Rate (FPR)",
            vision_only_score=14.8,
            multi_sensor_score=1.6,
            improvement_delta="-13.2% (89% drop)",
            unit="%",
            description="Misclassification of avian, cloud shadows, or dust clutter as drone threats.",
            is_benchmark=True
        ),
        EvaluationBenchmark(
            id="BM-5",
            metric_name="End-to-End Processing Latency",
            vision_only_score=28.5,
            multi_sensor_score=14.2,
            improvement_delta="-14.3 ms (2x faster)",
            unit="ms",
            description="Sensor packet arrival to consolidated track state estimation on C2 display.",
            is_benchmark=True
        ),
        EvaluationBenchmark(
            id="BM-6",
            metric_name="Mean Tracking Continuity",
            vision_only_score=68.2,
            multi_sensor_score=312.4,
            improvement_delta="4.5x duration",
            unit="sec",
            description="Continuous unbroken track duration without ID fragmentation or target loss.",
            is_benchmark=True
        ),
    ]
    db.add_all(benchmarks)

    # 5. Environmental Stress Tests
    env_tests = [
        EnvironmentalTest(
            id="ENV-1",
            condition="Clear Daylight (10,000 Lux)",
            vision_only_f1=94.2,
            multi_sensor_f1=99.1,
            delta="+4.9%",
            stress_factor="Baseline conditions"
        ),
        EnvironmentalTest(
            id="ENV-2",
            condition="Dense Fog / Smoke Haze (<200m Vis)",
            vision_only_f1=52.4,
            multi_sensor_f1=96.2,
            delta="+43.8%",
            stress_factor="Optical attenuation; radar and thermal penetration"
        ),
        EnvironmentalTest(
            id="ENV-3",
            condition="Night / Zero Lux (0.01 Lux)",
            vision_only_f1=38.0,
            multi_sensor_f1=97.0,
            delta="+59.0%",
            stress_factor="Total optical darkness; FLIR & RF SDR primary"
        ),
        EnvironmentalTest(
            id="ENV-4",
            condition="High Bird Migratory Clutter",
            vision_only_f1=67.5,
            multi_sensor_f1=95.8,
            delta="+28.3%",
            stress_factor="Visual similarity; rejected via RF emission & micro-Doppler"
        ),
        EnvironmentalTest(
            id="ENV-5",
            condition="Hostile Electronic Jamming (RF Noise)",
            vision_only_f1=83.0,
            multi_sensor_f1=94.5,
            delta="+11.5%",
            stress_factor="RF link degraded; EO/IR vision & radar retain lock"
        ),
    ]
    db.add_all(env_tests)

    # 6. Reference UAV Snapshots
    ref_drones = [
        ReferenceSnapshot(
            id="REF-DJI-M300",
            model_name="Matrice 300 RTK",
            manufacturer="DJI Enterprise",
            category="Commercial Quadcopter",
            image_url="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80",
            wingspan_meters=0.81,
            max_speed_kmh=82.8,
            typical_rcs_dbsm=-14.0,
            rotor_count=4,
            rf_protocol="OcuSync 3.0 Enterprise (2.4 / 5.8 GHz)",
            battery_life_min=55,
            max_payload_kg=2.7,
            visual_color="Matte Dark Grey / Aviation Orange Beacon",
            thermal_profile="4x Lower Motor Nacelles (ΔT ~7°C), Underslung Gimbal Heat",
            description="Heavy enterprise quadcopter equipped with redundant IMU and dual battery architecture. High acoustic footprint and distinct 2.4/5.8GHz video downlink.",
            feature_vector_json=[0.12, 0.45, 0.88, 0.23, 0.11] * 12
        ),
        ReferenceSnapshot(
            id="REF-FPV-CHAMELEON",
            model_name="Chameleon 7\" Carbon Racer",
            manufacturer="Custom / Open-Hardware",
            category="FPV Drone",
            image_url="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
            wingspan_meters=0.32,
            max_speed_kmh=145.0,
            typical_rcs_dbsm=-20.5,
            rotor_count=4,
            rf_protocol="ExpressLRS (ELRS 2.4GHz) + 5.8GHz Analog VTX",
            battery_life_min=8,
            max_payload_kg=0.8,
            visual_color="Carbon Fiber Weave / High-vis Cyan Props",
            thermal_profile="High heat density on LiPo battery cell discharge (ΔT +16°C)",
            description="Ultra-agile freestyle racing and tactical quad. Capable of extreme acrobatic acceleration and nap-of-the-earth terrain hugging.",
            feature_vector_json=[0.82, 0.15, 0.28, 0.93, 0.41] * 12
        ),
        ReferenceSnapshot(
            id="REF-TALON-WING",
            model_name="Talon Pro Aeromapper",
            manufacturer="X-UAV Aerospace",
            category="Fixed-Wing Drone",
            image_url="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80",
            wingspan_meters=1.35,
            max_speed_kmh=100.0,
            typical_rcs_dbsm=-8.0,
            rotor_count=1,
            rf_protocol="Microhard 900MHz Telemetry + MAVLink",
            battery_life_min=120,
            max_payload_kg=1.5,
            visual_color="High-visibility Matte White with Grey Leading Edge",
            thermal_profile="Single rear pusher motor exhaust thermal spike (ΔT +10°C)",
            description="Long-endurance fixed wing tactical mapping drone. High glide ratio, low acoustic signature, steady linear flight trajectories.",
            feature_vector_json=[0.32, 0.75, 0.48, 0.13, 0.91] * 12
        ),
        ReferenceSnapshot(
            id="REF-AUTEL-EVO",
            model_name="EVO II Dual 640T",
            manufacturer="Autel Robotics",
            category="Commercial Quadcopter",
            image_url="https://images.unsplash.com/photo-1533558701576-23c65e0272fb?w=800&auto=format&fit=crop&q=80",
            wingspan_meters=0.43,
            max_speed_kmh=72.0,
            typical_rcs_dbsm=-16.5,
            rotor_count=4,
            rf_protocol="Autel Dynamic Track 2.0 (2.4 GHz FHSS)",
            battery_life_min=38,
            max_payload_kg=0.9,
            visual_color="Safety Bright Orange Polycarbonate",
            thermal_profile="Symmetrical 4-point heat distribution",
            description="Compact folding surveillance drone equipped with dual optical and radiometric thermal payloads.",
            feature_vector_json=[0.92, 0.65, 0.18, 0.43, 0.31] * 12
        ),
        ReferenceSnapshot(
            id="REF-HEXA-HEAVY",
            model_name="Hydra-6 Heavy Cargo Lift",
            manufacturer="AeroVolt Dynamics",
            category="Heavy-Lift Hexacopter",
            image_url="https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80",
            wingspan_meters=1.65,
            max_speed_kmh=65.0,
            typical_rcs_dbsm=-5.0,
            rotor_count=6,
            rf_protocol="Dual LTE C2 Encrypted Link + S-Band Backup",
            battery_life_min=30,
            max_payload_kg=12.0,
            visual_color="Matte Stealth Black Carbon Tubular",
            thermal_profile="6 large brushless stators producing pronounced heat signatures",
            description="Heavy industrial hexacopter capable of transporting tactical sensor or supply canisters over 15km radii.",
            feature_vector_json=[0.05, 0.15, 0.98, 0.63, 0.81] * 12
        ),
    ]
    db.add_all(ref_drones)

    # 7. Initial Simulation Session
    session = SimulationSession(
        id="SIM-INIT-001",
        scenario_name="default",
        status="RUNNING",
        speed_multiplier=1.0,
        created_at=now,
        updated_at=now,
        parameters_json={"tick_rate_hz": 10, "is_simulated": True}
    )
    db.add(session)

    db.commit()
