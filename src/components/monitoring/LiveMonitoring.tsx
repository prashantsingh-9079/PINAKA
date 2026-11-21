import React, { useRef, useEffect, useState } from 'react';
import { usePinaka } from '../../context/PinakaContext';
import { TacticalCard } from '../common/TacticalCard';
import { SimulatedBadge } from '../common/SimulatedBadge';
import { VerificationStatus, Track } from '../../types/pinaka';
import { 
  Camera, 
  Flame, 
  Radio, 
  Zap, 
  Maximize2, 
  Crosshair, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  Compass, 
  Sliders,
  RotateCw,
  Lock,
  Unlock,
  AlertOctagon,
  Info
} from 'lucide-react';

export const LiveMonitoring: React.FC = () => {
  const { 
    tracks, 
    selectedTrackId, 
    selectTrack, 
    selectedTrack, 
    updateVerification, 
    activeViewMode, 
    setActiveViewMode,
    settings 
  } = usePinaka();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Gimbal and Pan/Zoom Controls state
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAutoTrackLocked, setIsAutoTrackLocked] = useState<boolean>(true);
  const [thermalPalette, setThermalPalette] = useState<'ironbow' | 'white-hot' | 'rainbow'>('ironbow');
  const [operatorNotesInput, setOperatorNotesInput] = useState<string>('');

  // Sync operator notes when selected track changes
  useEffect(() => {
    if (selectedTrack) {
      setOperatorNotesInput(selectedTrack.operatorNotes || '');
    }
  }, [selectedTrackId]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Draw Feed Background based on activeViewMode
      if (activeViewMode === 'thermal') {
        // LWIR Thermal background (dark violet to deep navy gradient)
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#090818');
        bgGrad.addColorStop(1, '#1A0E2A');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Thermal sensor noise / grain
        ctx.fillStyle = 'rgba(255, 100, 20, 0.03)';
        for (let i = 0; i < 40; i++) {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          ctx.fillRect(rx, ry, Math.random() * 80 + 20, Math.random() * 40 + 10);
        }
      } else if (activeViewMode === 'radar') {
        // Dark tactical radar background
        ctx.fillStyle = '#030810';
        ctx.fillRect(0, 0, width, height);

        // Radar grid
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.lineWidth = 1;
        const gridStep = 50;
        for (let x = 0; x < width; x += gridStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (activeViewMode === 'rf') {
        // RF Spectrogram waterfall background
        ctx.fillStyle = '#040714';
        ctx.fillRect(0, 0, width, height);

        // Waterfall horizontal wave pulses
        const now = Date.now() / 300;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.lineWidth = 1.5;
        for (let y = 30; y < height; y += 35) {
          ctx.beginPath();
          for (let x = 0; x < width; x += 15) {
            const ny = y + Math.sin(x * 0.05 + now + y) * 4;
            if (x === 0) ctx.moveTo(x, ny);
            else ctx.lineTo(x, ny);
          }
          ctx.stroke();
        }
      } else {
        // Optical EO / Fused HUD background: realistic atmospheric sky with horizon
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#09152C');
        skyGrad.addColorStop(0.65, '#0E223D');
        skyGrad.addColorStop(1, '#081423');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Atmospheric horizon haze line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.7);
        ctx.lineTo(width, height * 0.7);
        ctx.stroke();

        // Subtle terrain elevation silhouette in background
        ctx.fillStyle = 'rgba(4, 12, 22, 0.7)';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.7);
        for (let x = 0; x <= width; x += 30) {
          const mtnY = height * 0.7 - Math.sin(x * 0.008) * 25 - Math.cos(x * 0.02) * 12;
          ctx.lineTo(x, mtnY);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
      }

      // Draw Aerospace HUD Compass Tape at Top
      ctx.fillStyle = 'rgba(6, 182, 212, 0.7)';
      ctx.font = '10px JetBrains Mono';
      const centerHeading = selectedTrack ? Math.round(selectedTrack.heading) : 135;
      for (let h = centerHeading - 30; h <= centerHeading + 30; h += 5) {
        const normH = ((h % 360) + 360) % 360;
        const xOffset = width / 2 + (h - centerHeading) * 8;
        if (xOffset > 60 && xOffset < width - 60) {
          ctx.beginPath();
          ctx.moveTo(xOffset, 12);
          ctx.lineTo(xOffset, h % 10 === 0 ? 22 : 17);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.stroke();
          if (h % 10 === 0) {
            ctx.fillText(`${normH}°`, xOffset - 9, 32);
          }
        }
      }

      // Compass center marker
      ctx.fillStyle = '#00F0FF';
      ctx.beginPath();
      ctx.moveTo(width / 2, 8);
      ctx.lineTo(width / 2 - 5, 2);
      ctx.lineTo(width / 2 + 5, 2);
      ctx.closePath();
      ctx.fill();

      // Pitch Ladder in Center (Aerospace HUD)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1;
      const centerY = height / 2;
      for (let pitch = -2; pitch <= 2; pitch++) {
        if (pitch === 0) continue;
        const py = centerY + pitch * 35;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 40, py);
        ctx.lineTo(width / 2 - 15, py);
        ctx.moveTo(width / 2 + 15, py);
        ctx.lineTo(width / 2 + 40, py);
        ctx.stroke();
      }

      // Central Reticle Crosshairs
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 14, centerY);
      ctx.lineTo(width / 2 - 4, centerY);
      ctx.moveTo(width / 2 + 4, centerY);
      ctx.lineTo(width / 2 + 14, centerY);
      ctx.moveTo(width / 2, centerY - 14);
      ctx.lineTo(width / 2, centerY - 4);
      ctx.moveTo(width / 2, centerY + 4);
      ctx.lineTo(width / 2, centerY + 14);
      ctx.stroke();

      // Render Tracks with Dynamic Bounding Boxes & Flight Trails
      tracks.forEach(trk => {
        // Calculate canvas coordinates based on track position and zoom
        let px = (trk.position.x / 100) * width;
        let py = (trk.position.y / 100) * height;

        // Apply zoom and pan centering if locked
        if (isAutoTrackLocked && selectedTrack && trk.id === selectedTrack.id) {
          // Keep selected track around center with slight lead
          px = width / 2;
          py = height / 2;
        }

        const isSelected = trk.id === selectedTrackId;
        const boxW = Math.max(45, (trk.opticalBBox.w / 100) * width * zoomLevel);
        const boxH = Math.max(45, (trk.opticalBBox.h / 100) * height * zoomLevel);
        const boxX = px - boxW / 2;
        const boxY = py - boxH / 2;

        // Draw Historical Trajectory Trail (Breadcrumbs)
        if (trk.history && trk.history.length > 1) {
          ctx.beginPath();
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = isSelected 
            ? 'rgba(0, 240, 255, 0.6)' 
            : 'rgba(56, 189, 248, 0.25)';
          ctx.lineWidth = isSelected ? 1.5 : 1;
          trk.history.forEach((pt, idx) => {
            const hx = (pt.x / 100) * width;
            const hy = (pt.y / 100) * height;
            if (idx === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          });
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw Simulated Physical Drone Silhouette inside bounding box
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate((trk.heading * Math.PI) / 180);

        if (activeViewMode === 'thermal') {
          // Thermal heat blob representation (high heat on motor hubs)
          const heatGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
          heatGrad.addColorStop(0, '#FFFFFF'); // Hot white center
          heatGrad.addColorStop(0.3, '#F59E0B'); // Orange
          heatGrad.addColorStop(0.7, '#DC2626'); // Red
          heatGrad.addColorStop(1, 'rgba(147, 51, 234, 0)'); // Dissipating IR
          ctx.fillStyle = heatGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fill();

          // 4 Motor heat spots
          [-8, 8].forEach(mx => {
            [-8, 8].forEach(my => {
              ctx.beginPath();
              ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
              ctx.fillStyle = '#FFFFFF';
              ctx.fill();
            });
          });
        } else if (trk.classification === 'Fixed-Wing Drone') {
          // Fixed-wing aircraft geometry
          ctx.strokeStyle = isSelected ? '#00F0FF' : '#94A3B8';
          ctx.fillStyle = isSelected ? 'rgba(0, 240, 255, 0.2)' : 'rgba(148, 163, 184, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -12); // Nose
          ctx.lineTo(14, 4); // Right wing tip
          ctx.lineTo(3, 8); // Wing root
          ctx.lineTo(4, 14); // Tail right
          ctx.lineTo(0, 12); // Rudder
          ctx.lineTo(-4, 14); // Tail left
          ctx.lineTo(-3, 8);
          ctx.lineTo(-14, 4); // Left wing tip
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (trk.classification === 'Avian Clutter') {
          // Bird flapping silhouette
          const flap = Math.sin(Date.now() / 150) * 4;
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-10, flap);
          ctx.quadraticCurveTo(-5, -6, 0, 0);
          ctx.quadraticCurveTo(5, -6, 10, flap);
          ctx.stroke();
        } else {
          // Quadcopter quad arms + spinning propellers
          ctx.strokeStyle = isSelected ? '#00F0FF' : '#38BDF8';
          ctx.lineWidth = 1.5;

          // X-frame arms
          ctx.beginPath();
          ctx.moveTo(-10, -10);
          ctx.lineTo(10, 10);
          ctx.moveTo(-10, 10);
          ctx.lineTo(10, -10);
          ctx.stroke();

          // Center chassis
          ctx.fillStyle = isSelected ? '#00F0FF' : '#0284C7';
          ctx.fillRect(-4, -4, 8, 8);

          // Spinning rotor circles
          const propRadius = 5;
          [-10, 10].forEach(rx => {
            [-10, 10].forEach(ry => {
              ctx.beginPath();
              ctx.arc(rx, ry, propRadius, 0, Math.PI * 2);
              ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
              ctx.stroke();
            });
          });
        }
        ctx.restore();

        // Draw Bounding Box with Corner Brackets
        const boxColor = trk.verificationStatus === 'Verified Hostile' 
          ? '#EF4444' 
          : trk.verificationStatus === 'Authorized Flight'
          ? '#10B981'
          : isSelected
          ? '#00F0FF'
          : 'rgba(56, 189, 248, 0.7)';

        ctx.strokeStyle = boxColor;
        ctx.lineWidth = isSelected ? 2 : 1.2;

        // Tactical Corner Brackets
        const bracketLen = 8;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + bracketLen);
        ctx.lineTo(boxX, boxY);
        ctx.lineTo(boxX + bracketLen, boxY);
        // Top-right
        ctx.moveTo(boxX + boxW - bracketLen, boxY);
        ctx.lineTo(boxX + boxW, boxY);
        ctx.lineTo(boxX + boxW, boxY + bracketLen);
        // Bottom-left
        ctx.moveTo(boxX, boxY + boxH - bracketLen);
        ctx.lineTo(boxX, boxY + boxH);
        ctx.lineTo(boxX + bracketLen, boxY + boxH);
        // Bottom-right
        ctx.moveTo(boxX + boxW - bracketLen, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + boxH - bracketLen);
        ctx.stroke();

        // Subtle Box boundary
        ctx.strokeStyle = isSelected ? 'rgba(0, 240, 255, 0.2)' : 'rgba(56, 189, 248, 0.1)';
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Bounding Box Metadata Header
        ctx.fillStyle = isSelected ? '#00F0FF' : '#E2E8F0';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillText(`[${trk.id}] ${trk.classification}`, boxX, boxY - 14);

        // Subtitle: Confidence + Altitude + Speed
        ctx.fillStyle = '#94A3B8';
        ctx.font = '9px JetBrains Mono';
        ctx.fillText(
          `CONF: ${(trk.confidence * 100).toFixed(0)}% | ALT: ${trk.position.alt.toFixed(0)}m | ${trk.velocity.toFixed(0)}km/h`,
          boxX,
          boxY - 3
        );

        // Bottom label: RF and Thermal signature
        if (activeViewMode === 'fused' || isSelected) {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
          ctx.fillText(`RF: ${trk.rfFrequency.split('/')[0]}`, boxX, boxY + boxH + 11);
          ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
          ctx.fillText(`IR: ${trk.thermalSignature.split('/')[0]}`, boxX, boxY + boxH + 21);
        }
      });

      // Overlay Tactical Grid Details / HUD Telemetry box (Bottom Left)
      ctx.fillStyle = 'rgba(6, 11, 24, 0.85)';
      ctx.fillRect(15, height - 85, 230, 70);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.strokeRect(15, height - 85, 230, 70);

      ctx.fillStyle = '#00F0FF';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(`OPTICAL GIMBAL AZ: ${selectedTrack ? selectedTrack.azimuth : 42.5}°`, 25, height - 68);
      ctx.fillText(`ELEVATION: ${selectedTrack ? selectedTrack.elevation : 5.7}° | ZOOM: ${zoomLevel.toFixed(1)}x`, 25, height - 52);
      ctx.fillText(`FUSION PIPELINE: 4-SENSORS SYNCED`, 25, height - 36);
      ctx.fillStyle = '#10B981';
      ctx.fillText(`PTP IEEE-1588: SYNCHRONIZED (±0.18μs)`, 25, height - 20);

      // Watermark in bottom right
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText('PINAKA C-UAS SURVEILLANCE • SIMULATED DATA TESTBED', width - 310, height - 15);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [tracks, selectedTrackId, activeViewMode, zoomLevel, isAutoTrackLocked, thermalPalette]);

  return (
    <div className="space-y-4">
      {/* Top Controls Bar: View Modes, Gimbal Zoom, Watermark */}
      <div className="tactical-glass p-3 rounded-lg flex flex-wrap items-center justify-between gap-3">
        {/* Sensor View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-md border border-cyan-500/20 text-xs font-mono">
          <button
            onClick={() => setActiveViewMode('fused')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              activeViewMode === 'fused'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>FUSED HUD</span>
          </button>

          <button
            onClick={() => setActiveViewMode('optical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              activeViewMode === 'optical'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>EO OPTICAL</span>
          </button>

          <button
            onClick={() => setActiveViewMode('thermal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              activeViewMode === 'thermal'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>LWIR THERMAL</span>
          </button>

          <button
            onClick={() => setActiveViewMode('radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              activeViewMode === 'radar'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>RADAR SCOPE</span>
          </button>

          <button
            onClick={() => setActiveViewMode('rf')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              activeViewMode === 'rf'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>RF WATERFALL</span>
          </button>
        </div>

        {/* Gimbal Zoom & Lock Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center bg-slate-900/80 rounded border border-slate-800 p-0.5">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
              className="p-1.5 text-slate-400 hover:text-cyan-300 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-cyan-300 font-bold">{zoomLevel.toFixed(1)}x</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(4.0, prev + 0.25))}
              className="p-1.5 text-slate-400 hover:text-cyan-300 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsAutoTrackLocked(!isAutoTrackLocked)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-all ${
              isAutoTrackLocked
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {isAutoTrackLocked ? <Lock className="w-3.5 h-3.5 text-cyan-400" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>AUTO-LOCK</span>
          </button>

          <SimulatedBadge variant="prominent" />
        </div>
      </div>

      {/* Main Monitoring Screen & Operator Verification Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Live Canvas Monitor (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          <div className="tactical-glass tactical-corner rounded-lg overflow-hidden relative border border-cyan-500/30">
            {/* Top HUD overlay text */}
            <div className="absolute top-2.5 left-3 z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-red-400 tracking-wider">
                ● REC // {activeViewMode.toUpperCase()} FEED
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
                CAM_POD_01 (NORTH-FACING)
              </span>
            </div>

            <div className="absolute top-2.5 right-3 z-10">
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                SIMULATED LIVE VIDEO FEED
              </span>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={820}
              height={480}
              className="w-full h-auto block bg-black"
            />
          </div>

          {/* Quick Track Selection Thumbnails */}
          <div className="tactical-glass p-2.5 rounded-lg flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest shrink-0 px-2">
              SECTOR TRACKS:
            </span>
            {tracks.map(trk => (
              <button
                key={trk.id}
                onClick={() => selectTrack(trk.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono shrink-0 flex items-center gap-2 border transition-all ${
                  trk.id === selectedTrackId
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  trk.verificationStatus === 'Verified Hostile' 
                    ? 'bg-red-400' 
                    : trk.verificationStatus === 'Authorized Flight'
                    ? 'bg-emerald-400'
                    : 'bg-cyan-400'
                }`} />
                <span>{trk.id}</span>
                <span className="text-[10px] text-slate-500">{(trk.confidence * 100).toFixed(0)}%</span>
              </button>
            ))}
          </div>
        </div>

        {/* Operator Verification & Telemetry Dossier Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <TacticalCard
            title="Operator Verification & Decision C2"
            subtitle="Human-in-the-Loop Gating • Mandated Protocol"
          >
            {selectedTrack ? (
              <div className="space-y-4 font-mono text-xs">
                {/* Target Dossier Header */}
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-cyan-400 font-tactical">
                        {selectedTrack.id}
                      </span>
                      <span className="text-slate-400 block text-[11px]">
                        Callsign: {selectedTrack.callsign}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      selectedTrack.verificationStatus === 'Verified Hostile'
                        ? 'bg-red-950 text-red-300 border border-red-500/40'
                        : selectedTrack.verificationStatus === 'Authorized Flight'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {selectedTrack.verificationStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">CLASSIFICATION</span>
                      <span className="text-slate-200 font-semibold">{selectedTrack.classification}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">FUSION CONFIDENCE</span>
                      <span className="text-emerald-400 font-semibold">{(selectedTrack.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">VELOCITY</span>
                      <span className="text-slate-200 font-semibold">{selectedTrack.velocity.toFixed(1)} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">ALTITUDE</span>
                      <span className="text-slate-200 font-semibold">{selectedTrack.position.alt.toFixed(1)} m AGL</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">SLANT RANGE</span>
                      <span className="text-slate-200 font-semibold">{selectedTrack.range} meters</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">RADAR CROSS SECTION</span>
                      <span className="text-slate-200 font-semibold">{selectedTrack.rcs} dBsm</span>
                    </div>
                  </div>
                </div>

                {/* Multi-Sensor Observation Breakdown */}
                <div className="space-y-1.5 p-2.5 rounded bg-slate-900/50 border border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                    CORROBORATING SENSOR OBSERVATIONS
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">EO Optical:</span>
                    <span className="text-slate-200">Bounding Box Detected (YOLOv11)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">LWIR Thermal:</span>
                    <span className="text-amber-300">{selectedTrack.thermalSignature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AESA Radar:</span>
                    <span className="text-cyan-300">Doppler Micro-Harmonics Confirmed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Authorized RF:</span>
                    <span className="text-purple-300">{selectedTrack.rfFrequency}</span>
                  </div>
                </div>

                {/* Operator Verification Action Buttons */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    SET OPERATOR VERIFICATION STATUS
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateVerification(selectedTrack.id, 'Verified Hostile', operatorNotesInput)}
                      className="py-2 px-2.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 font-semibold flex items-center justify-center gap-1.5 transition-all text-[11px]"
                    >
                      <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                      <span>FLAG HOSTILE</span>
                    </button>

                    <button
                      onClick={() => updateVerification(selectedTrack.id, 'Authorized Flight', operatorNotesInput)}
                      className="py-2 px-2.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 font-semibold flex items-center justify-center gap-1.5 transition-all text-[11px]"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>AUTHORIZE</span>
                    </button>

                    <button
                      onClick={() => updateVerification(selectedTrack.id, 'False Positive', operatorNotesInput)}
                      className="py-2 px-2.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition-all text-[11px]"
                    >
                      <X className="w-3.5 h-3.5 text-slate-400" />
                      <span>FALSE POSITIVE</span>
                    </button>

                    <button
                      onClick={() => updateVerification(selectedTrack.id, 'Under Review', operatorNotesInput)}
                      className="py-2 px-2.5 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 font-semibold flex items-center justify-center gap-1.5 transition-all text-[11px]"
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>UNDER REVIEW</span>
                    </button>
                  </div>

                  {/* Operator Notes Input Field */}
                  <div className="pt-2">
                    <label className="text-[10px] text-slate-400 block mb-1">
                      OPERATOR LOG / MISSION DISPATCH NOTES:
                    </label>
                    <textarea
                      value={operatorNotesInput}
                      onChange={(e) => setOperatorNotesInput(e.target.value)}
                      placeholder="Enter verification rationale or dispatch notes..."
                      className="w-full h-18 p-2 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none resize-none"
                    />
                    <button
                      onClick={() => updateVerification(selectedTrack.id, selectedTrack.verificationStatus, operatorNotesInput)}
                      className="mt-1.5 w-full py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all"
                    >
                      SAVE LOG ENTRY
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                Select an airborne track to review observations and enter human-in-the-loop verification.
              </div>
            )}
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
