import time
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.simulation_engine import simulation_engine
from app.schemas.simulation import SimulationControlRequest, SimulationStatusResponse

router = APIRouter()

@router.post("/simulation/start", response_model=SimulationStatusResponse)
async def start_simulation():
    await simulation_engine.start()
    return get_status()

@router.post("/simulation/pause", response_model=SimulationStatusResponse)
def pause_simulation():
    simulation_engine.pause()
    return get_status()

@router.post("/simulation/resume", response_model=SimulationStatusResponse)
def resume_simulation():
    simulation_engine.resume()
    return get_status()

@router.post("/simulation/reset", response_model=SimulationStatusResponse)
def reset_simulation(db: Session = Depends(get_db)):
    simulation_engine.reset(db)
    return get_status()

@router.post("/simulation/control", response_model=SimulationStatusResponse)
def control_simulation(req: SimulationControlRequest, db: Session = Depends(get_db)):
    if req.speed is not None:
        simulation_engine.set_speed(req.speed)
    if req.scenario is not None:
        simulation_engine.set_scenario(req.scenario, db)
    return get_status()

@router.get("/simulation/status", response_model=SimulationStatusResponse)
def get_simulation_status():
    return get_status()

def get_status() -> dict:
    return {
        "status": "PAUSED" if simulation_engine.is_paused else "RUNNING" if simulation_engine.is_running else "STOPPED",
        "scenario": simulation_engine.scenario,
        "speedMultiplier": simulation_engine.speed_multiplier,
        "activeTracksCount": len(simulation_engine.tracks_state),
        "activeSensorsCount": 4,
        "isSimulated": True,
        "tickRateHz": simulation_engine.tick_rate_hz,
        "uptimeSeconds": round(time.time() - simulation_engine.start_time, 1)
    }
