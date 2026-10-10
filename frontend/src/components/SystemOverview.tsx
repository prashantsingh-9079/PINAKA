import React from 'react';

export const SystemOverview = () => {
  return (
    <div className="system-overview">
      <div className="system-overview-grid">
        <div className="overview-card">
          <h3>System Status</h3>
          <div className="status-details">
            <div className="status-item">
              <span>Backend API:</span>
              <span className="status-indicator status-online">
                <span className="status-dot"></span>
                Connected
              </span>
            </div>
            <div className="status-item">
              <span>WebSocket:</span>
              <span className="status-indicator status-online">
                <span className="status-dot"></span>
                Streaming
              </span>
            </div>
            <div className="status-item">
              <span>Last Update:</span>
              <span>Just now</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Data Sources</h3>
          <div className="status-details">
            <div className="status-item">
              <span>Video Feed:</span>
              <span className="status-indicator status-online">
                <span className="status-dot"></span>
                Active
              </span>
            </div>
            <div className="status-item">
              <span>RF Classifier:</span>
              <span className="status-indicator status-online">
                <span className="status-dot"></span>
                Authorized
              </span>
            </div>
            <div className="status-item">
              <span>Radar:</span>
              <span className="status-indicator status-degraded">
                <span className="status-dot"></span>
                Simulated
              </span>
            </div>
            <div className="status-item">
              <span>Thermal:</span>
              <span className="status-indicator status-offline">
                <span className="status-dot"></span>
                Offline
              </span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Performance Metrics</h3>
          <div className="status-details">
            <div className="status-item">
              <span>Processing FPS:</span>
              <span>24.5</span>
            </div>
            <div className="status-item">
              <span>Memory Usage:</span>
              <span>1.2 GB</span>
            </div>
            <div className="status-item">
              <span>CPU Load:</span>
              <span>45%</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Alert Summary</h3>
          <div className="status-details">
            <div className="status-item">
              <span>Total (24h):</span>
              <span>12</span>
            </div>
            <div className="status-item">
              <span>Unreviewed:</span>
              <span className="status-indicator status-warning">
                <span className="status-dot"></span>
                3
              </span>
            </div>
            <div className="status-item">
              <span>False Positives:</span>
              <span>2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};