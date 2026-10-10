import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const SensorLatencyChart = () => {
  const [latencyData, setLatencyData] = useState([]);
  const [visibleSensors, setVisibleSensors] = useState(new Set(['cam-01', 'cam-02', 'rf-01', 'radar-01', 'thermal-01']));

  // Initialize with some historical latency data for each sensor
  useEffect(() => {
    const initData = [];
    const now = Date.now();
    const sensors = ['cam-01', 'cam-02', 'rf-01', 'radar-01', 'thermal-01'];
    const sensorNames = {
      'cam-01': 'Front Camera',
      'cam-02': 'Rear Camera',
      'rf-01': 'RF Scanner',
      'radar-01': 'Radar Unit',
      'thermal-01': 'Thermal Imager'
    };

    // Generate 2 minutes of historical data (120 seconds, 1 sample per second)
    for (let i = 120; i >= 0; i--) {
      const time = now - i * 1000; // 1 second intervals

      sensors.forEach(sensorId => {
        // Base latency with sensor-specific patterns
        let baseLatency = 0;
        switch (sensorId) {
          case 'cam-01': baseLatency = 40 + Math.sin(i * 0.05) * 10; break;
          case 'cam-02': baseLatency = 45 + Math.cos(i * 0.07) * 8; break;
          case 'rf-01': baseLatency = 10 + Math.sin(i * 0.02) * 3; break;
          case 'radar-01': baseLatency = 60 + Math.sin(i * 0.04) * 15; break;
          case 'thermal-01':
            // Thermal sensor is mostly offline, so high latency or null
            baseLatency = Math.random() > 0.7 ? 0 : 200 + Math.random() * 100;
            break;
        }

        // Add some noise
        const latency = Math.max(0, baseLatency + (Math.random() - 0.5) * 5);

        initData.push({
          time: i, // seconds ago
          sensorId,
          sensorName: sensorNames[sensorId],
          latency: latency,
          timestamp: time
        });
      });
    }

    setLatencyData(initData);

    // Set up live updates every 2 seconds
    const interval = setInterval(() => {
      const now = Date.now();
      const latestTime = Math.floor(Date.now() / 1000);

      setLatencyData(prev => {
        // Shift window: remove oldest second, add new data point for each sensor
        const updated = prev.slice(5); // Remove oldest 5 seconds worth (we add 5 sensors per second)

        // Add new data point for each sensor
        ['cam-01', 'cam-02', 'rf-01', 'radar-01', 'thermal-01'].forEach(sensorId => {
          // Only update visible sensors
          if (!visibleSensors.has(sensorId)) {
            return;
          }

          let baseLatency = 0;
          switch (sensorId) {
            case 'cam-01': baseLatency = 40 + Math.sin(latestTime * 0.05) * 10; break;
            case 'cam-02': baseLatency = 45 + Math.cos(latestTime * 0.07) * 8; break;
            case 'rf-01': baseLatency = 10 + Math.sin(latestTime * 0.02) * 3; break;
            case 'radar-01': baseLatency = 60 + Math.sin(latestTime * 0.04) * 15; break;
            case 'thermal-01':
              baseLatency = Math.random() > 0.7 ? 0 : 200 + Math.random() * 100;
              break;
          }

          const latency = Math.max(0, baseLatency + (Math.random() - 0.5) * 5);

          updated.push({
            time: 0, // Will be remapped below
            sensorId,
            sensorName: {
              'cam-01': 'Front Camera',
              'cam-02': 'Rear Camera',
              'rf-01': 'RF Scanner',
              'radar-01': 'Radar Unit',
              'thermal-01': 'Thermal Imager'
            }[sensorId],
            latency: latency,
            timestamp: now
          });
        });

        // Remap time values to be seconds ago
        return updated.map((point, index) => ({
          ...point,
          time: index / 5 // 5 sensors per second
        }));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Sensor Latency Trends</h3>
        <p className="chart-subtitle">
          Latency trends for all sensors over time (lower is better)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={latencyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            label={{ value: 'Seconds Ago', position: 'insideBottom' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '8px', borderRadius: '4px' }}
          />
          <Legend
            verticalAlign="top"
            height={36}
          />

          {/* Lines for each sensor - only show if visible */}
          {visibleSensors.has('cam-01') && (
            <Line
              type="monotone"
              dataKey="latency"
              stroke="#2196f3"
              name="Front Camera"
            />
          )}
          {visibleSensors.has('cam-02') && (
            <Line
              type="monotone"
              dataKey="latency"
              stroke="#ff9800"
              name="Rear Camera"
            />
          )}
          {visibleSensors.has('rf-01') && (
            <Line
              type="monotone"
              dataKey="latency"
              stroke="#9c27b0"
              name="RF Scanner"
            />
          )}
          {visibleSensors.has('radar-01') && (
            <Line
              type="monotone"
              dataKey="latency"
              stroke="#f44336"
              name="Radar Unit"
            />
          )}
          {visibleSensors.has('thermal-01') && (
            <Line
              type="monotone"
              dataKey="latency"
              stroke="#4caf50"
              name="Thermal Imager"
            />
          )}

          {/* Reference lines for latency thresholds */}
          <Line type="horizontal" y={50} stroke="#666" strokeDasharray="2 2" />
          <Line type="horizontal" y={100} stroke="#666" strokeDasharray="2 2" />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-footer">
        <div className="chart-controls">
          <div className="sensor-toggle-group">
            <span>Show Sensors:</span>
            <label className="sensor-toggle-label">
              <input
                type="checkbox"
                checked={visibleSensors.has('cam-01')}
                onChange={(e) => {
                  const newSet = new Set(visibleSensors);
                  if (e.target.checked) {
                    newSet.add('cam-01');
                  } else {
                    newSet.delete('cam-01');
                  }
                  setVisibleSensors(newSet);
                }}
              />
              Front Camera
            </label>
            <label className="sensor-toggle-label">
              <input
                type="checkbox"
                checked={visibleSensors.has('cam-02')}
                onChange={(e) => {
                  const newSet = new Set(visibleSensors);
                  if (e.target.checked) {
                    newSet.add('cam-02');
                  } else {
                    newSet.delete('cam-02');
                  }
                  setVisibleSensors(newSet);
                }}
              />
              Rear Camera
            </label>
            <label className="sensor-toggle-label">
              <input
                type="checkbox"
                checked={visibleSensors.has('rf-01')}
                onChange={(e) => {
                  const newSet = new Set(visibleSensors);
                  if (e.target.checked) {
                    newSet.add('rf-01');
                  } else {
                    newSet.delete('rf-01');
                  }
                  setVisibleSensors(newSet);
                }}
              />
              RF Scanner
            </label>
            <label className="sensor-toggle-label">
              <input
                type="checkbox"
                checked={visibleSensors.has('radar-01')}
                onChange={(e) => {
                  const newSet = new Set(visibleSensors);
                  if (e.target.checked) {
                    newSet.add('radar-01');
                  } else {
                    newSet.delete('radar-01');
                  }
                  setVisibleSensors(newSet);
                }}
              />
              Radar Unit
            </label>
            <label className="sensor-toggle-label">
              <input
                type="checkbox"
                checked={visibleSensors.has('thermal-01')}
                onChange={(e) => {
                  const newSet = new Set(visibleSensors);
                  if (e.target.checked) {
                    newSet.add('thermal-01');
                  } else {
                    newSet.delete('thermal-01');
                  }
                  setVisibleSensors(newSet);
                }}
              />
              Thermal Imager
            </label>
          </div>
        </div>
        <div className="chart-info">
          <span>Latency Thresholds:</span>
          <span className="threshold-line good">Good (<50ms)</span>
          <span className="threshold-line fair">Fair (50-100ms)</span>
          <span className="threshold-line poor">Poor (>100ms)</span>
        </div>
        <div className="chart-stats">
          <div className="stat-item">
            <span>Front Camera:</span>
            <span className="stat-value">
              {latencyData
                .filter(d => d.sensorId === 'cam-01')
                .reduce((avg, d, _, arr) => {
                  if (arr.length === 0) return 0;
                  const sum = arr.reduce((acc, val) => acc + val.latency, 0);
                  return (sum / arr.length).toFixed(1);
                })} ms avg
            </span>
          </div>
          <div className="stat-item">
            <span>Rear Camera:</span>
            <span className="stat-value">
              {latencyData
                .filter(d => d.sensorId === 'cam-02')
                .reduce((avg, d, _, arr) => {
                  if (arr.length === 0) return 0;
                  const sum = arr.reduce((acc, val) => acc + val.latency, 0);
                  return (sum / arr.length).toFixed(1);
                })} ms avg
            </span>
          </div>
          <div className="stat-item">
            <span>RF Scanner:</span>
            <span className="stat-value">
              {latencyData
                .filter(d => d.sensorId === 'rf-01')
                .reduce((avg, d, _, arr) => {
                  if (arr.length === 0) return 0;
                  const sum = arr.reduce((acc, val) => acc + val.latency, 0);
                  return (sum / arr.length).toFixed(1);
                })} ms avg
            </span>
          </div>
          <div className="stat-item">
            <span>Radar Unit:</span>
            <span className="stat-value">
              {latencyData
                .filter(d => d.sensorId === 'radar-01')
                .reduce((avg, d, _, arr) => {
                  if (arr.length === 0) return 0;
                  const sum = arr.reduce((acc, val) => acc + val.latency, 0);
                  return (sum / arr.length).toFixed(1);
                })} ms avg
            </span>
          </div>
          <div className="stat-item">
            <span>Thermal Imager:</span>
            <span className="stat-value">
              {latencyData
                .filter(d => d.sensorId === 'thermal-01')
                .reduce((avg, d, _, arr) => {
                  if (arr.length === 0) return 0;
                  const sum = arr.reduce((acc, val) => acc + val.latency, 0);
                  return (sum / arr.length).toFixed(1);
                })} ms avg
            </span>
          </div>
        </div>
        <div className="chart-insights">
          <div className="insight-item">
            <h4>Latency Analysis</h4>
            <p>
              This chart shows latency trends for each sensor type:<br/>
              • <strong>Good:</strong> <50ms (suitable for real-time tracking)<br/>
              • <strong>Fair:</strong> 50-100ms (acceptable with buffering)<br/>
              • <strong>Poor:</strong> >100ms (may cause tracking issues)<br/>
              • Thermal sensor shows intermittent operation (expected for periodic sensors)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};