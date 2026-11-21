import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal, Base, engine
from app.utils.seeder import seed_database
from app.services.simulation_engine import simulation_engine

# Ensure tables and seed exist
Base.metadata.create_all(bind=engine)
db = SessionLocal()
seed_database(db)
simulation_engine.initialize_from_db(db)
db.close()

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["HEALTHY", "DEGRADED"]
    assert data["service"] == "PINAKA"

def test_dashboard_stats():
    res = client.get("/api/dashboard/stats")
    assert res.status_code == 200
    data = res.json()
    assert "totalDetectedObjects" in data
    assert "activeTracksCount" in data
    assert "averageFusionConfidencePct" in data
    assert "processingLatencyMs" in data

def test_sensors():
    res = client.get("/api/sensors")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 4
    sensor_ids = [s["id"] for s in data]
    assert "camera" in sensor_ids
    assert "thermal" in sensor_ids
    assert "radar" in sensor_ids
    assert "rf" in sensor_ids

def test_tracks():
    res = client.get("/api/tracks")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    t0 = data[0]
    assert "id" in t0
    assert "position" in t0
    assert "confidence" in t0
    assert t0["isSimulated"] is True

def test_track_detail_and_history():
    tracks = client.get("/api/tracks").json()
    track_id = tracks[0]["id"]
    
    res = client.get(f"/api/tracks/{track_id}")
    assert res.status_code == 200
    assert res.json()["id"] == track_id

    hist_res = client.get(f"/api/tracks/{track_id}/history")
    assert hist_res.status_code == 200
    assert isinstance(hist_res.json(), list)

def test_events():
    res = client.get("/api/events")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_analytics():
    tracks = client.get("/api/tracks").json()
    track_id = tracks[0]["id"]

    res_traj = client.get(f"/api/analytics/trajectory?track_id={track_id}")
    assert res_traj.status_code == 200

    res_speed = client.get(f"/api/analytics/speed?track_id={track_id}")
    assert res_speed.status_code == 200

    res_conf = client.get(f"/api/analytics/confidence?track_id={track_id}")
    assert res_conf.status_code == 200

    res_groups = client.get("/api/analytics/groups")
    assert res_groups.status_code == 200

def test_evaluation():
    res = client.get("/api/evaluation")
    assert res.status_code == 200
    data = res.json()
    assert "benchmarks" in data
    assert "environmentalTests" in data

def test_simulation_controls():
    res_status = client.get("/api/simulation/status")
    assert res_status.status_code == 200
    assert res_status.json()["isSimulated"] is True

    res_pause = client.post("/api/simulation/pause")
    assert res_pause.status_code == 200
    assert res_pause.json()["status"] == "PAUSED"

    res_resume = client.post("/api/simulation/resume")
    assert res_resume.status_code == 200
    assert res_resume.json()["status"] == "RUNNING"

def test_operator_review():
    review_payload = {
        "trackId": "TRK-801",
        "status": "Verified Hostile",
        "notes": "Verified by automated test suite."
    }
    res = client.post("/api/operator/review", json=review_payload)
    assert res.status_code == 200
    assert res.json()["status"] == "Verified Hostile"

    res_list = client.get("/api/operator/reviews")
    assert res_list.status_code == 200
    assert len(res_list.json()) >= 1

def test_reference_search():
    res = client.post("/api/reference/search", json={"query": "Matrice", "category": "all"})
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    assert "Matrice" in data[0]["modelName"]

def test_system_status():
    res = client.get("/api/system/status")
    assert res.status_code == 200
    data = res.json()
    assert data["databaseConnected"] is True
    assert data["ptpTimeSyncLocked"] is True
