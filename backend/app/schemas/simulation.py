from typing import Optional, Dict, Any
from pydantic import BaseModel

class SimulationControlRequest(BaseModel):
    speed: Optional[float] = None
    scenario: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None

class SimulationStatusResponse(BaseModel):
    status: str  # RUNNING, PAUSED, STOPPED
    scenario: str
    speedMultiplier: float
    activeTracksCount: int
    activeSensorsCount: int
    isSimulated: bool = True
    tickRateHz: int
    uptimeSeconds: float
