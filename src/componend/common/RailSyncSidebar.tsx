import React, { useState } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import { UserRole } from '../../types/railway';
import { CATEGORIES_CONFIG } from '../../services/categoryPermissions';
import {
  Train,
  MapPin,
  Clock,
  GitFork,
  AlertTriangle,
  Gauge,
  Building2,
  Sliders,
  Activity,
  Sparkles,
  Mic,
  Settings,
  User,
  Compass,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  CreditCard,
  Volume2,
  Users,
  Radio,
  FileText,
  Lock,
  ArrowRightLeft,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  Info
} from 'lucide-react';

interface CategoryNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  action: () => void;
  active: boolean;
}

export const RailSyncSidebar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    sidebarOpen,
    setSidebarOpen,
    setCopilotOpen,
    setVoiceModalOpen,
    setSihModalOpen,
    passengerTab,
    setPassengerTab,
    stationTab,
    setStationTab,
    controlTab,
    setControlTab,
    adminTab,
    setAdminTab,
    networkHealth,
    smsSubscriptions,
    platformAssignments,
    paAnnouncements,
    cautionOrders,
    precedenceOrders,
    porterRequests,
    securityPolicies,
    bookings,
    alerts
  } = useRailSync();

  const [roleSwitchModalOpen, setRoleSwitchModalOpen] = useState(false);

  const categoryMeta = CATEGORIES_CONFIG[currentRole];

  // Passenger Navigation Items (Strictly Passenger Only)
  const passengerItems: CategoryNavItem[] = [
    {
      id: 'home',
      label: 'Home & Active Train',
      icon: <Train className="w-4 h-4 text-blue-600" />,
      action: () => setPassengerTab('home'),
      active: passengerTab === 'home'
    },
    {
      id: 'details',
      label: 'Train Details & Recovery',
      icon: <Clock className="w-4 h-4 text-indigo-600" />,
      action: () => setPassengerTab('details'),
      active: passengerTab === 'details'
    },
    {
      id: 'map',
      label: 'Live Corridor Map',
      icon: <MapPin className="w-4 h-4 text-emerald-600" />,
      action: () => setPassengerTab('map'),
      active: passengerTab === 'map'
    },
    {
      id: 'bookings',
      label: 'My PNR & Digital Wallet',
      icon: <CreditCard className="w-4 h-4 text-blue-600" />,
      badge: `${bookings.length}`,
      badgeColor: 'bg-blue-100 text-blue-700',
      action: () => setPassengerTab('bookings'),
      active: passengerTab === 'bookings'
    },
    {
      id: 'amenities',
      label: 'Station Amenities & Crowd',
      icon: <Building2 className="w-4 h-4 text-slate-600" />,
      action: () => setPassengerTab('amenities'),
      active: passengerTab === 'amenities'
    },
    {
      id: 'sms',
      label: 'Live SMS / WhatsApp Alerts',
      icon: <Radio className="w-4 h-4 text-emerald-600" />,
      badge: `${smsSubscriptions.length} Active`,
      badgeColor: 'bg-emerald-100 text-emerald-700',
      action: () => setPassengerTab('sms'),
      active: passengerTab === 'sms'
    }
  ];

  // Station Staff Navigation Items (Strictly Station Staff Only)
  const stationStaffItems: CategoryNavItem[] = [
    {
      id: 'overview',
      label: 'Station Terminal Overview',
      icon: <Building2 className="w-4 h-4 text-emerald-600" />,
      action: () => setStationTab('overview'),
      active: stationTab === 'overview'
    },
    {
      id: 'platforms',
      label: 'Platform Allocation Matrix',
      icon: <Layers className="w-4 h-4 text-blue-600" />,
      badge: `${platformAssignments.filter(p => p.isReassigned).length} Overrides`,
      badgeColor: 'bg-amber-100 text-amber-800',
      action: () => setStationTab('platforms'),
      active: stationTab === 'platforms'
    },
    {
      id: 'dwell',
      label: 'Dwell Time & Turnaround',
      icon: <Clock className="w-4 h-4 text-purple-600" />,
      action: () => setStationTab('dwell'),
      active: stationTab === 'dwell'
    },
    {
      id: 'crowd',
      label: 'Concourse Crowd & Gates',
      icon: <Users className="w-4 h-4 text-amber-600" />,
      action: () => setStationTab('crowd'),
      active: stationTab === 'crowd'
    },
    {
      id: 'pa',
      label: 'Multi-Lingual Station PA',
      icon: <Volume2 className="w-4 h-4 text-indigo-600" />,
      badge: `${paAnnouncements.length}`,
      badgeColor: 'bg-indigo-100 text-indigo-700',
      action: () => setStationTab('pa'),
      active: stationTab === 'pa'
    },
    {
      id: 'porter',
      label: 'Wheelchair & Porter Service',
      icon: <HelpCircle className="w-4 h-4 text-rose-600" />,
      badge: `${porterRequests.length} Dispatches`,
      badgeColor: 'bg-rose-100 text-rose-700',
      action: () => setStationTab('porter'),
      active: stationTab === 'porter'
    }
  ];

  // Control Room Navigation Items (Strictly Control Room Only)
  const controlRoomItems: CategoryNavItem[] = [
    {
      id: 'network',
      label: 'Corridor Dispatch Schematic',
      icon: <Sliders className="w-4 h-4 text-amber-600" />,
      action: () => setControlTab('network'),
      active: controlTab === 'network'
    },
    {
      id: 'precedence',
      label: 'Dynamic Precedence & Loops',
      icon: <GitFork className="w-4 h-4 text-blue-600" />,
      badge: `${precedenceOrders.length} Active`,
      badgeColor: 'bg-blue-100 text-blue-700',
      action: () => setControlTab('precedence'),
      active: controlTab === 'precedence'
    },
    {
      id: 'tsr',
      label: 'Caution Orders & TSR (Speed)',
      icon: <Gauge className="w-4 h-4 text-rose-600" />,
      badge: `${cautionOrders.filter(c => c.status === 'ACTIVE').length} TSR`,
      badgeColor: 'bg-rose-100 text-rose-700',
      action: () => setControlTab('tsr'),
      active: controlTab === 'tsr'
    },
    {
      id: 'propagation',
      label: 'Cascading Delay Ripple Tree',
      icon: <Activity className="w-4 h-4 text-purple-600" />,
      action: () => setControlTab('propagation'),
      active: controlTab === 'propagation'
    },
    {
      id: 'whatif',
      label: 'What-If Simulation Sandbox',
      icon: <Sparkles className="w-4 h-4 text-indigo-600" />,
      action: () => setControlTab('whatif'),
      active: controlTab === 'whatif'
    },
    {
      id: 'blocks',
      label: 'Corridor Track Blocks & Faults',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      badge: `${networkHealth.activeDisruptionsCount} Active`,
      badgeColor: 'bg-amber-100 text-amber-800',
      action: () => setControlTab('blocks'),
      active: controlTab === 'blocks'
    }
  ];

  // Admin Navigation Items (Strictly Admin Only)
  const adminItems: CategoryNavItem[] = [
    {
      id: 'metrics',
      label: 'Model Accuracy & Telemetry',
      icon: <Cpu className="w-4 h-4 text-purple-600" />,
      badge: 'MAE 8.7m',
      badgeColor: 'bg-purple-100 text-purple-700',
      action: () => setAdminTab('metrics'),
      active: adminTab === 'metrics'
    },
    {
      id: 'tuning',
      label: 'Ensemble Weights & Tuning',
      icon: <Settings className="w-4 h-4 text-blue-600" />,
      action: () => setAdminTab('tuning'),
      active: adminTab === 'tuning'
    },
    {
      id: 'drift',
      label: 'Feature Drift & Attributions',
      icon: <Activity className="w-4 h-4 text-emerald-600" />,
      action: () => setAdminTab('drift'),
      active: adminTab === 'drift'
    },
    {
      id: 'sensors',
      label: 'Telemetry IoT Sensor Fleet',
      icon: <Radio className="w-4 h-4 text-indigo-600" />,
      action: () => setAdminTab('sensors'),
      active: adminTab === 'sensors'
    },
    {
      id: 'rbac',
      label: 'RBAC Category Security Matrix',
      icon: <ShieldCheck className="w-4 h-4 text-rose-600" />,
      badge: `${securityPolicies.filter(p => p.enforced).length} Enforced`,
      badgeColor: 'bg-rose-100 text-rose-700',
      action: () => setAdminTab('rbac'),
      active: adminTab === 'rbac'
    },
    {
      id: 'audit',
      label: 'Cryptographic Audit Ledger',
      icon: <FileText className="w-4 h-4 text-slate-700" />,
      action: () => setAdminTab('audit'),
      active: adminTab === 'audit'
    }
  ];

  // Select active items based on current category
  const activeItems =
    currentRole === 'passenger'
      ? passengerItems
      : currentRole === 'station_staff'
      ? stationStaffItems
      : currentRole === 'control_room'
      ? controlRoomItems
      : adminItems;

  const roleStyles = {
    passenger: {
      accent: 'border-sky-300/80 bg-gradient-to-br from-sky-50 via-blue-50/60 to-indigo-50/40 text-blue-950 shadow-2xs',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      activeItem: 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm shadow-sky-500/25 font-bold',
      collapsedBg: 'bg-gradient-to-br from-sky-500 to-blue-600'
    },
    station_staff: {
      accent: 'border-emerald-300/80 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-cyan-50/40 text-emerald-950 shadow-2xs',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      activeItem: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-500/25 font-bold',
      collapsedBg: 'bg-gradient-to-br from-emerald-500 to-teal-600'
    },
    control_room: {
      accent: 'border-violet-300/80 bg-gradient-to-br from-violet-50 via-purple-50/60 to-indigo-50/40 text-violet-950 shadow-2xs',
      badge: 'bg-violet-100 text-violet-800 border-violet-200',
      activeItem: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-500/25 font-bold',
      collapsedBg: 'bg-gradient-to-br from-violet-500 to-indigo-600'
    },
    admin: {
      accent: 'border-amber-300/80 bg-gradient-to-br from-amber-50 via-orange-50/60 to-rose-50/40 text-amber-950 shadow-2xs',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      activeItem: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm shadow-amber-500/25 font-bold',
      collapsedBg: 'bg-gradient-to-br from-amber-500 to-orange-600'
    }
  };

  return (
    <>
      <aside
        className={`hidden md:flex flex-col bg-white/95 backdrop-blur-xs border-r border-slate-200/90 transition-all duration-300 z-30 shrink-0 select-none ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Category Identity Card */}
        <div className="p-3.5 border-b border-slate-100">
          {sidebarOpen ? (
            <div className={`p-3 rounded-2xl border ${roleStyles[currentRole].accent}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500">
                  Active Category
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${roleStyles[currentRole].badge}`}>
                  {categoryMeta.clearanceLevel.split(' ')[0]}
                </span>
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{categoryMeta.title}</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-snug">
                {categoryMeta.tagline}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              <div className={`w-10 h-10 rounded-xl ${roleStyles[currentRole].collapsedBg} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                {currentRole === 'passenger' ? 'PS' : currentRole === 'station_staff' ? 'SM' : currentRole === 'control_room' ? 'CR' : 'AD'}
              </div>
            </div>
          )}
        </div>

        {/* Category-Exclusive Navigation Features List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {sidebarOpen && (
            <div className="px-2.5 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Category Features</span>
              <span className="text-[9px] text-indigo-500 font-medium">Isolated Workspace</span>
            </div>
          )}

          {activeItems.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                item.active
                  ? roleStyles[currentRole].activeItem
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={item.label}
            >
              <div className={`shrink-0 ${item.active ? 'text-white' : ''}`}>
                {item.icon}
              </div>

              {sidebarOpen && (
                <div className="flex-1 flex items-center justify-between overflow-hidden text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ml-1.5 shrink-0 ${
                        item.active
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          ))}

          {/* AI Ops Tool for this Category */}
          <div className="pt-4 mt-2 border-t border-slate-100">
            {sidebarOpen && (
              <div className="px-2.5 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                AI Operations
              </div>
            )}
            <button
              onClick={() => setCopilotOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/70 transition group cursor-pointer"
              title="RailSync AI Copilot"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 group-hover:scale-110 transition-transform" />
              {sidebarOpen && <span>Ops AI Copilot</span>}
            </button>

            <button
              onClick={() => setVoiceModalOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-rose-700 hover:bg-rose-50/70 transition group cursor-pointer"
              title="Voice Assistant"
            >
              <Mic className="w-4 h-4 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
              {sidebarOpen && <span>Voice Assistant</span>}
            </button>
          </div>
        </div>

        {/* Bottom: Category Switcher & Toggle */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 space-y-2">
          <button
            onClick={() => setRoleSwitchModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition shadow-2xs group cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500 group-hover:rotate-180 transition-transform duration-300" />
            {sidebarOpen && <span>Switch Category</span>}
          </button>

          <div className="flex items-center justify-between text-slate-400 px-1 text-xs">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition cursor-pointer"
              title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {sidebarOpen && (
              <span className="text-[10px] font-mono text-slate-400">
                RailSync RBAC v1.4
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Role Transition / Category Switcher Modal */}
      {roleSwitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                <span>Switch Operational Category</span>
              </div>
              <button
                onClick={() => setRoleSwitchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Select an authorized category. Each category maintains strict role-based separation of features, operational controls, and telemetry data.
            </p>

            <div className="space-y-2.5">
              {(['passenger', 'station_staff', 'control_room', 'admin'] as UserRole[]).map(role => {
                const conf = CATEGORIES_CONFIG[role];
                const isCurrent = currentRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setRoleSwitchModalOpen(false);
                    }}
                    className={`w-full flex items-start justify-between p-3.5 rounded-xl border text-left transition ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/80 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {conf.title}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {conf.clearanceLevel.split(' ')[0]}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {conf.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setRoleSwitchModalOpen(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
