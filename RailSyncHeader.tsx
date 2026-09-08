import React, { useState, useEffect } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import { UserRole } from '../../types/railway';
import {
  Train,
  Building2,
  Sliders,
  Cpu,
  Mic,
  Sparkles,
  Activity,
  RotateCcw,
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Home
} from 'lucide-react';

export const RailSyncHeader: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    navigateToRole,
    currentRole,
    setCurrentRole,
    networkHealth,
    setCopilotOpen,
    setVoiceModalOpen,
    resetCorridor,
    setSearchModalOpen,
    notificationsOpen,
    setNotificationsOpen,
    sidebarOpen,
    setSidebarOpen,
    alerts
  } = useRailSync();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(6);

  // Freshness live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo(prev => (prev >= 24 ? 4 : prev + 2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { role: 'passenger', label: 'Passenger', icon: <Train className="w-3.5 h-3.5" />, desc: 'Journey ETA & Digital Ticket' },
    { role: 'station_staff', label: 'Station Staff', icon: <Building2 className="w-3.5 h-3.5" />, desc: 'Platform & Concourse Operations' },
    { role: 'control_room', label: 'Control Room', icon: <Sliders className="w-3.5 h-3.5" />, desc: 'Network Map & Delay Propagation' },
    { role: 'admin', label: 'Admin / AI', icon: <Cpu className="w-3.5 h-3.5" />, desc: 'Model Performance & Telemetry' }
  ];

  const currentRoleMeta = roles.find(r => r.role === currentRole) || roles[0];

  return (
    <header className="bg-white border-b border-slate-200 shrink-0 z-40 text-slate-800 shadow-2xs select-none">
      <div className="h-14 px-3 sm:px-5 flex items-center justify-between gap-3">
        {/* Left: RailSync Professional Wordmark + Active Workspace Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200/80 shadow-2xs"
            title="Toggle Sidebar Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Professional Wordmark with Subtle Railway Concept */}
          <button
            onClick={() => setActiveScreen('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer hover:opacity-95 transition"
            title="Go to RailSync Home Page"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-all">
              {/* Geometric railway dual-track glyph */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="4" x2="4" y2="20" />
                <line x1="20" y1="4" x2="20" y2="20" />
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 font-sans">
                Rail<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">Sync</span>
              </span>
              <span className="text-slate-300 font-light hidden sm:inline">|</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 tracking-wide uppercase font-mono hidden sm:inline border border-slate-200/60">
                {activeScreen === 'home'
                  ? 'Home'
                  : activeScreen === 'category_select'
                  ? 'Choose Role'
                  : currentRoleMeta.label}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Role Switcher Tabs */}
        <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 gap-1">
          <button
            onClick={() => setActiveScreen('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition whitespace-nowrap cursor-pointer ${
              activeScreen === 'home'
                ? 'bg-white text-indigo-700 font-bold shadow-xs border border-indigo-200/80 ring-1 ring-indigo-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
            title="RailSync Home Overview"
          >
            <Home className={`w-3.5 h-3.5 ${activeScreen === 'home' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>Home</span>
          </button>

          {roles.map(r => {
            const isActive = activeScreen === 'workspace' && currentRole === r.role;
            const activeColorClasses =
              r.role === 'passenger'
                ? 'bg-white text-sky-700 font-bold shadow-xs border border-sky-300 ring-1 ring-sky-100'
                : r.role === 'station_staff'
                ? 'bg-white text-emerald-700 font-bold shadow-xs border border-emerald-300 ring-1 ring-emerald-100'
                : r.role === 'control_room'
                ? 'bg-white text-violet-700 font-bold shadow-xs border border-violet-300 ring-1 ring-violet-100'
                : 'bg-white text-amber-700 font-bold shadow-xs border border-amber-300 ring-1 ring-amber-100';

            const iconColors =
              r.role === 'passenger'
                ? 'text-sky-600'
                : r.role === 'station_staff'
                ? 'text-emerald-600'
                : r.role === 'control_room'
                ? 'text-violet-600'
                : 'text-amber-600';

            return (
              <button
                key={r.role}
                onClick={() => navigateToRole(r.role)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? activeColorClasses
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
                }`}
                title={r.desc}
              >
                <span className={isActive ? iconColors : 'text-slate-400'}>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Global Command Search, Freshness Indicator, AI Copilot, Notifications & Profile */}
        <div className="flex items-center gap-2">
          {/* Universal Search Command Bar (Cmd+K) */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-500 transition shadow-2xs group min-w-[170px]"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
            <span className="text-slate-400 text-[11px]">⌘K Search...</span>
          </button>

          {/* Data Freshness Indicator */}
          <div
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono shadow-2xs"
            title="Real-time Telemetry & Stream Sync"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">Live Telemetry</span>
          </div>

          {/* Voice Assistant */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-200/80 text-sky-800 text-xs font-semibold transition shadow-2xs"
            title="Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden md:inline text-[11px]">Voice</span>
          </button>

          {/* AI Copilot Button */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-xs font-bold transition shadow-md shadow-indigo-500/25 cursor-pointer"
            title="RailSync AI Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin-slow" />
            <span className="hidden sm:inline text-[11px]">AI Copilot</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition relative shadow-2xs cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-xs">
                {alerts.length}
              </span>
            )}
          </button>

          {/* Reset Corridor Button */}
          <button
            onClick={resetCorridor}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-indigo-600 text-xs transition shadow-2xs cursor-pointer"
            title="Reset Simulation State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Profile & Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 p-1 pl-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white text-[11px] font-bold flex items-center justify-center font-mono shadow-2xs">
                RS
              </div>
              <span className="hidden sm:inline text-slate-800 text-[11px] font-medium">Aayush</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-800">Aayush Sharma</p>
                  <p className="text-[11px] text-slate-500 capitalize">{currentRole.replace('_', ' ')}</p>
                </div>

                <div className="py-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Workspace
                  </div>
                  {roles.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setCurrentRole(r.role);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                        currentRole === r.role
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {r.icon}
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
