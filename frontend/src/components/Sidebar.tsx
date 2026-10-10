import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>PINAKA</h2>
        <p className="sidebar-tagline">Multi-Sensor AI Dashboard</p>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" end activeClassName="active">
              <span className="nav-link-icon">🏠</span>
              Overview
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/live-monitor" activeClassName="active">
              <span className="nav-link-icon">📺</span>
              Live Monitor
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/tracks" activeClassName="active">
              <span className="nav-link-icon">🎯</span>
              Tracks
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/group-analytics" activeClassName="active">
              <span className="nav-link-icon">👥</span>
              Group Analytics
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/sensor-health" activeClassName="active">
              <span className="nav-link-icon">📡</span>
              Sensor Health
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/object-search" activeClassName="active">
              <span className="nav-link-icon">🔍</span>
              Object Search
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/events-alerts" activeClassName="active">
              <span className="nav-link-icon">🚨</span>
              Events & Alerts
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/evaluation" activeClassName="active">
              <span className="nav-link-icon">📊</span>
              Evaluation
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/reports" activeClassName="active">
              <span className="nav-link-icon">📄</span>
              Reports
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/settings" activeClassName="active">
              <span className="nav-link-icon">⚙️</span>
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="status-indicator status-online">
          <span className="status-dot"></span>
          System Online
        </div>
        <small className="sidebar-version">v0.1.0</small>
      </div>
    </aside>
  );
};