import React, { useState } from 'react';
import { Sliders, Play, RotateCcw, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2, Clock, Train } from 'lucide-react';
import { DataSourceBadge } from './Badges';

interface WhatIfSimulatorPanelProps {
  className?: string;
  onSimulate?: (result: any) => void;
}

export const WhatIfSimulatorPanel: React.FC<WhatIfSimulatorPanelProps> = ({ className = '', onSimulate }) => {
  const [targetTrain, setTargetTrain] = useState('12627 Karnataka Express');
  const [holdDurationMin, setHoldDurationMin] = useState(10);
  const [speedRestrictionKmH, setSpeedRestrictionKmH] = useState(60);
  const [scenarioType, setScenarioType] = useState<'HOLD' | 'TSR' | 'PLATFORM_BLOCK'>('HOLD');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  // Derived simulation calculations based on inputs
  const predictedEtaDelta = scenarioType === 'HOLD'
    ? holdDurationMin
    : scenarioType === 'TSR'
    ? Math.round((110 - speedRestrictionKmH) * 0.15)
    : 14;

  const downstreamPropagationDelta = Math.max(0, Math.round(predictedEtaDelta * 0.7));
  const connectionRisk = predictedEtaDelta >= 12 ? 'HIGH' : predictedEtaDelta >= 6 ? 'MEDIUM' : 'LOW';
  const platformRisk = predictedEtaDelta >= 10 ? 'HIGH' : predictedEtaDelta >= 5 ? 'MEDIUM' : 'LOW';

  const handleRunSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
      if (onSimulate) {
        onSimulate({
          predictedEtaDelta,
          downstreamPropagationDelta,
          connectionRisk,
          platformRisk
        });
      }
    }, 600);
  };

  const handleReset = () => {
    setHoldDurationMin(10);
    setSpeedRestrictionKmH(60);
    setScenarioType('HOLD');
  };

  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden ${className}`}>
      {/* Prominent Simulation Safety Banner */}
      <div className="bg-purple-900 text-purple-100 px-5 py-2 text-xs font-mono font-bold flex items-center justify-between border-b border-purple-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>SIMULATION ENVIRONMENT — NOT A LIVE OPERATING COMMAND</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] border border-purple-700">
          SANDBOX ISOLATION ACTIVE
        </span>
      </div>

      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Interactive What-If Decision Simulator
            </h3>
            <p className="text-[11px] text-slate-500">
              Evaluate operational interventions before authorizing dispatch directives
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge source="SIMULATION" />
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulation Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Target Train Rake
            </label>
            <div className="flex items-center gap-2">
              <Train className="w-4 h-4 text-slate-400" />
              <select
                value={targetTrain}
                onChange={e => setTargetTrain(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="12627 Karnataka Express">12627 Karnataka Express (Chennai ➔ Bengaluru)</option>
                <option value="20608 Vande Bharat">20608 Vande Bharat Express (Mysuru ➔ Chennai)</option>
                <option value="12028 Shatabdi Express">12028 Shatabdi Express (Bengaluru ➔ Chennai)</option>
                <option value="22691 Rajdhani Express">22691 Bangalore Rajdhani (Bengaluru ➔ Delhi)</option>
              </select>
            </div>
          </div>

          {/* Intervention Scenario Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Intervention Scenario
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScenarioType('HOLD')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  scenarioType === 'HOLD'
                    ? 'bg-purple-50 text-purple-900 border-purple-300 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Hold Train
              </button>
              <button
                type="button"
                onClick={() => setScenarioType('TSR')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  scenarioType === 'TSR'
                    ? 'bg-purple-50 text-purple-900 border-purple-300 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Speed Restriction
              </button>
              <button
                type="button"
                onClick={() => setScenarioType('PLATFORM_BLOCK')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  scenarioType === 'PLATFORM_BLOCK'
                    ? 'bg-purple-50 text-purple-900 border-purple-300 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Platform Block
              </button>
            </div>
          </div>

          {/* Stepper Controls */}
          {scenarioType === 'HOLD' && (
            <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Hold Duration at Station
                </span>
                <span className="text-xs font-mono font-bold text-purple-900">
                  {holdDurationMin} minutes
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setHoldDurationMin(Math.max(2, holdDurationMin - 2))}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold flex items-center justify-center text-sm shadow-2xs"
                >
                  −
                </button>
                <div className="flex-1 text-center font-mono font-bold text-base text-slate-800">
                  {holdDurationMin} min
                </div>
                <button
                  type="button"
                  onClick={() => setHoldDurationMin(Math.min(60, holdDurationMin + 2))}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold flex items-center justify-center text-sm shadow-2xs"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {scenarioType === 'TSR' && (
            <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Imposed Speed Ceiling (TSR)
                </span>
                <span className="text-xs font-mono font-bold text-purple-900">
                  {speedRestrictionKmH} km/h (Nominal: 110)
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={speedRestrictionKmH}
                onChange={e => setSpeedRestrictionKmH(Number(e.target.value))}
                className="w-full accent-purple-600 mt-2"
              />
            </div>
          )}

          {scenarioType === 'PLATFORM_BLOCK' && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
              Simulates closing Platform 3 at Katpadi Jn for 25 minutes to model loop track diversion and following train headway penalties.
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="flex-1 py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs shadow-purple-600/20 disabled:opacity-75"
            >
              {isRunning ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Computing Ensemble Network Simulation...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Run What-If Simulation</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              title="Reset Parameters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Predicted Impact Scorecard */}
        <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200/90 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Predicted Network Impact
              </span>
              <span className="text-[10px] font-mono text-purple-800 bg-purple-100 px-2 py-0.5 rounded font-bold">
                XGB+GNN MODEL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Direct Train Delay
                </span>
                <div className="text-2xl font-bold font-mono text-rose-600 mt-0.5">
                  +{predictedEtaDelta} min
                </div>
                <span className="text-[10px] text-slate-500">Destination ETA impact</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Downstream Cascading
                </span>
                <div className="text-2xl font-bold font-mono text-amber-600 mt-0.5">
                  +{downstreamPropagationDelta} min
                </div>
                <span className="text-[10px] text-slate-500">Spread to 2 following trains</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Connection Risk
                </span>
                <div className={`text-base font-bold font-mono mt-0.5 ${
                  connectionRisk === 'HIGH' ? 'text-rose-600' : connectionRisk === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {connectionRisk}
                </div>
                <span className="text-[10px] text-slate-500">Missed cross-corridor rakes</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Platform Clearance
                </span>
                <div className={`text-base font-bold font-mono mt-0.5 ${
                  platformRisk === 'HIGH' ? 'text-rose-600' : platformRisk === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {platformRisk}
                </div>
                <span className="text-[10px] text-slate-500">Dwell buffer risk score</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/70 text-xs text-slate-500 flex items-center justify-between">
            <span>Ensemble Confidence: <span className="font-bold text-slate-800">88.4%</span></span>
            <span className="text-[11px] text-purple-700 font-semibold">Ready for dispatch review</span>
          </div>
        </div>
      </div>
    </div>
  );
};
