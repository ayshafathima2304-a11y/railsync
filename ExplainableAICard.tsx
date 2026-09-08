import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, Info, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { DelayFactor } from '../../types/railway';
import { DataSourceBadge } from './Badges';

interface ExplainableAICardProps {
  factors: DelayFactor[];
  netChangeMin: number;
  trainNumber: string;
  className?: string;
}

export const ExplainableAICard: React.FC<ExplainableAICardProps> = ({
  factors,
  netChangeMin,
  trainNumber,
  className = ''
}) => {
  // If no factors are passed, provide standard realistic railway factors
  const activeFactors: DelayFactor[] = factors && factors.length > 0 ? factors : [
    { category: 'Congestion', name: 'Platform lead queueing at Katpadi outer home', delayMin: 4, percentage: 40 },
    { category: 'Speed Restriction', name: 'Temporary Caution Order (TCO 60 km/h) on bridge 41', delayMin: 3, percentage: 30 },
    { category: 'Unscheduled Stoppage', name: 'Signal aspect hold waiting rake clearance', delayMin: 2, percentage: 20 },
    { category: 'Recovery Buffer', name: 'Dynamic speed headroom recovery on quad high-speed section', delayMin: -1, percentage: 10, isRecovery: true }
  ];

  const netDelay = netChangeMin !== undefined ? netChangeMin : activeFactors.reduce((sum, f) => sum + f.delayMin, 0);

  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Why did the ETA change?
            </h3>
            <p className="text-[11px] text-slate-500">
              Explainable AI attribution breakdown for Train {trainNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge source="AI PREDICTION" />
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
            netDelay > 0
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : netDelay < 0
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            {netDelay > 0 ? `Net +${netDelay} min` : netDelay < 0 ? `Net ${netDelay} min` : 'Nominal (0 min)'}
          </span>
        </div>
      </div>

      {/* Factors List */}
      <div className="p-5 space-y-3.5">
        {activeFactors.map((factor, index) => {
          const isRecovery = factor.isRecovery || factor.delayMin < 0;
          return (
            <div
              key={index}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {factor.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {factor.percentage}% weight
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {factor.name}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                      isRecovery
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {isRecovery ? (
                      <>
                        <TrendingDown className="w-3 h-3 text-emerald-600" />
                        <span>{factor.delayMin} min</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-3 h-3 text-amber-600" />
                        <span>+{factor.delayMin} min</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Relative Weight Bar */}
              <div className="mt-2 w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isRecovery ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(10, factor.percentage))}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Net Calculation Summary */}
        <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Formula: Base Telemetry + Segment Restrictions − Dynamic Buffer</span>
          <span className="font-bold text-slate-800">
            Current ETA Variance: {netDelay > 0 ? `+${netDelay}` : netDelay} min
          </span>
        </div>
      </div>
    </div>
  );
};
