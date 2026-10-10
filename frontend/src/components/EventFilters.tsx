import React, { useState } from 'react';

interface FilterOptions {
  timeRange: string;
  severity: string[];
  type: string[];
  status: string[];
}

interface EventFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const EventFilters = ({ filters, onFiltersChange }: EventFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const alertTypes = [
    'Unusual Group Motion',
    'Sensor Disagreement',
    'Track Lost',
    'New Candidate Track',
    'Group Size Changed',
    'Low Confidence Detection',
    'Sensor Degraded',
    'Multiple Tracks Lost'
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setLocalFilters(prev => {
      const newFilters = { ...prev };
      if (name === 'timeRange') {
        newFilters.timeRange = value as string;
      } else if (name === 'severity' || name === 'type' || name === 'status') {
        const current = prev[name] as string[] || [];
        newFilters[name] = checked
          ? [...current, value]
          : current.filter((v: string) => v !== value);
      }
      return newFilters;
    });
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters: FilterOptions = {
      timeRange: '24h',
      severity: ['info', 'warning', 'error'],
      type: [],
      status: ['new', 'reviewed', 'resolved']
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="event-filters">
      <div className="filters-header">
        <h3>Filter Alerts</h3>
      </div>

      <div className="filter-group">
        <label className="filter-label">Time Range</label>
        <select
          name="timeRange"
          value={localFilters.timeRange}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="1h">Last Hour</option>
          <option value="6h">Last 6 Hours</option>
          <option value="24h" selected>Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Severity</label>
        <div className="filter-checkboxes">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              name="severity"
              value="info"
              checked={localFilters.severity.includes('info')}
              onChange={handleFilterChange}
            />
            Info
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              name="severity"
              value="warning"
              checked={localFilters.severity.includes('warning')}
              onChange={handleFilterChange}
            />
            Warning
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              name="severity"
              value="error"
              checked={localFilters.severity.includes('error')}
              onChange={handleFilterChange}
            />
            Error
          </label>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Status</label>
        <div className="filter-checkboxes">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              name="status"
              value="new"
              checked={localFilters.status.includes('new')}
              onChange={handleFilterChange}
            />
            New
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              name="status"
              value="reviewed"
              checked={localFilters.status.includes('reviewed')}
              onChange={handleFilterChange}
            />
            Reviewed
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              name="status"
              value="resolved"
              checked={localFilters.status.includes('resolved')}
              onChange={handleFilterChange}
            />
            Resolved
          </label>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Alert Type</label>
        <div className="filter-checkboxes">
          {alertTypes.map(type => (
            <label key={type} className="filter-checkbox">
              <input
                type="checkbox"
                name="type"
                value={type}
                checked={localFilters.type.includes(type)}
                onChange={handleFilterChange}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn btn-sm btn-secondary" onClick={handleResetFilters}>
          Reset Filters
        </button>
        <button className="btn btn-sm btn-primary ms-2" onClick={handleApplyFilters}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};