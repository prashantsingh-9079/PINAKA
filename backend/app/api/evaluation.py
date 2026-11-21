from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import EvaluationBenchmark, EnvironmentalTest
from app.schemas.evaluation import EvaluationDashboardResponse

router = APIRouter()

@router.get("/evaluation", response_model=EvaluationDashboardResponse)
def get_evaluation_results(db: Session = Depends(get_db)):
    benchmarks = db.query(EvaluationBenchmark).all()
    env_tests = db.query(EnvironmentalTest).all()

    return {
        "benchmarks": [
            {
                "metric": b.metric_name,
                "visionOnly": b.vision_only_score,
                "multiSensorFused": b.multi_sensor_score,
                "improvement": b.improvement_delta,
                "unit": b.unit,
                "description": b.description
            }
            for b in benchmarks
        ],
        "environmentalTests": [
            {
                "condition": e.condition,
                "visionOnlyF1": e.vision_only_f1,
                "multiSensorFused": e.multi_sensor_f1,
                "delta": e.delta,
                "stressFactor": e.stress_factor
            }
            for e in env_tests
        ],
        "methodology": {
            "testDatasetSize": "4,800 Flight Passes",
            "groundTruthEquipment": "Differential RTK-GPS + Laser Rangefinder",
            "isSimulatedBenchmark": True,
            "measuredTrialsHours": 120
        }
    }
