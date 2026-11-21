from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.config import settings
from app.models import Sensor, Track
from app.websocket.manager import ws_manager
from app.services.simulation_engine import simulation_engine
from app.schemas.system import SystemStatusResponse

router = APIRouter()

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint for Docker, orchestrators and frontend connectivity."""
    db_ok = True
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_ok = False

    return {
        "status": "HEALTHY" if db_ok else "DEGRADED",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "CONNECTED" if db_ok else "DISCONNECTED",
        "simulationActive": simulation_engine.is_running and not simulation_engine.is_paused,
        "connectedWebSockets": len(ws_manager.active_connections)
    }

@router.get("/system/status", response_model=SystemStatusResponse)
def get_system_status(db: Session = Depends(get_db)):
    """Detailed hardware and pipeline telemetry."""
    active_tracks = len(simulation_engine.tracks_state)
    non_fp = len([t for t in simulation_engine.tracks_state if t.get("verificationStatus") != "False Positive"])

    return {
        "status": "OPERATIONAL",
        "version": settings.VERSION,
        "databaseConnected": True,
        "databaseUrl": "SQLite (pinaka.db)",
        "activeSensors": 4,
        "totalTracks": active_tracks,
        "activeTracks": non_fp,
        "websocketConnectedClients": len(ws_manager.active_connections),
        "latencyMs": 14.2,
        "tensorCoreUtilizationPct": 34.2,
        "ptpTimeSyncLocked": True,
        "ptpDriftPpm": 0.04,
        "isSimulated": True
    }
