import { 
  Track, 
  SensorStatus, 
  GroupCluster, 
  RecentEvent, 
  ReferenceDrone, 
  EvaluationBenchmark, 
  EnvironmentalTestResult,
  SystemSettings 
} from '../types/pinaka';

export const INITIAL_SENSORS: SensorStatus[] = [
  {
    id: 'camera',
    name: 'EO Optical Gimbal',
    fullTitle: 'Electro-Optical High-Resolution Surveillance Pod',
    model: 'PINAKA-EO-4K80 Ultra Zoom',
    status: 'ONLINE',
    healthScore: 98,
    dataQuality: 96,
    lastObservation: '0.04s ago',
    latencyMs: 14.8,
    throughputMbps: 185.4,
    timeSyncJitterUs: 0.18,
    activeDetectionsCount: 5,
    firmwareVersion: 'v4.8.2-rtsp-opt',
    specs: {
      spectralBand: 'Visible 380 - 750 nm',
      resolution: '3840 x 2160 (4K UHD)',
      frameRate: '60 FPS Ultra-Low Latency',
      fov: '3.2° Narrow to 64° Wide Dynamic Zoom'
    }
  },
  {
    id: 'thermal',
    name: 'LWIR Thermal Core',
    fullTitle: 'Long-Wave Infrared Microbolometer Sensor',
    model: 'FLIR-PINAKA Boson-640 LWIR',
    status: 'ONLINE',
    healthScore: 99,
    dataQuality: 97,
    lastObservation: '0.03s ago',
    latencyMs: 11.2,
    throughputMbps: 92.0,
    timeSyncJitterUs: 0.22,
    activeDetectionsCount: 6,
    firmwareVersion: 'v2.1.0-ir-calib',
    specs: {
      spectralBand: 'LWIR 7.5 - 13.5 μm',
      resolution: '640 x 512 Uncooled VOx',
      frameRate: '60 Hz Synchronized',
      fov: '18° x 14° Telephoto IR Lens'
    }
  },
  {
    id: 'radar',
    name: 'X-Band 3D AESA Radar',
    fullTitle: 'Active Electronically Scanned Array Micro-Doppler Radar',
    model: 'PINAKA-AESA-3DX FMCW',
    status: 'ONLINE',
    healthScore: 97,
    dataQuality: 99,
    lastObservation: '0.08s ago',
    latencyMs: 16.5,
    throughputMbps: 450.8,
    timeSyncJitterUs: 0.12,
    activeDetectionsCount: 7,
    firmwareVersion: 'v5.3.1-doppler-dsp',
    specs: {
      frequency: 'X-Band 9.4 - 9.8 GHz FMCW',
      resolution: 'Range: 0.5m | Azimuth: 0.8° | Elevation: 1.2°',
      maxRange: '5,000 m (Instrumented)',
      fov: '360° Continuous Electronic Beam Steering'
    }
  },
  {
    id: 'rf',
    name: 'Passive RF SDR Array',
    fullTitle: 'Authorized RF Telemetry & C2 Protocol Scanner',
    model: 'SDR-PINAKA Hydra-4X Wideband',
    status: 'ONLINE',
    healthScore: 96,
    dataQuality: 94,
    lastObservation: '0.02s ago',
    latencyMs: 8.4,
    throughputMbps: 120.5,
    timeSyncJitterUs: 0.15,
    activeDetectionsCount: 5,
    firmwareVersion: 'v3.7.0-sdr-hop',
    specs: {
      frequency: '400 MHz - 6.0 GHz Continuous Real-time',
      resolution: '100 kHz Channelization / 40 MHz Instantaneous BW',
      spectralBand: 'FHSS, DSSS, OcuSync 2/3/4, ExpressLRS, TBS Crossfire',
      maxRange: '8,000 m Line-of-Sight'
    }
  }
];

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'TRK-801',
    callsign: 'SPECTRE-1',
    classification: 'Commercial Quadcopter',
    position: {
      x: 48,
      y: 42,
      lat: 28.6139,
      lng: 77.2090,
      alt: 124
    },
    velocity: 48.5,
    heading: 135,
    climbRate: -0.4,
    range: 1240,
    azimuth: 42.5,
    elevation: 5.7,
    rcs: -14.2, // dBsm (typical small drone)
    confidence: 0.98,
    fusedSensors: ['camera', 'thermal', 'radar', 'rf'],
    rfFrequency: '2.437 GHz (Ch 6) / OcuSync 3.0',
    rfPower: -64.2,
    thermalSignature: 'ΔT +7.4°C / 4x Brushless Rotors + ESC Hub',
    thermalTempMax: 44.2,
    opticalBBox: {
      x: 45,
      y: 38,
      w: 8,
      h: 8
    },
    verificationStatus: 'Under Review',
    operatorNotes: 'Target maintains stationary perimeter hover near Sector Alpha.',
    groupId: 'SWARM-BRAVO-1',
    history: [
      { timestamp: Date.now() - 60000, x: 42, y: 36, alt: 110, speed: 42.0, heading: 125, confidence: 0.94, fusedSensors: ['radar', 'rf'] },
      { timestamp: Date.now() - 45000, x: 44, y: 38, alt: 115, speed: 45.2, heading: 130, confidence: 0.96, fusedSensors: ['camera', 'radar', 'rf'] },
      { timestamp: Date.now() - 30000, x: 46, y: 40, alt: 120, speed: 47.8, heading: 132, confidence: 0.97, fusedSensors: ['camera', 'thermal', 'radar', 'rf'] },
      { timestamp: Date.now() - 15000, x: 47, y: 41, alt: 123, speed: 48.1, heading: 134, confidence: 0.98, fusedSensors: ['camera', 'thermal', 'radar', 'rf'] },
      { timestamp: Date.now(), x: 48, y: 42, alt: 124, speed: 48.5, heading: 135, confidence: 0.98, fusedSensors: ['camera', 'thermal', 'radar', 'rf'] }
    ],
    lastUpdated: Date.now(),
    isSimulated: true
  },
  {
    id: 'TRK-802',
    callsign: 'SPECTRE-2',
    classification: 'Commercial Quadcopter',
    position: {
      x: 52,
      y: 45,
      lat: 28.6145,
      lng: 77.2105,
      alt: 128
    },
    velocity: 51.2,
    heading: 138,
    climbRate: 0.2,
    range: 1380,
    azimuth: 46.1,
    elevation: 5.3,
    rcs: -13.8,
    confidence: 0.97,
    fusedSensors: ['camera', 'thermal', 'radar', 'rf'],
    rfFrequency: '2.437 GHz (Ch 6) / Secondary Telemetry Link',
    rfPower: -66.8,
    thermalSignature: 'ΔT +6.9°C / Motor Arm Cluster',
    thermalTempMax: 43.5,
    opticalBBox: {
      x: 50,
      y: 42,
      w: 7.5,
      h: 7.5
    },
    verificationStatus: 'Under Review',
    operatorNotes: 'Flocking coordinate with TRK-801; delta distance: ~180m.',
    groupId: 'SWARM-BRAVO-1',
    history: [
      { timestamp: Date.now() - 60000, x: 46, y: 39, alt: 114, speed: 44.5, heading: 128, confidence: 0.92, fusedSensors: ['radar', 'rf'] },
      { timestamp: Date.now() - 30000, x: 49, y: 42, alt: 122, speed: 49.0, heading: 135, confidence: 0.96, fusedSensors: ['camera', 'thermal', 'radar'] },
      { timestamp: Date.now(), x: 52, y: 45, alt: 128, speed: 51.2, heading: 138, confidence: 0.97, fusedSensors: ['camera', 'thermal', 'radar', 'rf'] }
    ],
    lastUpdated: Date.now(),
    isSimulated: true
  },
  {
    id: 'TRK-803',
    callsign: 'SPECTRE-3',
    classification: 'Commercial Quadcopter',
    position: {
      x: 45,
      y: 47,
      lat: 28.6132,
      lng: 77.2112,
      alt: 130
    },
    velocity: 49.8,
    heading: 136,
    climbRate: 0.1,
    range: 1410,
    azimuth: 44.2,
    elevation: 5.2,
    rcs: -14.0,
    confidence: 0.96,
    fusedSensors: ['camera', 'thermal', 'radar', 'rf'],
    rfFrequency: '2.442 GHz (Ch 7) / Mesh Relay',
    rfPower: -68.4,
    thermalSignature: 'ΔT +7.1°C / ESC Radiators',
    thermalTempMax: 44.0,
    opticalBBox: {
      x: 43,
      y: 44,
      w: 8,
      h: 8
    },
    verificationStatus: 'Under Review',
    operatorNotes: 'Rear echelon element of 3-ship candidate formation.',
    groupId: 'SWARM-BRAVO-1',
    history: [
      { timestamp: Date.now() - 60000, x: 39, y: 41, alt: 118, speed: 43.1, heading: 130, confidence: 0.90, fusedSensors: ['radar'] },
      { timestamp: Date.now() - 30000, x: 42, y: 44, alt: 125, speed: 48.0, heading: 134, confidence: 0.94, fusedSensors: ['camera', 'radar', 'rf'] },
      { timestamp: Date.now(), x: 45, y: 47, alt: 130, speed: 49.8, heading: 136, confidence: 0.96, fusedSensors: ['camera', 'thermal', 'radar', 'rf'] }
    ],
    lastUpdated: Date.now(),
    isSimulated: true
  },
  {
    id: 'TRK-904',
    callsign: 'VORTEX-FAST',
    classification: 'FPV Drone',
    position: {
      x: 72,
      y: 28,
      lat: 28.6210,
      lng: 77.2185,
      alt: 45
    },
    velocity: 118.4,
    heading: 220,
    climbRate: -3.2,
    range: 2150,
    azimuth: 68.2,
    elevation: 1.2,
    rcs: -19.5, // Tiny RCS
    confidence: 0.93,
    fusedSensors: ['camera', 'radar', 'rf'],
    rfFrequency: '5.845 GHz (Band R, Ch 4) / Analog VTX 800mW',
    rfPower: -58.2,
    thermalSignature: 'ΔT +14.2°C / Overclocked LiPo Pack + 6S Stator',
    thermalTempMax: 58.6,
    opticalBBox: {
      x: 70,
      y: 26,
      w: 5,
      h: 5
    },
    verificationStatus: 'Verified Hostile',
    operatorNotes: 'High-speed, nap-of-the-earth contour flight. High agility evasive maneuvering.',
    groupId: null,
    history: [
      { timestamp: Date.now() - 60000, x: 86, y: 15, alt: 75, speed: 124.0, heading: 215, confidence: 0.88, fusedSensors: ['rf', 'radar'] },
      { timestamp: Date.now() - 30000, x: 79, y: 22, alt: 58, speed: 120.5, heading: 218, confidence: 0.91, fusedSensors: ['radar', 'rf'] },
      { timestamp: Date.now(), x: 72, y: 28, alt: 45, speed: 118.4, heading: 220, confidence: 0.93, fusedSensors: ['camera', 'radar', 'rf'] }
    ],
    lastUpdated: Date.now(),
    isSimulated: true
  },
  {
    id: 'TRK-905',
    callsign: 'EAGLE-SCAN',
    classification: 'Fixed-Wing Drone',
    position: {
      x: 22,
      y: 68,
      lat: 28.6040,
      lng: 77.1950,
      alt: 480
    },
    velocity: 82.0,
    heading: 45,
    climbRate: 0.8,
    range: 3420,
    azimuth: 210.4,
    elevation: 8.1,
    rcs: -8.5, // Larger carbon pusher frame
    confidence: 0.99,
    fusedSensors: ['camera', 'thermal', 'radar', 'rf'],
    rfFrequency: '915 MHz FHSS Telemetry / Microhard Link',
    rfPower: -61.0,
    thermalSignature: 'ΔT +9.5°C / Pusher Prop Motor Housing',
    thermalTempMax: 48.2,
    opticalBBox: {
      x: 20,
      y: 65,
      w: 9,
      h: 7
    },
    verificationStatus: 'Authorized Flight',
    operatorNotes: 'Scheduled agricultural corridor survey corridor #IND-DEL-402.',
    groupId: null,
    history: [
      { timestamp: Date.now() - 60000, x: 12, y: 78, alt: 420, speed: 80.0, heading: 42, confidence: 0.98, fusedSensors: ['radar', 'rf', 'camera', 'thermal'] },
      { timestamp: Date.now() - 30000, x: 17, y: 73, alt: 450, speed: 81.2, heading: 44, confidence: 0.99, fusedSensors: ['radar', 'rf', 'camera', 'thermal'] },
      { timestamp: Date.now(), x: 22, y: 68, alt: 480, speed: 82.0, heading: 45, confidence: 0.99, fusedSensors: ['camera', 'thermal', 'radar', 'rf'] }
    ],
    lastUpdated: Date.now(),
    isSimulated: true
  },
  {
    id: 'TRK-906',
    callsign: 'CLUTTER-BIRD-1',
    classification: 'Avian Clutter',
    position: {
      x: 34,
      y: 22,
      lat: 28.6250,
      lng: 77.2020,
      alt: 65
    },
    velocity: 28.0,
    heading: 95,
    climbRate: -0.1,
    range: 1650,
    azimuth: 325.0,
    elevation: 2.3,
    rcs: -22.0,
    confidence: 0.84,
    fusedSensors: ['camera', 'radar'],
    rfFrequency: 'None (Silent / No RF Emission Detected)',
    rfPower: -95.0,
    thermalSignature: 'ΔT +1.2°C / Biological Wing Surface (Diffuse)',
    thermalTempMax: 32.1,
    opticalBBox: {
      x: 32,
      y: 20,
      w: 4.5,
      h: 4.5
    },
    verificationStatus: 'False Positive',
    operatorNotes: 'Micro-Doppler spectral analysis confirms biological wing flapping frequency (5.2 Hz). No RF emission.',
    groupId: null,
    history: [
      { timestamp: Date.now() - 60000, x: 28, y: 23, alt: 64, speed: 27.0, heading: 92, confidence: 0.81, fusedSensors: ['radar'] },
      { timestamp: Date.now() - 30000, x: 31, y: 22, alt: 66, speed: 28.5, heading: 94, confidence: 0.83, fusedSensors: ['camera', 'radar'] },
      { timestamp: Date.now(), x: 34, y: 22, alt: 65, speed: 28.0, heading: 95, confidence: 0.84, fusedSensors: ['camera', 'radar'] }
    ],
    lastUpdated: Date.now(),
    isSimulated: true
  }
];

