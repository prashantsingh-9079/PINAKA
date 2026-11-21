from sqlalchemy import Column, String, Float, Integer, Boolean, JSON, ForeignKey
from app.database import Base

class Observation(Base):
    __tablename__ = "observations"

    id = Column(String, primary_key=True, index=True)
    sensor_id = Column(String, ForeignKey("sensors.id"), index=True, nullable=False)
    timestamp = Column(Float, index=True, nullable=False)
    track_id = Column(String, ForeignKey("tracks.id"), index=True, nullable=True)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    alt = Column(Float, nullable=False)
    speed = Column(Float, default=0.0)
    heading = Column(Float, default=0.0)
    confidence = Column(Float, default=0.9)
    rcs = Column(Float, nullable=True)
    classification = Column(String, default="Micro-UAV")
    classification_probs_json = Column(JSON, default=dict)
    raw_payload_json = Column(JSON, default=dict)
    data_source = Column(String, default="SIMULATED_TESTBED")
    is_simulated = Column(Boolean, default=True)
