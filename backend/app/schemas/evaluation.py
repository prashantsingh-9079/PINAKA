from typing import List
from pydantic import BaseModel

class BenchmarkItem(BaseModel):
    metric: str
    visionOnly: float
    multiSensorFused: float
    improvement: str
    unit: str
    description: str

class EnvironmentalTestItem(BaseModel):
    condition: str
    visionOnlyF1: float
    multiSensorFused: float
    delta: str
    stressFactor: str

class EvaluationDashboardResponse(BaseModel):
    benchmarks: List[BenchmarkItem]
    environmentalTests: List[EnvironmentalTestItem]
    methodology: dict