export const INITIAL_GROUPS: GroupCluster[] = [
  {
    id: 'SWARM-BRAVO-1',
    name: 'Candidate Swarm Bravo (3 Units)',
    trackIds: ['TRK-801', 'TRK-802', 'TRK-803'],
    centroid: {
      x: 48.3,
      y: 44.6,
      alt: 127.3
    },
    dispersionRadius: 185.0, // meters
    formationType: 'V-Formation',
    cohesionScore: 0.94,
    relativeMovementVector: {
      speed: 49.8,
      heading: 136.3
    },
    nearestNeighborDistAvg: 112.5,
    history: [
      { timestamp: Date.now() - 60000, dispersion: 210, cohesion: 0.88, size: 3 },
      { timestamp: Date.now() - 45000, dispersion: 198, cohesion: 0.91, size: 3 },
      { timestamp: Date.now() - 30000, dispersion: 190, cohesion: 0.93, size: 3 },
      { timestamp: Date.now() - 15000, dispersion: 186, cohesion: 0.94, size: 3 },
      { timestamp: Date.now(), dispersion: 185, cohesion: 0.94, size: 3 }
    ]
  }
];

export const INITIAL_EVENTS: RecentEvent[] = [
  {
    id: 'EVT-108',
    timestamp: '19:24:12 UTC',
    type: 'FUSION_LOCK',
    severity: 'alert',
    title: '4-Sensor Fusion Lock Confirmed',
    message: 'TRK-801, TRK-802, TRK-803 validated with Optical, Thermal, Radar, and RF correlation (Confidence > 0.96).',
    trackId: 'TRK-801'
  },
  {
    id: 'EVT-107',
    timestamp: '19:23:45 UTC',
    type: 'RF_EMISSION',
    severity: 'warning',
    title: 'Unregistered VTX Emission Detected',
    message: 'Wideband SDR detected 5.8 GHz analog video transmission at 800mW from TRK-904.',
    trackId: 'TRK-904'
  },
  {
    id: 'EVT-106',
    timestamp: '19:22:18 UTC',
    type: 'GROUP_SPLIT',
    severity: 'info',
    title: 'Candidate Swarm Cohesion High',
    message: 'SWARM-BRAVO-1 maintains rigid V-formation geometry. Cohesion metric: 0.94.',
    trackId: 'TRK-802'
  },
  {
    id: 'EVT-105',
    timestamp: '19:20:05 UTC',
    type: 'OPERATOR_OVERRIDE',
    severity: 'info',
    title: 'Clutter Rejection Applied',
    message: 'TRK-906 reclassified to Avian Clutter by Operator based on micro-Doppler wing harmonics.',
    trackId: 'TRK-906'
  },
  {
    id: 'EVT-104',
    timestamp: '19:18:30 UTC',
    type: 'DETECTION',
    severity: 'info',
    title: 'Authorized Corridor Correlation',
    message: 'TRK-905 flight telemetry matched with DGCA Indian Skyways agricultural permit #402.',
    trackId: 'TRK-905'
  }
];

