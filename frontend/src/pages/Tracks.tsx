import React from 'react';
import { TrackTable } from '../components/TrackTable';
import { TrackFilters } from '../components/TrackFilters';
import { TrackStats } from '../components/TrackStats';

export const Tracks = () => {
  return (
    <div className="tracks-page">
      <div className="page-header">
        <h1>Tracks</h1>
        <p className="page-subtitle">
          Detailed view of all detected and tracked objects
        </p>
      </div>

      <div className="tracks-content">
        <div className="tracks-sidebar">
          <TrackFilters />
          <TrackStats />
        </div>
        <div className="tracks-main">
          <TrackTable />
        </div>
      </div>
    </div>
  );
};