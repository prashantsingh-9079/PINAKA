import React, { useState } from 'react';
import { EventStats } from './EventStats';

interface Alert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  evidence: string[];
}

interface EventTimelineProps {
  alerts: Alert[];
  filters: {
    timeRange: string;
    severity: string[];
    type: string[];
    status: string[];
  };
  onAlertSelect: (id: string | null) => void;
}

export const EventTimeline = ({ alerts, filters, onAlertSelect }: EventTimelineProps) => {
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  // Filter alerts based on selected filters
  const filteredAlerts = alerts.filter(alert => {
    const timePassed = (Date.now() - new Date(alert.timestamp).getTime()) / 1000;
    const withinTimeRange =
      (filters.timeRange === '1h' && timePassed <= 3600) ||
      (filters.timeRange === '6h' && timePassed <= 21600) ||
      (filters.timeRange === '24h' && timePassed <= 86400) ||
      (filters.timeRange === '7d' && timePassed <= 604800) ||
      (filters.timeRange === '30d' && timePassed <= 2592000) ||
      false; // Default to false if no match

    const matchesSeverity = filters.severity.length === 0 || filters.severity.includes(alert.severity);
    const matchesType = filters.type.length === 0 || filters.type.includes(alert.type);
    const matchesStatus = filters.status.length === 0 || filters.status.includes(alert.status);

    return withinTimeRange && matchesSeverity && matchesType && matchesStatus;
  });

  // Sort by timestamp (newest first)
  const sortedAlerts = [...filteredAlerts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleExpand = (id: string) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };

  const handleReview = (id: string, action: 'reviewed' | 'resolved') => {
    // In a real app, this would update the backend
    // For now, we'll just update local state (would need to be lifted up or use context)
    alert(`Alert ${id} marked as ${action}`);
  };

  const handleAlertSelect = (id: string | null) => {
    onAlertSelect(id);
  };

  if (sortedAlerts.length === 0) {
    return (
      <div className="timeline-empty">
        <div className="empty-icon">🔕</div>
        <h3>No alerts match current filters</h3>
        <p>Try adjusting your filter criteria to see more alerts.</p>
      </div>
    );
  }

  return (
    <div className="event-timeline">
      <div className="timeline-header">
        <h3>Alert Timeline</h3>
        <div className="timeline-actions">
          <button className="btn btn-sm btn-secondary">
            Export Timeline
          </button>
          <button className="btn btn-sm btn-primary ms-2">
            Mark All Reviewed
          </button>
        </div>
      </div>

      <div className="timeline-list">
        {sortedAlerts.map((alert) => (
          <div key={alert.id} className={`timeline-item ${alert.status}`}>
            <div className="timeline-header">
              <div className="timeline-left">
                <div className="alert-type-badge">
                  <span className={`severity-dot severity-${alert.severity}`}></span>
                  {alert.type}
                </span>
                <div className="alert-time">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                  <span className="time-age">
                    {Math.floor((Date.now() - new Date(alert.timestamp).getTime()) / 60000)}m ago
                  </span>
                </div>
              </div>
              <div className="timeline-right">
                <button
                  className={`btn btn-icon ${expandedAlertId === alert.id ? 'btn-active' : ''}`}
                  onClick={() => handleExpand(alert.id)}
                >
                  {expandedAlertId === alert.id ? '▲' : '▼'}
                </button>
              </div>
            </div>

            <div className="timeline-body">
              <div className="alert-message">
                {alert.message}
              </div>
              <div className="alert-evidence">
                <strong>Evidence:</strong>
                {alert.evidence.map((ev, index) => (
                  <span key={index} className="evidence-tag">
                    {ev.startsWith('visual') ? '📷' : ev.startsWith('rf') ? '📡' : ev.startsWith('radar') ? '📻' : '📄'}
                    {ev}
                  </span>
                ))}
              </div>
              <div className="alert-actions">
                <button
                  className={`btn btn-sm ${alert.status === 'new' ? 'btn-warning' : ''}`}
                  onClick={() => handleReview(alert.id, 'reviewed')}
                >
                  {alert.status === 'new' ? 'Review' : 'Reviewed'}
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handleReview(alert.id, 'resolved')}
                >
                  {alert.status === 'resolved' ? 'Resolved' : 'Resolve'}
                </button>
              </div>
            </div>

            {expandedAlertId === alert.id && (
              <div className="timeline-expanded">
                <div className="expanded-section">
                  <h4>Full Details</h4>
                  <div className="detail-row">
                    <span>Alert ID:</span>
                    <span>{alert.id}</span>
                  </div>
                  <div className="detail-row">
                    <span>Timestamp:</span>
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Status:</span>
                    <span className={`status-${alert.status}`}>{alert.status}</span>
                  </div>
                  <div className="detail-row">
                    <span>Confidence:</span>
                    <span>{Math.floor(Math.random() * 100)}%</span>
                  </div>
                </div>

                <div className="expanded-section">
                  <h4>Related Tracks</h4>
                  <div className="related-tracks">
                    {/* Simulate related tracks */}
                    {[`TRK-${Math.floor(Math.random() * 100)}`, `TRK-${Math.floor(Math.random() * 100)}`].map((trackId, index) => (
                      <span key={index} className="track-tag">{trackId}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Make each alert item clickable to select it */}
      <style jsx>{`
        .timeline-item {
          cursor: pointer;
        }
        .timeline-item:hover {
          background-color: rgba(26, 33, 48, 0.3);
        }
      `}</style>
    </div>
  );
};