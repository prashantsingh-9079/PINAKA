from typing import List, Optional
from pydantic import BaseModel

class Centroid(BaseModel):
    x: float
    y: float
    alt: float

class RelativeMovement(BaseModel):
    speed: float
    heading: float

class GroupHistoryPoint(BaseModel):
    timestamp: float
    dispersion: float
    cohesion: float
    size: int

class GroupClusterResponse(BaseModel):
    id: str
    name: str
    trackIds: List[str]
    centroid: Centroid
    dispersionRadius: float
    formationType: str
    cohesionScore: float
    relativeMovementVector: RelativeMovement
    nearestNeighborDistAvg: float
    history: List[GroupHistoryPoint] = []

class TrajectoryPoint(BaseModel):
    time: str
    timestamp: float
    x: float
    y: float
    altitude: float
    speed: float
    heading: float
    confidence: float
    rcs: Optional[float] = None

class LatencyDistributionItem(BaseModel):
    range: str
    count: int

class SpeedAnalyticsResponse(BaseModel):
    trackId: str
    data: List[dict]

class ConfidenceAnalyticsResponse(BaseModel):
    trackId: str
    data: List[dict]
