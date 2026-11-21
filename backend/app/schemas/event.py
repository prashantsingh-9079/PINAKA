from typing import Optional
from pydantic import BaseModel

class EventBase(BaseModel):
    id: str
    timestamp: str
    type: str
    severity: str
    title: str
    message: str
    trackId: Optional[str] = None

class EventCreate(BaseModel):
    type: str
    severity: str
    title: str
    message: str
    trackId: Optional[str] = None

class EventResponse(EventBase):
    class Config:
        from_attributes = True
