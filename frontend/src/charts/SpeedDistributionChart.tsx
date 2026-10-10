import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const SpeedDistributionChart = () => {
  const [speedData, setSpeedData] = useState([]);

  // Initialize with some speed distribution data
  useEffect(() => {
    // Generate histogram data for speed distribution
    const bins = Array.from({ length: 20 }, (_, i) => i * 0.5); // 0 to 9.5 m/s in 0.5m/s bins
    const initData = bins.map((binStart, index) => ({
      speedRange: `${binStart}-${binStart + 0.5} m/s`,
      count: Math.floor(Math.random() * 15), // Random count
      binStart,
      binEnd: binStart + 0.5
    }));
    setSpeedData(initData);

    // Simulate updates every 2-4 seconds
    const interval = setInterval(() => {
      // Generate new random distribution
      const newData = bins.map((binStart, index) => ({
        speedRange: `${binStart}-${binStart + 0.5} m/s`,
        count: Math.floor(Math.random() * 20), // Random count
        binStart,
        binEnd: binStart + 0.5
      }));
      setSpeedData(newData);
    }, 2000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  // Calculate statistics
  const totalSamples = speedData.reduce((sum, bin) => sum + bin.count, 0);
  const averageSpeed = speedData.reduce((sum, bin) => {
    const midPoint = (bin.binStart + bin.binEnd) / 2;
    return sum + (midPoint * bin.count);
  }, 0) / (totalSamples > 0 ? totalSamples : 1);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Speed Distribution Analysis</h3>
        <p className="chart-subtitle">
          Histogram of observed speeds over time window
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={speedData}
          margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="speedRange"
            tick={{ fontSize: 10 }}
            label={{ value: 'Speed Range', position: 'insideBottom' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '8px', borderRadius: '4px' }}
          />
          <Legend
            verticalAlign="top"
            height={36}
          />

          <Bar
            dataKey="count"
            fill="#2196f3"
            barSize={0.8}
          />

          {/* Reference line for average speed */}
          {/* This would need to be calculated differently in a real implementation */}
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-footer">
        <div className="chart-info">
          <span>Total Samples: {totalSamples}</span>
          <span className="ml-4">Average Speed: {averageSpeed.toFixed(2)} m/s</span>
        </div>
        <div className="chart-insights">
          <div className="insight-item">
            <h4>Speed Analysis</h4>
            <p>
              This histogram shows the distribution of observed speeds,<br/>
              which can help identify patterns such as:<br/>
              • Hovering (low speed peaks)<br/>
              • Cruising flight (consistent mid-range speeds)<br/>
              • Rapid maneuvering (broad distribution)<br/>
              • Landing/takeoff (bimodal distribution)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};