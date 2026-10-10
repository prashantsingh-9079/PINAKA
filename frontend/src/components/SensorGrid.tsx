import React, { useState, useEffect } from 'react';

interface Sensor {
  id: string;
  name: string;
  type: 'camera' | 'rf' | 'radar' | 'thermal';
  status: 'online' | 'degraded' | 'offline';
  lastSeen: string;
  latency: number; // ms
  dataRate: number; // kbps
  healthScore: number; // 0-100
}

export const SensorGrid = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [groupByType, setGroupByType] = useState(false);
  const [healthHistory, setHealthHistory] = useState<Map<string, number[]>>(new Map());

  // Initialize with sample sensors and simulate live updates
  useEffect(() => {
    const initSensors: Sensor[] = [
      {
        id: 'cam-01',
        name: 'Front Camera',
        type: 'camera',
        status: 'online',
        lastSeen: 'just now',
        latency: 45,
        dataRate: 1250,
        healthScore: 98
      },
      {
        id: 'cam-02',
        name: 'Rear Camera',
        type: 'camera',
        status: 'online',
        lastSeen: '2s ago',
        latency: 52,
        dataRate: 1180,
        healthScore: 95
      },
      {
        id: 'rf-01',
        name: 'RF Scanner',
        type: 'rf',
        status: 'online',
        lastSeen: 'just now',
        latency: 12,
        dataRate: 45,
        healthScore: 99
      },
      {
        id: 'radar-01',
        name: 'Radar Unit',
        type: 'radar',
        status: 'degraded',
        lastSeen: '5s ago',
        latency: 78,
        dataRate: 220,
        healthScore: 75
      },
      {
        id: 'thermal-01',
        name: 'Thermal Imager',
        type: 'thermal',
        status: 'offline',
        lastSeen: '45s ago',
        latency: 0,
        dataRate: 0,
        healthScore: 0
      }
    ];

    setSensors(initSensors);

    // Initialize health history for each sensor
    const initialHealthHistory = new Map<string, number[]>();
    initSensors.forEach(sensor => {
      initialHealthHistory.set(sensor.id, [sensor.healthScore]);
    });
    setHealthHistory(initialHealthHistory);

    // Simulate live updates every 3-8 seconds
    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => {
        // Simulate random changes in status and metrics
        const newSensor = { ...sensor };

        // Randomly change status occasionally
        if (Math.random() > 0.95) {
          const statuses: ('online' | 'degraded' | 'offline')[] =
            ['online', 'degraded', 'offline'];
          newSensor.status = statuses[Math.floor(Math.random() * statuses.length)];
        }

        // Update metrics with small random variations
        if (newSensor.status !== 'offline') {
          newSensor.latency = Math.max(1, newSensor.latency + (Math.random() - 0.5) * 10);
          newSensor.dataRate = Math.max(0, newSensor.dataRate + (Math.random() - 0.5) * 50);
          newSensor.healthScore = Math.max(0, Math.min(100,
            newSensor.healthScore + (Math.random() - 0.5) * 5
          ));
          newSensor.lastSeen = 'just now';
        } else {
          // For offline sensors, occasionally bring them back online
          if (Math.random() > 0.98) {
            newSensor.status = 'online';
            newSensor.latency = Math.floor(Math.random() * 30) + 10;
            newSensor.dataRate = Math.floor(Math.random() * 200) + 500;
            newSensor.healthScore = Math.floor(Math.random() * 20) + 80;
            newSensor.lastSeen = 'just now';
          }
        }

        return newSensor;
      }));

      // Update health history
      setHealthHistory(prev => {
        const newHistory = new Map(prev);
        prev.forEach(sensor => {
          if (newHistory.has(sensor.id)) {
            const history = newHistory.get(sensor.id)!;
            // Keep only last 20 history points
            const updatedHistory = [...history.slice(-19), sensor.healthScore];
            newHistory.set(sensor.id, updatedHistory);
          } else {
            newHistory.set(sensor.id, [sensor.healthScore]);
          }
        });
        return newHistory;
      });
    }, 3000 + Math.random() * 5000); // 3-8 seconds

    // Calculate health trend indicator based on recent history
    const calculateHealthTrend = (sensorId: string): string => {
      if (!healthHistory.has(sensorId)) return '';

      const history = healthHistory.get(sensorId)!;
      if (history.length < 2) return '→'; // Not enough data

      // Compare recent average with older average
      const recentAvg = history.slice(-5).reduce((sum, val) => sum + val, 0) / Math.min(5, history.length);
      const olderAvg = history.slice(0, -5).reduce((sum, val) => sum + val, 0) / Math.max(1, history.length - 5);

      if (recentAvg > olderAvg + 2) return '↑'; // Improving
      if (recentAvg < olderAvg - 2) return '↓'; // Degrading
      return '→'; // Stable
    };

  return (

  return (
    <div className="sensor-grid">
      <div className="grid-header">
        <div className="grid-header-content">
          <h2>Sensor Status</h2>
          <div className="grid-controls">
            <label className="group-toggle-label">
              <input
                type="checkbox"
                checked={groupByType}
                onChange={(e) => setGroupByType(e.target.checked)}
              />
              Group by Type
            </label>
          </div>
        </div>
      </div>
      <div className="sensor-list">
        {groupByType ? (
          <>
            {/* Group sensors by type */}
            {['camera', 'rf', 'radar', 'thermal'].map(type => {
              const typeSensors = sensors.filter(s => s.type === type);
              if (typeSensors.length === 0) return null;

              return (
                <div key={type} className="sensor-group">
                  <div className="group-header">
                    <h3>{type.toUpperCase()} SENSORS</h3>
                    <div className="group-stats">
                      <span>Count: {typeSensors.length}</span>
                      <span>Avg Health: {Math.round(typeSensors.reduce((sum, s) => sum + s.healthScore, 0) / typeSensors.length)}%</span>
                    </div>
                  </div>
                  <div className="group-sensors">
                    {typeSensors.map(sensor => (
                      <div
                        key={sensor.id}
                        className={`sensor-item ${sensor.status}`}
                        onClick={() => onSensorSelect(sensor.id)}
                      >
                        <div className="sensor-info">
                          <div className="sensor-name">{sensor.name}</div>
                          <div className="sensor-type">{sensor.type.toUpperCase()}</div>
                        </div>
                        <div className="sensor-status">
                          <div className={`status-indicator status-${sensor.status.toLowerCase()}`}>
                            <span className="status-dot"></span>
                            <span>{sensor.status.toUpperCase()}</span>
                          </div>
                          <div className="sensor-metrics">
                            <div className="metric">
                              <span>Latency:</span>
                              <span>{sensor.latency} ms</span>
                            </div>
                            <div className="metric">
                              <span>Health:</span>
                              <span>{sensor.healthScore}%</span>
                            </div>
                          </div>
                          {/* Health trend indicator */}
                          {healthHistory.has(sensor.id) && (
                            <div className="health-trend">
                              <span title="Health trend (last 20 readings)">
                                {calculateHealthTrend(sensor.id)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            {/* Original ungrouped view */}
            {sensors.map(sensor => (
              <div
                key={sensor.id}
                className={`sensor-item ${sensor.status}`}
                onClick={() => onSensorSelect(sensor.id)}
              >
                <div className="sensor-info">
                  <div className="sensor-name">{sensor.name}</div>
                  <div className="sensor-type">{sensor.type.toUpperCase()}</div>
                </div>
                <div className="sensor-status">
                  <div className={`status-indicator status-${sensor.status.toLowerCase()}`}>
                    <span className="status-dot"></span>
                    <span>{sensor.status.toUpperCase()}</span>
                  </div>
                  <div className="sensor-metrics">
                    <div className="metric">
                      <span>Latency:</span>
                      <span>{sensor.latency} ms</span>
                    </div>
                    <div className="metric">
                      <span>Health:</span>
                      <span>{sensor.healthScore}%</span>
                    </div>
                  </div>
                </div>
                {/* Health trend indicator */}
                {healthHistory.has(sensor.id) && (
                  <div className="health-trend">
                    <span title="Health trend (last 20 readings)">
                      {calculateHealthTrend(sensor.id)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      <div className="grid-footer">
        <div className="refresh-info">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
        <button className="btn btn-sm btn-secondary">
          Refresh All
        </button>
      </div>
    </div>
  );
};