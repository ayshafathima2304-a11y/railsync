import React, { useState } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import {
  Cpu,
  BarChart3,
  Database,
  Layers,
  History,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileDown,
  RefreshCw,
  Search,
  Zap,
  Clock,
  ArrowDown,
  Info,
  Sliders,
  Radio,
  SlidersHorizontal,
  Lock,
  Unlock,
  ShieldAlert,
  FileText,
  Activity,
  CheckCircle
} from 'lucide-react';
import { DataSourceBadge } from '../common/Badges';
import { FEATURE_IMPORTANCE, MODEL_VERSIONS } from '../../data/mockRailwayData';

export const AdminAIDashboard: React.FC = () => {
  const {
    modelMetrics,
    predictionHistory,
    auditLogs,
    activeModelVersion,
    setActiveModelVersion,
    adminTab,
    setAdminTab,
    modelWeights,
    setModelWeights,
    telemetrySensors,
    securityPolicies,
    toggleSecurityPolicy,
    addNotification
  } = useRailSync();

  const [selectedFeature, setSelectedFeature] = useState<typeof FEATURE_IMPORTANCE[0] | null>(FEATURE_IMPORTANCE[0]);
  const [historySearch, setHistorySearch] = useState('');
  const [promoteModal, setPromoteModal] = useState<string | null>(null);

  // Local state for tuning weights
  const [localWeights, setLocalWeights] = useState(modelWeights);
  const [tuningSaved, setTuningSaved] = useState(false);

  // Audit filter state
  const [auditFilter, setAuditFilter] = useState<'ALL' | 'SUCCESS' | 'DENIED'>('ALL');
  const [auditSearch, setAuditSearch] = useState('');

  const handleSaveWeights = () => {
    setModelWeights(localWeights);
    setTuningSaved(true);
    addNotification({
      title: 'Model Weights Updated',
      message: `Ensemble balance updated to XGBoost ${localWeights.xgboost}%, GNN ${localWeights.gnn}%, Physics ${localWeights.physics}%.`,
      severity: 'INFO',
      scope: 'ALL'
    });
    setTimeout(() => setTuningSaved(false), 3500);
  };

  const exportHistoryCSV = () => {
    const headers = 'ID,Timestamp,Train,Station,Scheduled,Predicted,Actual,ErrorMin,Confidence,Model\n';
    const rows = predictionHistory.map(p =>
      `${p.id},${p.timestamp},${p.trainNumber},${p.stationCode},${p.scheduledETA},${p.predictedETA},${p.actualETA},${p.errorMin},${p.confidence}%,${p.modelVersion}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RailSync_Prediction_Log_${Date.now()}.csv`;
    a.click();
  };

  const exportAuditCSV = () => {
    const headers = 'ID,Timestamp,UserRole,Action,Resource,Result,Details\n';
    const rows = auditLogs.map(l =>
      `"${l.id}","${l.timestamp}","${l.userRole}","${l.action.replace(/"/g, '""')}","${l.resource.replace(/"/g, '""')}","${l.result}","${(l.details || '').replace(/"/g, '""')}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RailSync_Audit_Ledger_${Date.now()}.csv`;
    a.click();
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.userRole.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.resource.toLowerCase().includes(auditSearch.toLowerCase());

    if (auditFilter === 'ALL') return matchesSearch;
    if (auditFilter === 'DENIED') return matchesSearch && log.result === 'ACCESS_DENIED';
    return matchesSearch && log.result === 'SUCCESS';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                RAILSYNC AI & MODEL OPERATIONS PLATFORM
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEM OPERATIONAL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Machine Learning Pipeline • Feature Attribution • Latency & Ingestion Health
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-700">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Active Model</span>
            <span className="font-bold text-purple-700">{activeModelVersion} Ensemble</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Inference Latency</span>
            <span className="font-bold text-emerald-600">38ms</span>
          </div>
        </div>
      </div>

      {/* Sub Navigation (Aligned with Sidebar IDs) */}
      <div className="pb-1">
        <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 inline-flex items-center gap-1 overflow-x-auto max-w-full shadow-2xs">
          {[
            { id: 'metrics', label: 'Model Performance & Baseline' },
            { id: 'tuning', label: 'Ensemble Weights & Tuning' },
            { id: 'drift', label: 'Feature Drift & Attributions' },
            { id: 'sensors', label: `Telemetry Sensors & Streams (${telemetrySensors.length})` },
            { id: 'rbac', label: 'RBAC Security Matrix' },
            { id: 'audit', label: `Audit Ledger (${auditLogs.length})` },
            { id: 'pipeline', label: 'Model Registry & Deploy' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                adminTab === tab.id
                  ? 'bg-white text-purple-900 font-bold shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: MODEL PERFORMANCE & BASELINE */}
      {adminTab === 'metrics' && (
        <div className="space-y-6">
          {/* Headline KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 uppercase font-mono block">Mean Absolute Error (MAE)</span>
              <div className="text-4xl font-black font-mono text-emerald-600 mt-1">
                {modelMetrics.maeMin} <span className="text-base text-slate-400 font-sans font-normal">min</span>
              </div>
              <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>38.7% lower than NTES baseline</span>
              </span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 uppercase font-mono block">Root Mean Square Error</span>
              <div className="text-4xl font-black font-mono text-blue-600 mt-1">
                {modelMetrics.rmseMin} <span className="text-base text-slate-400 font-sans font-normal">min</span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block font-mono">
                Baseline: 19.4 min
              </span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 uppercase font-mono block">Corridor Coverage</span>
              <div className="text-4xl font-black font-mono text-slate-900 mt-1">
                {modelMetrics.coveragePercent}%
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                Across 14 block sections
              </span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 uppercase font-mono block">Mean Confidence</span>
              <div className="text-4xl font-black font-mono text-purple-600 mt-1">
                {modelMetrics.avgConfidencePercent}%
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                38,420 predictions / 24h
              </span>
            </div>
          </div>

          {/* Visual Benchmark: Baseline vs RailSync */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Baseline (NTES Static Delay Offset) vs RailSync Dynamic ETA
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluation on 12,000 historical train runs along the Chennai-Bengaluru Southern Corridor
                </p>
              </div>
              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 font-semibold">
                DEMO EVALUATION BENCHMARK
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MAE Comparison Bar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-semibold text-slate-700 block">
                  Mean Absolute Error (Lower is Better)
                </span>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">Traditional NTES Static Model</span>
                      <span className="font-mono text-rose-600 font-bold">14.2 min</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-rose-500 h-3 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-emerald-700 font-semibold">RailSync AI Ensemble v1.4</span>
                      <span className="font-mono text-emerald-700 font-bold">8.7 min (-38.7%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '52%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* On-Time Arrival Confidence */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-semibold text-slate-700 block">
                  ETA Within 5-Minute Window (% Punctual Predictions)
                </span>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">NTES Rule-Based Predictor</span>
                      <span className="font-mono text-slate-700 font-bold">58.4%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-slate-400 h-3 rounded-full" style={{ width: '58%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-purple-700 font-semibold">RailSync Multi-Modal Engine</span>
                      <span className="font-mono text-purple-700 font-bold">89.2% (+30.8 pts)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-purple-600 h-3 rounded-full" style={{ width: '89%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENSEMBLE WEIGHTS & TUNING (ADMIN EXCLUSIVE) */}
      {adminTab === 'tuning' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Multi-Model Ensemble Meta-Learner Tuning</h2>
              <p className="text-xs text-slate-500">
                Adjust gradient boosting, spatio-temporal GNN, and physical kinematic simulation weights in real-time
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Weight Sum: {localWeights.xgboost + localWeights.gnn + localWeights.physics}%</span>
            </span>
          </div>

          {tuningSaved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ensemble weights safely updated and committed to cryptographic audit ledger.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Model 1: XGBoost Gradient Trees */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600">MODEL 01</span>
                <span className="text-sm font-black font-mono text-slate-900">{localWeights.xgboost}%</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">XGBoost Gradient Trees</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Handles historical section delays, weather coefficients, and day-of-week demand spikes.
                </p>
              </div>
              <input
                type="range"
                min={10}
                max={70}
                value={localWeights.xgboost}
                onChange={e => setLocalWeights({ ...localWeights, xgboost: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10% Min</span>
                <span>70% Max</span>
              </div>
            </div>

            {/* Model 2: Spatio-Temporal GNN */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-600">MODEL 02</span>
                <span className="text-sm font-black font-mono text-slate-900">{localWeights.gnn}%</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Spatio-Temporal Graph Neural Net (GNN)</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Models corridor track topology, headway conflicts, junction merges, and ripple propagation.
                </p>
              </div>
              <input
                type="range"
                min={10}
                max={70}
                value={localWeights.gnn}
                onChange={e => setLocalWeights({ ...localWeights, gnn: Number(e.target.value) })}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10% Min</span>
                <span>70% Max</span>
              </div>
            </div>

            {/* Model 3: Physics-Based Kinematics */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-600">MODEL 03</span>
                <span className="text-sm font-black font-mono text-slate-900">{localWeights.physics}%</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Kinematic Physics & Deceleration</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Computes train tonnage braking curves, track gradient resistance, and curve speed restrictions.
                </p>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={localWeights.physics}
                onChange={e => setLocalWeights({ ...localWeights, physics: Number(e.target.value) })}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5% Min</span>
                <span>50% Max</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setLocalWeights({ xgboost: 45, gnn: 35, physics: 20 })}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Reset to Defaults (45 / 35 / 20)
            </button>
            <button
              onClick={handleSaveWeights}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs"
            >
              Save & Rebalance Ensemble
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: FEATURE IMPORTANCE & DRIFT */}
      {adminTab === 'drift' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Model Feature Attributions (SHAPley Values)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Relative feature weight determining dynamic ETA recalculations
                  </p>
                </div>
                <DataSourceBadge source="AI PREDICTION" />
              </div>

              <div className="space-y-3 pt-2">
                {FEATURE_IMPORTANCE.map(item => (
                  <div
                    key={item.feature}
                    onClick={() => setSelectedFeature(item)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      selectedFeature?.feature === item.feature
                        ? 'bg-purple-50/60 border-purple-300 shadow-2xs'
                        : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-900">{item.feature}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-700">{(item.weight * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${item.weight * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Deep Dive Panel */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Feature Telemetry Breakdown
              </h3>

              {selectedFeature ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                    <span className="text-[10px] font-mono text-purple-600 uppercase font-bold block">Selected Feature</span>
                    <h4 className="text-base font-bold text-purple-950 mt-0.5">{selectedFeature.feature}</h4>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Weight Contribution:</span>
                      <span className="font-mono font-bold text-slate-900">{(selectedFeature.weight * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Update Frequency:</span>
                      <span className="font-mono text-slate-900">Sub-minute telemetry</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Drift Metric (PSI):</span>
                      <span className="font-mono font-bold text-emerald-600">0.03 (Stable)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {selectedFeature.description}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Select a feature on the left to inspect attribution.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SENSORS & DATA STREAMS */}
      {adminTab === 'sensors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Corridor IoT Telemetry Sensors & Live Ingestion Fleet
              </h3>
              <p className="text-xs text-slate-500">
                Trackside axle counters, loco GPS transponders, and automated signal relay health
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              4 / 4 Hardware Units Online
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {telemetrySensors.map(sensor => (
              <div key={sensor.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {sensor.id}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {sensor.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{sensor.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{sensor.location}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sensor Type</span>
                    <span className="font-mono text-slate-800 font-bold">{sensor.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Latency</span>
                    <span className="font-mono text-emerald-600 font-bold">{sensor.latencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Health</span>
                    <span className="font-mono text-slate-900 font-bold">{sensor.healthPercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RBAC CATEGORY SECURITY MATRIX (ADMIN EXCLUSIVE) */}
      {adminTab === 'rbac' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Role-Based Category Isolation & Security Enforcement Policies
              </h3>
              <p className="text-xs text-slate-500">
                Guards boundary conditions between Passenger, Station Staff, Control Room, and Admin categories
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Strict RBAC Active</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityPolicies.map(policy => (
              <div key={policy.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {policy.category.toUpperCase()}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    policy.enforced
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {policy.enforced ? 'ENFORCED' : 'BYPASSED'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{policy.name}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{policy.rule}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Policy ID: {policy.id}</span>
                  <button
                    onClick={() => toggleSecurityPolicy(policy.id)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                  >
                    {policy.enforced ? 'Disable Policy' : 'Enable Policy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* User Roles Clearance Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 bg-slate-50/70">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Clearance Matrix Summary
              </h4>
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3">User Role</th>
                  <th className="p-3">Exclusive Clearance</th>
                  <th className="p-3">Strictly Prohibited Operations</th>
                  <th className="p-3">Audit Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-bold text-slate-900">Passenger</td>
                  <td className="p-3 text-slate-600">Digital wallet, SMS delay threshold subscriptions, Station terminal guides</td>
                  <td className="p-3 text-rose-600 font-semibold">Track interlocking, platform reallocation, PA dispatch, model weights</td>
                  <td className="p-3 font-mono text-slate-500">Public Inquiries</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Station Staff</td>
                  <td className="p-3 text-slate-600">Dynamic platform reassignments, multi-lingual PA broadcast, porter/accessibility dispatch</td>
                  <td className="p-3 text-rose-600 font-semibold">Corridor speed limits, signal interlock bypass, ML hyperparameters</td>
                  <td className="p-3 font-mono text-slate-500">Terminal Dispatch</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Control Room</td>
                  <td className="p-3 text-slate-600">Caution Orders (TSR), Precedence Overrides, Speed Headroom Authorization, Interlocking Matrix</td>
                  <td className="p-3 text-rose-600 font-semibold">Machine learning model retraining, user role policy modifications</td>
                  <td className="p-3 font-mono text-slate-500">Section Controller</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Admin / AI</td>
                  <td className="p-3 text-slate-600">Ensemble tuning, sensor fleet diagnostics, cryptographic audit ledger, version rollback</td>
                  <td className="p-3 text-emerald-600 font-semibold">None (Full System Authority)</td>
                  <td className="p-3 font-mono text-slate-500">Cryptographic Ledger</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: CRYPTOGRAPHIC AUDIT LEDGER */}
      {adminTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Operational & RBAC Cryptographic Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Every action and unauthorized category breach attempt is immutably logged for supervisory compliance
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportAuditCSV}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>

          {/* Audit Search and Filter Bar */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="relative">
              <input
                type="text"
                placeholder="Search audit action, role, resource..."
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 pl-8 w-64 focus:outline-none focus:border-purple-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-mono">
              {(['ALL', 'SUCCESS', 'DENIED'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setAuditFilter(f)}
                  className={`px-3 py-1 rounded-md transition ${
                    auditFilter === f
                      ? 'bg-purple-600 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f === 'ALL' ? 'All Events' : f === 'SUCCESS' ? 'Authorized' : 'Access Denied'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Actor Role</th>
                  <th className="p-3">Action Description</th>
                  <th className="p-3">Target Resource</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No audit records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map(log => {
                    const isDenied = log.result === 'ACCESS_DENIED';
                    return (
                      <tr
                        key={log.id}
                        className={`transition ${isDenied ? 'bg-rose-50/50 hover:bg-rose-50' : 'hover:bg-slate-50/80'}`}
                      >
                        <td className="p-3 text-slate-400">{log.id}</td>
                        <td className="p-3 text-slate-500">{log.timestamp}</td>
                        <td className="p-3 font-bold uppercase">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                            log.userRole === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : log.userRole === 'control_room'
                              ? 'bg-blue-100 text-blue-800'
                              : log.userRole === 'station_staff'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {log.userRole}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 font-sans font-medium">
                          <div className="flex items-center gap-1.5">
                            {isDenied && <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                            <span>{log.action}</span>
                          </div>
                          {log.details && (
                            <span className="block text-[11px] text-slate-500 font-mono mt-0.5">{log.details}</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 font-sans">{log.resource}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isDenied
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {log.result}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: MODEL REGISTRY & DEPLOY PIPELINE */}
      {adminTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Model Registry & Safe Version Control
              </h3>
              <p className="text-xs text-slate-500">
                Guarded deployment preventing accidental replacement of active production prediction models
              </p>
            </div>
            <DataSourceBadge source="AI PREDICTION" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MODEL_VERSIONS.map(mv => {
              const isActive = mv.version === activeModelVersion;
              return (
                <div
                  key={mv.version}
                  className={`p-5 rounded-2xl border transition space-y-3 ${
                    isActive
                      ? 'bg-purple-50/50 border-purple-300 shadow-xs'
                      : 'bg-white border-slate-200/90 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      {mv.version}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isActive ? 'ACTIVE IN PRODUCTION' : 'ARCHIVED'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{mv.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{mv.notes}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">MAE Error:</span>
                      <span className="font-bold text-slate-900">{mv.mae} min</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">RMSE Error:</span>
                      <span className="font-bold text-slate-900">{mv.rmse} min</span>
                    </div>
                  </div>

                  {!isActive && (
                    <button
                      onClick={() => setPromoteModal(mv.version)}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      Rollback to {mv.version}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Safe Confirmation Modal */}
          {promoteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-slate-900 space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                  <h4 className="text-base font-bold">Confirm Model Switch</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You are switching active production ETA inference engine to <strong>{promoteModal}</strong>. This will affect dynamic ETA calculations across all 4 dashboards.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setPromoteModal(null)}
                    className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setActiveModelVersion(promoteModal);
                      setPromoteModal(null);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                  >
                    Confirm Switch to {promoteModal}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
