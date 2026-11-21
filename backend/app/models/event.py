from sqlalchemy import Column, String
from app.database import Base

class SystemEvent(Base):
    __tablename__ = "system_events"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(String, nullable=False)
    type = Column(String, nullable=False)  # DETECTION, FUSION_LOCK, GROUP_SPLIT, RF_EMISSION, OPERATOR_OVERRIDE, SENSOR_ALERT
    severity = Column(String, default="info")  # info, warning, alert, critical
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    track_id = Column(String, nullable=True)
