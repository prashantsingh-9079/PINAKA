import React, { useState } from 'react';
import { PinakaProvider, usePinaka } from './context/PinakaContext';
import { Header } from './components/common/Header';
import { Sidebar, NavigationPage } from './components/common/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { LiveMonitoring } from './components/monitoring/LiveMonitoring';
import { TrackAnalytics } from './components/analytics/TrackAnalytics';
import { SensorManagement } from './components/sensors/SensorManagement';
import { GroupAnalytics } from './components/swarm/GroupAnalytics';
import { ReferenceObjectSearch } from './components/search/ReferenceObjectSearch';
import { ResearchEvaluation } from './components/evaluation/ResearchEvaluation';
import { SettingsPage } from './components/settings/SettingsPage';
import { DefenseLoginPage } from './components/auth/DefenseLoginPage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('overview');
  const { selectTrack, settings, currentUser, login } = usePinaka();

  // If officer is not logged in, show Military & Government Authentication Portal
  if (!currentUser) {
    return <DefenseLoginPage onLoginSuccess={(session) => login(session)} />;
  }

  const handleNavigateToTrack = (trackId: string) => {
    selectTrack(trackId);
    setCurrentPage('analytics');
  };

  const handleNavigateToMonitoring = () => {
    setCurrentPage('monitoring');
  };

  const themeClass = 
    settings.theme === 'deep-abyss' 
      ? 'bg-[#010307]' 
      : settings.theme === 'radar-emerald' 
      ? 'bg-[#020d09]' 
      : settings.theme === 'solar-amber' 
      ? 'bg-[#0d0903]' 
      : 'bg-[#040711]';

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-tactical ${themeClass}`}>
      {/* Aerospace Header */}
      <Header />

      {/* Main Workspace with Tactical Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={(page) => setCurrentPage(page)} 
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-6 space-y-4 max-w-[1920px] mx-auto w-full">
          {currentPage === 'overview' && (
            <OverviewDashboard 
              onNavigateToMonitoring={handleNavigateToMonitoring} 
              onNavigateToTrack={handleNavigateToTrack} 
            />
          )}

          {currentPage === 'monitoring' && (
            <LiveMonitoring />
          )}

          {currentPage === 'analytics' && (
            <TrackAnalytics />
          )}

          {currentPage === 'sensors' && (
            <SensorManagement />
          )}

          {currentPage === 'groups' && (
            <GroupAnalytics />
          )}

          {currentPage === 'search' && (
            <ReferenceObjectSearch />
          )}

          {currentPage === 'evaluation' && (
            <ResearchEvaluation />
          )}

          {currentPage === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <PinakaProvider>
      <AppContent />
    </PinakaProvider>
  );
}

export default App;
