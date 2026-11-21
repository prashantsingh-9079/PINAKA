import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  LineChart, 
  Cpu, 
  Share2, 
  Search, 
  FlaskConical, 
  Settings,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  LogOut
} from 'lucide-react';
import { usePinaka } from '../../context/PinakaContext';

export type NavigationPage = 
  | 'overview'
  | 'monitoring'
  | 'analytics'
  | 'sensors'
  | 'groups'
  | 'search'
  | 'evaluation'
  | 'settings';

interface SidebarProps {
  currentPage: NavigationPage;
  onPageChange: (page: NavigationPage) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { tracks, groups, currentUser, logout } = usePinaka();

  const navItems = [
    {
      id: 'overview' as NavigationPage,
      label: 'Overview C2',
      icon: LayoutDashboard,
      badge: `${tracks.length}`
    },
    {
      id: 'monitoring' as NavigationPage,
      label: 'Live Monitoring',
      icon: Video,
      badge: 'LIVE'
    },
    {
      id: 'analytics' as NavigationPage,
      label: 'Track Analytics',
      icon: LineChart
    },
    {
      id: 'sensors' as NavigationPage,
      label: 'Sensor Management',
      icon: Cpu,
      badge: '4/4'
    },
    {
      id: 'groups' as NavigationPage,
      label: 'Group & Swarms',
      icon: Share2,
      badge: `${groups.length}`
    },
    {
      id: 'search' as NavigationPage,
      label: 'Reference Search',
      icon: Search
    },
    {
      id: 'evaluation' as NavigationPage,
      label: 'Research & Eval',
      icon: FlaskConical
    },
    {
      id: 'settings' as NavigationPage,
      label: 'System Settings',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 tactical-glass border-r border-cyan-500/20 flex flex-col justify-between shrink-0 h-[calc(100vh-53px)] sticky top-[53px] bg-[#050811]/95 z-40">
      {/* Navigation List */}
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center justify-between">
          <span>SURVEILLANCE MODULES</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md font-mono text-xs tracking-wider transition-all duration-150 text-left ${
                isActive
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive 
                    ? 'bg-cyan-500/30 text-cyan-200' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Officer Clearance Badge & Switch Button */}
      {currentUser && (
        <div className="px-3 py-2 border-t border-cyan-500/15 bg-slate-900/40">
          <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <UserCheck className="w-3 h-3 text-cyan-400" />
                <span>OFFICER IN C2</span>
              </span>
              <button
                onClick={logout}
                className="text-[9px] text-red-400 hover:text-red-300 underline"
                title="Switch Officer or Return to Defense Gateway"
              >
                Switch
              </button>
            </div>
            <div className="font-bold text-slate-200 truncate">
              {currentUser.rankOrTitle} {currentUser.name}
            </div>
            <div className="text-[9px] text-slate-400 truncate">
              {currentUser.serviceBranchOrDept.split('•')[0]}
            </div>
            <div className="pt-1 flex items-center justify-between text-[9px]">
              <span className="text-amber-400 font-bold">{currentUser.clearanceLevel.split('-')[1]}</span>
              <span className="text-slate-500">{currentUser.serviceId}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info Box */}
      <div className="p-3 border-t border-cyan-500/15 bg-slate-900/50">
        <div className="p-2.5 rounded border border-cyan-500/20 bg-[#040814]/80 text-[11px] font-mono">
          <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
            <span className="tracking-wider">PINAKA CORE v2.4</span>
            <span className="text-[9px] px-1 bg-cyan-950 border border-cyan-500/40 rounded text-cyan-300">RESEARCH</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Multi-Sensor Fusion • Extended Kalman Gating • Drone Swarm Analytics
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>AESA • FLIR • SDR</span>
            <span className="text-emerald-400">NOMINAL</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
