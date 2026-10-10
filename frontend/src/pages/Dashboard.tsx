import React from 'react';
import { MetricsGrid } from '../components/MetricsGrid';
import { SensorStatusChart } from '../charts/SensorStatusChart';
import { TrackList } from '../components/TrackList';
import { AlertPanel } from '../components/AlertPanel';
import { SystemOverview } from '../components/SystemOverview';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>PINAKA Operations Overview</h1>
        <p className="dashboard-subtitle">
          Real-time multi-sensor drone detection, tracking & swarm analytics
        </p>
      </div>

      <SystemOverview />

      <div className="dashboard-content">
        <div className="dashboard-left">
          <MetricsGrid />
          <AlertPanel title="Recent Alerts" />
        </div>
        <div className="dashboard-right">
          <SensorStatusChart />
          <TrackList title="Active Tracks" />
        </div>
      </div>
    </div>
  );
};