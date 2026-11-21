import React, { useState, useEffect } from 'react';
import { PinakaLogo } from './PinakaLogo';
import { SimulatedBadge } from './SimulatedBadge';
import { usePinaka } from '../../context/PinakaContext';
import { 
  Activity, 
  Clock, 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ShieldCheck,
  Cpu,
  Layers,
  LogOut,
  UserCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    tracks, 
    sensors, 
    settings, 
    toggleSimulation, 
    setSimulationSpeed, 
    resetSimulation, 
    updateSettings,
    backendConnected,
    systemLatencyMs,
    currentUser,
    logout
  } = usePinaka();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeSensorsCount = sensors.filter(s => s.status === 'ONLINE').length;
  const verifiedCount = tracks.filter(t => t.verificationStatus === 'Verified Hostile' || t.verificationStatus === 'Authorized Flight').length;

  return (
    <header className="tactical-glass border-b border-cyan-500/20 px-4 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-50 bg-[#050811]/90 backdrop-blur-md">
      {/* Brand & Identity */}
      <div className="flex items-center gap-4">
        <PinakaLogo size="md" showTagline={true} />
        <div className="h-6 w-px bg-slate-700/60 hidden md:block" />
        <SimulatedBadge variant="compact" className="hidden lg:inline-flex" />
      </div>

      {/* Center Telemetry Readouts */}
      <div className="hidden xl:flex items-center gap-6 font-mono text-xs">
        {/* UTC Time */}
        <div className="flex items-center gap-2 text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime}</span>
        </div>

        {/* Backend & WS Status */}
        <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800">
          <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-slate-400">ENGINE:</span>
          <span className={`font-semibold ${backendConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
            {backendConnected ? 'FASTAPI WS' : 'STANDALONE'}
          </span>
        </div>

        {/* Fusion Latency */}
        <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">LATENCY:</span>
          <span className="text-emerald-400 font-semibold">{systemLatencyMs.toFixed(1)} ms</span>
        </div>

        {/* Multi-Sensor Status */}
        <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">SENSORS:</span>
          <span className="text-cyan-300 font-semibold">{activeSensorsCount} / 4 ONLINE</span>
        </div>

        {/* Active Tracks */}
        <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">TRACKS:</span>
          <span className="text-blue-300 font-semibold">{tracks.length} DETECTED</span>
        </div>

        {/* PTP Sync Jitter */}
        <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-400">PTP JITTER:</span>
          <span className="text-purple-300 font-semibold">0.18 μs</span>
        </div>
      </div>

      {/* Right Controls & Simulation Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Play/Pause Simulation */}
        <button
          onClick={toggleSimulation}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border ${
            settings.isSimulating 
              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
              : 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
          }`}
          title={settings.isSimulating ? 'Pause Telemetry Simulation' : 'Resume Telemetry Simulation'}
        >
          {settings.isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{settings.isSimulating ? 'LIVE' : 'PAUSED'}</span>
        </button>

        {/* Speed multiplier selector */}
        <div className="hidden sm:flex items-center bg-slate-900/80 rounded border border-slate-800 p-0.5 text-[11px] font-mono">
          {([0.5, 1.0, 2.0, 5.0] as const).map(spd => (
            <button
              key={spd}
              onClick={() => setSimulationSpeed(spd)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                settings.simulationSpeed === spd 
                  ? 'bg-cyan-500 text-slate-950 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Reset simulation button */}
        <button
          onClick={resetSimulation}
          className="p-1.5 rounded bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
          title="Reset Simulation Tracks"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Audio Alerts toggle */}
        <button
          onClick={() => updateSettings({ audioAlerts: !settings.audioAlerts })}
          className={`p-1.5 rounded border transition-all ${
            settings.audioAlerts 
              ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400' 
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
          title={settings.audioAlerts ? 'Tactical Audio Alerts ON' : 'Audio Alerts MUTED'}
        >
          {settings.audioAlerts ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Officer Clearance / User Session Badge */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
            <div className="hidden lg:flex flex-col text-right font-mono text-[10px]">
              <span className="text-cyan-300 font-bold leading-tight">
                {currentUser.rankOrTitle} {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-slate-400 text-[9px] leading-tight">
                {currentUser.serviceId}
              </span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold hidden sm:inline">
              {currentUser.clearanceLevel.split('-')[1]}
            </span>
            <button
              onClick={logout}
              className="p-1.5 rounded bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 transition-all"
              title="Logout / Terminate Security Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-wider">DEFENSE LEVEL 2</span>
          </div>
        )}
      </div>
    </header>
  );
};
