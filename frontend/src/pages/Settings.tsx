import React from 'react';
import { SettingsForm } from '../components/SettingsForm';
import { SystemInfo } from '../components/SystemInfo';

export const Settings = () => {
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">
          System configuration, user preferences, and administration
        </p>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <SystemInfo />
        </div>
        <div className="settings-main">
          <SettingsForm />
        </div>
      </div>
    </div>
  );
};