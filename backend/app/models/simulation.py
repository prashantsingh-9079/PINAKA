from sqlalchemy import Column, String, Float, JSON
from app.database import Base

class SimulationSession(Base):
    __tablename__ = "simulation_sessions"

    id = Column(String, primary_key=True, index=True)
    scenario_name = Column(String, default="default")
    status = Column(String, default="RUNNING")  # RUNNING, PAUSED, STOPPED
    speed_multiplier = Column(Float, default=1.0)
    created_at = Column(Float, nullable=False)
    updated_at = Column(Float, nullable=False)
    parameters_json = Column(JSON, default=dict)
