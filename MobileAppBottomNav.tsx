import React from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import { UserRole } from '../../types/railway';
import { Train, Building2, Sliders, Cpu, Search, Bell, Home } from 'lucide-react';

export const MobileAppBottomNav: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    navigateToRole,
    currentRole,
    setCurrentRole,
    setSearchModalOpen,
    notificationsOpen,
    setNotificationsOpen,
    alerts
  } = useRailSync();

  const navItems: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'passenger', label: 'Passenger', icon: <Train className="w-4 h-4" /> },
    { role: 'station_staff', label: 'Station', icon: <Building2 className="w-4 h-4" /> },
    { role: 'control_room', label: 'Control', icon: <Sliders className="w-4 h-4" /> },
    { role: 'admin', label: 'Admin', icon: <Cpu className="w-4 h-4" /> }
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1 flex items-center justify-around select-none">
      {/* Home button */}
      <button
        onClick={() => setActiveScreen('home')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition min-w-[50px] min-h-[44px] ${
          activeScreen === 'home'
            ? 'text-blue-600 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div
          className={`p-1 rounded-lg transition ${
            activeScreen === 'home' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
        </div>
        <span className="text-[10px] tracking-tight">Home</span>
      </button>

      {navItems.map(item => {
        const isActive = activeScreen === 'workspace' && currentRole === item.role;
        return (
          <button
            key={item.role}
            onClick={() => navigateToRole(item.role)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition min-w-[50px] min-h-[44px] ${
              isActive
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500'
              }`}
            >
              {item.icon}
            </div>
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}

      <div className="w-[1px] h-6 bg-slate-200" />

      {/* Quick Search on Mobile */}
      <button
        onClick={() => setSearchModalOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 hover:text-slate-800 transition min-w-[48px] min-h-[44px]"
        title="Quick Search"
      >
        <div className="p-1 rounded-lg text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <span className="text-[10px]">Search</span>
      </button>

      {/* Mobile Alerts Bell */}
      <button
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        className="relative flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 hover:text-slate-800 transition min-w-[48px] min-h-[44px]"
        title="Notifications"
      >
        <div className="p-1 rounded-lg text-slate-500 relative">
          <Bell className="w-4 h-4" />
          {alerts.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white font-mono text-[8px] font-bold flex items-center justify-center">
              {alerts.length}
            </span>
          )}
        </div>
        <span className="text-[10px]">Alerts</span>
      </button>
    </nav>
  );
};
