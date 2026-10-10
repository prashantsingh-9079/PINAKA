"""
Health Check API Routes
"""

from fastapi import APIRouter
from app.core.config import settings
import torch
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "service": "PINAKA Backend",
        "version": "1.0.0"
    }


@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check with component status"""
    components = {
        "api": "healthy",
        "database": "not_configured",  # Would check actual DB connection
        "redis": "not_configured",     # Would check actual Redis connection
        "gemma_model": "unknown"
    }

    # Check Gemma model status
    try:
        from app.search.gemma_service import gemma_service
        if gemma_service.model is not None:
            components["gemma_model"] = "loaded"
        else:
            components["gemma_model"] = "not_loaded"
    except Exception as e:
        logger.error(f"Error checking Gemma model: {e}")
        components["gemma_model"] = f"error: {str(e)}"

    # Check GPU availability
    components["gpu_available"] = torch.cuda.is_available()
    if torch.cuda.is_available():
        components["gpu_count"] = torch.cuda.device_count()
        components["gpu_name"] = torch.cuda.get_device_name(0)

    return {
        "status": "healthy",
        "timestamp": settings.API_V1_STR,
        "components": components,
        "settings": {
            "gemma_model": settings.GEMMA_MODEL_NAME,
            "max_tracking_objects": settings.MAX_TRACKING_OBJECTS,
            "event_confidence_threshold": settings.EVENT_CONFIDENCE_THRESHOLD
        }
    }