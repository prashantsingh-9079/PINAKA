"""
Event API Routes
Handles alerts, events, and event management
"""

from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import random
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

router = APIRouter()


class EventBase(BaseModel):
    id: str
    event_type: str  # intrusion, swarm_detection, lost_track, etc.
    severity: str  # low, medium, high, critical
    description: str
    timestamp: float  # Unix timestamp
    status: str  # active, acknowledged, resolved, false_positive
    confidence: float  # 0-1


class EventResponse(EventBase):
    source_tracks: List[str]  # Track IDs that triggered this event
    source_sensors: List[str]  # Sensor IDs that detected the event
    location: Optional[List[float]]  # [x, y] coordinates if applicable
    metadata: Dict[str, Any]
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[float] = None
    resolved_at: Optional[float] = None
    false_positive_reason: Optional[str] = None


class EventCreate(BaseModel):
    event_type: str
    severity: str
    description: str
    confidence: float = 0.8
    source_tracks: List[str] = []
    source_sensors: List[str] = []
    location: Optional[List[float]] = None
    metadata: Dict[str, Any] = {}


class EventUpdate(BaseModel):
    status: Optional[str] = None
    acknowledged_by: Optional[str] = None
    false_positive_reason: Optional[str] = None


# Mock event data
MOCK_EVENTS = {
    "event-001": {
        "id": "event-001",
        "event_type": "swarm_detection",
        "severity": "high",
        "description": "Drone swarm detected approaching from northwest",
        "timestamp": datetime.now().timestamp() - 300,
        "status": "active",
        "confidence": 0.92,
        "source_tracks": ["track-003", "track-004", "track-005", "track-006", "track-007"],
        "source_sensors": ["cam-01", "cam-02", "rf-01"],
        "location": [450, 200],
        "metadata": {
            "swarm_size": 5,
            "avg_speed": 3.2,
            "direction": [0.8, -0.2],
            "formation": "V-formation"
        }
    },
    "event-002": {
        "id": "event-002",
        "event_type": "intrusion_alert",
        "severity": "critical",
        "description": "Unauthorized vehicle detected in secure zone",
        "timestamp": datetime.now().timestamp() - 180,
        "status": "acknowledged",
        "confidence": 0.95,
        "source_tracks": ["track-008"],
        "source_sensors": ["radar-01", "cam-02"],
        "location": [600, 350],
        "metadata": {
            "vehicle_type": "SUV",
            "speed": 15.2,
            "zone_violated": "ALPHA"
        },
        "acknowledged_by": "operator-01",
        "acknowledged_at": datetime.now().timestamp() - 120
    },
    "event-003": {
        "id": "event-003",
        "event_type": "lost_track",
        "severity": "medium",
        "description": "Track lost - possible occlusion or sensor failure",
        "timestamp": datetime.now().timestamp() - 90,
        "status": "active",
        "confidence": 0.78,
        "source_tracks": ["track-002"],
        "source_sensors": ["cam-01"],
        "location": [300, 400],
        "metadata": {
            "last_known_speed": 2.1,
            "last_known_direction": [0.9, 0.1],
            "occlusion_likely": True
        }
    },
    "event-004": {
        "id": "event-004",
        "event_type": "sensor_fault",
        "severity": "low",
        "description": "Thermal sensor showing intermittent signal",
        "timestamp": datetime.now().timestamp() - 600,
        "status": "false_positive",
        "confidence": 0.65,
        "source_tracks": [],
        "source_sensors": ["thermal-01"],
        "location": None,
        "metadata": {
            "sensor_id": "thermal-01",
            "error_code": "TEMP_SENSOR_FAULT",
            "signal_strength": 0.1
        },
        "false_positive_reason": "Known intermittent fault - maintenance scheduled"
    }
}


@router.get("", response_model=List[EventResponse])
async def get_events(
    status: Optional[str] = Query(None, description="Filter by event status"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    limit: int = Query(100, description="Maximum number of events to return"),
    offset: int = Query(0, description="Offset for pagination")
):
    """Get events with optional filtering and pagination"""
    events = list(MOCK_EVENTS.values())

    # Apply filters
    if status:
        events = [e for e in events if e["status"] == status]
    if severity:
        events = [e for e in events if e["severity"] == severity]
    if event_type:
        events = [e for e in events if e["event_type"] == event_type]

    # Sort by timestamp (most recent first)
    events.sort(key=lambda x: x["timestamp"], reverse=True)

    # Apply pagination
    paginated_events = events[offset:offset + limit]

    # Add some realistic variation to simulate live updates
    for event in paginated_events:
        if event["status"] == "active":
            # Slightly vary confidence
            event["confidence"] = max(0.1, min(0.99, event["confidence"] + (random.random() - 0.5) * 0.05))

    return paginated_events


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: str):
    """Get details of a specific event"""
    if event_id not in MOCK_EVENTS:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")

    event = MOCK_EVENTS[event_id].copy()

    # Simulate live update for active events
    if event["status"] == "active":
        event["confidence"] = max(0.1, min(0.99, event["confidence"] + (random.random() - 0.5) * 0.02))

    return event


@router.patch("/{event_id}", response_model=EventResponse)
async def update_event(event_id: str, event_update: EventUpdate):
    """Update event status (acknowledge, resolve, mark as false positive)"""
    if event_id not in MOCK_EVENTS:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")

    event = MOCK_EVENTS[event_id]
    update_data = event_update.dict(exclude_unset=True)

    # Apply updates
    for key, value in update_data.items():
        if key in event:
            event[key] = value

    # Set timestamps based on status changes
    if "status" in update_data:
        if update_data["status"] == "acknowledged" and event.get("acknowledged_by"):
            event["acknowledged_at"] = datetime.now().timestamp()
        elif update_data["status"] == "resolved":
            event["resolved_at"] = datetime.now().timestamp()

    return event


