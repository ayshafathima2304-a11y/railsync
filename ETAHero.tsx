import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { DataSourceBadge, ConfidenceBadge, DelayBadge } from './Badges';
import { DataSourceType } from '../../types/railway';

interface ETAHeroProps {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  scheduledArrival: string;
  predictedArrival: string;
  currentDelayMin: number;
  predictedDelayMin: number;
  confidence: number;
  bestCaseArrival?: string;
  worstCaseArrival?: string;
  source?: DataSourceType;
  primaryCause?: string;
  onExploreWhy?: () => void;
  className?: string;
}

export const ETAHero: React.FC<ETAHeroProps> = ({
  trainNumber,
  trainName,
  origin,
  destination,
  scheduledArrival,
  predictedArrival,
  currentDelayMin,
  predictedDelayMin,
  confidence,
  bestCaseArrival,
  worstCaseArrival,
  source = 'AI PREDICTION',
  primaryCause,
  onExploreWhy,
  className = ''
}) => {
  const [prevEta, setPrevEta] = useState(predictedArrival);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (predictedArrival !== prevEta) {
      setIsChanging(true);
      const timer = setTimeout(() => {
        setPrevEta(predictedArrival);
        setIsChanging(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [predictedArrival, prevEta]);

  // Derive best/worst defaults if not explicitly passed
  const best = bestCaseArrival || predictedArrival;
  const worst = worstCaseArrival || predictedArrival;

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all duration-300 ${className}`}
      style={{ borderLeft: '4px solid #0F2747' }}
    >
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-[#0F2747] text-white tracking-wide">
            {trainNumber}
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              {trainName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>{origin}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="font-medium text-slate-700">{destination}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge source={source} />
          <ConfidenceBadge confidence={confidence} />
        </div>
      </div>

      {/* Main ETA Focus Surface */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Signature Big ETA Number */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Expected Arrival at Destination
            </span>
            <span className="text-xs font-mono text-slate-400">
              Scheduled: <span className="font-semibold text-slate-600">{scheduledArrival}</span>
            </span>
          </div>

          <div className="flex items-baseline gap-3.5">
            <div
              className={`text-5xl sm:text-6xl font-extrabold font-mono text-slate-900 tracking-tight transition-transform duration-300 ${
                isChanging ? 'scale-105 text-blue-600' : ''
              }`}
            >
              {predictedArrival}
            </div>
            <div className="space-y-1">
              <DelayBadge delayMin={predictedDelayMin} />
              <div className="text-[10px] text-slate-400 font-mono">
                {predictedDelayMin > 0 ? `+${predictedDelayMin}m variance` : 'On schedule'}
              </div>
            </div>
          </div>

          {/* Confidence interval bracket */}
          <div className="pt-2 flex items-center gap-4 text-xs text-slate-600 font-mono border-t border-slate-100">
            <div>
              <span className="text-slate-400 text-[10px] block">Best Case</span>
              <span className="font-semibold text-emerald-700">{best}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div>
              <span className="text-slate-400 text-[10px] block">Expected (AI)</span>
              <span className="font-bold text-slate-900">{predictedArrival}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div>
              <span className="text-slate-400 text-[10px] block">Worst Case</span>
              <span className="font-semibold text-rose-700">{worst}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Key Driver & Explainability Snapshot */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Delay Driver & Recovery Intelligence</span>
            </div>
            {onExploreWhy && (
              <button
                onClick={onExploreWhy}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
              >
                <span>Full breakdown</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {primaryCause ? (
              <>
                Primary delay: <span className="font-semibold text-slate-800">{primaryCause}</span>. RailSync dynamic recovery models factor a 3.5 min buffer in the next quad section.
              </>
            ) : (
              'Corridor telemetry indicates optimal sectional headway with nominal speed buffer engaged.'
            )}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-xs">
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70">
              <span className="text-slate-500 text-[11px]">Recovery Buffer</span>
              <span className="font-mono font-bold text-emerald-700">−3.5 min</span>
            </div>
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70">
              <span className="text-slate-500 text-[11px]">Connection Risk</span>
              <span className="font-semibold text-amber-700">Low (8m safety)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
