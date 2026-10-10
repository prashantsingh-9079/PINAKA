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

export const SensorStatusChart = () => {
  const [data, setData] = useState([]);

  // Initialize with some baseline data
  useEffect(() => {
    const initData = [];
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now - i * 1000);
      initData.push({
        name: `${i}s ago`,
        camera: 4,
        rf: 3,
        radar: 2,
        thermal: 1,
      });
    }
    setData(initData);

    // Set up live updates
    const interval = setInterval(() => {
      const now = Date.now();
      const newEntry = {
        name: 'now',
        camera: 4,
        rf: Math.floor(Math.random() * 4) + 2, // 2-5
        radar: Math.floor(Math.random() * 3) + 1, // 1-3
        thermal: Math.random() > 0.7 ? 1 : 0, // 70% chance of 1
      };

      // Shift data and add new entry
      setData(prev => {
        const updated = [...prev.slice(1), newEntry];
        // Update timestamps
        return updated.map((entry, index) => ({
          ...entry,
          name: index === 6 ? 'now' : `${6 - index}s ago`
        }));
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Sensor Health Status</h3>
        <p className="chart-subtitle">
          Live sensor feed status (updates every 2s)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend
            verticalAlign="top"
            height={36}
            margin={{ right: -40, left: -40 }}
            payload={[
              { color: '#00bcd4', name: 'Camera' },
              { color: '#2196f3', name: 'RF' },
              { color: '#ff9800', name: 'Radar' },
              { color: '#9c27b0', name: 'Thermal' }
            ]}
          />
          <Bar dataKey="camera" fill="#00bcd4" radius={[6, 6, 0, 0]} />
          <Bar dataKey="rf" fill="#2196f3" radius={[6, 6, 0, 0]} />
          <Bar dataKey="radar" fill="#ff9800" radius={[6, 6, 0, 0]} />
          <Bar dataKey="thermal" fill="#9c27b0" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};