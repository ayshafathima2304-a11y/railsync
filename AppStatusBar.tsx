import React, { useState, useEffect } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import { Activity, Radio, Cpu, ShieldCheck, Terminal, Clock } from 'lucide-react';

export const AppStatusBar: React.FC = () => {
  const { currentRole, networkHealth, trains, disruptions } = useRailSync();
  const [time, setTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour12: false }));
      setUtcTime(now.toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeTrainsCount = trains.filter(t => t.status === 'RUNNING' || t.status === 'DELAYED').length;
  const activeDisruptionsCount = disruptions.filter(d => d.active).length;

  return (
    <footer className="h-7.5 shrink-0 bg-white/95 backdrop-blur-md text-slate-600 text-[11px] font-mono border-t border-slate-200/80 px-3 hidden sm:flex items-center justify-between select-none z-30 shadow-2xs">
      {/* Left section: System status & corridor */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>CONNECTED</span>
        </div>

        <span className="text-slate-300">|</span>

        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <Radio className="w-3 h-3 text-indigo-600 shrink-0" />
          <span>MAS-SBC Quad Corridor (356 km)</span>
        </div>

        <span className="text-slate-300">|</span>

        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-cyan-600 shrink-0" />
          <span className="text-slate-700 font-semibold">Telemetry: {networkHealth.overallScore}%</span>
          <span className="text-[10px] text-slate-400">(28ms ping)</span>
        </div>

        <span className="text-slate-300">|</span>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Active Trains:</span>
          <span className="text-indigo-700 font-black px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200/60">{activeTrainsCount}</span>
          {activeDisruptionsCount > 0 && (
            <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 text-[10px]">
              {activeDisruptionsCount} Alerts
            </span>
          )}
        </div>
      </div>

      {/* Right section: Engines, RBAC, Clock, Keyboard shortcuts */}
      <div className="flex items-center gap-3 text-slate-600">
        <div className="hidden lg:flex items-center gap-1.5 bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full border border-violet-200/70">
          <Cpu className="w-3 h-3 text-violet-600 shrink-0" />
          <span className="font-semibold">Ensemble ML v1.4.2</span>
        </div>

        <span className="hidden lg:inline text-slate-300">|</span>

        <div className="flex items-center gap-1.5 text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/70">
          <ShieldCheck className="w-3 h-3 text-sky-600 shrink-0" />
          <span className="uppercase text-[10px]">
            {currentRole === 'passenger' ? 'Passenger Workspace' : currentRole.replace('_', ' ')}
          </span>
        </div>

        <span className="text-slate-300">|</span>

        <div className="hidden md:flex items-center gap-1 text-slate-500">
          <Terminal className="w-3 h-3 text-slate-400" />
          <span>Press</span>
          <kbd className="px-1.5 py-0.2 bg-slate-100 rounded border border-slate-300 text-slate-700 font-bold text-[10px] shadow-2xs">⌘K</kbd>
        </div>

        <span className="hidden md:inline text-slate-300">|</span>

        <div className="flex items-center gap-1.5 text-slate-800 bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-200/70">
          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="font-bold text-amber-900">{time} IST</span>
          <span className="text-[10px] text-amber-700/80">({utcTime} UTC)</span>
        </div>
      </div>
    </footer>
  );
};
