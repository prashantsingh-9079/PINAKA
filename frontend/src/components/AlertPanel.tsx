import React from 'react';

interface Alert {
  id: string;
  time: string;
  type: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
}

export const AlertPanel = ({ title }: { title: string }) => {
  // Sample alerts data
  const alerts: Alert[] = [
    {
      id: '1',
      time: '10:23:45',
      type: 'Unusual Group Motion',
      severity: 'warning',
      message: 'Candidate group detected with unusual dispersion pattern',
      status: 'new'
    },
    {
      id: '2',
      time: '10:22:12',
      type: 'Sensor Disagreement',
      severity: 'info',
      message: 'Visual and RF detections show conflicting trajectories',
      status: 'reviewed'
    },
    {
      id: '3',
      time: '10:20:05',
      type: 'Track Lost',
      severity: 'error',
      message: 'Track TRK-087 lost after 3 consecutive missed detections',
      status: 'new'
    }
  ];

  return (
    <div className="alert-panel">
      <div className="panel-header">
        <h3>{title}</h3>
        <button className="btn btn-sm btn-secondary">View All</button>
      </div>
      <div className="alert-list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item alert-${alert.status}`}>
            <div className="alert-info">
              <div className="alert-time">{alert.time}</div>
              <div className="alert-type">{alert.type}</div>
              <div className="alert-message">{alert.message}</div>
            </div>
            <div className="alert-status">
              <span className={`status-dot status-${alert.severity}`}></span>
              <span>{alert.status.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};