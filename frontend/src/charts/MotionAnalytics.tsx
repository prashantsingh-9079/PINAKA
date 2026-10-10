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

export const MotionAnalytics = () => {
  const [motionData, setMotionData] = useState([]);

  // Initialize with some historical data and simulate live updates
  useEffect(() => {
    const initData = [];
    const now = Date.now();
    // Generate 20 seconds of historical data
    for (let i = 20; i >= 0; i--) {
      const time = now - i * 500; // 500ms intervals
      // Simulate a drone flying in a complex pattern
      const t = i * 0.1; // time parameter
      // Create a motion pattern with varying speed
      const speed = 5 + 3 * Math.sin(t * 0.5) + 2 * Math.sin(t * 1.3); // 5-10 m/s
      const acceleration = 1.5 * Math.cos(t * 0.5) + 0.8 * Math.sin(t * 1.3); // -2.3 to 2.3 m/s²
      const jerk = -0.75 * Math.sin(t * 0.5) + 1.04 * Math.cos(t * 1.3); // -1.79 to 1.79 m/s³

      initData.push({
        t: 20 - i, // seconds ago
        speed,
        acceleration,
        jerk,
        timestamp: time
      });
    }
    setMotionData(initData);

    // Set up live updates
    const interval = setInterval(() => {
      const now = Date.now();
      const latest = motionData[motionData.length - 1];
      const prev = motionData[Math.max(0, motionData.length - 2)];
      const timeDiff = 0.5; // 500ms

      // Simple motion model with some randomness
      const newSpeed = latest.speed + (Math.random() - 0.5) * 0.5;
      const newAcceleration = latest.acceleration + (Math.random() - 0.5) * 0.3;
      const newJerk = latest.jerk + (Math.random() - 0.5) * 0.2;

      const newPoint = {
        t: latest.t + timeDiff,
        speed: Math.max(0, newSpeed), // Don't allow negative speed
        acceleration: newAcceleration,
        jerk: newJerk,
        timestamp: now
      };

      setMotionData(prev => {
        const updated = [...prev.slice(1), newPoint]; // Keep window of 20 seconds
        // Update time labels
        return updated.map((point, index) => ({
          ...point,
          t: index * 0.5
        }));
      });
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, [motionData]);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Advanced Motion Analysis</h3>
        <p className="chart-subtitle">
          Speed, acceleration, and jerk analysis with mathematical interpretation
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={motionData}
          margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 12 }}
            label={{ value: 'Time (s ago)', position: 'insideBottom' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '8px', borderRadius: '4px' }}
          />
          <Legend
            verticalAlign="top"
            height={36}
          />

          {/* Speed (m/s) */}
          <Line
            type="monotone"
            dataKey="speed"
            stroke="#2196f3"
            strokeWidth={2}
            name="Speed (m/s)"
          />

          {/* Acceleration (m/s²) */}
          <Line
            type="monotone"
            dataKey="acceleration"
            stroke="#ff9800"
            strokeWidth={2}
            name="Acceleration (m/s²)"
          />

          {/* Jerk (m/s³) - rate of change of acceleration */}
          <Line
            type="monotone"
            dataKey="jerk"
            stroke="#9c27b0"
            strokeWidth={2}
            name="Jerk (m/s³)"
          />

          {/* Reference lines */}
          <Line type="horizontal" y={0} stroke="#666" strokeDasharray="2 2" />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-footer">
        <div className="chart-info">
          {motionData.length > 0 && (
            <>
              <span>Current Speed: {motionData[motionData.length - 1].speed.toFixed(2)} m/s</span>
              <span className="ml-4">Acceleration: {motionData[motionData.length - 1].acceleration.toFixed(2)} m/s²</span>
              <span className="ml-4">Jerk: {motionData[motionData.length - 1].jerk.toFixed(2)} m/s³</span>
            </>
          )}
        </div>
        <div className="chart-insights">
          <div className="insight-item">
            <h4>Mathematical Interpretation</h4>
            <p>
              <strong>Speed:</strong> Magnitude of velocity vector<br/>
              <strong>Acceleration:</strong> Rate of change of speed (2nd derivative of position)<br/>
              <strong>Jerk:</strong> Rate of change of acceleration (3rd derivative of position)<br/>
              High jerk values indicate rapid changes in acceleration, which may suggest maneuvering or instability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};