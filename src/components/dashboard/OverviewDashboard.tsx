import React, { useRef, useEffect } from 'react';
import { usePinaka } from '../../context/PinakaContext';
import { TacticalCard } from '../common/TacticalCard';
import { SimulatedBadge } from '../common/SimulatedBadge';
import { 
  Crosshair, 
  Layers, 
  Activity, 
  Camera, 
  Flame, 
  Radio, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  ChevronRight, 
  Zap,
  BarChart2,
  HardDrive
} from 'lucide-react';

interface OverviewDashboardProps {
  onNavigateToMonitoring: () => void;
  onNavigateToTrack: (trackId: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ 
  onNavigateToMonitoring, 
  onNavigateToTrack 
}) => {
  const { 
    tracks, 
    sensors, 
    groups, 
    events, 
    radarSweepAngle, 
    selectTrack, 
    selectedTrackId,
    setScenario,
    settings
  } = usePinaka();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw tactical mini-radar PPI display
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 14;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background circle
    ctx.fillStyle = '#060B18';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Concentric range rings
    const ringCount = 4;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= ringCount; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius / ringCount) * i, 0, Math.PI * 2);
      ctx.stroke();

      // Range text (km)
      ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText(`${i}km`, centerX + 4, centerY - (radius / ringCount) * i + 10);
    }

    // Crosshairs (Azimuth grid)
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.stroke();

    // Diagonal lines (45 deg)
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    const diagDist = radius * 0.7071;
    ctx.moveTo(centerX - diagDist, centerY - diagDist);
    ctx.lineTo(centerX + diagDist, centerY + diagDist);
    ctx.moveTo(centerX - diagDist, centerY + diagDist);
    ctx.lineTo(centerX + diagDist, centerY - diagDist);
    ctx.stroke();
    ctx.setLineDash([]);

    // Radar beam sweep
    const sweepRad = (radarSweepAngle * Math.PI) / 180;
    const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, sweepRad - 0.35, sweepRad);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.fill();

    // Leading sweep line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(sweepRad) * radius, centerY + Math.sin(sweepRad) * radius);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Render active tracks on radar
    tracks.forEach(trk => {
      // Convert normalized 0-100 position to radar coordinates
      const normX = (trk.position.x - 50) / 45; // -1 to 1
      const normY = (trk.position.y - 50) / 45;
      const blipX = centerX + normX * (radius * 0.85);
      const blipY = centerY + normY * (radius * 0.85);

      const isSelected = trk.id === selectedTrackId;

      // Draw blip halo
      ctx.beginPath();
      ctx.arc(blipX, blipY, isSelected ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = trk.verificationStatus === 'Verified Hostile' 
        ? 'rgba(239, 68, 68, 0.3)' 
        : trk.verificationStatus === 'Authorized Flight'
        ? 'rgba(16, 185, 129, 0.3)'
        : 'rgba(6, 182, 212, 0.3)';
      ctx.fill();

      // Blip center dot
      ctx.beginPath();
      ctx.arc(blipX, blipY, isSelected ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = trk.verificationStatus === 'Verified Hostile' 
        ? '#EF4444' 
        : trk.verificationStatus === 'Authorized Flight'
        ? '#10B981'
        : '#00F0FF';
      ctx.fill();

      // Track label
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(trk.id, blipX + 8, blipY - 3);

      // Velocity line
      const velAngle = (trk.heading * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(blipX, blipY);
      ctx.lineTo(blipX + Math.cos(velAngle) * 12, blipY + Math.sin(velAngle) * 12);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Central Radar Origin mark
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#00F0FF';
    ctx.fill();

  }, [radarSweepAngle, tracks, selectedTrackId]);

  const cameraSensor = sensors.find(s => s.id === 'camera');
  const thermalSensor = sensors.find(s => s.id === 'thermal');
  const radarSensor = sensors.find(s => s.id === 'radar');
  const rfSensor = sensors.find(s => s.id === 'rf');

  const averageConfidence = Math.round(
    (tracks.reduce((acc, t) => acc + t.confidence, 0) / (tracks.length || 1)) * 100
  );

  return (
    <div className="space-y-4">
      {/* Top Banner with Research Testbed Status */}
      <div className="tactical-glass p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-cyan-400">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tactical font-bold text-base tracking-wider text-slate-100 uppercase">
                Airspace Surveillance & Multi-Sensor C2 Deck
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                ACTIVE MONITORING
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Sector Alpha-North • 4-Sensor Spatial Fusion Engine • IEEE-1588 Precision PTP Time Sync
            </p>
          </div>
        </div>

        {/* Quick Scenario Preset Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">RESEARCH BENCHMARK:</span>
          <select 
            value={settings.simulationScenario}
            onChange={(e) => setScenario(e.target.value as any)}
            className="bg-slate-900 border border-cyan-500/30 text-cyan-200 text-xs font-mono px-3 py-1.5 rounded focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="default">Baseline: Multi-Target Sector (6 Targets)</option>
            <option value="swarm-5">Scenario A: 5-Drone Synchronized Swarm</option>
            <option value="fpv-speed">Scenario B: High-Speed FPV Sprint (120+ km/h)</option>
            <option value="avian-clutter">Scenario C: Avian vs Drone Clutter Rejection</option>
          </select>
          <SimulatedBadge variant="compact" />
        </div>
      </div>

      {/* KPI Telemetry Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Detected Objects */}
        <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-cyan-500">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>TOTAL OBJECTS</span>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-100">
            {tracks.length}
          </div>
          <div className="text-[10px] font-mono text-cyan-400 mt-0.5 flex items-center gap-1">
            <span>In Surveillance Sphere</span>
          </div>
        </div>

        {/* Active Tracks */}
        <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-blue-500">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>ACTIVE TRACKS</span>
            <Crosshair className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-blue-300">
            {tracks.filter(t => t.verificationStatus !== 'False Positive').length}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
            Kalman Locked
          </div>
        </div>

        {/* Fusion Confidence */}
        <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>FUSION CONFIDENCE</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {averageConfidence}%
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
            Cross-Sensor Verified
          </div>
        </div>

        {/* Processing Latency */}
        <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-purple-500">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>PROCESSING LATENCY</span>
            <Activity className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-purple-300">
            14.2 <span className="text-xs font-normal">ms</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
            End-to-End Pipeline
          </div>
        </div>

        {/* Candidate Groups */}
        <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>SWARM CLUSTERS</span>
            <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-300">
            {groups.length}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
            {groups[0]?.formationType || 'None'}
          </div>
        </div>

        {/* System Health */}
        <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-cyan-400">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
            <span>SYSTEM HEALTH</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-cyan-300">
            99.2%
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
            Tensor Core Load: 34%
          </div>
        </div>
      </div>

      {/* 4 Sensor Status Cards Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Camera Sensor Card */}
        <div className="tactical-glass p-3.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-tactical font-semibold text-xs text-slate-200">
                  {cameraSensor?.name}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  Visible 380-750nm 4K
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              {cameraSensor?.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-[11px] font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block">QUALITY</span>
              <span className="text-slate-200">{cameraSensor?.dataQuality}%</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">LATENCY</span>
              <span className="text-slate-200">{cameraSensor?.latencyMs}ms</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">TRACKS</span>
              <span className="text-cyan-400">{cameraSensor?.activeDetectionsCount}</span>
            </div>
          </div>
        </div>

        {/* Thermal Sensor Card */}
        <div className="tactical-glass p-3.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-cyan-950/80 text-orange-400 border border-orange-500/30">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-tactical font-semibold text-xs text-slate-200">
                  {thermalSensor?.name}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  LWIR 8-14μm Flir VOx
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              {thermalSensor?.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-[11px] font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block">QUALITY</span>
              <span className="text-slate-200">{thermalSensor?.dataQuality}%</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">LATENCY</span>
              <span className="text-slate-200">{thermalSensor?.latencyMs}ms</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">TRACKS</span>
              <span className="text-orange-400">{thermalSensor?.activeDetectionsCount}</span>
            </div>
          </div>
        </div>

        {/* Radar Sensor Card */}
        <div className="tactical-glass p-3.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-tactical font-semibold text-xs text-slate-200">
                  {radarSensor?.name}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  X-Band 3D AESA FMCW
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              {radarSensor?.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-[11px] font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block">QUALITY</span>
              <span className="text-slate-200">{radarSensor?.dataQuality}%</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">LATENCY</span>
              <span className="text-slate-200">{radarSensor?.latencyMs}ms</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">TRACKS</span>
              <span className="text-cyan-400">{radarSensor?.activeDetectionsCount}</span>
            </div>
          </div>
        </div>

        {/* Authorized RF Sensor Card */}
        <div className="tactical-glass p-3.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-cyan-950/80 text-purple-400 border border-purple-500/30">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-tactical font-semibold text-xs text-slate-200">
                  {rfSensor?.name}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  Passive SDR Intercept
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              {rfSensor?.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-[11px] font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block">QUALITY</span>
              <span className="text-slate-200">{rfSensor?.dataQuality}%</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">LATENCY</span>
              <span className="text-slate-200">{rfSensor?.latencyMs}ms</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">SIGNALS</span>
              <span className="text-purple-400">{rfSensor?.activeDetectionsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Command Center Layout: Left Tactical Radar & Live Track Table, Right Real-time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Tactical Radar PPI Scope & Active Tracks (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <TacticalCard
            title="Tactical Airspace PPI Radar & Fused Spatial Distribution"
            subtitle="Plan Position Indicator • 360° Electronic Beam Steering • Gated Association"
            headerAction={
              <button 
                onClick={onNavigateToMonitoring}
                className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>OPEN FULL HUD</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Radar Canvas (5 cols) */}
              <div className="sm:col-span-6 flex flex-col items-center justify-center relative">
                <canvas 
                  ref={canvasRef} 
                  width={290} 
                  height={290} 
                  className="rounded-full shadow-[0_0_25px_rgba(6,182,212,0.15)] border border-cyan-500/30"
                />
                <div className="mt-2 text-center text-[10px] font-mono text-slate-400">
                  SWEEP: <span className="text-cyan-400 font-semibold">{Math.round(radarSweepAngle)}° AZ</span> | RANGE: <span className="text-slate-300">4.0 KM</span>
                </div>
              </div>

              {/* Selected Track Quick Telemetry (6 cols) */}
              <div className="sm:col-span-6 space-y-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Crosshair className="w-4 h-4 text-cyan-400" />
                    <span className="font-tactical font-bold text-sm text-cyan-300">
                      {selectedTrackId || 'NO TRACK SELECTED'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                    {tracks.find(t => t.id === selectedTrackId)?.classification || 'UAV'}
                  </span>
                </div>

                {(() => {
                  const trk = tracks.find(t => t.id === selectedTrackId) || tracks[0];
                  if (!trk) return null;
                  return (
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>VELOCITY:</span>
                        <span className="text-slate-200 font-bold">{trk.velocity.toFixed(1)} km/h</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>ALTITUDE:</span>
                        <span className="text-slate-200 font-bold">{trk.position.alt.toFixed(1)} m AGL</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>RANGE / AZ:</span>
                        <span className="text-slate-200 font-bold">{trk.range}m / {trk.azimuth}°</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>RCS / POWER:</span>
                        <span className="text-slate-200 font-bold">{trk.rcs} dBsm / {trk.rfPower} dBm</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>FUSED SENSORS:</span>
                        <span className="text-cyan-400 uppercase font-semibold">{trk.fusedSensors.join(' • ')}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400">STATUS:</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          trk.verificationStatus === 'Verified Hostile' 
                            ? 'bg-red-950 text-red-300 border border-red-500/40' 
                            : trk.verificationStatus === 'Authorized Flight'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}>
                          {trk.verificationStatus}
                        </span>
                      </div>
                      <button
                        onClick={() => onNavigateToTrack(trk.id)}
                        className="w-full mt-2 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-semibold transition-all"
                      >
                        ANALYZE KINEMATICS & SENSOR WEIGHTS →
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Quick Track Row Selector */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
                ACTIVE SURVEILLANCE TRACK MATRIX (SELECT TO INSPECT)
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800/80 pb-1">
                      <th className="pb-1.5">TRACK</th>
                      <th className="pb-1.5">CLASS</th>
                      <th className="pb-1.5">SPEED</th>
                      <th className="pb-1.5">ALT</th>
                      <th className="pb-1.5">CONF</th>
                      <th className="pb-1.5">SENSORS</th>
                      <th className="pb-1.5">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {tracks.map(trk => (
                      <tr 
                        key={trk.id}
                        onClick={() => selectTrack(trk.id)}
                        className={`cursor-pointer transition-colors ${
                          trk.id === selectedTrackId 
                            ? 'bg-cyan-500/15 text-cyan-200 font-semibold' 
                            : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="py-1.5 text-cyan-400 font-bold">{trk.id}</td>
                        <td className="py-1.5">{trk.classification}</td>
                        <td className="py-1.5">{trk.velocity.toFixed(0)} km/h</td>
                        <td className="py-1.5">{trk.position.alt.toFixed(0)}m</td>
                        <td className="py-1.5 text-emerald-400">{(trk.confidence * 100).toFixed(0)}%</td>
                        <td className="py-1.5 uppercase text-[10px] text-slate-400">{trk.fusedSensors.join('+')}</td>
                        <td className="py-1.5">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                            trk.verificationStatus === 'Verified Hostile' 
                              ? 'bg-red-950/80 text-red-400' 
                              : trk.verificationStatus === 'Authorized Flight'
                              ? 'bg-emerald-950/80 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {trk.verificationStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TacticalCard>
        </div>

        {/* Right: Live Simulated Activity Feed & System Health (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Activity Feed */}
          <TacticalCard
            title="Real-time Activity & Telemetry Feed"
            subtitle="Automated Event Pipeline • Multi-Sensor Trigger Log"
            badge={
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            }
          >
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {events.map((evt) => (
                <div 
                  key={evt.id}
                  className="p-2.5 rounded bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/30 transition-all font-mono text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        evt.severity === 'critical' 
                          ? 'bg-red-400 animate-pulse' 
                          : evt.severity === 'alert'
                          ? 'bg-amber-400'
                          : evt.severity === 'warning'
                          ? 'bg-yellow-400'
                          : 'bg-cyan-400'
                      }`} />
                      <span className="font-bold text-slate-200">{evt.title}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">{evt.timestamp}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {evt.message}
                  </p>
                  {evt.trackId && (
                    <div className="mt-1 flex items-center justify-between pt-1 border-t border-slate-800/50 text-[10px]">
                      <span className="text-cyan-400">TARGET: {evt.trackId}</span>
                      <button 
                        onClick={() => { selectTrack(evt.trackId!); onNavigateToTrack(evt.trackId!); }}
                        className="text-slate-400 hover:text-cyan-300 underline"
                      >
                        Inspect Track
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TacticalCard>

          {/* System Architecture & Health Card */}
          <TacticalCard
            title="Processing Pipeline Architecture"
            subtitle="Edge Neural Inference & Micro-Doppler FFT Engine"
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>TensorRT / YOLO-v11 Drone Pod:</span>
                  <span className="text-cyan-300">58.4 FPS (11.2ms)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[65%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>AESA FMCW Doppler Fast-Time FFT:</span>
                  <span className="text-cyan-300">4,096 bins / 120Hz</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full w-[82%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Extended Kalman Filter (EKF) Gating:</span>
                  <span className="text-emerald-400">Nominal (&lt; 0.8ms)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[35%]" />
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-cyan-500/20 text-[10px] text-slate-400 flex items-center justify-between">
                <span>PTP IEEE-1588 SYNC LOCK:</span>
                <span className="text-emerald-400 font-bold">LOCKED (±0.18 μs)</span>
              </div>
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
