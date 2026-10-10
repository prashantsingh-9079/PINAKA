import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
} from 'recharts';

export const TrajectoryChart = () => {
  const [trackData, setTrackData] = useState([]);

  // Initialize with some historical data and simulate live updates
  useEffect(() => {
    const initData = [];
    const now = Date.now();
    // Generate 20 seconds of historical data
    for (let i = 20; i >= 0; i--) {
      const time = now - i * 500; // 500ms intervals
      // Simulate a drone flying in a pattern
      const t = i * 0.1; // time parameter
      const x = 50 + 30 * Math.sin(t * 0.5) + 5 * Math.sin(t * 2); // Complex path
      const y = 50 + 25 * Math.cos(t * 0.3) + 3 * Math.sin(t * 1.5);
      const confidence = Math.max(0.7, 0.9 - i * 0.01); // Decreasing confidence with age

      initData.push({
        t: 20 - i, // seconds ago
        x,
        y,
        confidence,
        timestamp: time
      });
    }
    setTrackData(initData);

    // Set up live updates
    const interval = setInterval(() => {
      const now = Date.now();
      const latest = trackData[trackData.length - 1];
      const timeDiff = 0.5; // 500ms

      // Predict next point based on current motion (simple inertia)
      const predictedX = latest.x + (latest.x - trackData[Math.max(0, trackData.length - 2)].x) * 0.8;
      const predictedY = latest.y + (latest.y - trackData[Math.max(0, trackData.length - 2)].y) * 0.8;

      // Add some random walk to make it realistic
      const newX = predictedX + (Math.random() - 0.5) * 2;
      const newY = predictedY + (Math.random() - 0.5) * 2;
      const newConfidence = Math.max(0.6, latest.confidence - 0.02); // Slightly decreasing confidence

      const newPoint = {
        t: latest.t + timeDiff,
        x: newX,
        y: newY,
        confidence: newConfidence,
        timestamp: now
      };

      setTrackData(prev => {
        const updated = [...prev.slice(1), newPoint]; // Keep window of 20 seconds
        // Update time labels
        return updated.map((point, index) => ({
          ...point,
          t: index * 0.5
        }));
      });
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, [trackData]);

  // Calculate predicted path for next 3 seconds
  const predictedPath = [];
  if (trackData.length >= 2) {
    const latest = trackData[trackData.length - 1];
    const prev = trackData[trackData.length - 2];

    // Velocity vector
    const vx = (latest.x - prev.x) / 0.5;
    const vy = (latest.y - prev.y) / 0.5;

    // Simple prediction with increasing uncertainty
    for (let i = 1; i <= 6; i++) { // 6 steps of 0.5s = 3 seconds
      const timeOffset = i * 0.5;
      const uncertainty = 1 + i * 0.2; // Growing uncertainty
      predictedPath.push({
        t: latest.t + timeOffset,
        x: latest.x + vx * timeOffset,
        y: latest.y + vy * timeOffset,
        confidence: Math.max(0.3, latest.confidence - i * 0.08),
        timestamp: latest.timestamp + timeOffset * 1000
      });
    }
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Track Trajectory & Prediction</h3>
        <p className="chart-subtitle">
          Historical path (blue) with predicted trajectory (dashed) and confidence bands
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={trackData}
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
            label={{ value: 'Position (m)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value) => `${value.toFixed(2)} m`}
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '8px', borderRadius: '4px' }}
          />
          <Legend
            verticalAlign="top"
            height={36}
          />

          {/* Confidence band for historical data */}
          <Area
            type="monotone"
            dataKey="y"
            stroke="#ff9800"
            fillOpacity={0.1}
            isRangeArea={true}
            y0Key={({ x, y, confidence }: any) =>
              y - (1 - confidence) * 5 // Confidence interval based on confidence
            }
            y1Key={({ x, y, confidence }: any) =>
              y + (1 - confidence) * 5
            }
          />

          {/* Historical trajectory */}
          <Line
            type="monotone"
            dataKey="x"
            stroke="#2196f3"
            strokeWidth={2}
            name="X Position"
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#00bcd4"
            strokeWidth={2}
            name="Y Position"
          />

          {/* Predicted path */}
          {predictedPath.length > 0 && (
            <>
              <Line
                type="monotone"
                dataKey="x"
                stroke="#ff9800"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Predicted X"
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#ff9800"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Predicted Y"
              />
              {/* Confidence band for prediction */}
              <Area
                type="monotone"
                dataKey="x"
                stroke="#ff9800"
                fillOpacity={0.05}
                isRangeArea={true}
                y0Key={({ x, y, confidence }: any) =>
                  y - (1 - confidence) * 8 // Wider confidence for prediction
                }
                y1Key={({ x, y, confidence }: any) =>
                  y + (1 - confidence) * 8
                }
                data={predictedPath}
              />
            </>
          )}

          {/* Current position indicator */}
          {trackData.length > 0 && (
            <>
              <circle
                cx={trackData[trackData.length - 1].x}
                cy={trackData[trackData.length - 1].y}
                r={4}
                fill="#ff0000"
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-footer">
        <div className="chart-info">
          <span>Current Position: ({trackData.length > 0 ? trackData[trackData.length - 1].x.toFixed(1) : '0.0'}, {trackData.length > 0 ? trackData[trackData.length - 1].y.toFixed(1) : '0.0'}) m</span>
          <span className="ml-4">Prediction Horizon: 3.0s</span>
          <span className="ml-4">Update Rate: 2Hz</span>
        </div>
      </div>
    </div>
  );
};