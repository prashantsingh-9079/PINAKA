from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Sensor
from app.schemas.sensor import SensorResponse

router = APIRouter()

@router.get("/sensors", response_model=List[SensorResponse])
def get_sensors(db: Session = Depends(get_db)):
    sensors = db.query(Sensor).all()
    results = []
    for s in sensors:
        results.append({
            "id": s.id,
            "name": s.name,
            "fullTitle": s.full_title,
            "model": s.model,
            "status": s.status,
            "healthScore": s.health_score,
            "dataQuality": s.data_quality,
            "lastObservation": s.last_observation,
            "latencyMs": s.latency_ms,
            "throughputMbps": s.throughput_mbps,
            "timeSyncJitterUs": s.time_sync_jitter_us,
            "activeDetectionsCount": s.active_detections_count,
            "firmwareVersion": s.firmware_version,
            "specs": s.specs_json or {}
        })
    return results

@router.get("/sensors/{sensor_id}", response_model=SensorResponse)
def get_sensor(sensor_id: str, db: Session = Depends(get_db)):
    s = db.query(Sensor).filter_by(id=sensor_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Sensor not found")
    return {
        "id": s.id,
        "name": s.name,
        "fullTitle": s.full_title,
        "model": s.model,
        "status": s.status,
        "healthScore": s.health_score,
        "dataQuality": s.data_quality,
        "lastObservation": s.last_observation,
        "latencyMs": s.latency_ms,
        "throughputMbps": s.throughput_mbps,
        "timeSyncJitterUs": s.time_sync_jitter_us,
        "activeDetectionsCount": s.active_detections_count,
        "firmwareVersion": s.firmware_version,
        "specs": s.specs_json or {}
    }
