from typing import Optional, List
from pydantic import BaseModel

class OperatorReviewCreate(BaseModel):
    trackId: str
    status: str  # Verified Hostile, Authorized Flight, False Positive, Under Review
    notes: Optional[str] = None
    operatorId: Optional[str] = "OP-774"

class OperatorReviewResponse(BaseModel):
    id: int
    trackId: str
    status: str
    notes: Optional[str] = None
    operatorId: str
    createdAt: float

    class Config:
        from_attributes = True
