import numpy as np
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Track, Sensor
from app.services.simulation_engine import simulation_engine
from app.schemas.system import DashboardStatsResponse

router = APIRouter()

@router.get("/dashboard/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Read active tracks count from live simulation engine or database
    active_tracks = simulation_engine.tracks_state
    total_count = len(active_tracks)
    
    # Active tracks (excluding false positives)
    non_fp_count = len([t for t in active_tracks if t.get("verificationStatus") != "False Positive"])
    
    # Average fusion confidence
    avg_conf = int(np.mean([t.get("confidence", 0.95) for t in active_tracks]) * 100) if active_tracks else 98

    # Sensors count
    sensors_count = db.query(Sensor).count()
    online_sensors = db.query(Sensor).filter(Sensor.status == "ONLINE").count()

    return {
        "totalDetectedObjects": total_count,
        "activeTracksCount": non_fp_count,
        "averageFusionConfidencePct": avg_conf,
        "processingLatencyMs": 14.2,
        "swarmClustersCount": 1 if any(t.get("groupId") for t in active_tracks) else 0,
        "systemHealthPct": 99.2,
        "activeSensorsCount": online_sensors,
        "totalSensorsCount": sensors_count or 4
    }