export const REFERENCE_DRONES: ReferenceDrone[] = [
  {
    id: 'REF-DJI-M300',
    modelName: 'Matrice 300 RTK',
    manufacturer: 'DJI Enterprise',
    category: 'Commercial Quadcopter',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    wingspanMeters: 0.81,
    maxSpeedKmh: 82.8,
    typicalRcs: -14.0,
    rotorCount: 4,
    rfProtocol: 'OcuSync 3.0 Enterprise (2.4 / 5.8 GHz)',
    batteryLifeMin: 55,
    maxPayloadKg: 2.7,
    visualColor: 'Matte Dark Grey / Aviation Orange Beacon',
    thermalProfile: '4x Lower Motor Nacelles (ΔT ~7°C), Underslung Gimbal Heat',
    description: 'Heavy enterprise quadcopter equipped with redundant IMU and dual battery architecture. High acoustic footprint and distinct 2.4/5.8GHz video downlink.'
  },
  {
    id: 'REF-FPV-CHAMELEON',
    modelName: 'Chameleon 7" Carbon Racer',
    manufacturer: 'Custom / Open-Hardware',
    category: 'FPV Drone',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    wingspanMeters: 0.32,
    maxSpeedKmh: 145.0,
    typicalRcs: -20.5,
    rotorCount: 4,
    rfProtocol: 'ExpressLRS (ELRS 2.4GHz) + 5.8GHz Analog VTX',
    batteryLifeMin: 8,
    maxPayloadKg: 0.8,
    visualColor: 'Carbon Fiber Weave / High-vis Cyan Props',
    thermalProfile: 'High heat density on LiPo battery cell discharge (ΔT +16°C)',
    description: 'Ultra-agile freestyle racing and tactical quad. Capable of extreme acrobatic acceleration and nap-of-the-earth terrain hugging.'
  },
  {
    id: 'REF-TALON-WING',
    modelName: 'Talon Pro Aeromapper',
    manufacturer: 'X-UAV Aerospace',
    category: 'Fixed-Wing Drone',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
    wingspanMeters: 1.35,
    maxSpeedKmh: 100.0,
    typicalRcs: -8.0,
    rotorCount: 1,
    rfProtocol: 'Microhard 900MHz Telemetry + MAVLink',
    batteryLifeMin: 120,
    maxPayloadKg: 1.5,
    visualColor: 'High-visibility Matte White with Grey Leading Edge',
    thermalProfile: 'Single rear pusher motor exhaust thermal spike (ΔT +10°C)',
    description: 'Long-endurance fixed wing tactical mapping drone. High glide ratio, low acoustic signature, steady linear flight trajectories.'
  },
  {
    id: 'REF-AUTEL-EVO',
    modelName: 'EVO II Dual 640T',
    manufacturer: 'Autel Robotics',
    category: 'Commercial Quadcopter',
    image: 'https://images.unsplash.com/photo-1533558701576-23c65e0272fb?w=800&auto=format&fit=crop&q=80',
    wingspanMeters: 0.43,
    maxSpeedKmh: 72.0,
    typicalRcs: -16.5,
    rotorCount: 4,
    rfProtocol: 'Autel Dynamic Track 2.0 (2.4 GHz FHSS)',
    batteryLifeMin: 38,
    maxPayloadKg: 0.9,
    visualColor: 'Safety Bright Orange Polycarbonate',
    thermalProfile: 'Symmetrical 4-point heat distribution',
    description: 'Compact folding surveillance drone equipped with dual optical and radiometric thermal payloads.'
  },
  {
    id: 'REF-HEXA-HEAVY',
    modelName: 'Hydra-6 Heavy Cargo Lift',
    manufacturer: 'AeroVolt Dynamics',
    category: 'Heavy-Lift Hexacopter',
    image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&auto=format&fit=crop&q=80',
    wingspanMeters: 1.65,
    maxSpeedKmh: 65.0,
    typicalRcs: -5.0,
    rotorCount: 6,
    rfProtocol: 'Dual LTE C2 Encrypted Link + S-Band Backup',
    batteryLifeMin: 30,
    maxPayloadKg: 12.0,
    visualColor: 'Matte Stealth Black Carbon Tubular',
    thermalProfile: '6 large brushless stators producing pronounced heat signatures',
    description: 'Heavy industrial hexacopter capable of transporting tactical sensor or supply canisters over 15km radii.'
  }
];

