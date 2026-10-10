import React, { useState, useEffect } from 'react';

export const VideoFeed = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="video-feed-container">
      <div className="video-feed">
        {/* In a real app, this would be a video element or canvas showing the feed */}
        <div className="video-feed-placeholder">
          <div className="video-feed-content">
            <div className="video-status">
              <span className="status-dot status-online"></span>
              Live Feed
            </div>
            <div className="video-resolution">1920x1080 @ 30 FPS</div>
            <div className="video-sensor-sources">
              <span className="sensor-badge">camera-01</span>
              <span className="sensor-badge">rf-01</span>
            </div>
          </div>
          {/* Simulated video frame with detections */}
          <div className="video-frame">
            {/* Detection boxes would be rendered here */}
            <div className="detection-box" style={{ top: '20%', left: '30%', width: '15%', height: '20%' }}>
              <div className="detection-label">drone 92%</div>
            </div>
            <div className="detection-box" style={{ top: '50%', left: '60%', width: '12%', height: '18%' }}>
              <div className="detection-label">unknown 65%</div>
            </div>
          </div>
        </div>
      </div>
      <div className="video-controls">
        <button className="btn btn-icon" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="btn btn-icon">
          📷
        </button>
        <button className="btn btn-icon">
          ⏺
        </button>
        <div className="video-time">{currentTime.toFixed(1)}s</div>
      </div>
    </div>
  );
};