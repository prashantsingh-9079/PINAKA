from typing import Dict, Any, List
from pydantic import BaseModel

class SystemStatusResponse(BaseModel):
    status: str
    version: str
    databaseConnected: bool
    databaseUrl: str
    activeSensors: int
    totalTracks: int
    activeTracks: int
    websocketConnectedClients: int
    latencyMs: float
    tensorCoreUtilizationPct: float
    ptpTimeSyncLocked: bool
    ptpDriftPpm: float
    isSimulated: bool = True

class DashboardStatsResponse(BaseModel):
    totalDetectedObjects: int
    activeTracksCount: int
    averageFusionConfidencePct: int
    processingLatencyMs: float
    swarmClustersCount: int
    systemHealthPct: float
    activeSensorsCount: int
    totalSensorsCount: int
