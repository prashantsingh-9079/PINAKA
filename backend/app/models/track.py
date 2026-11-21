from sqlalchemy import Column, String, Float, Integer, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Track(Base):
    __tablename__ = "tracks"

    id = Column(String, primary_key=True, index=True)  # e.g. TRK-801
    callsign = Column(String, nullable=False)
    classification = Column(String, nullable=False)  # Commercial Quadcopter, FPV Drone, etc.
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    alt = Column(Float, nullable=False)
    lat = Column(Float, default=28.6139)
    lng = Column(Float, default=77.2090)
    velocity = Column(Float, nullable=False)
    heading = Column(Float, nullable=False)
    climb_rate = Column(Float, default=0.0)
    range = Column(Float, default=1200.0)
    azimuth = Column(Float, default=45.0)
    elevation = Column(Float, default=5.0)
    rcs = Column(Float, default=-14.0)
    confidence = Column(Float, default=0.95)
    fused_sensors_json = Column(JSON, default=list)  # ["camera", "thermal", "radar", "rf"]
    rf_frequency = Column(String, default="2.437 GHz")
    rf_power = Column(Float, default=-64.0)
    thermal_signature = Column(String, default="ΔT +7.2°C")
    thermal_temp_max = Column(Float, default=44.0)
    bbox_json = Column(JSON, default=dict)  # {"x": 45, "y": 38, "w": 8, "h": 8}
    verification_status = Column(String, default="Under Review")
    operator_notes = Column(String, nullable=True)
    group_id = Column(String, nullable=True)
    is_simulated = Column(Boolean, default=True)
    last_updated = Column(Float, nullable=False)

    history = relationship("TrackHistory", back_populates="track", cascade="all, delete-orphan", order_by="TrackHistory.timestamp")


class TrackHistory(Base):
    __tablename__ = "track_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    track_id = Column(String, ForeignKey("tracks.id", ondelete="CASCADE"), index=True, nullable=False)
    timestamp = Column(Float, index=True, nullable=False)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    alt = Column(Float, nullable=False)
    speed = Column(Float, nullable=False)
    heading = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    fused_sensors_json = Column(JSON, default=list)
    rcs = Column(Float, nullable=True)

    track = relationship("Track", back_populates="history")
