import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Track, 
  SensorStatus, 
  GroupCluster, 
  RecentEvent, 
  VerificationStatus, 
  SystemSettings 
} from '../types/pinaka';
import { UserSession, PRESET_OFFICIALS } from '../types/auth';
import { 
  INITIAL_TRACKS, 
  INITIAL_SENSORS, 
  INITIAL_GROUPS, 
  INITIAL_EVENTS, 
  DEFAULT_SETTINGS 
} from '../data/mockData';
import { api } from '../services/api';
import { wsClient } from '../services/websocket';

interface PinakaContextType {
  tracks: Track[];
  sensors: SensorStatus[];
  groups: GroupCluster[];
  events: RecentEvent[];
  selectedTrackId: string | null;
  selectedTrack: Track | null;
  settings: SystemSettings;
  radarSweepAngle: number;
  activeViewMode: 'optical' | 'thermal' | 'radar' | 'rf' | 'quad' | 'fused';
  backendConnected: boolean;
  systemLatencyMs: number;
  currentUser: UserSession | null;
  login: (session: UserSession) => void;
  logout: () => void;
  setActiveViewMode: (mode: 'optical' | 'thermal' | 'radar' | 'rf' | 'quad' | 'fused') => void;
  selectTrack: (id: string | null) => void;
  updateVerification: (trackId: string, status: VerificationStatus, notes?: string) => Promise<void>;
  updateSettings: (partial: Partial<SystemSettings>) => void;
  setScenario: (scenario: SystemSettings['simulationScenario']) => Promise<void>;
  toggleSimulation: () => Promise<void>;
  setSimulationSpeed: (speed: SystemSettings['simulationSpeed']) => Promise<void>;
  resetSimulation: () => Promise<void>;
  addEvent: (event: Omit<RecentEvent, 'id' | 'timestamp'>) => Promise<void>;
  refreshBackendData: () => Promise<void>;
}

const PinakaContext = createContext<PinakaContextType | undefined>(undefined);

