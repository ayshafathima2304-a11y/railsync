import React, { useState } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  Train,
  Building2,
  ShieldCheck,
  Check
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const {
    notificationsOpen,
    setNotificationsOpen,
    alerts,
    dismissAlert,
    setSelectedTrainId,
    setCurrentRole,
    setCopilotOpen
  } = useRailSync();

  const [activeCategory, setActiveCategory] = useState<'ALL' | 'ETA' | 'DISRUPTIONS' | 'PLATFORM' | 'CONNECTIONS'>('ALL');

  if (!notificationsOpen) return null;

  const filteredAlerts = alerts.filter(a => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'ETA') return a.title.toLowerCase().includes('eta') || a.title.toLowerCase().includes('delay');
    if (activeCategory === 'DISRUPTIONS') return a.severity === 'CRITICAL' || a.title.toLowerCase().includes('signal');
    if (activeCategory === 'PLATFORM') return a.title.toLowerCase().includes('platform');
    if (activeCategory === 'CONNECTIONS') return a.title.toLowerCase().includes('connection');
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-900/20 backdrop-blur-xs"
      onClick={() => setNotificationsOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-slate-800 animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Operational Notifications
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {alerts.length}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Live telemetry alerts and corridor updates</p>
            </div>
          </div>

          <button
            onClick={() => setNotificationsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {(['ALL', 'ETA', 'DISRUPTIONS', 'PLATFORM', 'CONNECTIONS'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">All notifications cleared</p>
              <p className="text-slate-400 mt-0.5">Corridor telemetry is operating smoothly</p>
            </div>
          ) : (
            filteredAlerts.map(alert => {
              const isCrit = alert.severity === 'CRITICAL';
              const isWarn = alert.severity === 'WARNING';

              return (
                <div
                  key={alert.id}
                  className="pt-2.5 first:pt-0 p-3 rounded-xl bg-white hover:bg-slate-50/90 border border-slate-200/80 transition shadow-2xs group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          isCrit
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : isWarn
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-blue-50 text-blue-600 border border-blue-200'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{alert.title}</h4>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                              isCrit
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : isWarn
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {alert.timeAgo}
                          </span>
                          {alert.trainNumber && (
                            <span className="text-blue-600 font-bold">Train {alert.trainNumber}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => dismissAlert(alert.id)}
                      title="Dismiss notification"
                      className="p-1 rounded text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Action link */}
                  {alert.trainNumber && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setSelectedTrainId(alert.trainNumber!);
                          setCurrentRole('passenger');
                          setNotificationsOpen(false);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition"
                      >
                        <Train className="w-3.5 h-3.5" />
                        <span>Track Train {alert.trainNumber}</span>
                      </button>

                      <button
                        onClick={() => {
                          setNotificationsOpen(false);
                          setCopilotOpen(true);
                        }}
                        className="text-slate-500 hover:text-slate-800 text-[11px] transition flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        <span>Ask Copilot</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[11px] font-mono text-emerald-600 font-medium">● Telemetry sync active</span>
          <button
            onClick={() => alerts.forEach(a => dismissAlert(a.id))}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};
