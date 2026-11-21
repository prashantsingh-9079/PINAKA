from sqlalchemy import Column, String, Float, Boolean
from app.database import Base

class EvaluationBenchmark(Base):
    __tablename__ = "evaluation_benchmarks"

    id = Column(String, primary_key=True, index=True)
    metric_name = Column(String, nullable=False)
    vision_only_score = Column(Float, nullable=False)
    multi_sensor_score = Column(Float, nullable=False)
    improvement_delta = Column(String, nullable=False)
    unit = Column(String, default="%")
    description = Column(String, nullable=False)
    is_benchmark = Column(Boolean, default=True)


class EnvironmentalTest(Base):
    __tablename__ = "environmental_tests"

    id = Column(String, primary_key=True, index=True)
    condition = Column(String, nullable=False)
    vision_only_f1 = Column(Float, nullable=False)
    multi_sensor_f1 = Column(Float, nullable=False)
    delta = Column(String, nullable=False)
    stress_factor = Column(String, nullable=False)
