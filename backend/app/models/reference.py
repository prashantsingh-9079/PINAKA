from sqlalchemy import Column, String, Float, Integer, JSON
from app.database import Base

class ReferenceSnapshot(Base):
    __tablename__ = "reference_snapshots"

    id = Column(String, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    manufacturer = Column(String, nullable=False)
    category = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    wingspan_meters = Column(Float, default=0.5)
    max_speed_kmh = Column(Float, default=80.0)
    typical_rcs_dbsm = Column(Float, default=-14.0)
    rotor_count = Column(Integer, default=4)
    rf_protocol = Column(String, default="OcuSync")
    battery_life_min = Column(Integer, default=30)
    max_payload_kg = Column(Float, default=1.0)
    visual_color = Column(String, default="Dark Grey")
    thermal_profile = Column(String, default="Rotors")
    description = Column(String, nullable=False)
    feature_vector_json = Column(JSON, default=list)  # Visual embedding vector for cosine similarity
