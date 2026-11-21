export type SensorType = 'camera' | 'thermal' | 'radar' | 'rf';

export type DroneClassification = 
  | 'Commercial Quadcopter'
  | 'Fixed-Wing Drone'
  | 'FPV Drone'
  | 'Micro-UAV'
  | 'Heavy-Lift Hexacopter'
  | 'Avian Clutter';

export type VerificationStatus = 
  | 'Unverified'
  | 'Verified Hostile'
  | 'Authorized Flight'
  | 'False Positive'
  | 'Under Review';

export interface ObservationPoint {
  timestamp: number;
  x: number; // Normalized 0-100 or km
  y: number; // Normalized 0-100 or km
  alt: number; // meters
  speed: number; // km/h
  heading: number; // deg
  confidence: number; // 0-1
  fusedSensors: SensorType[];
  rcs?: number; // dBsm
}

export interface Track {
  id: string; // e.g. TRK-804
  callsign: string; // e.g. PHANTOM-A9
  classification: DroneClassification;
  position: {
    x: number; // 0-100 coordinate in surveillance sector
    y: number; // 0-100
    lat: number;
    lng: number;
    alt: number; // Altitude in meters
  };
  velocity: number; // km/h
  heading: number; // 0-360 deg
  climbRate: number; // m/s
  range: number; // meters from sensor station
  azimuth: number; // degrees
  elevation: number; // degrees
  rcs: number; // Radar Cross Section dBsm
  confidence: number; // Overall fusion confidence 0.0 - 1.0
  fusedSensors: SensorType[];
  rfFrequency: string; // e.g. "2.437 GHz (Ch 6) / OcuSync 3+"
  rfPower: number; // dBm
  thermalSignature: string; // e.g. "ΔT +6.8°C / Motor Coils"
  thermalTempMax: number; // Celsius
  opticalBBox: {
    x: number; // 0-100 %
    y: number;
    w: number;
    h: number;
  };
  verificationStatus: VerificationStatus;
  operatorNotes?: string;
  groupId: string | null;
  history: ObservationPoint[];
  lastUpdated: number;
  isSimulated: boolean;
}

export interface SensorStatus {
  id: SensorType;
  name: string;
  fullTitle: string;
  model: string;
  status: 'ONLINE' | 'DEGRADED' | 'STANDBY' | 'OFFLINE';
  healthScore: number; // 0-100%
  dataQuality: number; // 0-100%
  lastObservation: string;
  latencyMs: number;
  throughputMbps: number;
  timeSyncJitterUs: number; // micro-seconds jitter (PTP IEEE 1588)
  activeDetectionsCount: number;
  firmwareVersion: string;
  specs: {
    spectralBand?: string;
    resolution?: string;
    frameRate?: string;
    frequency?: string;
    maxRange?: string;
    fov?: string;
  };
}

export interface GroupCluster {
  id: string;
  name: string;
  trackIds: string[];
  centroid: {
    x: number;
    y: number;
    alt: number;
  };
  dispersionRadius: number; // meters
  formationType: 'V-Formation' | 'Dispersed Cluster' | 'Column Line' | 'Dynamic Swarm' | 'Circular Perimeter';
  cohesionScore: number; // 0.0 - 1.0
  relativeMovementVector: {
    speed: number;
    heading: number;
  };
  nearestNeighborDistAvg: number; // meters
  history: {
    timestamp: number;
    dispersion: number;
    cohesion: number;
    size: number;
  }[];
}

export interface RecentEvent {
  id: string;
  timestamp: string;
  type: 'DETECTION' | 'FUSION_LOCK' | 'GROUP_SPLIT' | 'RF_EMISSION' | 'OPERATOR_OVERRIDE' | 'SENSOR_ALERT';
  severity: 'info' | 'warning' | 'alert' | 'critical';
  title: string;
  message: string;
  trackId?: string;
}

export interface ReferenceDrone {
  id: string;
  modelName: string;
  manufacturer: string;
  category: DroneClassification;
  image: string;
  wingspanMeters: number;
  maxSpeedKmh: number;
  typicalRcs: number; // dBsm
  rotorCount: number;
  rfProtocol: string;
  batteryLifeMin: number;
  maxPayloadKg: number;
  visualColor: string;
  thermalProfile: string;
  description: string;
}

export interface EvaluationBenchmark {
  metric: string;
  visionOnly: number;
  multiSensorFused: number;
  improvement: string;
  unit: string;
  description: string;
}

export interface EnvironmentalTestResult {
  condition: string;
  visionOnlyF1: number;
  multiSensorFused: number;
  delta: string;
  stressFactor: string;
}

export interface SystemSettings {
  theme: 'tactical-midnight' | 'deep-abyss' | 'radar-emerald' | 'solar-amber';
  telemetryUnits: 'metric' | 'imperial' | 'aviation';
  refreshRateHz: 30 | 60;
  audioAlerts: boolean;
  kalmanProcessNoiseQ: number; // 0.01 - 1.0
  kalmanMeasurementNoiseR: number; // 0.1 - 5.0
  associationThresholdMahalanobis: number; // 1.0 - 5.0
  minSensorsForLock: 1 | 2 | 3;
  showSimulatedWatermarks: boolean;
  simulationScenario: 'default' | 'swarm-5' | 'fpv-speed' | 'avian-clutter' | 'thermal-night';
  simulationSpeed: 0.5 | 1.0 | 2.0 | 5.0;
  isSimulating: boolean;
}
