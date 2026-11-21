from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import SystemEvent
from app.schemas.event import EventResponse, EventCreate

router = APIRouter()

@router.get("/events", response_model=List[EventResponse])
def get_events(limit: int = 25, db: Session = Depends(get_db)):
    events = db.query(SystemEvent).all()
    # Reverse order for latest first
    events.reverse()
    results = []
    for e in events[:limit]:
        results.append({
            "id": e.id,
            "timestamp": e.timestamp,
            "type": e.type,
            "severity": e.severity,
            "title": e.title,
            "message": e.message,
            "trackId": e.track_id
        })
    return results

@router.post("/events", response_model=EventResponse)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    import time
    now_str = time.strftime("%H:%M:%S UTC")
    evt_id = f"EVT-{int(time.time() * 1000) % 100000}"
    db_evt = SystemEvent(
        id=evt_id,
        timestamp=now_str,
        type=event.type,
        severity=event.severity,
        title=event.title,
        message=event.message,
        track_id=event.trackId
    )
    db.add(db_evt)
    db.commit()
    return {
        "id": db_evt.id,
        "timestamp": db_evt.timestamp,
        "type": db_evt.type,
        "severity": db_evt.severity,
        "title": db_evt.title,
        "message": db_evt.message,
        "trackId": db_evt.track_id
    }
