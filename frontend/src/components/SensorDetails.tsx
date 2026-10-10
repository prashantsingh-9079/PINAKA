import React, { useState } from 'react';

interface Sensor {
  id: string;
  name: string;
  type: 'camera' | 'rf' | 'radar' | 'thermal';
  status: 'online' | 'degraded' | 'offline';
  lastSeen: string;
  latency: number;
  dataRate: number;
  healthScore: number;
  bandwidthUsage: number;
  errorRate: number;
  temperature?: number;
  signalStrength?: number;
}

interface SensorDetailsProps {
  sensors: Sensor[];
  selectedSensorId: string | null;
  onSensorSelect: (id: string | null) => void;
}

export const SensorDetails = ({ sensors, selectedSensorId, onSensorSelect }: SensorDetailsProps) => {
  const sensor = sensors.find(s => s.id === selectedSensorId);

  if (!sensor) {
    return (
      <div className="sensor-details-empty">
        <div className="empty-icon">📡</div>
        <h3>Select a sensor to view details</h3>
        <p>Click on a sensor in the grid to see its detailed status here.</p>
      </div>
    );
  }

  const handleSelectSensor = (id: string | null) => {
    onSensorSelect(id);
  };

  // Format bytes to appropriate units
  const formatBandwidth = (bps: number): string => {
    if (bps >= 1000000) return `${(bps / 1000000).toFixed(1)} Mbps`;
    if (bps >= 1000) return `${(bps / 1000).toFixed(1)} Kbps`;
    return `${bps} bps`;
  };

  // Handle sensor actions (reset, restart, etc.)
  const handleSensorAction = (action: string) => {
    // In a real implementation, this would send commands to the backend
    // For now, we'll simulate the actions
    console.log(`Performing ${action} on sensor ${sensor.id}`);

    // Simulate immediate feedback
    if (action === 'reset') {
      alert(`Sensor ${sensor.name} has been reset. Please wait for reconnection.`);
    } else if (action === 'restart') {
      alert(`Sensor ${sensor.name} is restarting. Please wait for reconnection.`);
    }
  };

  return (
    <div className="sensor-details-panel">
      <div className="details-header">
        <h2>{sensor.name} Details</h2>
        <div className="sensor-actions">
          <button className="btn btn-icon btn-back" onClick={() => handleSelectSensor(null)}>
            ◀ Back to Grid
          </button>
        </div>
      </div>

      <div className="details-tabs">
        <button className="tab-btn active">Overview</button>
        <button className="tab-btn">Metrics</button>
        <button className="tab-btn">Diagnostics</button>
        <button className="tab-btn">Logs</button>
      </div>

      <div className="details-content">
        <div className="tab-content active">
          <div className="detail-section">
            <h3>Sensor Information</h3>
            <div className="info-grid">
              <div className="info-row">
                <span>Sensor ID:</span>
                <span className="info-value">{sensor.id}</span>
              </div>
              <div className="info-row">
                <span>Type:</span>
                <span className="info-value">{sensor.type.toUpperCase()}</span>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <span className={`info-value status-${sensor.status.toLowerCase()}`}>
                  {sensor.status.toUpperCase()}
                </span>
              </div>
              <div className="info-row">
                <span>Last Seen:</span>
                <span className="info-value">{sensor.lastSeen}</span>
              </div>
              <div className="info-row">
                <span>Uptime:</span>
                <span className="info-value">
                  {sensor.status === 'online' ? '99.8%' : '0%'}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Connection Status</h3>
            <div className="status-indicators">
              <div className="status-item">
                <span>Connection:</span>
                <span className={`status-dot status-${sensor.status === 'online' ? 'online' : sensor.status === 'degraded' ? 'degraded' : 'offline'}`}>
                  {sensor.status.toUpperCase()}
                </span>
              </div>
              <div className="status-item">
                <span>Data Link:</span>
                <span className="status-dot status-online">ACTIVE</span>
              </div>
              <div className="status-item">
                <span>Sync:</span>
                <span className="status-dot status-online">SYNCED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content">
          <div className="detail-section">
            <h3>Performance Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <h4>Latency</h4>
                <div className="metric-value">{sensor.latency} ms</span>
                <div className="metric-trend">
                  {sensor.latency < 50 ? '↓ Good' : sensor.latency < 100 ? '→ Fair' : '↑ Poor'}
                </div>
              </div>
              <div className="metric-card">
                <h4>Data Rate</h4>
                <div className="metric-value">
                  {formatBandwidth(sensor.dataRate * 1000)} // Convert kbps to bps for formatting
                </div>
                <div className="metric-trend">
                  {sensor.dataRate > 800 ? '↑ High' : sensor.dataRate > 500 ? '→ Normal' : '↓ Low'}
                </div>
              </div>
              <div className="metric-card">
                <h4>Bandwidth Usage</h4>
                <div className="metric-value">
                  {formatBandwidth(sensor.bandwidthUsage * 1000)}
                </div>
                <div className="metric-trend">
                  {sensor.bandwidthUsage > 0.8 ? '↑ High' : sensor.bandwidthUsage > 0.5 ? '→ Moderate' : '↓ Low'}
                </div>
              </div>
              <div className="metric-card">
                <h4>Error Rate</h4>
                <div className="metric-value">{sensor.errorRate.toFixed(2)}%</span>
                <div className="metric-trend">
                  {sensor.errorRate < 1 ? '↓ Excellent' : sensor.errorRate < 3 ? '→ Acceptable' : '↑ Poor'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content">
          <div class="detail-section">
            <h3>Diagnostic Information</h3>
            <div className="diagnostics-grid">
              {sensor.type === 'camera' && (
                <>
                  <div className="diagnostic-item">
                    <span>Resolution:</span>
                    <span>1920x1080</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Frame Rate:</span>
                    <span>30 FPS</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Exposure:</span>
                    <span>Auto</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Focus:</span>
                    <span>Auto</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>White Balance:</span>
                    <span>Auto</span>
                  </div>
                </>
              )}
              {sensor.type === 'rf' && (
                <>
                  <div className="diagnostic-item">
                    <span>Frequency:</span>
                    <span>2.4 GHz</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Bandwidth:</span>
                    <span>20 MHz</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Modulation:</span>
                    <span>QPSK</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Signal Strength:</span>
                    <span>{sensor.signalStrength?.toFixed(1) ?? '-'} dBm</span>
                  </div>
                </>
              )}
              {sensor.type === 'radar' && (
                <>
                  <div className="diagnostic-item">
                    <span>Frequency:</span>
                    <span>76-81 GHz</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Range:</span>
                    <span>0-200 m</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Resolution:</span>
                    <span>0.1 m</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Update Rate:</span>
                    <span>20 Hz</span>
                  </div>
                </>
              )}
              {sensor.type === 'thermal' && (
                <>
                  <div className="diagnostic-item">
                    <span>Resolution:</span>
                    <span>640x480</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Frame Rate:</span>
                    <span>9 FPS</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Temp Range:</span>
                    <span>-40°C to 150°C</span>
                  </div>
                  <div className="diagnostic-item">
                    <span>Sensor Temp:</span>
                    <span>{sensor.temperature?.toFixed(1) ?? '-'}°C</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="tab-content">
          <div className="detail-section">
            <h3>Recent Logs</h3>
            <div className="logs-container">
              <div className="log-entry log-info">
                <span className="log-time">10:23:45</span>
                <span className="log-type">INFO</span>
                <span className="log-message">Sensor initialized successfully</span>
              </div>
              <div className="log-entry log-info">
                <span className="log-time">10:23:40</span>
                <span className="log-type">INFO</span>
                <span className="log-message">Calibration completed</span>
              </div>
              {sensor.status === 'offline' && (
                <div className="log-entry log-error">
                  <span className="log-time">10:22:10</span>
                  <span className="log-type">ERROR</span>
                  <span className="log-message">Connection lost - timeout</span>
                </div>
              )}
              {sensor.status === 'degraded' && (
                <div className="log-entry log-warning">
                  <span className="log-time">10:21:05</span>
                  <span className="log-type">WARNING</span>
                  <span className="log-message">High latency detected</span>
                </div>
              )}
              <div className="log-entry log-info">
                <span className="log-time">10:20:30</span>
                <span className="log-type">INFO</span>
                <span className="log-message">Firmware version: v2.1.4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="details-footer">
        <div className="footer-actions">
          <button className="btn btn-sm btn-outline">
            Export Diagnostics
          </button>
          <button className="btn btn-sm btn-primary ms-2">
            Run Diagnostics
          </button>
          {sensor.status !== 'offline' && (
            <button className="btn btn-sm btn-warning ms-2" onClick={() => handleSensorAction('reset')}>
              Reset Sensor
            </button>
          )}
          {sensor.status === 'offline' && (
            <button className="btn btn-sm btn-success ms-2" onClick={() => handleSensorAction('restart')}>
              Restart Sensor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};