from sqlalchemy import Column, String, Float, Integer, JSON
from app.database import Base

class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(String, primary_key=True, index=True)  # camera, thermal, radar, rf
    name = Column(String, nullable=False)
    full_title = Column(String, nullable=False)
    model = Column(String, nullable=False)
    status = Column(String, default="ONLINE")  # ONLINE, DEGRADED, STANDBY, OFFLINE
    health_score = Column(Float, default=98.0)
    data_quality = Column(Float, default=96.0)
    last_observation = Column(String, default="0.04s ago")
    latency_ms = Column(Float, default=14.0)
    throughput_mbps = Column(Float, default=150.0)
    time_sync_jitter_us = Column(Float, default=0.18)
    active_detections_count = Column(Integer, default=5)
    firmware_version = Column(String, default="v4.8.2")
    specs_json = Column(JSON, default=dict)