export const EVALUATION_BENCHMARKS: EvaluationBenchmark[] = [
  {
    metric: 'Precision (P)',
    visionOnly: 84.6,
    multiSensorFused: 98.4,
    improvement: '+13.8%',
    unit: '%',
    description: 'Proportion of true positive drone detections against total positive classifications.'
  },
  {
    metric: 'Recall / Sensitivity (R)',
    visionOnly: 79.1,
    multiSensorFused: 97.2,
    improvement: '+18.1%',
    unit: '%',
    description: 'Ability of the system to identify all airborne drone targets within sector volume.'
  },
  {
    metric: 'F1 Score (Harmonic Mean)',
    visionOnly: 81.7,
    multiSensorFused: 97.8,
    improvement: '+16.1%',
    unit: '%',
    description: 'Balanced performance measure combining precision and recall under adverse conditions.'
  },
  {
    metric: 'False Positive Rate (FPR)',
    visionOnly: 14.8,
    multiSensorFused: 1.6,
    improvement: '-13.2% (89% drop)',
    unit: '%',
    description: 'Misclassification of avian, cloud shadows, or dust clutter as drone threats.'
  },
  {
    metric: 'End-to-End Processing Latency',
    visionOnly: 28.5,
    multiSensorFused: 14.2,
    improvement: '-14.3 ms (2x faster)',
    unit: 'ms',
    description: 'Sensor packet arrival to consolidated track state estimation on C2 display.'
  },
  {
    metric: 'Mean Tracking Continuity',
    visionOnly: 68.2,
    multiSensorFused: 312.4,
    improvement: '4.5x duration',
    unit: 'sec',
    description: 'Continuous unbroken track duration without ID fragmentation or target loss.'
  }
];

