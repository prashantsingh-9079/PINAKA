"""
Track API Routes
Handles object tracking data and track management
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import random
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

router = APIRouter()


class TrackBase(BaseModel):
    id: str
    object_class: str  # person, vehicle, drone, etc.
    confidence: float  # 0-1
    first_seen: float  # timestamp
    last_seen: float   # timestamp
    status: str  # active, lost, stationary
    sensor_sources: List[str]  # which sensors contributed to this track


class TrackResponse(TrackBase):
    current_bbox: List[float]  # [x, y, width, height]
    predicted_bbox: List[float]
    velocity: List[float]  # [vx, vy] in m/s
    acceleration: List[float]  # [ax, ay] in m/s²
    track_length: float  # seconds
    total_detections: int
    avg_confidence: float


class TrackHistoryPoint(BaseModel):
    timestamp: float
    bbox: List[float]
    confidence: float


# Mock track data - in reality this would come from the tracking module
MOCK_TRACKS = {
    "track-001": {
        "id": "track-001",
        "object_class": "person",
        "confidence": 0.87,
        "first_seen": datetime.now().timestamp() - 120,
        "last_seen": datetime.now().timestamp() - 5,
        "status": "active",
        "sensor_sources": ["cam-01", "cam-02"],
        "current_bbox": [250, 180, 70, 160],
        "predicted_bbox": [255, 185, 70, 160],
        "velocity": [0.5, -0.2],
        "acceleration": [0.01, -0.005],
        "track_length": 115.0,
        "total_detections": 45,
        "avg_confidence": 0.85
    },
    "track-002": {
        "id": "track-002",
        "object_class": "vehicle",
        "confidence": 0.92,
        "first_seen": datetime.now().timestamp() - 85,
        "last_seen": datetime.now().timestamp() - 2,
        "status": "active",
        "sensor_sources": ["cam-01", "radar-01"],
        "current_bbox": [400, 300, 120, 90],
        "predicted_bbox": [405, 302, 120, 90],
        "velocity": [2.1, 0.3],
        "acceleration": [0.05, 0.01],
        "track_length": 83.0,
        "total_detections": 38,
        "avg_confidence": 0.90
    },
    "track-003": {
        "id": "track-003",
        "object_class": "drone",
        "confidence": 0.78,
        "first_seen": datetime.now().timestamp() - 45,
        "last_seen": datetime.now().timestamp() - 10,
        "status": "lost",
        "sensor_sources": ["rf-01"],
        "current_bbox": [100, 100, 60, 60],
        "predicted_bbox": [95, 95, 60, 60],
        "velocity": [-1.2, 0.8],
        "acceleration": [-0.02, 0.01],
        "track_length": 35.0,
        "total_detections": 12,
        "avg_confidence": 0.75
    }
}


@router.get("", response_model=List[TrackResponse])
async def get_tracks(
    status: Optional[str] = Query(None, description="Filter by track status"),
    object_class: Optional[str] = Query(None, description="Filter by object class"),
    limit: int = Query(100, description="Maximum number of tracks to return")
):
    """Get active tracks with optional filtering"""
    tracks = list(MOCK_TRACKS.values())

    # Apply filters
    if status:
        tracks = [t for t in tracks if t["status"] == status]
    if object_class:
        tracks = [t for t in tracks if t["object_class"] == object_class]

    # Sort by last_seen (most recent first)
    tracks.sort(key=lambda x: x["last_seen"], reverse=True)

    # Apply limit
    tracks = tracks[:limit]

    # Add some realistic variation to simulate live updates
    for track in tracks:
        if track["status"] == "active":
            track["last_seen"] = datetime.now().timestamp() - random.uniform(0, 5)
            # Slightly vary confidence and position
            track["confidence"] = max(0.1, min(0.99, track["confidence"] + (random.random() - 0.5) * 0.1))
            track["current_bbox"] = [
                track["current_bbox"][0] + random.uniform(-2, 2),
                track["current_bbox"][1] + random.uniform(-2, 2),
                track["current_bbox"][2],
                track["current_bbox"][3]
            ]

    return tracks


@router.get("/{track_id}", response_model=TrackResponse)
async def get_track(track_id: str):
    """Get details of a specific track"""
    if track_id not in MOCK_TRACKS:
        raise HTTPException(status_code=404, detail=f"Track {track_id} not found")

    track = MOCK_TRACKS[track_id].copy()

    # Simulate live update
    if track["status"] == "active":
        track["last_seen"] = datetime.now().timestamp() - random.uniform(0, 3)
        track["confidence"] = max(0.1, min(0.99, track["confidence"] + (random.random() - 0.5) * 0.05))
        track["current_bbox"] = [
            track["current_bbox"][0] + random.uniform(-1, 1),
            track["current_bbox"][1] + random.uniform(-1, 1),
            track["current_bbox"][2],
            track["current_bbox"][3]
        ]

    return track


@router.get("/{track_id}/history")
async def get_track_history(
    track_id: str,
    limit: int = Query(50, description="Number of history points to return")
):
    """Get historical positions for a track"""
    if track_id not in MOCK_TRACKS:
        raise HTTPException(status_code=404, detail=f"Track {track_id} not found")

    # Generate mock history data
    track = MOCK_TRACKS[track_id]
    history_points = []

    # Create a realistic movement pattern
    start_time = track["first_seen"]
    end_time = track["last_seen"]
    duration = end_time - start_time

    # Generate points along a simulated path
    num_points = min(limit, 30)  # Limit to reasonable number
    for i in range(num_points):
        progress = i / (num_points - 1) if num_points > 1 else 0
        timestamp = start_time + (duration * progress)

        # Simulate movement with some noise
        base_x = track["current_bbox"][0] + (progress * 50)
        base_y = track["current_bbox"][1] + (progress * 30)

        history_points.append({
            "timestamp": timestamp,
            "bbox": [
                base_x + random.uniform(-5, 5),
                base_y + random.uniform(-5, 5),
                track["current_bbox"][2] + random.uniform(-5, 5),
                track["current_bbox"][3] + random.uniform(-5, 5)
            ],
            "confidence": max(0.1, track["confidence"] + (random.random() - 0.5) * 0.2)
        })

    return {
        "track_id": track_id,
        "history": history_points,
        "count": len(history_points)
    }


@router.get("/{track_id}/events")
async def get_track_events(track_id: str):
    """Get events associated with a track"""
    if track_id not in MOCK_TRACKS:
        raise HTTPException(status_code=404, detail=f"Track {track_id} not found")

    # Mock events for this track
    track = MOCK_TRACKS[track_id]
    events = []

    if track["object_class"] == "drone" and track["status"] == "lost":
        events.append({
            "id": f"event-{track_id}-001",
            "timestamp": track["last_seen"] - 10,
            "type": "track_lost",
            "description": f"{track['object_class']} track lost after {track['track_length']:.1f} seconds",
            "severity": "medium"
        })

    if track["total_detections"] < 10 and track["track_length"] > 30:
        events.append({
            "id": f"event-{track_id}-002",
            "timestamp": track["last_seen"] - 5,
            "type": "low_detection_rate",
            "description": f"Low detection rate for {track['object_class']} track",
            "severity": "low"
        })

    return {
        "track_id": track_id,
        "events": events,
        "count": len(events)
    }


@router.post("")
async def create_manual_track(track_data: dict):
    """Create a manual track (for testing/override)"""
    track_id = f"manual-{len(MOCK_TRACKS) + 1}"

    new_track = {
        "id": track_id,
        "object_class": track_data.get("object_class", "unknown"),
        "confidence": track_data.get("confidence", 0.8),
        "first_seen": datetime.now().timestamp(),
        "last_seen": datetime.now().timestamp(),
        "status": "active",
        "sensor_sources": track_data.get("sensor_sources", ["manual"]),
        "current_bbox": track_data.get("bbox", [100, 100, 50, 50]),
        "predicted_bbox": track_data.get("bbox", [100, 100, 50, 50]),
        "velocity": [0.0, 0.0],
        "acceleration": [0.0, 0.0],
        "track_length": 0.0,
        "total_detections": 1,
        "avg_confidence": track_data.get("confidence", 0.8)
    }

    MOCK_TRACKS[track_id] = new_track

    return {
        "message": f"Manual track {track_id} created",
        "track": new_track
    }


@router.delete("/{track_id}")
async def delete_track(track_id: str):
    """Delete a track (typically for manual tracks)"""
    if track_id not in MOCK_TRACKS:
        raise HTTPException(status_code=404, detail=f"Track {track_id} not found")

    # Prevent deletion of auto-generated tracks (optional safety)
    if not track_id.startswith("manual-"):
        raise HTTPException(
            status_code=400,
            detail="Cannot delete automatically generated tracks. Only manual tracks can be deleted."
        )

    deleted_track = MOCK_TRACKS.pop(track_id)

    return {
        "message": f"Track {track_id} deleted",
        "deleted_track": deleted_track
    }