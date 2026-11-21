import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SimulatedBadgeProps {
  label?: string;
  variant?: 'prominent' | 'compact' | 'subtle';
  className?: string;
}

export const SimulatedBadge: React.FC<SimulatedBadgeProps> = ({ 
  label = 'SIMULATED DATA // SYNTHETIC RESEARCH TESTBED', 
  variant = 'compact',
  className = '' 
}) => {
  if (variant === 'prominent') {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.15)] ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 animate-pulse text-amber-400" />
        <span className="font-semibold uppercase">{label}</span>
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-400 text-[10px] font-mono tracking-wider uppercase ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-ping" />
        SIMULATED TESTBED
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono tracking-widest uppercase shadow-[0_0_8px_rgba(6,182,212,0.15)] ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
      {label}
    </span>
  );
};
