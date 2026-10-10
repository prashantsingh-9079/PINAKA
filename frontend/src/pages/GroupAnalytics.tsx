import React from 'react';
import { GroupOverview } from '../components/GroupOverview';
import { GroupCharts } from '../charts/GroupCharts';
import { GroupTable } from '../components/GroupTable';

export const GroupAnalytics = () => {
  return (
    <div className="group-analytics-page">
      <div className="page-header">
        <h1>Group Analytics</h1>
        <p className="page-subtitle">
          Analysis of candidate groups and swarm behavior patterns
        </p>
      </div>

      <div className="group-analytics-content">
        <div className="group-overview-section">
          <GroupOverview />
        </div>
        <div className="group-details-section">
          <div className="group-tabs">
            <button className="tab-btn active">Overview</button>
            <button className="tab-btn">Metrics</button>
            <button className="tab-btn">Tracks</button>
            <button className="tab-btn">Alerts</button>
          </div>
          <div className="group-tab-content">
            <GroupCharts />
            <GroupTable />
          </div>
        </div>
      </div>
    </div>
  );
};