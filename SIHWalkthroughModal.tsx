import React from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Play,
  CheckCircle2,
  Sparkles,
  Flame,
  ArrowRight
} from 'lucide-react';

interface StepInfo {
  step: number;
  title: string;
  roleTarget: string;
  actionDesc: string;
  whatItProves: string;
}

const SYSTEM_STEPS: StepInfo[] = [
  {
    step: 1,
    title: 'Passenger Baseline ETA',
    roleTarget: 'Passenger Dashboard',
    actionDesc: 'Inspect Train 12627 Karnataka Express running on-time (Scheduled 8:20 PM, AI ETA 8:20 PM, 94% confidence).',
    whatItProves: 'Clean, mobile-first passenger experience with readable large ETA & confidence score.'
  },
  {
    step: 2,
    title: 'Corridor Live Map Telemetry',
    roleTarget: 'Live Railway Map',
    actionDesc: 'Track live rake movement along the Chennai-Bengaluru quad corridor nearing Katpadi Junction.',
    whatItProves: 'Dynamic GPS-synchronized train position and block-section signaling integration.'
  },
  {
    step: 3,
    title: 'Inject Signal Stoppage (+10m)',
    roleTarget: 'Simulation Engine',
    actionDesc: 'Simulate unexpected signal interlock congestion outside Katpadi Platform 5 approach.',
    whatItProves: 'Real-time event ingestion triggering section-level delay calculations across the whole corridor.'
  },
  {
    step: 4,
    title: 'Dynamic ETA Recalculation',
    roleTarget: 'Central Source of Truth',
    actionDesc: 'Destination ETA updates to 8:29 PM, confidence adjusts to 87%, and downstream recovery is calculated.',
    whatItProves: 'Delay does NOT equal destination delay. Proves section-level recovery buffers.'
  },
  {
    step: 5,
    title: 'Explainable ETA Breakdown',
    roleTarget: 'Explainability Card',
    actionDesc: 'View numerical attribution: Signal congestion +5m, Preceding train +3m, Dwell +2m, Weather +1m, Recovery -4m.',
    whatItProves: 'AI transparency. Every delay minute is explained quantitatively, not hallucinated.'
  },
  {
    step: 6,
    title: 'Delay Propagation Graph',
    roleTarget: 'Network Intelligence',
    actionDesc: 'Inspect cascading delay ripples to Train 16528, Train 12028, and 8 passenger connection risks.',
    whatItProves: 'Predicts where the disruption is going before downstream assets are blocked.'
  },
  {
    step: 7,
    title: 'Station Staff Dashboard',
    roleTarget: 'Station Operations',
    actionDesc: 'Switch to Station Staff view: Dynamic arrival board, platform 5 conflict warning, and AI platform re-route recommendation.',
    whatItProves: 'Genuinely role-tailored workflow for station superintendents and platform controllers.'
  },
  {
    step: 8,
    title: 'Control Room Network Cockpit',
    roleTarget: 'Operations Control Center',
    actionDesc: 'Inspect network health index (82/100), active corridor map, and prioritized disruption escalation center.',
    whatItProves: 'High-density operational intelligence for railway divisional dispatchers.'
  },
  {
    step: 9,
    title: 'What-If Simulation Workspace',
    roleTarget: 'Control Room Simulator',
    actionDesc: 'Ask: "What if the stoppage lasts another 10 minutes?" Run scenario and inspect recalculated network impact.',
    whatItProves: 'Proactive operational simulation to prevent network-wide cascading gridlocks.'
  },
  {
    step: 10,
    title: 'Operational AI Copilot',
    roleTarget: 'AI Copilot Assistant',
    actionDesc: 'Ask: "Which trains are most affected?" Copilot responds strictly from current corridor state.',
    whatItProves: 'Full Gemini AI integration without operational hallucination.'
  },
  {
    step: 11,
    title: 'Admin / AI Analytics & Model Health',
    roleTarget: 'AI Analytics Platform',
    actionDesc: 'Review MAE (8.7 min vs 14.2 min Baseline), RMSE, feature importance weights, and model versioning.',
    whatItProves: 'Data science & ML rigor with measurable error benchmarks.'
  },
  {
    step: 12,
    title: 'Multimodal Voice Assistant',
    roleTarget: 'Voice Interface',
    actionDesc: 'Speak: "When will Train 12627 reach Bengaluru?" RailSync synthesizes current AI forecast.',
    whatItProves: 'End-to-end accessibility and hands-free operations across all user roles.'
  }
];

export const SIHWalkthroughModal: React.FC = () => {
  const {
    sihModalOpen,
    setSihModalOpen,
    sihStep,
    setSihStep,
    nextSihStep,
    prevSihStep
  } = useRailSync();

  if (!sihModalOpen) return null;

  const currentStepInfo = SYSTEM_STEPS[sihStep] || SYSTEM_STEPS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              RS
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                RailSync Interactive System Guide
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-mono font-semibold">
                  Step {sihStep + 1} of 12
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Dynamic Forecast of Expected Time of Arrival & Dispatch Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={() => setSihModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Step Spotlight Card */}
        <div className="p-6 bg-blue-50/40 border-b border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Target Screen: {currentStepInfo.roleTarget}
            </span>
            <span className="text-xs font-mono text-slate-400 font-medium">
              Flow Stage {currentStepInfo.step}/12
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {currentStepInfo.title}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {currentStepInfo.actionDesc}
          </p>

          <div className="p-3 rounded-xl bg-white border border-blue-200/80 text-xs text-slate-700 flex items-start gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-semibold">System Value & Architecture: </strong>
              <span>{currentStepInfo.whatItProves}</span>
            </div>
          </div>
        </div>

        {/* 12-Step Progress Timeline Scrubber */}
        <div className="p-4 overflow-y-auto flex-1 bg-white space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 mb-2">Full 12-Step Feature Exploration:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SYSTEM_STEPS.map((step, idx) => {
              const isCurrent = idx === sihStep;
              const isPassed = idx < sihStep;

              return (
                <button
                  key={step.step}
                  onClick={() => setSihStep(idx)}
                  className={`p-2.5 rounded-xl text-left transition flex items-center justify-between border ${
                    isCurrent
                      ? 'bg-blue-50 text-blue-900 border-blue-400 shadow-2xs font-semibold'
                      : isPassed
                      ? 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      : 'bg-white text-slate-400 border-slate-100 hover:text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {step.step}
                    </span>
                    <span className="text-xs font-medium truncate max-w-[170px]">
                      {step.title}
                    </span>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 ${isCurrent ? 'text-blue-600' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={prevSihStep}
            disabled={sihStep === 0}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={() => setSihModalOpen(false)}
            className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium transition"
          >
            Close & Explore
          </button>

          <button
            onClick={() => {
              if (sihStep === 11) {
                setSihStep(0);
              } else {
                nextSihStep();
              }
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
          >
            <span>{sihStep === 11 ? 'Restart Guide' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const SystemTourModal = SIHWalkthroughModal;
