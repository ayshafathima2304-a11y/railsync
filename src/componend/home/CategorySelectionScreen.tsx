import React from 'react';
import {
  Train,
  Building2,
  Sliders,
  Cpu,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  Compass,
  Layers
} from 'lucide-react';
import { useRailSync } from '../../context/RailSyncContext';
import { UserRole } from '../../types/railway';

export const CategorySelectionScreen: React.FC = () => {
  const { navigateToRole, setActiveScreen } = useRailSync();

  const categories: {
    role: UserRole;
    title: string;
    subtitle: string;
    badge: string;
    badgeColor?: string;
    description: string;
    features: string[];
    accentColor: string;
    icon: React.ReactNode;
    liveMetric: string;
    liveLabel: string;
    bgAccent?: string;
    bgCard?: string;
    borderAccent: string;
    buttonClass: string;
  }[] = [
    {
      role: 'passenger',
      title: 'Passenger',
      subtitle: 'Your journey, intelligently tracked.',
      badge: 'TRAVEL EXPERIENCE',
      badgeColor: 'text-sky-700 bg-sky-50 border-sky-200',
      description:
        'Dynamic ETA forecasting, live journey progress track, explainable delay reasons, missed connection alerts, and digital seat booking.',
      features: [
        'Real-time ETA with 89% Confidence Interval',
        'Chennai MAS ➔ Bengaluru SBC Progress Track',
        'Explainable AI delay factors & recovery buffers',
        'Interactive AI Copilot & SMS travel updates'
      ],
      accentColor: 'text-sky-600',
      icon: <Compass className="w-6 h-6 text-sky-600" />,
      liveMetric: '18:47 (+17m)',
      liveLabel: 'Train 12627 Expected Arrival',
      bgCard: 'bg-gradient-to-br from-white via-sky-50/30 to-blue-50/40',
      borderAccent: 'border-sky-200/90 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/15',
      buttonClass: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-sm shadow-sky-500/20'
    },
    {
      role: 'station_staff',
      title: 'Station Staff',
      subtitle: 'Know what is happening at your station.',
      badge: 'STATION OPERATIONS',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description:
        'Live terminal arrival stream, platform occupancy conflicts, computer vision crowd prediction, gate throttling, and automated PA broadcasts.',
      features: [
        'Station overview & priority operational issues',
        'Platform occupancy timeline & clash prevention',
        'Automated crowd density forecast across concourses',
        'Multi-lingual smart PA announcement triggers'
      ],
      accentColor: 'text-emerald-600',
      icon: <Layers className="w-6 h-6 text-emerald-600" />,
      liveMetric: 'PF 3 Occupied',
      liveLabel: 'Katpadi Jn Live Concourse Status',
      bgCard: 'bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40',
      borderAccent: 'border-emerald-200/90 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/15',
      buttonClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm shadow-emerald-500/20'
    },
    {
      role: 'control_room',
      title: 'Control Room',
      subtitle: 'See the network before disruption spreads.',
      badge: 'CORRIDOR DISPATCH',
      badgeColor: 'text-violet-700 bg-violet-50 border-violet-200',
      description:
        'Network health monitoring, live corridor topology map, GNN cascading delay propagation tree, precedence dispatching, and sandbox What-If simulation.',
      features: [
        'Full 356 km interactive corridor node map',
        'Graph neural network delay propagation graphs',
        'Interactive What-If disruption sandbox simulator',
        'Train precedence & Temporary Speed Restriction orders'
      ],
      accentColor: 'text-violet-600',
      icon: <Sliders className="w-6 h-6 text-violet-600" />,
      liveMetric: '91% Healthy',
      liveLabel: '5 Coaching Trains in Quad Corridor',
      bgCard: 'bg-gradient-to-br from-white via-violet-50/30 to-indigo-50/40',
      borderAccent: 'border-violet-200/90 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/15',
      buttonClass: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm shadow-violet-500/20'
    },
    {
      role: 'admin',
      title: 'Admin / AI Analytics',
      subtitle: 'Understand and improve the intelligence.',
      badge: 'MODEL & GOVERNANCE',
      badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
      description:
        'ML prediction accuracy tracking, ensemble model weighting (XGBoost + GNN + Physics), data drift detection, sensor health, and telemetry pipelines.',
      features: [
        'MAE 2.3 min • 94.2% prediction accuracy',
        'Feature importance & explainability metrics',
        'Live model drift and sensor telemetry pipeline',
        'Audit logs & multi-role governance policies'
      ],
      accentColor: 'text-amber-600',
      icon: <Cpu className="w-6 h-6 text-amber-600" />,
      liveMetric: '94.2% MAE 2.3m',
      liveLabel: 'XGBoost + GNN v1.4 Ensemble',
      bgCard: 'bg-gradient-to-br from-white via-amber-50/30 to-orange-50/40',
      borderAccent: 'border-amber-200/90 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/15',
      buttonClass: 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-sm shadow-orange-500/20'
    }
  ];

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-indigo-50/15 to-sky-50/20 p-4 sm:p-8 flex flex-col justify-between max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Top Bar with Back Action */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
        <button
          onClick={() => setActiveScreen('home')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition shadow-xs group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-indigo-600" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-mono text-slate-600 font-medium">
            Chennai MAS ➔ Bengaluru SBC Corridor
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Headline & Guidance */}
      <div className="text-center max-w-2xl mx-auto my-8 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 border border-indigo-200/80 tracking-wide uppercase font-mono shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Tailored Operational Experiences
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-sans">
          Choose your{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            RailSync experience
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Select a role to open tailored dynamic ETA intelligence, live corridor telemetry,
          and predictive railway operations.
        </p>
      </div>

      {/* Four Category Grid Cards with Rich Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        {categories.map(cat => (
          <div
            key={cat.role}
            onClick={() => navigateToRole(cat.role)}
            className={`cursor-pointer rounded-2xl ${cat.bgCard} border ${cat.borderAccent} p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden`}
          >
            <div>
              {/* Header inside Card */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {cat.icon}
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full border inline-block mb-1 shadow-2xs ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cat.title}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Live Telemetry
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-800">
                    {cat.liveMetric}
                  </span>
                </div>
              </div>

              {/* Tagline & Description */}
              <p className="text-xs font-bold text-slate-800 mb-1">
                {cat.subtitle}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {cat.description}
              </p>

              {/* Feature Checklist */}
              <div className="space-y-1.5 pt-3 border-t border-slate-200/60 mb-6">
                {cat.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Action Button */}
            <button
              onClick={e => {
                e.stopPropagation();
                navigateToRole(cat.role);
              }}
              className={`w-full py-2.5 px-4 rounded-xl ${cat.buttonClass} text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer`}
            >
              <span>Launch {cat.title} Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer reassurance */}
      <div className="text-center pt-8 border-t border-slate-200 mt-6">
        <p className="text-xs text-slate-500">
          Switch roles at any time using the global role tabs in the top navigation bar or sidebar.
        </p>
      </div>
    </div>
  );
};
