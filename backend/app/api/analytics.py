from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.simulation_engine import simulation_engine
from app.services.cluster_service import analyze_groups
from app.schemas.analytics import GroupClusterResponse

router = APIRouter()

@router.get("/analytics/groups", response_model=List[GroupClusterResponse])
def get_group_analytics():
    """Returns candidate swarm cluster analytics."""
    return analyze_groups(simulation_engine.tracks_state)

@router.get("/analytics/trajectory")
def get_trajectory(track_id: str = Query(..., description="Track identifier")):
    """Returns spatial trajectory points for Recharts Scatter/Line graph."""
    for trk in simulation_engine.tracks_state:
        if trk["id"] == track_id:
            return [
                {
                    "time": time_label(pt["timestamp"]),
                    "timestamp": pt["timestamp"],
                    "x": round(pt["x"], 1),
                    "y": round(pt["y"], 1),
                    "altitude": round(pt["alt"], 1),
                    "speed": round(pt["speed"], 1),
                    "heading": round(pt["heading"], 1),
                    "confidence": round(pt["confidence"] * 100, 1),
                    "rcs": pt.get("rcs", -14.0)
                }
                for pt in trk.get("history", [])
            ]
    return []

@router.get("/analytics/speed")
def get_speed_analytics(track_id: str = Query(...)):
    """Returns speed vs time data for selected track."""
    for trk in simulation_engine.tracks_state:
        if trk["id"] == track_id:
            return [
                {
                    "time": time_label(pt["timestamp"]),
                    "timestamp": pt["timestamp"],
                    "speed": round(pt["speed"], 1)
                }
                for pt in trk.get("history", [])
            ]
    return []

@router.get("/analytics/confidence")
def get_confidence_analytics(track_id: str = Query(...)):
    """Returns cross-sensor confidence breakdown over time."""
    import math
    for trk in simulation_engine.tracks_state:
        if trk["id"] == track_id:
            hist = trk.get("history", [])
            return [
                {
                    "time": time_label(pt["timestamp"]),
                    "timestamp": pt["timestamp"],
                    "confidence": round(pt["confidence"] * 100, 1),
                    "opticalConf": round(max(70, (pt["confidence"] - 0.04 + math.sin(i) * 0.02) * 100), 1),
                    "thermalConf": round(max(75, (pt["confidence"] - 0.02 + math.cos(i) * 0.02) * 100), 1),
                    "radarConf": round(pt["confidence"] * 100, 1),
                    "rfConf": 98.0 if "rf" in pt.get("fusedSensors", []) else 0.0
                }
                for i, pt in enumerate(hist)
            ]
    return []

def time_label(ts: float) -> str:
    import time
    return time.strftime("%H:%M:%S", time.gmtime(ts))
