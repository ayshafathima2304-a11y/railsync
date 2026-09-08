import React from 'react';
import { DataSourceType } from '../../types/railway';

interface Props {
  source: DataSourceType;
  className?: string;
}

export const DataSourceBadge: React.FC<Props> = ({ source, className = '' }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  if (source === 'LIVE DATA') {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
  } else if (source === 'AI PREDICTION') {
    style = 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
  } else if (source === 'HISTORICAL DATA') {
    style = 'bg-slate-100 text-slate-600 border-slate-200';
  } else if (source === 'DEMO DATA') {
    style = 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
  } else if (source === 'SIMULATION') {
    style = 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] tracking-wider uppercase border font-mono ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {source}
    </span>
  );
};

export const ConfidenceBadge: React.FC<{ confidence: number; className?: string }> = ({
  confidence,
  className = ''
}) => {
  const isHigh = confidence >= 85;
  const isMed = confidence >= 70 && confidence < 85;

  const color = isHigh
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200 font-semibold'
    : isMed
    ? 'text-blue-700 bg-blue-50 border-blue-200 font-semibold'
    : 'text-amber-800 bg-amber-50 border-amber-200 font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${color} ${className}`}
      title={`AI Confidence: ${confidence}% based on telemetry, section signal density & historical recovery variance`}
    >
      <span>{confidence}%</span>
      <span className="text-[10px] opacity-75">conf</span>
    </span>
  );
};

export const DelayBadge: React.FC<{ delayMin: number; className?: string }> = ({
  delayMin,
  className = ''
}) => {
  if (delayMin <= 0) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        On Time
      </span>
    );
  }

  if (delayMin < 10) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
      >
        +{delayMin} min
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
    >
      +{delayMin} min delay
    </span>
  );
};
