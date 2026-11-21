import React, { ReactNode } from 'react';

interface TacticalCardProps {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const TacticalCard: React.FC<TacticalCardProps> = ({
  title,
  subtitle,
  badge,
  headerAction,
  children,
  className = '',
  noPadding = false
}) => {
  return (
    <div className={`tactical-glass tactical-corner rounded-lg overflow-hidden flex flex-col ${className}`}>
      {(title || headerAction || badge) && (
        <div className="px-4 py-2.5 border-b border-cyan-500/15 bg-slate-900/40 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-1.5 h-3.5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-sm" />
            <div>
              {title && (
                <h3 className="font-tactical font-semibold text-sm tracking-wider text-slate-200 uppercase truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] font-mono text-slate-400 tracking-wide truncate">
                  {subtitle}
                </p>
              )}
            </div>
            {badge && <div className="ml-2">{badge}</div>}
          </div>
          {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
        </div>
      )}
      <div className={`flex-1 ${noPadding ? '' : 'p-4'}`}>
        {children}
      </div>
    </div>
  );
};
