import { 
  Track, 
  SensorStatus, 
  GroupCluster, 
  RecentEvent, 
  VerificationStatus,
  ReferenceDrone,
  EvaluationBenchmark,
  EnvironmentalTestResult
} from '../types/pinaka';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin;
  }
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Request to ${path} failed:`, err);
    throw err;
  }
}

export const api = {
  // System & Health
  getHealth: () => request<{ status: string; service: string; database: string; simulationActive: boolean; connectedWebSockets: number }>('/api/health'),
  getSystemStatus: () => request<any>('/api/system/status'),
  getDashboardStats: () => request<any>('/api/dashboard/stats'),

  // Sensors
  getSensors: () => request<SensorStatus[]>('/api/sensors'),
  getSensor: (id: string) => request<SensorStatus>(`/api/sensors/${id}`),

  // Tracks
  getTracks: () => request<Track[]>('/api/tracks'),
  getTrack: (id: string) => request<Track>(`/api/tracks/${id}`),
  getTrackHistory: (id: string) => request<any[]>(`/api/tracks/${id}/history`),

  // Events
  getEvents: () => request<RecentEvent[]>('/api/events'),
  createEvent: (event: Omit<RecentEvent, 'id' | 'timestamp'>) => request<RecentEvent>('/api/events', {
    method: 'POST',
    body: JSON.stringify(event)
  }),

  // Analytics
  getGroupAnalytics: () => request<GroupCluster[]>('/api/analytics/groups'),
  getTrajectory: (trackId: string) => request<any[]>(`/api/analytics/trajectory?track_id=${encodeURIComponent(trackId)}`),
  getSpeedAnalytics: (trackId: string) => request<any[]>(`/api/analytics/speed?track_id=${encodeURIComponent(trackId)}`),
  getConfidenceAnalytics: (trackId: string) => request<any[]>(`/api/analytics/confidence?track_id=${encodeURIComponent(trackId)}`),

  // Evaluation
  getEvaluation: () => request<{ benchmarks: EvaluationBenchmark[]; environmentalTests: EnvironmentalTestResult[]; methodology: any }>('/api/evaluation'),

  // Simulation Controls
  startSimulation: () => request<any>('/api/simulation/start', { method: 'POST' }),
  pauseSimulation: () => request<any>('/api/simulation/pause', { method: 'POST' }),
  resumeSimulation: () => request<any>('/api/simulation/resume', { method: 'POST' }),
  resetSimulation: () => request<any>('/api/simulation/reset', { method: 'POST' }),
  controlSimulation: (params: { speed?: number; scenario?: string }) => request<any>('/api/simulation/control', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  getSimulationStatus: () => request<any>('/api/simulation/status'),

  // Operator Reviews
  submitOperatorReview: (review: { trackId: string; status: VerificationStatus; notes?: string }) => request<any>('/api/operator/review', {
    method: 'POST',
    body: JSON.stringify(review)
  }),
  getOperatorReviews: () => request<any[]>('/api/operator/reviews'),

  // Reference Drone Search
  searchReferenceDrones: (params: { query?: string; color?: string; category?: string; imageBase64?: string }) => request<ReferenceDrone[]>('/api/reference/search', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  getAllReferenceDrones: () => request<ReferenceDrone[]>('/api/reference/drones'),
};
