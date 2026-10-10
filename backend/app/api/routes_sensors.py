"""
Sensor API Routes
Handles sensor management, status, and data ingestion
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import random
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

router = APIRouter()


class SensorBase(BaseModel):
    id: str
    name: str
    type: str  # camera, rf, radar, thermal
    status: str  # online, degraded, offline
    last_seen: str
    latency: float  # ms
    data_rate: float  # kbps
    health_score: float  # 0-100


class SensorCreate(SensorBase):
    pass


class SensorUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    latency: Optional[float] = None
    data_rate: Optional[float] = None
    health_score: Optional[float] = None


class SensorResponse(SensorBase):
    timestamp: float
    bandwidth_usage: Optional[float] = None
    error_rate: Optional[float] = None
    temperature: Optional[float] = None
    signal_strength: Optional[float] = None


# Mock sensor data - in reality this would come from actual sensors or a database
MOCK_SENSORS = {
    "cam-01": {
        "id": "cam-01",
        "name": "Front Camera",
        "type": "camera",
        "status": "online",
        "last_seen": "just now",
        "latency": 45.0,
        "data_rate": 1250.0,
        "health_score": 98.0,
        "bandwidth_usage": 0.75,
        "error_rate": 0.2,
        "temperature": 45.0
    },
    "cam-02": {
        "id": "cam-02",
        "name": "Rear Camera",
        "type": "camera",
        "status": "online",
        "last_seen": "2s ago",
        "latency": 52.0,
        "data_rate": 1180.0,
        "health_score": 95.0,
        "bandwidth_usage": 0.68,
        "error_rate": 0.3,
        "temperature": 43.0
    },
    "rf-01": {
        "id": "rf-01",
        "name": "RF Scanner",
        "type": "rf",
        "status": "online",
        "last_seen": "just now",
        "latency": 12.0,
        "data_rate": 45.0,
        "health_score": 99.0,
        "bandwidth_usage": 0.1,
        "error_rate": 0.05,
        "signal_strength": -45.0
    },
    "radar-01": {
        "id": "radar-01",
        "name": "Radar Unit",
        "type": "radar",
        "status": "degraded",
        "last_seen": "5s ago",
        "latency": 78.0,
        "data_rate": 220.0,
        "health_score": 75.0,
        "bandwidth_usage": 0.4,
        "error_rate": 2.1,
        "temperature": 55.0
    },
    "thermal-01": {
        "id": "thermal-01",
        "name": "Thermal Imager",
        "type": "thermal",
        "status": "offline",
        "last_seen": "45s ago",
        "latency": 0.0,
        "data_rate": 0.0,
        "health_score": 0.0,
        "bandwidth_usage": 0.0,
        "error_rate": 100.0,
        "temperature": None
    }
}


@router.get("", response_model=List[SensorResponse])
async def get_sensors():
    """Get status of all sensors"""
    # Simulate live updates
    for sensor_id, sensor_data in MOCK_SENSORS.items():
        if sensor_data["status"] != "offline":
            # Add small random variations to simulate live data
            sensor_data["latency"] = max(1, sensor_data["latency"] + (random.random() - 0.5) * 2)
            sensor_data["data_rate"] = max(0, sensor_data["data_rate"] + (random.random() - 0.5) * 10)
            sensor_data["health_score"] = max(0, min(100, sensor_data["health_score"] + (random.random() - 0.5) * 1))
            sensor_data["last_seen"] = "just now"

    return list(MOCK_SENSORS.values())


@router.get("/{sensor_id}", response_model=SensorResponse)
async def get_sensor(sensor_id: str):
    """Get status of a specific sensor"""
    if sensor_id not in MOCK_SENSORS:
        raise HTTPException(status_code=404, detail=f"Sensor {sensor_id} not found")

    sensor_data = MOCK_SENSORS[sensor_id].copy()

    # Simulate live update
    if sensor_data["status"] != "offline":
        sensor_data["latency"] = max(1, sensor_data["latency"] + (random.random() - 0.5) * 2)
        sensor_data["data_rate"] = max(0, sensor_data["data_rate"] + (random.random() - 0.5) * 10)
        sensor_data["health_score"] = max(0, min(100, sensor_data["health_score"] + (random.random() - 0.5) * 1))
        sensor_data["last_seen"] = "just now"

    return sensor_data


@router.put("/{sensor_id}", response_model=SensorResponse)
async def update_sensor(sensor_id: str, sensor_update: SensorUpdate):
    """Update sensor status or configuration"""
    if sensor_id not in MOCK_SENSORS:
        raise HTTPException(status_code=404, detail=f"Sensor {sensor_id} not found")

    # Update fields that are provided
    update_data = sensor_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key in MOCK_SENSORS[sensor_id]:
            MOCK_SENSORS[sensor_id][key] = value

    # Update timestamp
    MOCK_SENSORS[sensor_id]["last_seen"] = "just now"

    return MOCK_SENSORS[sensor_id]


@router.post("/{sensor_id}/reset")
async def reset_sensor(sensor_id: str):
    """Reset a sensor (bring offline sensors back online)"""
    if sensor_id not in MOCK_SENSORS:
        raise HTTPException(status_code=404, detail=f"Sensor {sensor_id} not found")

    sensor = MOCK_SENSORS[sensor_id]
    if sensor["status"] == "offline":
        sensor["status"] = "online"
        sensor["latency"] = random.uniform(10, 40)
        sensor["data_rate"] = random.uniform(500, 1500)
        sensor["health_score"] = random.uniform(80, 100)
        sensor["last_seen"] = "just now"

        # Reset type-specific fields
        if sensor["type"] == "camera":
            sensor["temperature"] = random.uniform(40, 50)
        elif sensor["type"] == "rf":
            sensor["signal_strength"] = random.uniform(-60, -30)
        elif sensor["type"] == "radar":
            sensor["temperature"] = random.uniform(50, 70)
        elif sensor["type"] == "thermal":
            sensor["temperature"] = random.uniform(30, 60)
            sensor["bandwidth_usage"] = random.uniform(0.1, 0.5)
            sensor["error_rate"] = random.uniform(0, 2)

    return {"message": f"Sensor {sensor_id} reset successfully", "sensor": sensor}


@router.get("/{sensor_id}/data")
async def get_sensor_data(sensor_id: str, limit: int = 100):
    """Get recent data points from a sensor"""
    if sensor_id not in MOCK_SENSORS:
        raise HTTPException(status_code=404, detail=f"Sensor {sensor_id} not found")

    # Generate mock time-series data
    sensor = MOCK_SENSORS[sensor_id]
    now = datetime.now()

    data_points = []
    for i in range(min(limit, 50)):  # Limit to 50 points for performance
        time_offset = now - timedelta(seconds=i*2)  # 2 second intervals

        # Generate realistic data based on sensor type
        if sensor["type"] == "camera":
            value = {
                "timestamp": time_offset.timestamp(),
                "frame_count": random.randint(25, 35),
                "avg_brightness": random.randint(50, 200),
                "motion_detected": random.random() > 0.7
            }
        elif sensor["type"] == "rf":
            value = {
                "timestamp": time_offset.timestamp(),
                "frequency_power": random.uniform(-80, -20),
                "signal_detected": random.random() > 0.8,
                "bandwidth_used": random.uniform(10, 50)
            }
        elif sensor["type"] == "radar":
            value = {
                "timestamp": time_offset.timestamp(),
                "range_bins": [random.uniform(0.1, 5.0) for _ in range(10)],
                "velocity": random.uniform(-5, 5),
                "objects_detected": random.randint(0, 3)
            }
        elif sensor["type"] == "thermal":
            value = {
                "timestamp": time_offset.timestamp(),
                "max_temp": random.uniform(20, 40),
                "min_temp": random.uniform(-10, 15),
                "hot_spots": random.randint(0, 5)
            }
        else:
            value = {"timestamp": time_offset.timestamp(), "value": random.random()}

        data_points.append(value)

    return {
        "sensor_id": sensor_id,
        "data_points": data_points,
        "count": len(data_points)
    }