import React from 'react';

interface Track {
  id: string;
  class: string;
  confidence: number;
  lastSeen: string;
  sensorSource: string[];
  status: 'tentative' | 'confirmed' | 'coasting' | 'lost';
}

export const TrackList = ({ title }: { title: string }) => {
  // Sample tracks data
  const tracks: Track[] = [
    {
      id: 'TRK-001',
      class: 'drone',
      confidence: 0.92,
      lastSeen: 'just now',
      sensorSource: ['camera-01', 'rf-01'],
      status: 'confirmed'
    },
    {
      id: 'TRK-002',
      class: 'drone',
      confidence: 0.78,
      lastSeen: '2s ago',
      sensorSource: ['camera-01'],
      status: 'confirmed'
    },
    {
      id: 'TRK-003',
      class: 'unknown',
      confidence: 0.65,
      lastSeen: '5s ago',
      sensorSource: ['rf-01'],
      status: 'tentative'
    },
    {
      id: 'TRK-004',
      class: 'bird',
      confidence: 0.91,
      lastSeen: '8s ago',
      sensorSource: ['camera-01', 'thermal-01'],
      status: 'confirmed'
    }
  ];

  return (
    <div className="track-list">
      <div className="panel-header">
        <h3>{title}</h3>
        <button className="btn btn-sm btn-secondary">View All Tracks</button>
      </div>
      <div className="track-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Track ID</th>
              <th>Class</th>
              <th>Confidence</th>
              <th>Last Seen</th>
              <th>Sensors</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track) => (
              <tr key={track.id}>
                <td>{track.id}</td>
                                <td>{track.class}</td>
                <td>{(track.confidence * 100).toFixed(0)}%</td>
                <td>{track.lastSeen}</td>
                <td>
                  {track.sensorSource.map((sensor, index) => (
                    <span key={index} className="sensor-badge">
                      {sensor}
                    </span>
                  ))}
                </td>
                <td>
                  <span className={`status-dot status-${track.status === 'confirmed' ? 'online' : track.status === 'tentative' ? 'degraded' : 'offline'}`}></span>
                  {track.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};