export const ENVIRONMENTAL_TESTS: EnvironmentalTestResult[] = [
  {
    condition: 'Clear Daylight (10,000 Lux)',
    visionOnlyF1: 94.2,
    multiSensorFused: 99.1,
    delta: '+4.9%',
    stressFactor: 'Baseline conditions'
  },
  {
    condition: 'Dense Fog / Smoke Haze (<200m Vis)',
    visionOnlyF1: 52.4,
    multiSensorFused: 96.2,
    delta: '+43.8%',
    stressFactor: 'Optical attenuation; radar and thermal penetration'
  },
  {
    condition: 'Night / Zero Lux (0.01 Lux)',
    visionOnlyF1: 38.0,
    multiSensorFused: 97.0,
    delta: '+59.0%',
    stressFactor: 'Total optical darkness; FLIR & RF SDR primary'
  },
  {
    condition: 'High Bird Migratory Clutter',
    visionOnlyF1: 67.5,
    multiSensorFused: 95.8,
    delta: '+28.3%',
    stressFactor: 'Visual similarity; rejected via RF emission & micro-Doppler'
  },
  {
    condition: 'Hostile Electronic Jamming (RF Noise)',
    visionOnlyF1: 83.0,
    multiSensorFused: 94.5,
    delta: '+11.5%',
    stressFactor: 'RF link degraded; EO/IR vision & radar retain lock'
  }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  theme: 'tactical-midnight',
  telemetryUnits: 'metric',
  refreshRateHz: 60,
  audioAlerts: true,
  kalmanProcessNoiseQ: 0.15,
  kalmanMeasurementNoiseR: 0.8,
  associationThresholdMahalanobis: 2.5,
  minSensorsForLock: 2,
  showSimulatedWatermarks: true,
  simulationScenario: 'default',
  simulationSpeed: 1.0,
  isSimulating: true
};
