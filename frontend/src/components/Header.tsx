import React from 'react';
import { useState } from 'react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          PINAKA Dashboard
        </div>
        <div className="header-actions">
          <button className="btn btn-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
          <div className="status-indicator status-online">
            <span className="status-dot"></span>
            Live
          </div>
          <button className="btn btn-secondary">
            <span>👤</span> Operator
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sidebar sidebar-mobile">
          <nav className="sidebar-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="/" className="nav-link">
                  <span className="nav-link-icon">🏠</span>
                  Overview
                </a>
              </li>
              <li className="nav-item">
                <a href="/live-monitor" className="nav-link">
                  <span className="nav-link-icon">📺</span>
                  Live Monitor
                </a>
              </li>
              <li className="nav-item">
                <a href="/tracks" className="nav-link">
                  <span className="nav-link-icon">🎯</span>
                  Tracks
                </a>
              </li>
              <li className="nav-item">
                <a href="/group-analytics" className="nav-link">
                  <span className="nav-link-icon">👥</span>
                  Group Analytics
                </a>
              </li>
              <li className="nav-item">
                <a href="/sensor-health" className="nav-link">
                  <span className="nav-link-icon">📡</span>
                  Sensor Health
                </a>
              </li>
              <li className="nav-item">
                <a href="/object-search" className="nav-link">
                  <span className="nav-link-icon">🔍</span>
                  Object Search
                </a>
              </li>
              <li className="nav-item">
                <a href="/events-alerts" className="nav-link">
                  <span className="nav-link-icon">🚨</span>
                  Events & Alerts
                </a>
              </li>
              <li className="nav-item">
                <a href="/evaluation" className="nav-link">
                  <span className="nav-link-icon">📊</span>
                  Evaluation
                </a>
              </li>
              <li className="nav-item">
                <a href="/reports" className="nav-link">
                  <span className="nav-link-icon">📄</span>
                  Reports
                </a>
              </li>
              <li className="nav-item">
                <a href="/settings" className="nav-link">
                  <span className="nav-link-icon">⚙️</span>
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};