export const PinakaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [sensors, setSensors] = useState<SensorStatus[]>(INITIAL_SENSORS);
  const [groups, setGroups] = useState<GroupCluster[]>(INITIAL_GROUPS);
  const [events, setEvents] = useState<RecentEvent[]>(INITIAL_EVENTS);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>('TRK-801');
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [radarSweepAngle, setRadarSweepAngle] = useState<number>(0);
  const [activeViewMode, setActiveViewMode] = useState<'optical' | 'thermal' | 'radar' | 'rf' | 'quad' | 'fused'>('fused');
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [systemLatencyMs, setSystemLatencyMs] = useState<number>(14.2);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('pinaka_defense_session');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const login = (session: UserSession) => {
    setCurrentUser(session);
    try {
      localStorage.setItem('pinaka_defense_session', JSON.stringify(session));
    } catch {}
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('pinaka_defense_session');
    } catch {}
  };

  // 1. Initial REST API Load from FastAPI Backend
  const refreshBackendData = async () => {
    try {
      const [backendTracks, backendSensors, backendEvents, backendGroups] = await Promise.all([
        api.getTracks(),
        api.getSensors(),
        api.getEvents(),
        api.getGroupAnalytics()
      ]);

      if (backendTracks && backendTracks.length > 0) setTracks(backendTracks);
      if (backendSensors && backendSensors.length > 0) setSensors(backendSensors);
      if (backendEvents && backendEvents.length > 0) setEvents(backendEvents);
      if (backendGroups && backendGroups.length > 0) setGroups(backendGroups);
      setBackendConnected(true);
    } catch {
      // Backend starting or not yet connected - keep local state
      setBackendConnected(false);
    }
  };

  useEffect(() => {
    refreshBackendData();

    // 2. Connect WebSocket for real-time live streaming
    wsClient.connect();

    const unsubStatus = wsClient.addStatusListener((connected) => {
      setBackendConnected(connected);
      if (connected) {
        refreshBackendData();
      }
    });

    const unsubMsg = wsClient.addMessageListener((msg) => {
      if (msg.type === 'TELEMETRY_UPDATE') {
        if (msg.tracks) {
          setTracks(msg.tracks);
        }
        if (msg.groups) {
          setGroups(msg.groups);
        }
        if (msg.radarSweepAngle !== undefined) {
          setRadarSweepAngle(msg.radarSweepAngle);
        }
        if (msg.system?.latencyMs) {
          setSystemLatencyMs(msg.system.latencyMs);
        }
      }
    });

    return () => {
      unsubStatus();
      unsubMsg();
      wsClient.disconnect();
    };
  }, []);

  // Selected track lookup
  const selectedTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0] || null;

  const selectTrack = (id: string | null) => {
    setSelectedTrackId(id);
  };

  // Human Operator Verification
  const updateVerification = async (trackId: string, status: VerificationStatus, notes?: string) => {
    // Optimistic UI update
    setTracks(prev => prev.map(t => {
      if (t.id === trackId) {
        return {
          ...t,
          verificationStatus: status,
          operatorNotes: notes || t.operatorNotes
        };
      }
      return t;
    }));

    try {
      await api.submitOperatorReview({ trackId, status, notes });
      const updatedEvents = await api.getEvents();
      if (updatedEvents) setEvents(updatedEvents);
    } catch {
      addEvent({
        type: status === 'Verified Hostile' ? 'FUSION_LOCK' : 'OPERATOR_OVERRIDE',
        severity: status === 'Verified Hostile' ? 'critical' : status === 'Authorized Flight' ? 'info' : 'warning',
        title: `Track ${trackId} Verification Updated`,
        message: `Operator marked ${trackId} as "${status}". ${notes ? `Note: ${notes}` : ''}`,
        trackId
      });
    }
  };

  const updateSettings = (partial: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const setScenario = async (scenario: SystemSettings['simulationScenario']) => {
    updateSettings({ simulationScenario: scenario });
    try {
      await api.controlSimulation({ scenario });
      refreshBackendData();
    } catch {
      // Local fallback
    }
  };

  const toggleSimulation = async () => {
    const nextState = !settings.isSimulating;
    updateSettings({ isSimulating: nextState });
    try {
      if (nextState) {
        await api.resumeSimulation();
      } else {
        await api.pauseSimulation();
      }
    } catch {
      // Local fallback
    }
  };

  const setSimulationSpeed = async (speed: SystemSettings['simulationSpeed']) => {
    updateSettings({ simulationSpeed: speed });
    try {
      await api.controlSimulation({ speed });
    } catch {
      // Local fallback
    }
  };

  const resetSimulation = async () => {
    try {
      await api.resetSimulation();
      refreshBackendData();
    } catch {
      setTracks(INITIAL_TRACKS);
      setSensors(INITIAL_SENSORS);
      setGroups(INITIAL_GROUPS);
      setSelectedTrackId('TRK-801');
    }
  };

  const addEvent = async (event: Omit<RecentEvent, 'id' | 'timestamp'>) => {
    try {
      const created = await api.createEvent(event);
      setEvents(prev => [created, ...prev.slice(0, 20)]);
    } catch {
      const timeStr = new Date().toTimeString().split(' ')[0] + ' UTC';
      const newEvt: RecentEvent = {
        ...event,
        id: `EVT-${Math.floor(Math.random() * 900 + 100)}`,
        timestamp: timeStr
      };
      setEvents(prev => [newEvt, ...prev.slice(0, 20)]);
    }
  };

  return (
    <PinakaContext.Provider value={{
      tracks,
      sensors,
      groups,
      events,
      selectedTrackId,
      selectedTrack,
      settings,
      radarSweepAngle,
      activeViewMode,
      backendConnected,
      systemLatencyMs,
      currentUser,
      login,
      logout,
      setActiveViewMode,
      selectTrack,
      updateVerification,
      updateSettings,
      setScenario,
      toggleSimulation,
      setSimulationSpeed,
      resetSimulation,
      addEvent,
      refreshBackendData
    }}>
      {children}
    </PinakaContext.Provider>
  );
};

export const usePinaka = () => {
  const context = useContext(PinakaContext);
  if (!context) {
    throw new Error('usePinaka must be used within a PinakaProvider');
  }
  return context;
};
