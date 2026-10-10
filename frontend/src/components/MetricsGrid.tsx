import React, { useState, useEffect } from 'react';

export const MetricsGrid = () => {
  // Simulate live-updating metrics
  const [metrics, setMetrics] = useState([
    {
      title: 'Active Sensors',
      value: '4/4',
      unit: '',
      status: 'good',
      icon: '📡',
      trend: 'stable'
    },
    {
      title: 'Detected Objects',
      value: '12',
      unit: '',
      status: 'warning',
      icon: '👁️',
      trend: 'up'
    },
    {
      title: 'Confirmed Tracks',
      value: '8',
      unit: '',
      status: 'good',
      icon: '🎯',
      trend: 'stable'
    },
    {
      title: 'Candidate Groups',
      value: '2',
      unit: '',
      status: 'warning',
      icon: '👥',
      trend: 'up'
    },
    {
      title: 'System Latency',
      value: '42',
      unit: 'ms',
      status: 'good',
      icon: '⚡',
      trend: 'down'
    },
    {
      title: 'Data Freshness',
      value: 'Live',
      unit: '',
      status: 'good',
      icon: '🔴',
      trend: 'stable'
    }
  ]);

  // Simulate live updates every 3-5 seconds
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(prevMetrics => {
        return prevMetrics.map(metric => {
          // Create a copy to modify
          const updated = { ...metric };

          // Simulate random fluctuations for certain metrics
          if (metric.title === 'Detected Objects') {
            const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            const newValue = Math.max(0, parseInt(updated.value) + change);
            updated.value = newValue.toString();
            updated.trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
          } else if (metric.title === 'Confirmed Tracks') {
            const change = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            const newValue = Math.max(0, Math.min(15, parseInt(updated.value) + change));
            updated.value = newValue.toString();
            updated.trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
          } else if (metric.title === 'Candidate Groups') {
            const change = Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            const newValue = Math.max(0, Math.min(5, parseInt(updated.value) + change));
            updated.value = newValue.toString();
            updated.trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
          } else if (metric.title === 'System Latency') {
            const change = Math.random() - 0.5; // -0.5 to 0.5
            const newValue = Math.max(10, Math.max(100, parseInt(updated.value) + change * 10));
            updated.value = Math.round(newValue).toString();
            updated.trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
          }

          // Update status based on values
          if (metric.title === 'Detected Objects' && parseInt(updated.value) > 15) {
            updated.status = 'warning';
          } else if (metric.title === 'Detected Objects' && parseInt(updated.value) > 25) {
            updated.status = 'error';
          } else if (metric.title === 'System Latency' && parseInt(updated.value) > 100) {
            updated.status = 'warning';
          } else if (metric.title === 'System Latency' && parseInt(updated.value) > 200) {
            updated.status = 'error';
          }

          return updated;
        });
      });
    };

    const interval = setInterval(updateMetrics, 3000 + Math.random() * 2000); // 3-5s interval
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="metrics-grid">
      {metrics.map((metric, index) => (
        <div key={index} className="metric-card">
          <div className="metric-header">
            <div>{metric.icon} {metric.title}</div>
            <div className={`metric-status status-${metric.status}`}>
              {metric.status.toUpperCase()}
            </div>
          </div>
          <div className="metric-value">{metric.value}</div>
          {metric.unit && <div className="metric-unit">{metric.unit}</div>}
          <div className="metric-trend">
            {metric.trend === 'up' && (
              <span className="trend-up">↑</span>
            )}
            {metric.trend === 'down' && (
              <span className="trend-down">↓</span>
            )}
            {metric.trend === 'stable' && (
              <span className="trend-stable">→</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};