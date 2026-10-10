import React from 'react';

export const TrackDetailPanel = () => {
  // Sample selected track data
  const track = {
    id: 'TRK-001',
    class: 'drone',
    confidence: 0.92,
    firstSeen: '10:20:15',
    lastSeen: 'just now',
    sensors: ['camera-01', 'rf-01'],
    status: 'confirmed',
    snapshots: 5,
    trajectoryPoints: 127
  };

  return (
    <div className="track-detail-panel">
      <div className="panel-header">
        <h3>Track Details</h3>
        <button className="btn btn-sm btn-secondary">Track TRK-001</button>
      </div>
      <div className="track-detail-content">
        <div className="detail-row">
          <span className="detail-label">Track ID:</span>
          <span className="detail-value">{track.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Classification:</span>
          <span className="detail-value">{track.class}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Confidence:</span>
          <span className="detail-value">
            {(track.confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">First Seen:</span>
          <span className="detail-value">{track.firstSeen}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Last Seen:</span>
          <span className="detail-value">{track.lastSeen}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Sensor Sources:</span>
          <div className="detail-value sensor-list">
            {track.sensors.map((sensor, index) => (
              <span key={index} className="sensor-badge">
                {sensor}
              </span>
            ))}
          </div>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className={`detail-value status-${track.status.toLowerCase()}`}>
            {track.status}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Snapshots:</span>
          <span className="detail-value">{track.snapshots}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Trajectory Points:</span>
          <span className="detail-value">{track.trajectoryPoints}</span>
        </div>
      </div>
    </div>
  );
};