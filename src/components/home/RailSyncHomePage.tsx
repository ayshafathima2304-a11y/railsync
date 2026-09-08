import React, { useState } from 'react';
import {
  Train,
  ArrowRight,
  Sparkles,
  Search,
  Compass,
  Layers,
  Sliders,
  Cpu,
  Clock,
  Radio,
  ShieldCheck,
  Zap,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Users,
  Activity
} from 'lucide-react';
import { useRailSync } from '../../context/RailSyncContext';
import { AnimatedCorridorVisualizer } from './AnimatedCorridorVisualizer';
import { UserRole } from '../../types/railway';

export const RailSyncHomePage: React.FC = () => {
  const { setActiveScreen, navigateToRole, setSelectedTrainId, setSearchModalOpen, trains } = useRailSync();
  const [searchQuery, setSearchQuery] = useState('');

  const handleTrackSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSelectedTrainId('12627');
      navigateToRole('passenger');
      return;
    }

    const matchedTrain = trains.find(
      t =>
        t.number.toLowerCase().includes(query) ||
        t.name.toLowerCase().includes(query) ||
        t.origin.toLowerCase().includes(query) ||
        t.destination.toLowerCase().includes(query) ||
        query.includes(t.number)
    );

    if (matchedTrain) {
      setSelectedTrainId(matchedTrain.id);
      navigateToRole('passenger');
    } else {
      setSearchModalOpen(true);
    }
  };

  const handleTrackTrain = (trainId: string) => {
    setSelectedTrainId(trainId);
    navigateToRole('passenger');
  };

  const featureCards: {
    role: UserRole;
    title: string;
    subtitle: string;
    description: string;
    bulletItems: string[];
    accentColor: string;
    borderHover: string;
    icon: React.ReactNode;
    badgeText: string;
    badgeBg: string;
    cardBg?: string;
    actionBtnBg?: string;
    illustrationTag: string;
    tagline: string;
  }[] = [
    {
      role: 'passenger',
      title: 'Passenger',
      subtitle: 'Your journey, intelligently tracked.',
      tagline: 'Dynamic ETA, journey progress, alerts, connection risk and booking.',
      description:
        'Stay ahead of schedule adjustments with predictive machine-learning arrival times, explainable delay factors, and instant multi-platform rebooking.',
      bulletItems: ['Dynamic ETA Forecast', 'Journey Progress Bar', 'Delay Cause Attribution', 'Connection Risk Radar'],
      accentColor: 'text-sky-600',
      borderHover: 'hover:border-sky-400 hover:ring-2 hover:ring-sky-100 hover:shadow-lg hover:shadow-sky-500/10',
      icon: <Compass className="w-6 h-6 text-sky-600" />,
      badgeText: 'TRAVEL INTELLIGENCE',
      badgeBg: 'bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border-sky-200',
      cardBg: 'bg-gradient-to-br from-white via-sky-50/20 to-blue-50/30 border-sky-200/80',
      actionBtnBg: 'bg-gradient-to-r from-sky-600 to-blue-600 group-hover:from-sky-700 group-hover:to-blue-700 text-white',
      illustrationTag: 'Train 12627 • 18:47 (+17m)'
    },
    {
      role: 'station_staff',
      title: 'Station Staff',
      subtitle: 'Know what is happening at your station.',
      tagline: 'Arrivals, platforms, crowd prediction, disruptions and station intelligence.',
      description:
        'Keep platforms running smoothly with proactive rake turnaround monitoring, computer vision crowd forecasting, and automated multi-lingual announcements.',
      bulletItems: ['Live Station Arrivals', 'Platform Conflict Radar', 'Crowd Density Forecast', 'Automated PA Broadcaster'],
      accentColor: 'text-emerald-600',
      borderHover: 'hover:border-emerald-400 hover:ring-2 hover:ring-emerald-100 hover:shadow-lg hover:shadow-emerald-500/10',
      icon: <Layers className="w-6 h-6 text-emerald-600" />,
      badgeText: 'TERMINAL OPERATIONS',
      badgeBg: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200',
      cardBg: 'bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 border-emerald-200/80',
      actionBtnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:from-emerald-700 group-hover:to-teal-700 text-white',
      illustrationTag: 'Katpadi Jn • PF 3 Occupied'
    },
    {
      role: 'control_room',
      title: 'Control Room',
      subtitle: 'See the network before disruption spreads.',
      tagline: 'Live trains, ETA intelligence, delay propagation, recovery and simulations.',
      description:
        'Oversee the 356 km Quad Corridor with real-time train movement topology, GNN cascading delay propagation trees, and interactive What-If scenario sandbox.',
      bulletItems: ['Live Corridor Topology', 'Delay Cascading Tree', 'What-If Disruption Sandbox', 'Precedence & TSR Dispatch'],
      accentColor: 'text-violet-600',
      borderHover: 'hover:border-violet-400 hover:ring-2 hover:ring-violet-100 hover:shadow-lg hover:shadow-violet-500/10',
      icon: <Sliders className="w-6 h-6 text-violet-600" />,
      badgeText: 'CORRIDOR DISPATCH',
      badgeBg: 'bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 border-violet-200',
      cardBg: 'bg-gradient-to-br from-white via-violet-50/20 to-indigo-50/30 border-violet-200/80',
      actionBtnBg: 'bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:from-violet-700 group-hover:to-indigo-700 text-white',
      illustrationTag: 'MAS–SBC • 91% Network Health'
    },
    {
      role: 'admin',
      title: 'Admin / AI Analytics',
      subtitle: 'Understand and improve the intelligence.',
      tagline: 'Models, prediction accuracy, data quality, system health and analytics.',
      description:
        'Monitor model precision, feature importance, sensor drift, and model pipeline health across XGBoost, Graph Neural Networks, and Physics kinematics.',
      bulletItems: ['Prediction Accuracy 94.2%', 'Feature Importance Weights', 'Data Freshness Telemetry', 'Multi-Role Security RBAC'],
      accentColor: 'text-amber-600',
      borderHover: 'hover:border-amber-400 hover:ring-2 hover:ring-amber-100 hover:shadow-lg hover:shadow-amber-500/10',
      icon: <Cpu className="w-6 h-6 text-amber-600" />,
      badgeText: 'MODEL INTELLIGENCE',
      badgeBg: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border-amber-200',
      cardBg: 'bg-gradient-to-br from-white via-amber-50/20 to-orange-50/30 border-amber-200/80',
      actionBtnBg: 'bg-gradient-to-r from-amber-600 to-orange-600 group-hover:from-amber-700 group-hover:to-orange-700 text-white',
      illustrationTag: 'XGBoost + GNN • MAE 2.3m'
    }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 via-indigo-50/15 to-sky-50/20 font-sans text-slate-900 pb-20">
      {/* Hero Section Container */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Modern Colorful Ambient Lighting Orbs */}
        <div className="absolute -top-24 left-1/4 w-[500px] h-[350px] bg-gradient-to-br from-sky-200/50 via-indigo-200/40 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-10 right-1/4 w-[450px] h-[320px] bg-gradient-to-bl from-violet-200/40 via-pink-100/30 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-36 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-gradient-to-tr from-amber-100/40 to-emerald-100/30 blur-2xl pointer-events-none -z-10" />

        {/* Top Header Tag */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-indigo-200/70 shadow-xs text-xs font-semibold text-slate-700 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">RailSync</span>
            <span className="text-slate-300">|</span>
            <span className="text-indigo-600 font-medium">Intelligent Train Operations & Dynamic ETA System</span>
          </div>

          {/* Main Headline with Dynamic Gradient Typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            <span className="text-slate-900">Predict the arrival. </span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent block sm:inline">
              Understand the delay.
            </span>{' '}
            <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
              Anticipate the disruption.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
            AI-powered dynamic ETA, railway intelligence, and real-time operational insights harmonized in an attractive, modern platform.
          </p>

          {/* Dual Action CTAs with Rich Colors */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveScreen('category_select')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Roles & Workspaces</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-200" />
            </button>

            <button
              onClick={() => handleTrackTrain('12627')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-indigo-200/90 hover:border-indigo-400 font-bold text-sm transition-all shadow-xs hover:shadow-md flex items-center gap-2.5 group cursor-pointer"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Train className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>Track Live Train (ETA)</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-mono border border-emerald-200/80 font-bold">
                12627 LIVE
              </span>
            </button>
          </div>

          {/* Interactive Quick Train & PNR ETA Lookup Bar */}
          <div className="w-full max-w-xl mx-auto pt-4">
            <form
              onSubmit={handleTrackSubmit}
              className="p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-indigo-200/80 shadow-md shadow-indigo-500/5 hover:border-indigo-400 transition-all flex items-center gap-2"
            >
              <div className="pl-3 text-indigo-600">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Enter Train # (e.g. 12627, 20608) or PNR to track dynamic ETA..."
                className="w-full py-2 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs shrink-0 transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Track Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Live Train Status Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px]">
              <span className="text-slate-400 font-medium">Quick Track:</span>
              <button
                type="button"
                onClick={() => handleTrackTrain('12627')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 transition shadow-2xs font-medium cursor-pointer"
              >
                <Train className="w-3 h-3 text-sky-600" />
                <span className="font-bold font-mono">12627 Exp</span>
                <span className="text-[10px] px-1 rounded bg-amber-50 text-amber-700 border border-amber-200/60 font-mono">+9m</span>
              </button>

              <button
                type="button"
                onClick={() => handleTrackTrain('20608')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition shadow-2xs font-medium cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="font-bold font-mono">20608 Vande Bharat</span>
                <span className="text-[10px] px-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">130 km/h</span>
              </button>

              <button
                type="button"
                onClick={() => handleTrackTrain('12007')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-violet-50 text-slate-700 hover:text-violet-700 border border-slate-200 hover:border-violet-300 transition shadow-2xs font-medium cursor-pointer"
              >
                <Clock className="w-3 h-3 text-violet-600" />
                <span className="font-bold font-mono">12007 Shatabdi</span>
                <span className="text-[10px] px-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">On Time</span>
              </button>
            </div>
          </div>
        </div>

        {/* Impressive Animated Railway/Network Visualization */}
        <div className="mt-6 shadow-sm rounded-2xl">
          <AnimatedCorridorVisualizer />
        </div>
      </section>

      {/* Real-Time Telemetry Metrics Bar with Expressive Colors */}
      <section className="border-y border-indigo-100/80 bg-white/90 backdrop-blur-md py-4 px-4 sm:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-xs">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-100 border border-violet-200 flex items-center justify-center text-violet-600 shrink-0 shadow-2xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-violet-600 font-mono block">
                Model Ensemble Accuracy
              </span>
              <span className="text-sm font-black font-mono text-slate-900">
                94.2% <span className="text-xs font-medium text-slate-500">(MAE 2.3 min)</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 font-mono block">
                Corridor Active Rakes
              </span>
              <span className="text-sm font-black font-mono text-slate-900">
                5 High-Speed Coaching
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-600 font-mono block">
                Explainable Delay Buffer
              </span>
              <span className="text-sm font-black font-mono text-slate-900">
                -4 min Dynamic Headway
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-50 to-pink-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-600 font-mono block">
                Real-Time Telemetry Stream
              </span>
              <span className="text-sm font-black font-mono text-slate-900">
                Sub-Second Kafka Ingestion
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Preview Section: Four Major Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
            Modular Railway Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Engineered for every level of railway operation
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            From the traveling passenger to the network chief controller, RailSync provides
            purpose-built views synchronized across live data streams.
          </p>
        </div>

        {/* 4 Interactive Colorful Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureCards.map(card => (
            <div
              key={card.role}
              onClick={() => navigateToRole(card.role)}
              className={`${card.cardBg} rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden ${card.borderHover}`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      {card.icon}
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-bold font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full border inline-block mb-1 shadow-2xs ${card.badgeBg}`}
                      >
                        {card.badgeText}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Live Preview
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-800">
                      {card.illustrationTag}
                    </span>
                  </div>
                </div>

                {/* Subtitle & Tagline */}
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  {card.subtitle}
                </h4>
                <p className="text-xs font-semibold text-indigo-700 mb-2">
                  {card.tagline}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {card.description}
                </p>

                {/* Bullet items */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/60 mb-6">
                  {card.bulletItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Strip */}
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                  Open {card.title} Experience
                </span>
                <div className={`w-8 h-8 rounded-full ${card.actionBtnBg} flex items-center justify-center transition-all shadow-xs`}>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corridor Technology Explanation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
                Corridor Technology
              </span>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                How RailSync predicts and recovers coaching delays
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rather than relying on static timetables, RailSync analyzes track signal occupancy,
                weather friction, speed headroom, and junction bottlenecks using an ensemble of XGBoost,
                Graph Neural Networks (GNN), and physical train kinematics.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateToRole('admin')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition"
                >
                  <span>Explore Machine Learning Model Metrics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Dynamic Block Headway
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Real-time sensing of preceding trains and automated signal caution zones.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Downstream Recovery
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Computes high-speed track headroom to accurately offset initial terminal delays.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Cascading Propagation
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Predicts platform clashes and missed passenger connections before they manifest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
