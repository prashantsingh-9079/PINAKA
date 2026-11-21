import React, { useRef, useEffect } from 'react';
import { usePinaka } from '../../context/PinakaContext';
import { TacticalCard } from '../common/TacticalCard';
import { SimulatedBadge } from '../common/SimulatedBadge';
import { 
  Share2, 
  Users, 
  Maximize2, 
  AlertCircle, 
  Compass, 
  Activity, 
  Layers, 
  Network, 
  ShieldAlert,
  Info
} from 'lucide-react';

export const GroupAnalytics: React.FC = () => {
  const { groups, tracks, selectedTrackId, selectTrack, setScenario } = usePinaka();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const primaryGroup = groups[0];

  // Render 2D Tactical Swarm Spatial Distribution Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Dark grid background
    ctx.fillStyle = '#060B18';
    ctx.fillRect(0, 0, width, height);

    // Tactical Coordinate Grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!primaryGroup) return;

    // Find member tracks
    const memberTracks = tracks.filter(t => primaryGroup.trackIds.includes(t.id));

    // Centroid coordinate on canvas
    const centroidCanvasX = (primaryGroup.centroid.x / 100) * width;
    const centroidCanvasY = (primaryGroup.centroid.y / 100) * height;

    // Draw Dispersion Boundary Circle / Convex Hull
    const radiusCanvas = Math.max(35, (primaryGroup.dispersionRadius / 300) * 120);
    ctx.beginPath();
    ctx.arc(centroidCanvasX, centroidCanvasY, radiusCanvas, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.fill();
    ctx.setLineDash([]);

    // Draw Centroid Point & Motion Vector
    ctx.beginPath();
    ctx.arc(centroidCanvasX, centroidCanvasY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();

    // Centroid Heading Vector Arrow
    const headingRad = (primaryGroup.relativeMovementVector.heading * Math.PI) / 180;
    const vectorLen = (primaryGroup.relativeMovementVector.speed / 100) * 80;
    const targetVectorX = centroidCanvasX + Math.cos(headingRad) * vectorLen;
    const targetVectorY = centroidCanvasY + Math.sin(headingRad) * vectorLen;

    ctx.beginPath();
    ctx.moveTo(centroidCanvasX, centroidCanvasY);
    ctx.lineTo(targetVectorX, targetVectorY);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Arrowhead
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(targetVectorX, targetVectorY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Label for Centroid
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 10px JetBrains Mono';
    ctx.fillText(
      `CENTROID [${primaryGroup.relativeMovementVector.speed.toFixed(1)} km/h @ ${primaryGroup.relativeMovementVector.heading.toFixed(0)}°]`,
      centroidCanvasX + 10,
      centroidCanvasY - 8
    );

    // Draw Inter-Drone Network Links (Mesh connectivity)
    for (let i = 0; i < memberTracks.length; i++) {
      for (let j = i + 1; j < memberTracks.length; j++) {
        const t1 = memberTracks[i];
        const t2 = memberTracks[j];
        const x1 = (t1.position.x / 100) * width;
        const y1 = (t1.position.y / 100) * height;
        const x2 = (t2.position.x / 100) * width;
        const y2 = (t2.position.y / 100) * height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Distance label between drones
        const dist = Math.round(Math.sqrt(Math.pow((t1.position.x - t2.position.x) * 50, 2) + Math.pow((t1.position.y - t2.position.y) * 50, 2)));
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.fillStyle = 'rgba(6, 182, 212, 0.7)';
        ctx.font = '9px JetBrains Mono';
        ctx.fillText(`${dist}m`, midX + 3, midY - 3);
      }
    }

    // Draw Individual Swarm Drones
    memberTracks.forEach(trk => {
      const px = (trk.position.x / 100) * width;
      const py = (trk.position.y / 100) * height;
      const isSelected = trk.id === selectedTrackId;

      // Outer ring
      ctx.beginPath();
      ctx.arc(px, py, isSelected ? 9 : 6, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? 'rgba(0, 240, 255, 0.4)' : 'rgba(59, 130, 246, 0.3)';
      ctx.fill();

      // Drone center dot
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#00F0FF' : '#38BDF8';
      ctx.fill();

      // Track Label
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(trk.id, px + 8, py - 4);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText(`${trk.velocity.toFixed(0)} km/h`, px + 8, py + 8);
    });

  }, [primaryGroup, tracks, selectedTrackId]);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="tactical-glass p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tactical font-bold text-base text-slate-100 uppercase tracking-wider">
                Candidate Swarm & Multi-Agent Group Analytics
              </h2>
              <SimulatedBadge variant="compact" />
            </div>
            <p className="text-xs font-mono text-slate-400">
              Spatial Clustering (DBSCAN) • Convex Hull Dispersion • Flocking Geometry Detection
            </p>
          </div>
        </div>

        {/* Preset scenario toggle */}
        <button
          onClick={() => setScenario('swarm-5')}
          className="px-3 py-1.5 rounded bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-xs hover:bg-cyan-500/25 transition-all"
        >
          LOAD 5-UAV SYNCHRONIZED SWARM
        </button>
      </div>

      {/* Ethical Research Compliance Banner */}
      <div className="tactical-glass p-3 rounded-lg border-l-4 border-l-amber-500 flex items-start gap-3 bg-amber-950/20">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="font-mono text-xs">
          <span className="font-bold text-amber-300 block mb-0.5">
            RESEARCH COMPLIANCE & CIVIL LIBERTIES DISCLAIMER
          </span>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Spatial clustering, flocking coordination, and nearest-neighbor cohesion metrics are computed exclusively for research into multi-agent flight kinematics and airspace traffic management. Movement patterns and geometric formations must <span className="underline font-bold text-amber-300">not</span> be interpreted as definitive proof of hostile intent without authorized human operator verification and corroborated electronic telemetry.
          </p>
        </div>
      </div>

      {/* Primary Swarm Cluster Metrics Bar */}
      {primaryGroup ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-amber-500">
            <span className="text-slate-500 text-[10px] block">CLUSTER SIZE</span>
            <span className="text-xl font-bold text-slate-100">{primaryGroup.trackIds.length} UAVs</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Connected Nodes</span>
          </div>

          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-cyan-400">
            <span className="text-slate-500 text-[10px] block">FORMATION GEOMETRY</span>
            <span className="text-sm font-bold text-cyan-300 truncate block">{primaryGroup.formationType}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Angular Wedge Profile</span>
          </div>

          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-purple-400">
            <span className="text-slate-500 text-[10px] block">MAX DISPERSION RADIUS</span>
            <span className="text-xl font-bold text-purple-300">{primaryGroup.dispersionRadius} m</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Convex Hull Boundary</span>
          </div>

          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-emerald-400">
            <span className="text-slate-500 text-[10px] block">COHESION INDEX</span>
            <span className="text-xl font-bold text-emerald-400">{(primaryGroup.cohesionScore * 100).toFixed(0)}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Reynolds Boids Metric</span>
          </div>

          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-blue-400">
            <span className="text-slate-500 text-[10px] block">NEAREST NEIGHBOR AVG</span>
            <span className="text-xl font-bold text-blue-300">{primaryGroup.nearestNeighborDistAvg.toFixed(1)} m</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Inter-Drone Clearance</span>
          </div>

          <div className="tactical-glass p-3 rounded-lg border-l-2 border-l-red-400">
            <span className="text-slate-500 text-[10px] block">CENTROID VELOCITY</span>
            <span className="text-xl font-bold text-slate-100">{primaryGroup.relativeMovementVector.speed.toFixed(1)} km/h</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Heading: {primaryGroup.relativeMovementVector.heading.toFixed(0)}°</span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono text-center">
          No candidate swarm cluster currently detected in sector volume.
        </div>
      )}

      {/* Main 2D Tactical Swarm Spatial Distribution Visualizer & Member Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Swarm Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <TacticalCard
            title="Tactical Spatial Swarm Distribution & Mesh Topology"
            subtitle="Real-time inter-drone distance matrix & centroid drift vector"
          >
            <div className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={560}
                height={380}
                className="w-full h-auto rounded-lg border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-slate-950"
              />
              <div className="mt-3 flex items-center justify-between w-full text-[11px] font-mono text-slate-400 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Centroid</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ml-2" />
                  <span>UAV Nodes</span>
                  <span className="w-4 h-0.5 bg-cyan-400/50 ml-2" />
                  <span>Mesh Link</span>
                </div>
                <span>DBSCAN Epsilon: 250m | MinPts: 3</span>
              </div>
            </div>
          </TacticalCard>
        </div>

        {/* Right: Swarm Members & Lifecycle History (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <TacticalCard
            title="Cluster Member Telemetry Matrix"
            subtitle={`Swarm Roster (${primaryGroup?.trackIds.length || 0} Synchronized Nodes)`}
          >
            <div className="space-y-2 font-mono text-xs max-h-56 overflow-y-auto">
              {primaryGroup?.trackIds.map(tid => {
                const trk = tracks.find(t => t.id === tid);
                if (!trk) return null;
                const isSelected = trk.id === selectedTrackId;
                return (
                  <div
                    key={tid}
                    onClick={() => selectTrack(tid)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-400">{trk.id}</span>
                        <span className="text-[10px] text-slate-400">({trk.callsign})</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {trk.velocity.toFixed(0)} km/h • Alt: {trk.position.alt.toFixed(0)}m • Conf: {(trk.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                      IN MESH
                    </span>
                  </div>
                );
              })}
            </div>
          </TacticalCard>

          {/* Group Lifecycle / Event History */}
          <TacticalCard
            title="Swarm Formation & Kinematic Lifecycle Log"
            subtitle="Automated split, merge, and cohesion transitions"
          >
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px]">
                <div className="flex justify-between text-slate-500 text-[10px] mb-0.5">
                  <span>19:20:15 UTC</span>
                  <span className="text-emerald-400">FORMATION_STABLE</span>
                </div>
                <p className="text-slate-300">
                  Cohesion metric achieved 0.94 threshold. V-formation geometry locked across 3 member nodes.
                </p>
              </div>

              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px]">
                <div className="flex justify-between text-slate-500 text-[10px] mb-0.5">
                  <span>19:16:40 UTC</span>
                  <span className="text-cyan-400">CLUSTER_MERGE</span>
                </div>
                <p className="text-slate-300">
                  TRK-803 linked to SWARM-BRAVO-1 cluster via Kalman nearest neighbor gating (distance: 140m).
                </p>
              </div>

              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px]">
                <div className="flex justify-between text-slate-500 text-[10px] mb-0.5">
                  <span>19:12:00 UTC</span>
                  <span className="text-amber-400">CLUSTER_DETECTED</span>
                </div>
                <p className="text-slate-300">
                  DBSCAN algorithm initiated candidate cluster identification in Sector Alpha-North.
                </p>
              </div>
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
