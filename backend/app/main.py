"""
PINAKA Backend API
Multi-sensor AI platform for drone detection, tracking, and swarm analytics
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import json
import logging
from typing import List

from app.api import routes_health, routes_sensors, routes_tracks, routes_groups, routes_events, routes_search, routes_evaluation
from app.core.config import settings
from app.core.websocket_manager import manager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting PINAKA backend...")
    # Initialize any background tasks here
    yield
    # Shutdown
    logger.info("Shutting down PINAKA backend...")


app = FastAPI(
    title="PINAKA API",
    description="Multi-sensor AI platform for drone detection, tracking, and swarm analytics",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(routes_health.router, prefix="/api/health", tags=["health"])
app.include_router(routes_sensors.router, prefix="/api/sensors", tags=["sensors"])
app.include_router(routes_tracks.router, prefix="/api/tracks", tags=["tracks"])
app.include_router(routes_groups.router, prefix="/api/groups", tags=["groups"])
app.include_router(routes_events.router, prefix="/api/events", tags=["events"])
app.include_router(routes_search.router, prefix="/api/search", tags=["search"])
app.include_router(routes_evaluation.router, prefix="/api/evaluation", tags=["evaluation"])


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time data streaming"""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            # Echo back or process as needed
            await manager.send_personal_message(f"Message received: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("Client disconnected from WebSocket")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "PINAKA Multi-sensor AI Platform API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/status")
async def status():
    """API status endpoint"""
    return {
        "status": "operational",
        "timestamp": asyncio.get_event_loop().time()
    }