import React, { useState, useEffect } from 'react';
import { usePinaka } from '../../context/PinakaContext';
import { TacticalCard } from '../common/TacticalCard';
import { SimulatedBadge } from '../common/SimulatedBadge';
import { 
  Settings, 
  Palette, 
  Database, 
  Sliders, 
  Download, 
  RotateCcw, 
  Check, 
  Volume2, 
  Cpu, 
  Radio, 
  ShieldCheck,
  FileCode
} from 'lucide-react';
import { api } from '../../services/api';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, tracks, sensors, groups, backendConnected } = usePinaka();
  const [saveToast, setSaveToast] = useState<boolean>(false);
  const [systemTelemetry, setSystemTelemetry] = useState<any>(null);

  useEffect(() => {
    api.getSystemStatus().then(res => setSystemTelemetry(res)).catch(() => {});
  }, [backendConnected]);

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleExportFullStateJSON = () => {
    const fullState = {
      project: 'PINAKA - Multi-Sensor AI Drone Detection & Tracking',
      tagline: 'Detect. Understand. Protect.',
      timestamp: new Date().toISOString(),
      settings,
      tracks,
      sensors,
      groups
    };
    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PINAKA_Full_Tactical_State_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="tactical-glass p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tactical font-bold text-base text-slate-100 uppercase tracking-wider">
                System Configuration & Algorithmic Parameters
              </h2>
              <SimulatedBadge variant="compact" />
            </div>
            <p className="text-xs font-mono text-slate-400">
              Kalman Filter Covariance Tuning • Data Source Binding • Visual Command Deck Themes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs">
              <Check className="w-3.5 h-3.5" />
              <span>SETTINGS PERSISTED</span>
            </span>
          )}

          <button
            onClick={handleExportFullStateJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT SNAPSHOT JSON</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Theme & Interface Preferences */}
        <TacticalCard
          title="Command Deck Visual Theme"
          subtitle="Palantir-style aerospace dark modes & contrast palettes"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { updateSettings({ theme: 'tactical-midnight' }); handleSave(); }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  settings.theme === 'tactical-midnight'
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3 h-3 rounded-full bg-cyan-400" />
                  <span className="font-bold text-slate-200">TACTICAL MIDNIGHT</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Deep onyx navy with cyan reticles and electric blue indicators. Recommended.
                </p>
              </button>

              <button
                onClick={() => { updateSettings({ theme: 'deep-abyss' }); handleSave(); }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  settings.theme === 'deep-abyss'
                    ? 'border-blue-400 bg-blue-950/40 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-bold text-slate-200">DEEP ABYSS</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Pure pitch black `#000000` with high-contrast cobalt telemetry accents.
                </p>
              </button>

              <button
                onClick={() => { updateSettings({ theme: 'radar-emerald' }); handleSave(); }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  settings.theme === 'radar-emerald'
                    ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="font-bold text-slate-200">RADAR PHOSPHOR</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Classic military night-scope green phosphor aesthetic with high readability.
                </p>
              </button>

              <button
                onClick={() => { updateSettings({ theme: 'solar-amber' }); handleSave(); }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  settings.theme === 'solar-amber'
                    ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="font-bold text-slate-200">SOLAR AMBER</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Tactical amber night vision mode for low fatigue operational monitoring.
                </p>
              </button>
            </div>

            {/* General Preferences */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-200 block font-semibold">Telemetry Display Units</span>
                  <span className="text-slate-400 text-[10px]">Distance, velocity, and altitude coordinates</span>
                </div>
                <select
                  value={settings.telemetryUnits}
                  onChange={(e) => { updateSettings({ telemetryUnits: e.target.value as any }); handleSave(); }}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-2.5 py-1 rounded focus:outline-none"
                >
                  <option value="metric">Metric (km/h, meters, dBsm)</option>
                  <option value="imperial">Imperial (mph, feet, dBsm)</option>
                  <option value="aviation">Aviation (Knots, Flight Level, NM)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-200 block font-semibold">Tactical Audio Alerts</span>
                  <span className="text-slate-400 text-[10px]">Auditory chime on fusion lock and target breach</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.audioAlerts}
                  onChange={(e) => { updateSettings({ audioAlerts: e.target.checked }); handleSave(); }}
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-200 block font-semibold">Research Simulated Data Watermark</span>
                  <span className="text-slate-400 text-[10px]">Display [SIMULATED DATA] badge on video feeds</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showSimulatedWatermarks}
                  onChange={(e) => { updateSettings({ showSimulatedWatermarks: e.target.checked }); handleSave(); }}
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </TacticalCard>

        {/* 2. Data Source Configuration */}
        <TacticalCard
          title="Data Ingestion & Hardware Bus Source"
          subtitle="Configure network streams, telemetry ports, and ROS / PTP bindings"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-2">
              <label className="text-slate-300 block font-semibold">Active Ingestion Engine Mode</label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-2.5 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-all">
                  <input type="radio" name="source" defaultChecked className="mt-1" />
                  <div>
                    <span className="text-cyan-300 font-bold block">SYNTHETIC MULTI-SENSOR ENGINE (ACTIVE)</span>
                    <span className="text-[10px] text-slate-400">
                      Local high-fidelity physics simulator generating coordinated drone flight kinematics, radar micro-Doppler harmonics, and RF packet broadcasts.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-all">
                  <input type="radio" name="source" className="mt-1" />
                  <div>
                    <span className="text-slate-200 font-bold block">LIVE HARDWARE BUS (ETHERNET UDP / RTSP)</span>
                    <span className="text-[10px] text-slate-400">
                      Connect to physical AESA radar via ASTERIX Cat 021 over multicast IP 239.192.0.1, RTSP camera streams, and USRP SDR RF raw samples.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-all">
                  <input type="radio" name="source" className="mt-1" />
                  <div>
                    <span className="text-slate-200 font-bold block">ROSBAG / MCAP LOG REPLAY</span>
                    <span className="text-[10px] text-slate-400">
                      Replay recorded multi-sensor mission bags with microsecond synchronization for forensic track reconstruction.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                PTP IEEE 1588 BOUND SENSOR INTERFACES
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">EO GIMBAL</span>
                  <span>rtsp://192.168.10.21:554/ch0</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">LWIR THERMAL</span>
                  <span>gige://192.168.10.22:3956</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">3D AESA RADAR</span>
                  <span>udp://239.192.0.1:8600</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">PASSIVE RF SDR</span>
                  <span>gnuradio://127.0.0.1:5200</span>
                </div>
              </div>
            </div>
          </div>
        </TacticalCard>

        {/* 3. Live Backend & Database Telemetry */}
        <TacticalCard
          title="Backend Infrastructure & Database State"
          subtitle="FastAPI Core • SQLite Engine • WebSocket Daemon"
          className="lg:col-span-2"
          headerAction={
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
              backendConnected ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
            }`}>
              {backendConnected ? '● BACKEND ONLINE' : '○ CONNECTING...'}
            </span>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">FASTAPI STATUS</span>
              <span className="text-emerald-400 font-bold">{systemTelemetry?.status || (backendConnected ? 'OPERATIONAL' : 'STANDALONE')}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">v2.4.0 (Uvicorn)</span>
            </div>

            <div className="p-3 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">SQLITE DATABASE</span>
              <span className="text-cyan-300 font-bold">{systemTelemetry?.databaseUrl || 'pinaka.db'}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Tables: 9 Synced</span>
            </div>

            <div className="p-3 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">WEBSOCKET DAEMON</span>
              <span className="text-purple-300 font-bold">ws://localhost:8000/ws/live</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{systemTelemetry?.websocketConnectedClients || (backendConnected ? 1 : 0)} Client(s)</span>
            </div>

            <div className="p-3 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">SIMULATION TICK</span>
              <span className="text-amber-300 font-bold">10 Hz (100ms)</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Extended Kalman Loop</span>
            </div>
          </div>
        </TacticalCard>

        {/* 3. Sensor Fusion Algorithm Tuners (EKF Parameters) */}
        <TacticalCard
          title="Extended Kalman Filter (EKF) & Fusion Hyperparameters"
          subtitle="Noise covariance matrices and spatial association gating"
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
            {/* Process Noise Q */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-200 font-bold">Process Noise (Q)</span>
                <span className="text-cyan-400 font-bold">{settings.kalmanProcessNoiseQ.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="1.0"
                step="0.01"
                value={settings.kalmanProcessNoiseQ}
                onChange={(e) => { updateSettings({ kalmanProcessNoiseQ: parseFloat(e.target.value) }); handleSave(); }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Controls responsiveness to rapid drone maneuvers vs trajectory smoothing.
              </p>
            </div>

            {/* Measurement Noise R */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-200 font-bold">Measurement Noise (R)</span>
                <span className="text-blue-400 font-bold">{settings.kalmanMeasurementNoiseR.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={settings.kalmanMeasurementNoiseR}
                onChange={(e) => { updateSettings({ kalmanMeasurementNoiseR: parseFloat(e.target.value) }); handleSave(); }}
                className="w-full accent-blue-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Confidence placed in incoming sensor coordinates vs predicted state vector.
              </p>
            </div>

            {/* Mahalanobis Association Gating */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-200 font-bold">Gating Threshold (χ²)</span>
                <span className="text-purple-400 font-bold">{settings.associationThresholdMahalanobis.toFixed(1)} σ</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={settings.associationThresholdMahalanobis}
                onChange={(e) => { updateSettings({ associationThresholdMahalanobis: parseFloat(e.target.value) }); handleSave(); }}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Mahalanobis distance validation gate for Hungarian measurement association.
              </p>
            </div>

            {/* Min Sensors for Lock */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-200 font-bold">Min Corroboration</span>
                <span className="text-emerald-400 font-bold">{settings.minSensorsForLock} SENSORS</span>
              </div>
              <div className="flex gap-2 pt-1">
                {([1, 2, 3] as const).map(n => (
                  <button
                    key={n}
                    onClick={() => { updateSettings({ minSensorsForLock: n }); handleSave(); }}
                    className={`flex-1 py-1 rounded border text-center font-bold ${
                      settings.minSensorsForLock === n
                        ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                Minimum distinct sensor modalities required before promoting track to verified status.
              </p>
            </div>
          </div>
        </TacticalCard>
      </div>
    </div>
  );
};
