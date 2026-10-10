import React from 'react';
import { ReportFilters } from '../components/ReportFilters';
import { ReportList } from '../components/ReportList';
import { ReportPreview } from '../components/ReportPreview';

export const Reports = () => {
  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
        <p className="page-subtitle">
          Generated reports, exports, and audit trails
        </p>
      </div>

      <div className="reports-content">
        <div className="reports-sidebar">
          <ReportFilters />
        </div>
        <div className="reports-main">
          <div className="reports-tabs">
            <button className="tab-btn active">Reports</button>
            <button className="tab-btn">Exports</button>
            <button className="tab-btn">Audit Log</button>
          </div>
          <div className="reports-tab-content">
            <ReportList />
            <ReportPreview />
          </div>
        </div>
      </div>
    </div>
  );
};