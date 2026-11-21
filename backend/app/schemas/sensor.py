from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class SensorSpecs(BaseModel):
    spectralBand: Optional[str] = None
    resolution: Optional[str] = None
    frameRate: Optional[str] = None
    frequency: Optional[str] = None
    maxRange: Optional[str] = None
    fov: Optional[str] = None

class SensorBase(BaseModel):
    id: str
    name: str
    fullTitle: str
    model: str
    status: str
    healthScore: float
    dataQuality: float
    lastObservation: str
    latencyMs: float
    throughputMbps: float
    timeSyncJitterUs: float
    activeDetectionsCount: int
    firmwareVersion: str
    specs: Dict[str, Any]

class SensorResponse(SensorBase):
    class Config:
        from_attributes = True
