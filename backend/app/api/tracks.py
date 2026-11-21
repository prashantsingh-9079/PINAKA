from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Track, TrackHistory
from app.services.simulation_engine import simulation_engine
from app.schemas.track import TrackDetail, HistoryPoint

router = APIRouter()

def format_track(t: dict) -> dict:
    return {
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
        "history": t.get("history", []),
        "lastUpdated": t["lastUpdated"],
        "isSimulated": True
    }

@router.get("/tracks", response_model=List[TrackDetail])
def get_tracks():
    """Returns active tracks from live simulation engine."""
    return [format_track(t) for t in simulation_engine.tracks_state]

@router.get("/tracks/{track_id}", response_model=TrackDetail)
def get_track(track_id: str):
    """Returns individual track state."""
    for t in simulation_engine.tracks_state:
        if t["id"] == track_id:
            return format_track(t)
    raise HTTPException(status_code=404, detail="Track not found")

@router.get("/tracks/{track_id}/history", response_model=List[HistoryPoint])
def get_track_history(track_id: str, db: Session = Depends(get_db)):
    """Returns historical observations for specified track."""
    for t in simulation_engine.tracks_state:
        if t["id"] == track_id and t.get("history"):
            return t["history"]
    
    # Fallback to database
    hist = db.query(TrackHistory).filter_by(track_id=track_id).order_by(TrackHistory.timestamp).all()
    if not hist:
        raise HTTPException(status_code=404, detail="Track history not found")
    return [
        {
            "timestamp": h.timestamp,
            "x": h.x,
            "y": h.y,
            "alt": h.alt,
            "speed": h.speed,
            "heading": h.heading,
            "confidence": h.confidence,
            "fusedSensors": h.fused_sensors_json or [],
            "rcs": h.rcs
        }
        for h in hist
    ]
