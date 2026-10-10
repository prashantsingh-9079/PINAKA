import React from 'react';
import { VideoFeed } from '../components/VideoFeed';
import { TrackDetailPanel } from '../components/TrackDetailPanel';
import { TrajectoryChart } from '../charts/TrajectoryChart';
import { MotionAnalytics } from '../charts/MotionAnalytics';
import { ClusteringChart } from '../charts/ClusteringChart';
import { SpeedDistributionChart } from '../charts/SpeedDistributionChart';

export const LiveMonitor = () => {
  return (
    <div className="live-monitor">
      <div className="live-monitor-header">
        <h1>Live Monitor</h1>
        <p className="live-monitor-subtitle">
          Real-time video feed with object detection, tracking, and mathematical analysis
        </p>
      </div>

      <div className="live-monitor-content">
        <div className="video-section">
          <VideoFeed />
        </div>
        <div className="analytics-section">
          <div className="analytics-tabs">
            <button className="tab-btn active">Motion Analysis</button>
            <button className="tab-btn">Trajectory</button>
            <button className="tab-btn">Clustering</button>
            <button className="tab-btn">Speed Distribution</button>
          </div>
          <div className="analytics-tab-content">
            {/* Active tab content would be managed by state in a real implementation */}
            {/* For now, showing all components */}
            <div className="analytics-grid">
              <div className="analytics-panel">
                <TrackDetailPanel />
                <MotionAnalytics />
              </div>
              <div className="analytics-panel">
                <TrajectoryChart />
                <ClusteringChart />
              </div>
              <div className="analytics-panel">
                <SpeedDistributionChart />
                {/* Additional charts could go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};