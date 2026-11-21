import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api import api_router
from app.websocket.manager import ws_manager
from app.utils.seeder import seed_database
from app.services.simulation_engine import simulation_engine

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("pinaka.main")

# Create tables immediately at module load time as well as in lifespan
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize SQLite tables
    logger.info("Initializing SQLite database tables...")
    Base.metadata.create_all(bind=engine)
    
    # 2. Seed initial data
    db = SessionLocal()
    try:
        logger.info("Seeding database with sensors, benchmark models and baseline tracks...")
        seed_database(db)
        
        # 3. Initialize simulation engine state
        simulation_engine.initialize_from_db(db)
    finally:
        db.close()

    # 4. Start simulation physics background worker
    logger.info("Starting PINAKA Simulation Engine...")
    await simulation_engine.start()

    yield

    # Shutdown
    logger.info("Stopping PINAKA Simulation Engine...")
    simulation_engine.is_running = False

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_FULL_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include REST API Routers
app.include_router(api_router, prefix=settings.API_PREFIX)

# WebSocket Endpoint for Live Streaming
@app.websocket("/ws/live")
async def websocket_live_stream(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Keep socket open and listen for client messages (heartbeat/commands)
        while True:
            data = await websocket.receive_text()
            # Client can ping or send control commands
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.warning(f"WebSocket client error: {e}")
        ws_manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "name": settings.PROJECT_FULL_NAME,
        "tagline": "Detect. Understand. Protect.",
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "websocket_url": "/ws/live"
    }
