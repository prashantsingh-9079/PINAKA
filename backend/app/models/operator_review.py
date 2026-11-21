from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class OperatorReview(Base):
    __tablename__ = "operator_reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    track_id = Column(String, index=True, nullable=False)
    status = Column(String, nullable=False)  # Verified Hostile, Authorized Flight, False Positive, Under Review
    notes = Column(String, nullable=True)
    operator_id = Column(String, default="OP-774")
    created_at = Column(Float, nullable=False)
