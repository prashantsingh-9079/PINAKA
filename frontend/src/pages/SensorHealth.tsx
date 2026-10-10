import React, { useState } from 'react';
import { SensorGrid } from '../components/SensorGrid';
import { SensorDetails } from '../components/SensorDetails';
import { SensorLatencyChart } from '../charts/SensorLatencyChart';

export const SensorHealth = () => {
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  return (
    <div className="sensor-health-page">
      <div className="page-header">
        <h1>Sensor Health</h1>
        <p className="page-subtitle">
          Monitoring status, latency, and quality of all sensor feeds
        </p>
      </div>

      <div className="sensor-health-content">
        <div className="sensor-sidebar">
          <SensorGrid
            selectedSensorId={selectedSensorId}
            onSensorSelect={setSelectedSensorId}
          />
        </div>
        <div className="sensor-main">
          {selectedSensorId ? (
            <SensorDetails
              selectedSensorId={selectedSensorId}
              onSensorSelect={setSelectedSensorId}
            />
          ) : (
            <div className="placeholder-content">
              <h2>Sensor Overview</h2>
              <p>Select a sensor from the list to view detailed status and diagnostics.</p>
            </div>
          )}
          <SensorLatencyChart />
        </div>
      </div>
    </div>
  );
};