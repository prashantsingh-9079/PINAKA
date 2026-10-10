"""
Group API Routes
Handles group/swarm detection and analytics
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import random
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

router = APIRouter()


class GroupBase(BaseModel):
    id: str
    group_type: str  # swarm, convoy, formation, etc.
    object_count: int
    object_classes: List[str]  # types of objects in group
    first_seen: float  # timestamp
    last_seen: float   # timestamp
    status: str  # active, dispersing, stationary
    confidence: float  # 0-1


class GroupResponse(GroupBase):
    center_position: List[float]  # [x, y] centroid
    bounding_box: List[float]  # [x, y, width, height] enclosing all objects
    formation_type: str  # line, cluster, V-formation, etc.
    cohesion_score: float  # 0-1, how tightly grouped
    direction: List[float]  # [dx, dy] average movement vector
    speed: float  # average speed in m/s
    density: float  # objects per square meter
    track_ids: List[str]  # IDs of tracks in this group


class GroupAnalytics(BaseModel):
    group_id: str
    duration: float  # seconds
    max_size: int
    min_size: int
    avg_size: float
    formation_changes: int
    avg_cohesion: float
    max_speed: float
    min_speed: float
    avg_speed: float
    total_distance: float  # meters traveled


# Mock group data
MOCK_GROUPS = {
    "group-001": {
        "id": "group-001",
        "group_type": "swarm",
        "object_count": 5,
        "object_classes": ["drone", "drone", "drone", "person", "drone"],
        "first_seen": datetime.now().timestamp() - 200,
        "last_seen": datetime.now().timestamp() - 10,
        "status": "active",
        "confidence": 0.82,
        "center_position": [300, 200],
        "bounding_box": [250, 150, 100, 100],
        "formation_type": "V-formation",
        "cohesion_score": 0.75,
        "direction": [0.3, -0.1],
        "speed": 2.5,
        "density": 0.05,
        "track_ids": ["track-003", "track-004", "track-005", "track-006", "track-007"]
    },
    "group-002": {
        "id": "group-002",
        "group_type": "convoy",
        "object_count": 3,
        "object_classes": ["vehicle", "vehicle", "person"],
        "first_seen": datetime.now().timestamp() - 150,
        "last_seen": datetime.now().timestamp() - 5,
        "status": "active",
        "confidence": 0.90,
        "center_position": [500, 350],
        "bounding_box": [450, 300, 150, 120],
        "formation_type": "line",
        "cohesion_score": 0.88,
        "direction": [1.2, 0.2],
        "speed": 3.2,
        "density": 0.02,
        "track_ids": ["track-008", "track-009", "track-010"]
    },
    "group-003": {
        "id": "group-003",
        "group_type": "cluster",
        "object_count": 8,
        "object_classes": ["person"] * 8,
        "first_seen": datetime.now().timestamp() - 300,
        "last_seen": datetime.now().timestamp() - 60,
        "status": "dispersing",
        "confidence": 0.70,
        "center_position": [150, 400],
        "bounding_box": [100, 350, 150, 150],
        "formation_type": "cluster",
        "cohesion_score": 0.45,
        "direction": [0.1, 0.05],
        "speed": 0.8,
        "density": 0.04,
        "track_ids": [f"track-{i}" for i in range(11, 19)]
    }
}


@router.get("", response_model=List[GroupResponse])
async def get_groups(
    status: Optional[str] = Query(None, description="Filter by group status"),
    group_type: Optional[str] = Query(None, description="Filter by group type"),
    min_objects: Optional[int] = Query(None, description="Minimum number of objects"),
    limit: int = Query(50, description="Maximum number of groups to return")
):
    """Get detected groups with optional filtering"""
    groups = list(MOCK_GROUPS.values())

    # Apply filters
    if status:
        groups = [g for g in groups if g["status"] == status]
    if group_type:
        groups = [g for g in groups if g["group_type"] == group_type]
    if min_objects is not None:
        groups = [g for g in groups if g["object_count"] >= min_objects]

    # Sort by last_seen (most recent first)
    groups.sort(key=lambda x: x["last_seen"], reverse=True)

    # Apply limit
    groups = groups[:limit]

    # Add some realistic variation to simulate live updates
    for group in groups:
        if group["status"] == "active":
            group["last_seen"] = datetime.now().timestamp() - random.uniform(0, 10)
            group["confidence"] = max(0.1, min(0.99, group["confidence"] + (random.random() - 0.5) * 0.1))
            # Slightly vary position
            group["center_position"] = [
                group["center_position"][0] + random.uniform(-3, 3),
                group["center_position"][1] + random.uniform(-3, 3)
            ]
            group["bounding_box"] = [
                group["bounding_box"][0] + random.uniform(-2, 2),
                group["bounding_box"][1] + random.uniform(-2, 2),
                group["bounding_box"][2],
                group["bounding_box"][3]
            ]

    return groups


@router.get("/{group_id}", response_model=GroupResponse)
async def get_group(group_id: str):
    """Get details of a specific group"""
    if group_id not in MOCK_GROUPS:
        raise HTTPException(status_code=404, detail=f"Group {group_id} not found")

    group = MOCK_GROUPS[group_id].copy()

    # Simulate live update
    if group["status"] == "active":
        group["last_seen"] = datetime.now().timestamp() - random.uniform(0, 5)
        group["confidence"] = max(0.1, min(0.99, group["confidence"] + (random.random() - 0.5) * 0.05))
        group["center_position"] = [
            group["center_position"][0] + random.uniform(-1, 1),
            group["center_position"][1] + random.uniform(-1, 1)
        ]

    return group


@router.get("/{group_id}/analytics", response_model=GroupAnalytics)
async def get_group_analytics(group_id: str):
    """Get analytics for a specific group"""
    if group_id not in MOCK_GROUPS:
        raise HTTPException(status_code=404, detail=f"Group {group_id} not found")

    group = MOCK_GROUPS[group_id]

    # Generate mock analytics
    duration = group["last_seen"] - group["first_seen"]

    analytics = GroupAnalytics(
        group_id=group_id,
        duration=duration,
        max_size=group["object_count"] + random.randint(0, 3),
        min_size=max(1, group["object_count"] - random.randint(0, 2)),
        avg_size=group["object_count"] + random.uniform(-0.5, 0.5),
        formation_changes=random.randint(0, 5),
        avg_cohesion=max(0.1, min(0.9, group["cohesion_score"] + random.uniform(-0.2, 0.2))),
        max_speed=group["speed"] + random.uniform(0, 2.0),
        min_speed=max(0.1, group["speed"] - random.uniform(0, 1.5)),
        avg_speed=group["speed"] + random.uniform(-0.5, 0.5),
        total_distance=group["speed"] * duration * random.uniform(0.8, 1.2)
    )

    return analytics


@router.get("/{group_id}/tracks")
async def get_group_tracks(group_id: str):
    """Get tracks that belong to a specific group"""
    if group_id not in MOCK_GROUPS:
        raise HTTPException(status_code=404, detail=f"Group {group_id} not found")

    group = MOCK_GROUPS[group_id]
    track_ids = group["track_ids"]

    # Import tracks router to get track data (in real app, this would be from service/tracking)
    # For now, we'll return mock track data
    tracks = []
    for track_id in track_ids:
        # Mock track data - in reality this would come from the tracking system
        tracks.append({
            "id": track_id,
            "object_class": "unknown",  # Would be populated from actual track data
            "confidence": random.uniform(0.7, 0.95),
            "last_seen": datetime.now().timestamp() - random.uniform(0, 10)
        })

    return {
        "group_id": group_id,
        "tracks": tracks,
        "count": len(tracks)
    }


@router.get("/analytics/summary")
async def get_groups_summary():
    """Get summary statistics for all groups"""
    groups = list(MOCK_GROUPS.values())

    # Calculate summary statistics
    active_groups = [g for g in groups if g["status"] == "active"]
    total_objects = sum(g["object_count"] for g in groups)
    avg_confidence = sum(g["confidence"] for g in groups) / len(groups) if groups else 0

    group_types = {}
    for group in groups:
        group_type = group["group_type"]
        group_types[group_type] = group_types.get(group_type, 0) + 1

    return {
        "total_groups": len(groups),
        "active_groups": len(active_groups),
        "total_objects_in_groups": total_objects,
        "average_confidence": round(avg_confidence, 3),
        "group_type_distribution": group_types,
        "largest_group_size": max((g["object_count"] for g in groups), default=0),
        "timestamp": datetime.now().timestamp()
    }


@router.post("")
async def create_manual_group(group_data: dict):
    """Create a manual group (for testing/override)"""
    group_id = f"manual-{len(MOCK_GROUPS) + 1}"

    new_group = {
        "id": group_id,
        "group_type": group_data.get("group_type", "custom"),
        "object_count": group_data.get("object_count", 2),
        "object_classes": group_data.get("object_classes", ["unknown"] * group_data.get("object_count", 2)),
        "first_seen": datetime.now().timestamp(),
        "last_seen": datetime.now().timestamp(),
        "status": "active",
        "confidence": group_data.get("confidence", 0.8),
        "center_position": group_data.get("center_position", [250, 250]),
        "bounding_box": group_data.get("bounding_box", [200, 200, 100, 100]),
        "formation_type": group_data.get("formation_type", "custom"),
        "cohesion_score": group_data.get("cohesion_score", 0.7),
        "direction": group_data.get("direction", [0.0, 0.0]),
        "speed": group_data.get("speed", 1.0),
        "density": group_data.get("density", 0.01),
        "track_ids": group_data.get("track_ids", [])
    }

    MOCK_GROUPS[group_id] = new_group

    return {
        "message": f"Manual group {group_id} created",
        "group": new_group
    }


@router.delete("/{group_id}")
async def delete_group(group_id: str):
    """Delete a group (typically for manual groups)"""
    if group_id not in MOCK_GROUPS:
        raise HTTPException(status_code=404, detail=f"Group {group_id} not found")

    # Prevent deletion of auto-generated groups (optional safety)
    if not group_id.startswith("manual-"):
        raise HTTPException(
            status_code=400,
            detail="Cannot delete automatically generated groups. Only manual groups can be deleted."
        )

    deleted_group = MOCK_GROUPS.pop(group_id)

    return {
        "message": f"Group {group_id} deleted",
        "deleted_group": deleted_group
    }