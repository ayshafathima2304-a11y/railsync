import React from 'react';
import { RailSyncProvider, useRailSync } from './context/RailSyncContext';
import { RailSyncHeader } from './components/common/RailSyncHeader.tsx';
import { RailSyncSidebar } from './components/common/RailSyncSidebar';
import { AppStatusBar } from './components/common/AppStatusBar';
import { MobileAppBottomNav } from './components/common/MobileAppBottomNav';
import { UniversalSearchModal } from './components/common/UniversalSearchModal';
import { NotificationCenter } from './components/common/NotificationCenter';
import { PassengerDashboard } from './components/passenger/PassengerDashboard';
import { StationStaffDashboard } from './components/station/StationStaffDashboard';
import { ControlRoomDashboard } from './components/control/ControlRoomDashboard';
import { AdminAIDashboard } from './components/admin/AdminAIDashboard';
import { CopilotModal } from './components/common/CopilotModal';
import { VoiceAssistantModal } from './components/common/VoiceAssistantModal';
import { SIHWalkthroughModal } from './components/common/SIHWalkthroughModal';
import { CategoryAccessGuardModal } from './components/common/CategoryAccessGuardModal';
import { RailSyncHomePage } from './components/home/RailSyncHomePage';
import { CategorySelectionScreen } from './components/home/CategorySelectionScreen';

const DashboardContent: React.FC = () => {
  const { currentRole, activeScreen } = useRailSync();

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Native App Titlebar */}
      <RailSyncHeader />

      {/* Main Content Area */}
      {activeScreen === 'home' && (
        <div className="flex-1 min-w-0 h-full overflow-y-auto overscroll-contain bg-slate-50/70 pb-18 sm:pb-6">
          <RailSyncHomePage />
        </div>
      )}

      {activeScreen === 'category_select' && (
        <div className="flex-1 min-w-0 h-full overflow-y-auto overscroll-contain bg-slate-50/70 pb-18 sm:pb-6">
          <CategorySelectionScreen />
        </div>
      )}

      {activeScreen === 'workspace' && (
        <div className="flex-1 flex min-w-0 overflow-hidden relative">
          {/* Desktop Sidebar Rail */}
          <RailSyncSidebar />

          {/* Scrollable Canvas Surface */}
          <main className="flex-1 min-w-0 h-full overflow-y-auto overscroll-contain bg-slate-50/70 pb-18 sm:pb-3">
            {currentRole === 'passenger' && <PassengerDashboard />}
            {currentRole === 'station_staff' && <StationStaffDashboard />}
            {currentRole === 'control_room' && <ControlRoomDashboard />}
            {currentRole === 'admin' && <AdminAIDashboard />}
          </main>
        </div>
      )}

      {/* Mobile Native Bottom Navigation */}
      <MobileAppBottomNav />

      {/* Desktop Native App Status Bar */}
      <AppStatusBar />

      {/* Global Modals & Palettes */}
      <UniversalSearchModal />
      <NotificationCenter />
      <CopilotModal />
      <VoiceAssistantModal />
      <SIHWalkthroughModal />
      <CategoryAccessGuardModal />
    </div>
  );
};

export default function App() {
  return (
    <RailSyncProvider>
      <DashboardContent />
    </RailSyncProvider>
  );
}