@router.post("", response_model=EventResponse)
async def create_event(event_data: EventCreate):
    """Create a new event (typically from detection systems)"""
    event_id = f"event-{len(MOCK_EVENTS) + 1:03d}"

    new_event = {
        "id": event_id,
        "event_type": event_data.event_type,
        "severity": event_data.severity,
        "description": event_data.description,
        "timestamp": datetime.now().timestamp(),
        "status": "active",
        "confidence": event_data.confidence,
        "source_tracks": event_data.source_tracks,
        "source_sensors": event_data.source_sensors,
        "location": event_data.location,
        "metadata": event_data.metadata
    }

    MOCK_EVENTS[event_id] = new_event

    # In a real implementation, this would trigger alerts/notifications
    logger.info(f"New event created: {event_id} - {event_data.description}")

    return new_event


@router.get("/analytics/summary")
async def get_events_summary():
    """Get summary statistics for events"""
    events = list(MOCK_EVENTS.values())

    # Calculate summary statistics
    active_events = [e for e in events if e["status"] == "active"]
    acknowledged_events = [e for e in events if e["status"] == "acknowledged"]
    resolved_events = [e for e in events if e["status"] == "resolved"]
    false_positive_events = [e for e in events if e["status"] == "false_positive"]

    severity_counts = {}
    for event in events:
        severity = event["severity"]
        severity_counts[severity] = severity_counts.get(severity, 0) + 1

    event_type_counts = {}
    for event in events:
        event_type = event["event_type"]
        event_type_counts[event_type] = event_type_counts.get(event_type, 0) + 1

    # Calculate average confidence for active events
    avg_confidence = 0
    if active_events:
        avg_confidence = sum(e["confidence"] for e in active_events) / len(active_events)

    return {
        "total_events": len(events),
        "active_events": len(active_events),
        "acknowledged_events": len(acknowledged_events),
        "resolved_events": len(resolved_events),
        "false_positive_events": len(false_positive_events),
        "average_confidence": round(avg_confidence, 3),
        "severity_distribution": severity_counts,
        "event_type_distribution": event_type_counts,
        "timestamp": datetime.now().timestamp()
    }


@router.get("/analytics/timeline")
async def get_events_timeline(
    hours: int = Query(24, description="Number of hours to look back"),
    interval: str = Query("1h", description="Interval for aggregation (15m, 1h, 6h)")
):
    """Get events timeline for dashboard charts"""
    # Generate mock timeline data
    now = datetime.now()
    timeline_data = []

    # Determine interval in minutes
    interval_minutes = {
        "15m": 15,
        "1h": 60,
        "6h": 360
    }.get(interval, 60)

    # Generate data points
    current = now - timedelta(hours=hours)
    while current <= now:
        # Count events in this interval
        interval_end = current + timedelta(minutes=interval_minutes)
        count = sum(1 for e in MOCK_EVENTS.values()
                   if current.timestamp() <= e["timestamp"] < interval_end.timestamp())

        timeline_data.append({
            "timestamp": current.timestamp(),
            "event_count": count,
            "period_start": current.timestamp(),
            "period_end": interval_end.timestamp()
        })

        current = interval_end

    return {
        "interval": interval,
        "hours_covered": hours,
        "data_points": timeline_data
    }


@router.post("/{event_id}/acknowledge")
async def acknowledge_event(event_id: str, operator_id: str = "operator-01"):
    """Acknowledge an event"""
    if event_id not in MOCK_EVENTS:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")

    event = MOCK_EVENTS[event_id]
    if event["status"] != "active":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot acknowledge event with status: {event['status']}"
        )

    event["status"] = "acknowledged"
    event["acknowledged_by"] = operator_id
    event["acknowledged_at"] = datetime.now().timestamp()

    logger.info(f"Event {event_id} acknowledged by {operator_id}")

    return {
        "message": f"Event {event_id} acknowledged",
        "event": event
    }


@router.post("/{event_id}/resolve")
async def resolve_event(event_id: str):
    """Resolve an event"""
    if event_id not in MOCK_EVENTS:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")

    event = MOCK_EVENTS[event_id]
    if event["status"] not in ["active", "acknowledged"]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot resolve event with status: {event['status']}"
        )

    event["status"] = "resolved"
    event["resolved_at"] = datetime.now().timestamp()

    logger.info(f"Event {event_id} resolved")

    return {
        "message": f"Event {event_id} resolved",
        "event": event
    }


@router.post("/{event_id}/false-positive")
async def mark_false_positive(event_id: str, reason: str):
    """Mark an event as false positive"""
    if event_id not in MOCK_EVENTS:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")

    event = MOCK_EVENTS[event_id]
    event["status"] = "false_positive"
    event["false_positive_reason"] = reason

    logger.info(f"Event {event_id} marked as false positive: {reason}")

    return {
        "message": f"Event {event_id} marked as false positive",
        "event": event
    }


@router.get("/stream")
async def get_events_stream():
    """Get stream of recent events for real-time updates"""
    # In a real implementation, this would be a WebSocket endpoint
    # For now, return recent events
    recent_events = [
        e for e in MOCK_EVENTS.values()
        if e["timestamp"] > datetime.now().timestamp() - 300  # Last 5 minutes
    ]
    recent_events.sort(key=lambda x: x["timestamp"], reverse=True)

    return {
        "events": recent_events,
        "count": len(recent_events),
        "timestamp": datetime.now().timestamp()
    }