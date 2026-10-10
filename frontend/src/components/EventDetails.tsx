import React, { useState } from 'react';

interface Alert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  evidence: string[];
}

interface EventDetailsProps {
  alerts: Alert[];
  selectedAlertId: string | null;
  onAlertSelect: (id: string | null) => void;
}

export const EventDetails = ({ alerts, selectedAlertId, onAlertSelect }: EventDetailsProps) => {
  const alert = alerts.find(a => a.id === selectedAlertId);
  const [isAnnotationVisible, setIsAnnotationVisible] = useState(false);
  const [annotationText, setAnnotationText] = useState('');

  if (!alert) {
    return (
      <div className="event-details-empty">
        <div className="empty-icon">🔍</div>
        <h3>Select an alert to view details</h3>
        <p>Click on an alert in the timeline to see its full details here.</p>
      </div>
    );
  }

  const handleAnnotationToggle = () => {
    setIsAnnotationVisible(!isAnnotationVisible);
  };

  const handleAnnotationSave = () => {
    // In a real app, this would save to backend
    alert('Annotation saved!');
    setIsAnnotationVisible(false);
  };

  const handleStatusChange = (newStatus: 'reviewed' | 'resolved') => {
    // In a real app, this would update the backend
    alert(`Alert status changed to ${newStatus}`);
  };

  const handleGoBack = () => {
    onAlertSelect(null);
  };

  return (
    <div className="event-details-panel">
      <div className="details-header">
        <h3>Alert Details</h3>
        <div className="alert-meta">
          <span className="alert-id">ID: {alert.id}</span>
          <span className="alert-time">
            {new Date(alert.timestamp).toLocaleString()}
          </span>
        </div>
        <button className="btn btn-icon btn-back" onClick={handleGoBack}>
          ◀ Back to Timeline
        </button>
      </div>

      <div className="details-tabs">
        <button className="tab-btn active">Overview</button>
        <button className="tab-btn">Evidence</button>
        <button className="tab-btn">Analytics</button>
        <button className="tab-btn">Actions</button>
      </div>

      <div className="details-content">
        <div className="tab-content active">
          <div className="detail-section">
            <h4>Alert Information</h4>
            <div className="info-grid">
              <div className="info-row">
                <span>Type:</span>
                <span className="info-value">{alert.type}</span>
              </div>
              <div className="info-row">
                <span>Severity:</span>
                <span className={`info-value severity-${alert.severity}`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <span className={`info-value status-${alert.status}`}>
                  {alert.status.toUpperCase()}
                </span>
              </div>
              <div className="info-row">
                <span>Detection Confidence:</span>
                <span className="info-value">{Math.floor(Math.random() * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Alert Message</h4>
            <div className="alert-message-box">
              {alert.message}
            </div>
          </div>

          {isAnnotationVisible && (
            <div className="detail-section">
              <h4>Operator Annotation</h4>
              <div className="annotation-form">
                <textarea
                  value={annotationText}
                  onChange={(e) => setAnnotationText(e.target.value)}
                  placeholder="Add your observations or notes about this alert..."
                  className="form-textarea"
                  rows={4}
                />
                <div className="annotation-actions">
                  <button className="btn btn-sm btn-secondary" onClick={handleAnnotationToggle}>
                    Cancel
                  </button>
                  <button className="btn btn-sm btn-primary ms-2" onClick={handleAnnotationSave}>
                    Save Annotation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="tab-content">
          <div className="detail-section">
            <h4>Supporting Evidence</h4>
            <div className="evidence-timeline">
              {alert.evidence.map((ev, index) => {
                const evType = ev.startsWith('visual') ? 'Camera' :
                              ev.startsWith('rf') ? 'RF Classifier' :
                              ev.startsWith('radar') ? 'Radar' :
                              ev.startsWith('thermal') ? 'Thermal' : 'Other';
                const evIcon = ev.startsWith('visual') ? '📷' :
                              ev.startsWith('rf') ? '📡' :
                              ev.startsWith('radar') ? '📻' :
                              ev.startsWith('thermal') ? '🌡️' : '📄';

                return (
                  <div key={index} className="evidence-item">
                    <div className="evidence-icon">{evIcon}</div>
                    <div className="evidence-info">
                      <div className="evidence-type">{evType}</div>
                      <div className="evidence-id">{ev}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="tab-content">
          <div className="detail-section">
            <h4>Related Analytics</h4>
            <div className="analytics-grid">
              <div className="analytics-item">
                <h5>Motion Analysis</h5>
                <p>Speed: 12.3 m/s</p>
                <p>Acceleration: 1.2 m/s²</p>
                <p>Direction: 245°</p>
              </div>
              <div className="analytics-item">
                <h5>Track History</h5>
                <p>First seen: 2 min ago</p>
                <p>Last seen: Just now</p>
                <p>Track ID: TRK-{Math.floor(Math.random() * 1000)}</p>
              </div>
              <div className="analytics-item">
                <h5>Environmental</h5>
                <p>Lighting: Day</p>
                <p>Weather: Clear</p>
                <p>Altitude: 120m AGL</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content">
          <div className="detail-section">
            <h4>Available Actions</h4>
            <div className="actions-panel">
              <div className="action-group">
                <h5>Review Actions</h5>
                <button className={`btn btn-block ${alert.status === 'new' ? 'btn-warning' : ''}`
                          onClick={() => handleStatusChange('reviewed')}>
                  {alert.status === 'new' ? 'Mark as Reviewed' : 'Reviewed'}
                </button>
                <button className="btn btn-block btn-outline"
                        onClick={() => handleStatusChange('resolved')}>
                  {alert.status === 'resolved' ? 'Mark as Resolved' : 'Resolve as False Positive'}
                </button>
              </div>

              <div className="action-group">
                <h5>Investigation Tools</h5>
                <button className="btn btn-block btn-outline">
                  View Raw Sensor Data
                </button>
                <button className="btn btn-block btn-outline">
                  Correlate with Other Sensors
                </button>
                <button className="btn btn-block btn-outline">
                  Export Evidence Package
                </button>
              </div>

              <div className="action-group">
                <h5>Notifications</h5>
                <button className="btn btn-block btn-outline">
                  Notify Supervisor
                </button>
                <button className="btn btn-block btn-outline">
                  Log to Audit Trail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="details-footer">
        <div className="footer-actions">
          <button className="btn btn-sm btn-secondary">
            Previous Alert
          </button>
          <button className="btn btn-sm btn-primary ms-2">
            Next Alert
          </button>
        </div>
      </div>
    </div>
  );
};