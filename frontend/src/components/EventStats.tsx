import React, { useState, useEffect } from 'react';

interface Alert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  evidence: string[];
}

export const EventStats = () => {
  const [stats, setStats] = useState({
    total24h: 0,
    unreviewed: 0,
    falsePositives: 0,
    bySeverity: {
      info: 0,
      warning: 0,
      error: 0
    },
    byType: {} as Record<string, number>
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Initialize with sample data and simulate live updates
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
    updateStats(initAlerts);

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
        updateStats(updated);
        return updated;
      });
    }, 10000 + Math.random() * 20000); // 10-30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateStats = (alerts: Alert[]) => {
    const total24h = alerts.length;
    const unreviewed = alerts.filter(a => a.status === 'new').length;
    const falsePositives = alerts.filter(a => a.status === 'resolved' && Math.random() > 0.8).length; // Simulate some as false positives

    const bySeverity: Record<string, number> = { info: 0, warning: 0, error: 0 };
    const byType: Record<string, number> = {};

    alerts.forEach(alert => {
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
      byType[alert.type] = (byType[alert.type] || 0) + 1;
    });

    setStats({
      total24h,
      unreviewed,
      falsePositives,
      bySeverity,
      byType
    });
  };

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
    <div className="event-stats">
      <div className="stats-header">
        <h3>Alert Statistics</h3>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total (24h)</h4>
          <p className="stat-value">{stats.total24h}</p>
          <p className="stat-label">alerts</p>
        </div>
        <div className="stat-card">
          <h4>Unreviewed</h4>
          <p className="stat-value {stats.unreviewed > 5 ? 'status-warning' : ''}">
            {stats.unreviewed}
          </p>
          <p className="stat-label">requiring review</p>
        </div>
        <div className="stat-card">
          <h4>False Positives</h4>
          <p className="stat-value">{stats.falsePositives}</p>
          <p className="stat-label">identified</p>
        </div>
      </div>

      <div className="stats-breakdown">
        <div className="breakdown-section">
          <h4>By Severity</h4>
          <div className="severity-breakdown">
            <div className="severity-item">
              <span className="severity-label">Info:</span>
              <span className="severity-value status-info">{stats.bySeverity.info}</span>
            </div>
            <div className="severity-item">
              <span className="severity-label">Warning:</span>
              <span className="severity-value status-warning">{stats.bySeverity.warning}</span>
            </div>
            <div className="severity-item">
              <span className="severity-label">Error:</span>
              <span className="severity-value status-error">{stats.bySeverity.error}</span>
            </div>
          </div>
        </div>

        <div className="breakdown-section">
          <h4>By Type</h4>
          <div className="type-breakdown">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="type-item">
                <span className="type-label">{type}:</span>
                <span className="type-value">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};