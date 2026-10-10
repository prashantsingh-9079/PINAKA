import React, { useState, useEffect } from 'react';
import { EventFilters } from '../components/EventFilters';
import { EventTimeline } from '../components/EventTimeline';
import { EventDetails } from '../components/EventDetails';
import { EventStats } from '../components/EventStats';

interface Alert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  evidence: string[];
}

export const EventsAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filters, setFilters] = useState({
    timeRange: '24h',
    severity: [] as string[],
    type: [] as string[],
    status: [] as string[]
  });
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  // Initialize with sample data and simulate live updates (same as in EventStats)
  useEffect(() => {
    const initAlerts: Alert[] = [];
    const alertTypes = ['Unusual Group Motion', 'Sensor Disagreement', 'Track Lost', 'New Candidate Track', 'Group Size Changed', 'Low Confidence Detection'];
    const severities: ('info' | 'warning' | 'error')[] = ['info', 'warning', 'error'];

    // Generate initial alerts for the last 24 hours
    for (let i = 0; i < 25; i++) {
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      const time = new Date(Date.now() - hoursAgo * 3600000 - minutesAgo * 60000);

      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];

      initAlerts.push({
        id: `alert-${i}`,
        timestamp: time.toISOString(),
        type,
        severity,
        message: generateAlertMessage(type, severity),
        status: Math.random() > 0.7 ? 'new' : Math.random() > 0.3 ? 'reviewed' : 'resolved',
        evidence: generateEvidence()
      });
    }

    setAlerts(initAlerts);

    // Simulate new alerts coming in every 10-30 seconds
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: `alert-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        message: generateAlertMessage(
          alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severities[Math.floor(Math.random() * severities.length)]
        ),
        status: 'new',
        evidence: generateEvidence()
      };

      setAlerts(prev => {
        const updated = [newAlert, ...prev];
        // Keep only last 50 alerts
        if (updated.length > 50) {
          updated.pop();
        }
        return updated;
      });
    }, 10000 + Math.random() * 20000); // 10-30 seconds

    return () => clearInterval(interval);
  }, []);

  const generateAlertMessage = (type: string, severity: string): string => {
    const messages: Record<string, Record<string, string[]>> = {
      'Unusual Group Motion': {
        info: ['Group dispersion increased slightly', 'Group formation detected', 'Candidate group showing loose cohesion'],
        warning: ['Unusual dispersion pattern detected', 'Group moving in coordinated manner', 'Group speed deviation from norm'],
        error: ['Highly unusual group motion detected', 'Tight formation with high speed', 'Group exhibiting threat-like characteristics']
      },
      'Sensor Disagreement': {
        info: ['Minor discrepancy between sensors', 'Slight timing difference in detections', 'Low confidence correlation'],
        warning: ['Conflicting trajectories from visual and RF', 'Radar detection not confirmed by visual', 'Temporal mismatch in observations'],
        error: ['Direct contradiction between sensor modalities', 'High-confidence visual vs null RF', 'Impossible trajectory from fused data']
      },
      'Track Lost': {
        info: ['Track briefly obscured', 'Single missed detection', 'Temporary signal loss'],
        warning: ['Track lost after 2 missed detections', 'Signal degradation causing loss', 'Track lost in cluttered environment'],
        error: ['Track lost after 3+ missed detections', 'Complete signal dropout', 'Track lost during maneuver']
      },
      'New Candidate Track': {
        info: ['New low-confidence detection', 'Brief visual detection', 'RF return without visual'],
        warning: ['Medium-confidence track initiated', 'Consistent RF returns', 'Visual detection with low confidence'],
        error: ['High-confidence new track', 'Multi-sensor confirmation', 'Persistent detection over multiple frames']
      },
      'Group Size Changed': {
        info: ['Group gained one member', 'Group lost one member', 'Minor size fluctuation'],
        warning: ['Group size increased significantly', 'Group split into subgroups', 'Multiple tracks joining group'],
        error: ['Group doubled in size', 'Rapid group expansion', 'Many tracks converging']
      },
      'Low Confidence Detection': {
        info: ['Detection at range limit', 'Detection in poor lighting', 'Partial occlusion'],
        warning: ['Detection with marginal confidence', 'Detection in adverse weather', 'Detection with sensor noise'],
        error: ['Very low confidence detection', 'Detection at sensor limits', 'Highly uncertain detection']
      }
    };

    const typeMessages = messages[type] || { info: ['Generic alert'], warning: ['Generic alert'], error: ['Generic alert'] };
    const severityMessages = typeMessages[severity as keyof typeof typeMessages] || typeMessages.info;
    return severityMessages[Math.floor(Math.random() * severityMessages.length)];
  };

  const generateEvidence = (): string[] => {
    const evidenceTypes = ['visual-001', 'visual-002', 'rf-001', 'rf-002', 'radar-001', 'thermal-001'];
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 pieces of evidence
    const shuffled = [...evidenceTypes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div className="events-alerts-page">
      <div className="page-header">
        <h1>Events & Alerts</h1>
        <p className="page-subtitle">
          History of system events, alerts, and operator review actions
        </p>
      </div>

      <div className="events-alerts-content">
        <div className="events-sidebar">
          <EventFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
          <EventStats alerts={alerts} />
        </div>
        <div className="events-main">
          <div className="events-tabs">
            <button
              className={`tab-btn ${selectedAlertId === null ? 'active' : ''}`}
              onClick={() => setSelectedAlertId(null)}
            >
              Timeline
            </button>
            <button
              className={`tab-btn ${selectedAlertId !== null ? 'active' : ''}`}
              onClick={() => setSelectedAlertId(alerts.length > 0 ? alerts[0].id : null)}
            >
              Details
            </button>
            <button className="tab-btn">
              Analytics
            </button>
          </div>
          <div className="events-tab-content">
            {selectedAlertId === null ? (
              <EventTimeline
                alerts={alerts}
                filters={filters}
                onAlertSelect={setSelectedAlertId}
              />
            ) : (
              <EventDetails
                alerts={alerts}
                selectedAlertId={selectedAlertId}
                onAlertSelect={setSelectedAlertId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};