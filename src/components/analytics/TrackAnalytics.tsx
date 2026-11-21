import React, { useState } from 'react';
import { usePinaka } from '../../context/PinakaContext';
import { TacticalCard } from '../common/TacticalCard';
import { SimulatedBadge } from '../common/SimulatedBadge';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  ScatterChart, 
  Scatter, 
  ZAxis,
  BarChart,
  Bar
} from 'recharts';
import { 
  Crosshair, 
  Gauge, 
  Activity, 
  Clock, 
  Download, 
  Layers, 
  ShieldAlert, 
  Navigation,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

export const TrackAnalytics: React.FC = () => {
  const { tracks, selectedTrackId, selectTrack, selectedTrack, groups } = usePinaka();
  const [timeWindow, setTimeWindow] = useState<'30s' | '60s' | 'all'>('all');

  const trk = selectedTrack || tracks[0];

  // Prepare chart series from history
  const historyData = (trk?.history || []).map((pt, idx) => {
    const timeLabel = new Date(pt.timestamp).toTimeString().split(' ')[0];
    return {
      index: idx,
      time: timeLabel,
      speed: Math.round(pt.speed * 10) / 10,
      altitude: Math.round(pt.alt * 10) / 10,
      confidence: Math.round(pt.confidence * 100),
      opticalConf: Math.round((pt.confidence - 0.04 + Math.sin(idx) * 0.02) * 100),
      thermalConf: Math.round((pt.confidence - 0.02 + Math.cos(idx) * 0.02) * 100),
      radarConf: Math.round(pt.confidence * 100),
      rfConf: pt.fusedSensors.includes('rf') ? 98 : 0,
      x: Math.round(pt.x * 10) / 10,
      y: Math.round(pt.y * 10) / 10,
      rcs: pt.rcs || -14.0
    };
  });

  // Latency & Jitter synthetic profile
  const latencyDistributionData = [
    { range: '0-5ms', count: 12 },
    { range: '5-10ms', count: 48 },
    { range: '10-15ms', count: 184 },
    { range: '15-20ms', count: 32 },
    { range: '20-25ms', count: 6 },
    { range: '>25ms', count: 1 }
  ];

  // Swarm group dispersion data
  const swarmGroup = groups.find(g => trk && g.trackIds.includes(trk.id));
  const dispersionData = (swarmGroup?.history || []).map((h, i) => ({
    time: `-${((swarmGroup?.history?.length || 0) - i - 1) * 15}s`,
    dispersion: h.dispersion,
    cohesion: Math.round(h.cohesion * 100)
  }));

  // Export CSV function
  const exportHistoricalCSV = () => {
    if (!trk) return;
    const headers = 'Timestamp,TrackId,Classification,X_Pct,Y_Pct,Altitude_m,Speed_kmh,Heading_deg,Confidence_pct,Sensors\n';
    const rows = (trk.history || []).map(h => 
      `${new Date(h.timestamp).toISOString()},${trk.id},${trk.classification},${h.x},${h.y},${h.alt},${h.speed},${h.heading},${h.confidence * 100},"${h.fusedSensors.join('+')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PINAKA_${trk.id}_Telemetry_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Bar with Track Selector */}
      <div className="tactical-glass p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tactical font-bold text-base text-slate-100 uppercase tracking-wider">
                Multi-Sensor Track Kinematics & Analytics
              </h2>
              <SimulatedBadge variant="compact" />
            </div>
            <p className="text-xs font-mono text-slate-400">
              High-Precision Kalman Smoothed State Estimation • Trajectory & Dispersion Diagnostics
            </p>
          </div>
        </div>

        {/* Track Selector & Export Button */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="text-slate-400">TARGET:</span>
          <select
            value={selectedTrackId || ''}
            onChange={(e) => selectTrack(e.target.value)}
            className="bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold px-3 py-1.5 rounded focus:outline-none cursor-pointer"
          >
            {tracks.map(t => (
              <option key={t.id} value={t.id}>
                {t.id} - {t.callsign} ({t.classification})
              </option>
            ))}
          </select>

          <button
            onClick={exportHistoricalCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Target Quick Readout Banner */}
      {trk && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-cyan-400">
            <span className="text-slate-500 text-[10px] block">CURRENT SPEED</span>
            <span className="text-lg font-bold text-slate-100">{trk.velocity.toFixed(1)} km/h</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Climb: {trk.climbRate > 0 ? `+${trk.climbRate}` : trk.climbRate} m/s</span>
          </div>

          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-blue-400">
            <span className="text-slate-500 text-[10px] block">CURRENT ALTITUDE</span>
            <span className="text-lg font-bold text-blue-300">{trk.position.alt.toFixed(1)} m</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Above Ground Level</span>
          </div>

          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-emerald-400">
            <span className="text-slate-500 text-[10px] block">FUSION CONFIDENCE</span>
            <span className="text-lg font-bold text-emerald-400">{(trk.confidence * 100).toFixed(1)}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">4-Sensor Corroborated</span>
          </div>

          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-purple-400">
            <span className="text-slate-500 text-[10px] block">RADAR CROSS SECTION</span>
            <span className="text-lg font-bold text-purple-300">{trk.rcs} dBsm</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Micro-Doppler Verified</span>
          </div>

          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-amber-400">
            <span className="text-slate-500 text-[10px] block">RF EMISSION</span>
            <span className="text-sm font-bold text-amber-300 truncate block">{trk.rfFrequency.split('/')[0]}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Power: {trk.rfPower} dBm</span>
          </div>

          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-red-400">
            <span className="text-slate-500 text-[10px] block">VERIFICATION STATE</span>
            <span className="text-sm font-bold text-red-300 truncate block">{trk.verificationStatus}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Human Validated</span>
          </div>
        </div>
      )}

      {/* Grid of Interactive Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Speed vs Time */}
        <TacticalCard
          title="Kinematic Velocity Profile (Speed vs Time)"
          subtitle="Real-time kalman-filtered ground speed (km/h)"
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.15)" />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090E1A', borderColor: 'rgba(6, 182, 212, 0.4)', borderRadius: '6px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                  labelStyle={{ color: '#00F0FF', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  name="Speed (km/h)" 
                  stroke="#00F0FF" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: '#00F0FF' }}
                  activeDot={{ r: 6, fill: '#FFFFFF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TacticalCard>

        {/* 2. Position / Altitude vs Time */}
        <TacticalCard
          title="Altitude Profile (Altitude vs Time)"
          subtitle="Height AGL in meters with climb / descent trends"
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="altGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.15)" />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} domain={[0, 'dataMax + 20']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090E1A', borderColor: 'rgba(59, 130, 246, 0.4)', borderRadius: '6px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                  labelStyle={{ color: '#38BDF8', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="altitude" 
                  name="Altitude (m AGL)" 
                  stroke="#38BDF8" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#altGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TacticalCard>

        {/* 3. Confidence vs Time (Cross-Sensor Comparison) */}
        <TacticalCard
          title="Cross-Sensor Confidence vs Time"
          subtitle="Comparative fusion breakdown across Optical, Thermal, Radar & RF"
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.15)" />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} domain={[60, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090E1A', borderColor: 'rgba(6, 182, 212, 0.4)', borderRadius: '6px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="confidence" name="Overall Fusion" stroke="#10B981" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="radarConf" name="AESA Radar" stroke="#00F0FF" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="thermalConf" name="LWIR Thermal" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="opticalConf" name="EO Camera" stroke="#A855F7" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TacticalCard>

        {/* 4. 2D Planar Trajectory & Flight Path */}
        <TacticalCard
          title="Planar Spatial Trajectory (X vs Y Sector Grid)"
          subtitle="Multi-point ground track trajectory in surveillance coordinates"
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.15)" />
                <XAxis type="number" dataKey="x" name="X Coord" stroke="#64748B" domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} />
                <YAxis type="number" dataKey="y" name="Y Coord" stroke="#64748B" domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} />
                <ZAxis type="number" dataKey="speed" range={[30, 90]} name="Speed" unit="km/h" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#090E1A', borderColor: 'rgba(6, 182, 212, 0.4)', borderRadius: '6px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                />
                <Scatter name="Waypoint History" data={historyData} fill="#00F0FF" line={{ stroke: '#38BDF8', strokeWidth: 1.5 }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </TacticalCard>

        {/* 5. Swarm Dispersion vs Time (If Swarm Member) */}
        {swarmGroup ? (
          <TacticalCard
            title={`Swarm Group Dispersion (${swarmGroup.name})`}
            subtitle="Inter-drone cluster radius and cohesion index over time"
          >
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dispersionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.15)" />
                  <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis yAxisId="left" stroke="#F59E0B" tick={{ fontSize: 10, fill: '#F59E0B' }} domain={[100, 300]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" tick={{ fontSize: 10, fill: '#10B981' }} domain={[50, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090E1A', borderColor: 'rgba(245, 158, 11, 0.4)', borderRadius: '6px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                  <Line yAxisId="left" type="monotone" dataKey="dispersion" name="Dispersion Radius (m)" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="cohesion" name="Cohesion Score (%)" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TacticalCard>
        ) : (
          <TacticalCard
            title="Processing Latency Distribution"
            subtitle="Multi-sensor packet ingest to consolidated track state (ms)"
          >
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.15)" />
                  <XAxis dataKey="range" stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090E1A', borderColor: 'rgba(6, 182, 212, 0.4)', borderRadius: '6px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                  />
                  <Bar dataKey="count" name="Frames Count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TacticalCard>
        )}

        {/* 6. Comprehensive Historical Observations Table */}
        <TacticalCard
          title="Historical Observation Telemetry Matrix"
          subtitle="Discrete sensor reports, timestamps and covariance points"
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-900/90 text-slate-400 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="p-2">TIME</th>
                  <th className="p-2">GRID (X, Y)</th>
                  <th className="p-2">ALTITUDE</th>
                  <th className="p-2">SPEED</th>
                  <th className="p-2">HEADING</th>
                  <th className="p-2">CONFIDENCE</th>
                  <th className="p-2">SENSORS INVOLVED</th>
                  <th className="p-2">EST. RCS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {historyData.map((row) => (
                  <tr key={row.index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-2 text-cyan-400">{row.time}</td>
                    <td className="p-2">{row.x}%, {row.y}%</td>
                    <td className="p-2 text-blue-300">{row.altitude} m</td>
                    <td className="p-2">{row.speed} km/h</td>
                    <td className="p-2">135°</td>
                    <td className="p-2 text-emerald-400">{row.confidence}%</td>
                    <td className="p-2 uppercase text-[10px] text-slate-400">EO + FLIR + AESA + RF</td>
                    <td className="p-2">{row.rcs} dBsm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TacticalCard>
      </div>
    </div>
  );
};
