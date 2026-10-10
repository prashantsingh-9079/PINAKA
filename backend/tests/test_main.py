"""
Basic tests for the PINAKA backend
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "PINAKA" in data["message"]


def test_health_endpoint():
    """Test the health check endpoint"""
    response = client.get("/api/health/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_detailed_health_endpoint():
    """Test the detailed health check endpoint"""
    response = client.get("/api/health/detailed")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "components" in data


def test_sensors_endpoint():
    """Test the sensors endpoint"""
    response = client.get("/api/sensors/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Check that we have the expected sensors
    sensor_ids = [sensor["id"] for sensor in data]
    assert "cam-01" in sensor_ids
    assert "rf-01" in sensor_ids


def test_search_text_endpoint():
    """Test the text search endpoint"""
    response = client.post(
        "/api/search/text",
        json={"query": "person wearing red shirt", "limit": 5}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["query_type"] == "text"
    assert "results" in data
    assert "processing_time_ms" in data