import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { LiveMonitor } from './pages/LiveMonitor';
import { Tracks } from './pages/Tracks';
import { GroupAnalytics } from './pages/GroupAnalytics';
import { SensorHealth } from './pages/SensorHealth';
import { ObjectSearch } from './pages/ObjectSearch';
import { EventsAlerts } from './pages/EventsAlerts';
import { Evaluation } from './pages/Evaluation';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/live-monitor" element={<LiveMonitor />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/group-analytics" element={<GroupAnalytics />} />
            <Route path="/sensor-health" element={<SensorHealth />} />
            <Route path="/object-search" element={<ObjectSearch />} />
            <Route path="/events-alerts" element={<EventsAlerts />} />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;