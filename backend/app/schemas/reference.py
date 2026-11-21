from typing import Optional, List
from pydantic import BaseModel

class ReferenceDroneResponse(BaseModel):
    id: str
    modelName: str
    manufacturer: str
    category: str
    image: str
    wingspanMeters: float
    maxSpeedKmh: float
    typicalRcs: float
    rotorCount: int
    rfProtocol: str
    batteryLifeMin: int
    maxPayloadKg: float
    visualColor: str
    thermalProfile: str
    description: str
    similarityScore: Optional[float] = None

    class Config:
        from_attributes = True

class ReferenceSearchRequest(BaseModel):
    query: Optional[str] = None
    color: Optional[str] = "all"
    category: Optional[str] = "all"
    imageBase64: Optional[str] = None
