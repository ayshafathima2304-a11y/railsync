import React, { useState, useEffect } from 'react';
import { Train, Radio, ShieldCheck, Zap, ArrowRight, Gauge, AlertTriangle } from 'lucide-react';
import { useRailSync } from '../../context/RailSyncContext';

interface CorridorTrain {
  id: string;
  number: string;
  name: string;
  progressPercent: number; // 0 to 100
  speed: number;
  status: 'ON_TIME' | 'DELAYED' | 'RECOVERING';
  delayMin: number;
  nextStop: string;
  eta: string;
  color: string;
  direction: 'EAST_TO_WEST' | 'WEST_TO_EAST';
}

export const AnimatedCorridorVisualizer: React.FC = () => {
  const { navigateToRole } = useRailSync();
  const [activeHoverTrain, setActiveHoverTrain] = useState<string | null>(null);

  // Animated train positions moving smoothly along the corridor
  const [trains, setTrains] = useState<CorridorTrain[]>([
    {
      id: '12627',
      number: '12627',
      name: 'Karnataka Express',
      progressPercent: 44,
      speed: 92,
      status: 'RECOVERING',
      delayMin: 17,
      nextStop: 'Katpadi (KPD)',
      eta: '18:47',
      color: '#2563EB',
      direction: 'WEST_TO_EAST'
    },
    {
      id: '20608',
      number: '20608',
      name: 'Vande Bharat Exp',
      progressPercent: 78,
      speed: 130,
      status: 'ON_TIME',
      delayMin: 0,
      nextStop: 'Bangarapet (BWT)',
      eta: '19:15',
      color: '#059669',
      direction: 'WEST_TO_EAST'
    },
    {
      id: '12028',
      number: '12028',
      name: 'Shatabdi Express',
      progressPercent: 22,
      speed: 104,
      status: 'DELAYED',
      delayMin: 8,
      nextStop: 'Arakkonam (AJJ)',
      eta: '17:35',
      color: '#D97706',
      direction: 'WEST_TO_EAST'
    }
  ]);

  // Subtle continuous simulated progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prev =>
        prev.map(t => {
          let nextP = t.progressPercent + 0.15;
          if (nextP > 96) nextP = 6;
          return {
            ...t,
            progressPercent: nextP
          };
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const stations = [
    { code: 'MAS', name: 'Chennai Central', km: 0, pos: 6, platforms: 12, color: 'border-blue-500 text-blue-700 bg-blue-500' },
    { code: 'AJJ', name: 'Arakkonam', km: 69, pos: 25, platforms: 5, color: 'border-amber-500 text-amber-700 bg-amber-500' },
    { code: 'KPD', name: 'Katpadi Jn', km: 130, pos: 46, platforms: 5, color: 'border-rose-500 text-rose-700 bg-rose-500' },
    { code: 'JTJ', name: 'Jolarpettai', km: 214, pos: 64, platforms: 5, color: 'border-emerald-500 text-emerald-700 bg-emerald-500' },
    { code: 'BWT', name: 'Bangarapet', km: 285, pos: 80, platforms: 4, color: 'border-cyan-500 text-cyan-700 bg-cyan-500' },
    { code: 'SBC', name: 'Bengaluru City', km: 356, pos: 94, platforms: 10, color: 'border-indigo-500 text-indigo-700 bg-indigo-500' }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-white via-indigo-50/20 to-sky-50/25 rounded-2xl border border-indigo-100/90 p-5 shadow-sm overflow-hidden relative backdrop-blur-xs">
      {/* Visual Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-indigo-100/60">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono">
            MAS–SBC Quad Corridor <span className="text-indigo-600 font-normal">(356 km)</span>
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-bold border border-emerald-200/80 shadow-2xs">
            Automatic Block Signaling • Active
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs">
            <Radio className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span className="text-slate-700 font-semibold">Kafka: 100ms</span>
          </div>
          <button
            onClick={() => navigateToRole('control_room')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition group cursor-pointer"
          >
            <span>Inspect Full Map</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Network Track Stage */}
      <div className="relative py-8 px-4 select-none">
        {/* Dual Rails (Track 1 UP, Track 2 DOWN) */}
        <div className="relative h-16 flex flex-col justify-center">
          {/* Sleepers (Visual railway ties) */}
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-8 flex justify-between pointer-events-none opacity-25 overflow-hidden">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="w-0.5 h-full bg-indigo-300" />
            ))}
          </div>

          {/* Track 1 line */}
          <div className="absolute inset-x-2 top-3 h-1 bg-slate-200 rounded-full" />
          {/* Active section highlight */}
          <div
            className="absolute left-[6%] right-[6%] top-3 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 opacity-90 rounded-full shadow-xs"
          />

          {/* Track 2 line */}
          <div className="absolute inset-x-2 bottom-3 h-1 bg-slate-200 rounded-full" />
          <div
            className="absolute left-[6%] right-[6%] bottom-3 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 opacity-90 rounded-full shadow-xs"
          />

          {/* Station Nodes along the track */}
          {stations.map(st => (
            <div
              key={st.code}
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center -translate-x-1/2 z-20 group"
              style={{ left: `${st.pos}%` }}
            >
              {/* Station Pole Marker */}
              <div className={`w-4 h-4 rounded-full bg-white border-2 ${st.color.split(' ')[0]} group-hover:scale-125 transition-transform flex items-center justify-center shadow-xs`}>
                <div className={`w-1.5 h-1.5 rounded-full ${st.color.split(' ')[2]}`} />
              </div>

              {/* Station Label */}
              <div className="mt-4 flex flex-col items-center whitespace-nowrap">
                <span className="text-[11px] font-extrabold text-slate-800 font-mono tracking-tight group-hover:text-indigo-600 transition-colors">
                  {st.code}
                </span>
                <span className="text-[9px] text-slate-400 font-sans hidden sm:inline">
                  {st.name}
                </span>
                <span className="text-[8px] px-1 rounded bg-slate-100 text-slate-500 font-mono mt-0.5 border border-slate-200/60">
                  PF {st.platforms}
                </span>
              </div>
            </div>
          ))}

          {/* Moving Trains with Dynamic Markers */}
          {trains.map(t => {
            const isHovered = activeHoverTrain === t.id;
            const gradientBg =
              t.id === '12627'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-blue-500/30 ring-sky-300'
                : t.id === '20608'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 shadow-emerald-500/30 ring-emerald-300'
                : 'bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 shadow-amber-500/30 ring-amber-300';

            return (
              <div
                key={t.id}
                onMouseEnter={() => setActiveHoverTrain(t.id)}
                onMouseLeave={() => setActiveHoverTrain(null)}
                onClick={() => navigateToRole('passenger')}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 cursor-pointer transition-all duration-300"
                style={{
                  left: `${t.progressPercent}%`,
                  transform: `translate(-50%, ${t.id === '12627' ? '-65%' : t.id === '20608' ? '-35%' : '-65%'})`
                }}
              >
                {/* Visual Train Icon Pill */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full shadow-md text-white transition-all transform ${gradientBg} ${
                    isHovered ? 'scale-110 ring-4' : 'hover:scale-105'
                  }`}
                >
                  <Train className="w-3.5 h-3.5 animate-pulse" />
                  <span className="text-[10px] font-black font-mono tracking-tight">
                    {t.number}
                  </span>
                  <span className="text-[9px] font-bold opacity-90 hidden md:inline">
                    {t.speed} km/h
                  </span>
                </div>

                {/* Floating Tooltip with Real-Time ETA & Status */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 -top-12 pointer-events-none transition-all duration-200 whitespace-nowrap z-40 ${
                    isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'
                  }`}
                >
                  <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] shadow-xl font-sans border border-slate-700/80">
                    <span className="font-bold">{t.name}</span> • ETA SBC{' '}
                    <span className="text-emerald-400 font-mono font-bold">{t.eta}</span>{' '}
                    {t.delayMin > 0 && (
                      <span className="text-amber-300 font-mono font-semibold">({t.delayMin}m delay)</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Corridor Quick Highlights Strip with Vibrant Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-indigo-100/60 text-xs">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-200/80 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-sky-700 font-mono block">
              Active Speed Index
            </span>
            <span className="font-bold text-slate-800">
              Avg 108 km/h • Max 130 km/h
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-700 font-mono block">
              Katpadi Signal Warning
            </span>
            <span className="font-bold text-slate-800">
              Downstream headway +9 min
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 font-mono block">
              AI Dynamic Recovery
            </span>
            <span className="font-bold text-slate-800">
              -4 min buffer on Quad Track
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
