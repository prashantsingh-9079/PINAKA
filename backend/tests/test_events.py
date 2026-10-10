"""
Tests for the Events API
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_events():
    """Test getting events list"""
    response = client.get("/api/events/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

    # Check structure of first event
    event = data[0]
    assert "id" in event
    assert "event_type" in event
    assert "severity" in event
    assert "description" in event
    assert "timestamp" in event
    assert "status" in event
    assert "confidence" in event


def test_get_event_by_id():
    """Test getting a specific event by ID"""
    response = client.get("/api/events/event-001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "event-001"
    assert data["event_type"] == "swarm_detection"
    assert data["severity"] == "high"
    assert data["description"] == "Drone swarm detected approaching from northwest"


def test_get_event_not_found():
    """Test getting a non-existent event"""
    response = client.get("/api/events/event-999")
    assert response.status_code == 404


def test_filter_events_by_status():
    """Test filtering events by status"""
    response = client.get("/api/events/?status=active")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # All events should have status "active"
    for event in data:
        assert event["status"] == "active"


def test_filter_events_by_severity():
    """Test filtering events by severity"""
    response = client.get("/api/events/?severity=high")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # All events should have severity "high"
    for event in data:
        assert event["severity"] == "high"


def test_filter_events_by_type():
    """Test filtering events by event type"""
    response = client.get("/api/events/?event_type=intrusion_alert")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # All events should be intrusion_alert type
    for event in data:
        assert event["event_type"] == "intrusion_alert"


def test_create_event():
    """Test creating a new event"""
    event_data = {
        "event_type": "test_event",
        "severity": "medium",
        "description": "Test event for API testing",
        "confidence": 0.85,
        "source_tracks": ["track-test-1"],
        "source_sensors": ["cam-test"],
        "location": [100, 200],
        "metadata": {"test": True}
    }

    response = client.post("/api/events/", json=event_data)
    assert response.status_code == 200
    data = response.json()
    assert data["event_type"] == "test_event"
    assert data["severity"] == "medium"
    assert data["description"] == "Test event for API testing"
    assert data["id"].startswith("event-")


def test_acknowledge_event():
    """Test acknowledging an event"""
    response = client.post("/api/events/event-003/acknowledge?operator_id=test-operator")
    assert response.status_code == 200
    data = response.json()
    assert data["event"]["status"] == "acknowledged"
    assert data["event"]["acknowledged_by"] == "test-operator"


def test_resolve_event():
    """Test resolving an event"""
    # First acknowledge an event
    client.post("/api/events/event-003/acknowledge?operator_id=test-operator")

    # Then resolve it
    response = client.post("/api/events/event-003/resolve")
    assert response.status_code == 200
    data = response.json()
    assert data["event"]["status"] == "resolved"
    assert data["event"]["resolved_at"] is not None


def test_mark_false_positive():
    """Test marking an event as false positive"""
    response = client.post("/api/events/event-003/false-positive?reason=Test%20false%20positive")
    assert response.status_code == 200
    data = response.json()
    assert data["event"]["status"] == "false_positive"
    assert data["event"]["false_positive_reason"] == "Test false positive"


def test_get_events_summary():
    """Test getting events summary statistics"""
    response = client.get("/api/events/analytics/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_events" in data
    assert "active_events" in data
    assert "acknowledged_events" in data
    assert "resolved_events" in data
    assert "false_positive_events" in data
    assert "average_confidence" in data
    assert "severity_distribution" in data
    assert "event_type_distribution" in data


def test_get_events_timeline():
    """Test getting events timeline data"""
    response = client.get("/api/events/analytics/timeline?hours=1&interval=15m")
    assert response.status_code == 200
    data = response.json()
    assert "interval" in data
    assert "hours_covered" in data
    assert "data_points" in data
    assert isinstance(data["data_points"], list)

    # Check structure of data points
    if len(data["data_points"]) > 0:
        point = data["data_points"][0]
        assert "timestamp" in point
        assert "event_count" in point
        assert "period_start" in point
        assert "period_end" in point


def test_get_events_stream():
    """Test getting events stream for real-time updates"""
    response = client.get("/api/events/stream")
    assert response.status_code == 200
    data = response.json()
    assert "events" in data
    assert "count" in data
    assert "timestamp" in data
    assert isinstance(data["events"], list)