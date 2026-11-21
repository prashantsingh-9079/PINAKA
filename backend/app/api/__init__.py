from fastapi import APIRouter
from app.api.dashboard import router as dashboard_router
from app.api.sensors import router as sensors_router
from app.api.tracks import router as tracks_router
from app.api.events import router as events_router
from app.api.analytics import router as analytics_router
from app.api.evaluation import router as evaluation_router
from app.api.simulation import router as simulation_router
from app.api.operator import router as operator_router
from app.api.reference import router as reference_router
from app.api.system import router as system_router

api_router = APIRouter()

api_router.include_router(system_router, tags=["System"])
api_router.include_router(dashboard_router, tags=["Dashboard"])
api_router.include_router(sensors_router, tags=["Sensors"])
api_router.include_router(tracks_router, tags=["Tracks"])
api_router.include_router(events_router, tags=["Events"])
api_router.include_router(analytics_router, tags=["Analytics"])
api_router.include_router(evaluation_router, tags=["Evaluation"])
api_router.include_router(simulation_router, tags=["Simulation"])
api_router.include_router(operator_router, tags=["Operator"])
api_router.include_router(reference_router, tags=["Reference"])
