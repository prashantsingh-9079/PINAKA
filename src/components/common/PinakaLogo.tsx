import React from 'react';

interface PinakaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const PinakaLogo: React.FC<PinakaLogoProps> = ({ size = 'md', showTagline = true }) => {
  const iconDimensions = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex items-center gap-3">
      {/* Precision Bow / Radar Reticle Brand Icon */}
      <div className={`relative ${iconDimensions} flex items-center justify-center shrink-0`}>
        <div className="absolute inset-0 bg-cyan-500/10 rounded-lg border border-cyan-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.25)]" />
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <defs>
            <linearGradient id="pinakaBowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Celestial Bow Arch (Pinaka) */}
          <path 
            d="M 22 14 C 74 24, 88 50, 88 50 C 88 50, 74 76, 22 86 C 36 62, 36 38, 22 14 Z" 
            stroke="url(#pinakaBowGrad)" 
            strokeWidth="3.5" 
            fill="rgba(6, 182, 212, 0.15)"
            filter="url(#glow)"
          />
          {/* Bowstring */}
          <line x1="22" y1="14" x2="22" y2="86" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.8" />
          {/* Central Laser / Kinetic Arrow */}
          <line x1="12" y1="50" x2="88" y2="50" stroke="#00F0FF" strokeWidth="2.5" />
          <polygon points="96,50 84,45 87,50 84,55" fill="#00F0FF" />
          {/* Concentric Sensor Rings */}
          <circle cx="50" cy="50" r="16" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7"/>
          <circle cx="50" cy="50" r="4" fill="#00F0FF" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-tactical font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 ${titleSize}`}>
            PINAKA
          </span>
          <span className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 uppercase">
            C2 C-UAS
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            Detect • Understand • Protect
          </span>
        )}
      </div>
    </div>
  );
};
