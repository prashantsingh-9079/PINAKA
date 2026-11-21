import React, { useState, useEffect } from 'react';
import { usePinaka } from '../../context/PinakaContext';
import { TacticalCard } from '../common/TacticalCard';
import { SimulatedBadge } from '../common/SimulatedBadge';
import { SensorType, SensorStatus } from '../../types/pinaka';
import { 
  Camera, 
  Flame, 
  Radio, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sliders, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Cpu, 
  HardDrive, 
  Activity,
  Layers,
  Terminal,
  Signal
} from 'lucide-react';

export const SensorManagement: React.FC = () => {
  const { 
    sensors, 
    settings, 
    toggleSimulation, 
    setSimulationSpeed, 
    resetSimulation, 
    setScenario 
  } = usePinaka();

  const [selectedSensorId, setSelectedSensorId] = useState<SensorType>('camera');
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  const [rawTelemetryLog, setRawTelemetryLog] = useState<string[]>([]);

  // Selected sensor deep dive
  const currentSensor = sensors.find(s => s.id === selectedSensorId) || sensors[0];

  // Generate live simulated raw data packets
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString().split('T')[1].replace('Z', '');
      let line = '';
      if (selectedSensorId === 'radar') {
        const az = (Math.random() * 360).toFixed(1);
        const rng = (Math.random() * 3000 + 500).toFixed(0);
        const dop = (Math.random() * 60 - 30).toFixed(1);
        line = `[${now}] ASTERIX-CAT021: TARGET_BLIP AZ=${az}° RNG=${rng}m DOP=${dop}m/s RCS=-14.2dBsm SYNC_PTP=0.18us`;
      } else if (selectedSensorId === 'thermal') {
        const maxTemp = (Math.random() * 15 + 40).toFixed(1);
        const delta = (Math.random() * 4 + 5).toFixed(1);
        line = `[${now}] FLIR_BOSON_640: FRAME_SYNC TEMP_MAX=${maxTemp}°C DELTA_T=+${delta}°C AGC=LINEAR VOx_VOLT=3.30V`;
      } else if (selectedSensorId === 'rf') {
        const freq = (Math.random() > 0.5 ? 2437.0 : 5845.0) + (Math.random() * 0.4 - 0.2);
        const pwr = (Math.random() * 10 - 68).toFixed(1);
        line = `[${now}] SDR_WIDEBAND: FHSS_BURST FREQ=${freq.toFixed(3)}MHz PWR=${pwr}dBm PROTOCOL=OCUSYNC_3 HOP_RATE=1200/s`;
      } else {
        const bbox = `[${(Math.random() * 10 + 40).toFixed(0)}, ${(Math.random() * 10 + 35).toFixed(0)}, 80, 80]`;
        line = `[${now}] EO_POD_4K: RTSP_RTP_PACKET SEQ=${Math.floor(Math.random() * 90000)} CONF=0.98 BBOX=${bbox} OPT_ZOOM=4.2X`;
      }

      setRawTelemetryLog(prev => [line, ...prev.slice(0, 14)]);
    }, 400);

    return () => clearInterval(interval);
  }, [selectedSensorId]);

  const getSensorIcon = (id: SensorType) => {
    switch (id) {
      case 'camera': return <Camera className="w-5 h-5 text-cyan-400" />;
      case 'thermal': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'radar': return <Radio className="w-5 h-5 text-cyan-400" />;
      case 'rf': return <Zap className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Simulation & Replay Scrubber */}
      <div className="tactical-glass p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tactical font-bold text-base text-slate-100 uppercase tracking-wider">
                Sensor Array Management & Telemetry Replay
              </h2>
              <SimulatedBadge variant="compact" />
            </div>
            <p className="text-xs font-mono text-slate-400">
              Hardware Abstraction Layer • IEEE-1588 Precision Time Protocol • Raw Packet Introspection
            </p>
          </div>
        </div>

        {/* Master Replay & Simulation Engine Controller */}
        <div className="flex items-center gap-3 font-mono text-xs bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 px-1">ENGINE:</span>
          
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all font-semibold ${
              settings.isSimulating
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {settings.isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{settings.isSimulating ? 'SIMULATING' : 'PAUSED'}</span>
          </button>

          {/* Speed scrubber */}
          <div className="flex items-center bg-slate-950 rounded border border-slate-800 p-0.5 text-[11px]">
            {([0.5, 1.0, 2.0, 5.0] as const).map(spd => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-2 py-0.5 rounded ${
                  settings.simulationSpeed === spd
                    ? 'bg-cyan-500/30 text-cyan-200 font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={resetSimulation}
            className="p-1.5 text-slate-400 hover:text-cyan-300 rounded hover:bg-slate-800"
            title="Reset Simulation Scenario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Primary Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((sensor) => {
          const isSelected = sensor.id === selectedSensorId;
          return (
            <div
              key={sensor.id}
              onClick={() => setSelectedSensorId(sensor.id)}
              className={`tactical-glass rounded-lg p-4 cursor-pointer transition-all border ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'border-cyan-500/20 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  {getSensorIcon(sensor.id)}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    {sensor.status}
                  </span>
                </div>
              </div>

              <h3 className="font-tactical font-bold text-sm text-slate-100 uppercase tracking-wide">
                {sensor.name}
              </h3>
              <p className="text-[11px] font-mono text-slate-400 truncate mb-3">
                {sensor.model}
              </p>

              {/* Progress Gauges: Health & Quality */}
              <div className="space-y-2 pt-2 border-t border-slate-800 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                    <span>HARDWARE HEALTH</span>
                    <span className="text-emerald-400">{sensor.healthScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full" style={{ width: `${sensor.healthScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                    <span>DATA QUALITY / SNR</span>
                    <span className="text-cyan-400">{sensor.dataQuality}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: `${sensor.dataQuality}%` }} />
                  </div>
                </div>

                {/* Telemetry quick metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-slate-400">
                  <div>
                    <span className="block text-slate-500">LATENCY</span>
                    <span className="text-slate-200">{sensor.latencyMs} ms</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">PTP JITTER</span>
                    <span className="text-purple-300">±{sensor.timeSyncJitterUs} μs</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">THROUGHPUT</span>
                    <span className="text-slate-200">{sensor.throughputMbps} Mbps</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">ACTIVE DETECTIONS</span>
                    <span className="text-cyan-300 font-bold">{sensor.activeDetectionsCount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 text-center">
                <span className="text-[10px] font-mono text-cyan-400 uppercase">
                  {isSelected ? '● ACTIVE INSPECTION' : 'CLICK TO INSPECT'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sensor Deep Dive Panel & Live Telemetry Packet Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sensor Specifications & Diagnostics (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <TacticalCard
            title={`${currentSensor.name} — Hardware Diagnostics`}
            subtitle={currentSensor.fullTitle}
            headerAction={
              <span className="text-xs font-mono text-cyan-400">
                FW: {currentSensor.firmwareVersion}
              </span>
            }
          >
            <div className="space-y-4 font-mono text-xs">
              {/* Technical Specifications */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  SENSOR SUBSYSTEM SPECIFICATIONS
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  {Object.entries(currentSensor.specs).map(([key, val]) => (
                    <div key={key} className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase block mb-0.5">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-slate-200 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timestamp Synchronization & Time Protocol Diagnostics */}
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-slate-200">IEEE 1588 Precision Time Protocol</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    PTP MASTER LOCKED
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Hardware timestamping at network interface layer. Current clock phase offset is ±{currentSensor.timeSyncJitterUs} microseconds, well within the 1.0 μs fusion tolerance window required for Extended Kalman Filter multi-sensor correlation.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">PTP DRIFT</span>
                    <span className="text-slate-200">&lt; 0.05 ppm</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">PACKET JITTER</span>
                    <span className="text-slate-200">0.08 ms</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">TIME SYNCHRONIZED</span>
                    <span className="text-emerald-400">100.0%</span>
                  </div>
                </div>
              </div>

              {/* Sensor Re-calibration & Self-Test */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => alert(`Self-test initiated for ${currentSensor.name}. Telemetry calibrated.`)}
                  className="px-3 py-2 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 font-semibold transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>RUN HARDWARE SELF-TEST</span>
                </button>
                <span className="text-[10px] text-slate-500">
                  Last Calibrated: Today 06:00 UTC
                </span>
              </div>
            </div>
          </TacticalCard>
        </div>

        {/* Live Raw Telemetry Packet Stream / Bus Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <TacticalCard
            title="Real-Time Bus & Packet Inspector"
            subtitle="Raw NMEA / ASTERIX / RTSP / SDR I/Q Packet Stream"
            headerAction={
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>STREAMING 60 HZ</span>
              </div>
            }
          >
            <div className="bg-black/90 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5 h-[340px] overflow-y-auto">
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800 text-slate-500 text-[10px]">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>RAW TELEMETRY BUS // SENSOR_ID: {currentSensor.id.toUpperCase()}</span>
              </div>

              {rawTelemetryLog.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`leading-relaxed break-all ${
                    idx === 0 
                      ? 'text-cyan-300 font-semibold' 
                      : idx < 3 
                      ? 'text-slate-300' 
                      : 'text-slate-500'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
