from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class Position(BaseModel):
    x: float
    y: float
    alt: float
    lat: float
    lng: float

class BoundingBox(BaseModel):
    x: float
    y: float
    w: float
    h: float

class HistoryPoint(BaseModel):
    timestamp: float
    x: float
    y: float
    alt: float
    speed: float
    heading: float
    confidence: float
    fusedSensors: List[str]
    rcs: Optional[float] = None

class TrackBase(BaseModel):
    id: str
    callsign: str
    classification: str
    position: Position
    velocity: float
    heading: float
    climbRate: float
    range: float
    azimuth: float
    elevation: float
    rcs: float
    confidence: float
    fusedSensors: List[str]
    rfFrequency: str
    rfPower: float
    thermalSignature: str
    thermalTempMax: float
    opticalBBox: BoundingBox
    verificationStatus: str
    operatorNotes: Optional[str] = None
    groupId: Optional[str] = None
    lastUpdated: float
    isSimulated: bool = True

class TrackDetail(TrackBase):
    history: List[HistoryPoint] = []

    class Config:
        from_attributes = True
