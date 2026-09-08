import React, { useState } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import {
  Sliders,
  Activity,
  AlertTriangle,
  GitFork,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Layers,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  Search,
  CheckCircle2,
  Gauge,
  Zap,
  Lock,
  Unlock,
  Radio,
  Sparkles,
  ArrowUpRight,
  Clock,
  Compass,
  CheckCircle
} from 'lucide-react';
import { DataSourceBadge, ConfidenceBadge, DelayBadge } from '../common/Badges';
import { CorridorNetworkMap } from '../common/CorridorNetworkMap';
import { DelayPropagationGraph } from '../common/DelayPropagationGraph';
import { WhatIfSimulatorPanel } from '../common/WhatIfSimulatorPanel';
import { CORRIDOR_SECTIONS } from '../../data/mockRailwayData';

export const ControlRoomDashboard: React.FC = () => {
  const {
    trains,
    selectedTrain,
    setSelectedTrainId,
    disruptions,
    networkHealth,
    whatIfParams,
    setWhatIfParams,
    whatIfResult,
    triggerDisruption,
    setCopilotOpen,
    controlTab,
    setControlTab,
    addNotification
  } = useRailSync();

  const [filterRisk, setFilterRisk] = useState<'ALL' | 'HIGH' | 'MED' | 'LOW'>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  // Speed Headroom Section Controller State
  const [speedOverrides, setSpeedOverrides] = useState<Record<string, number>>({
    'SEC-2': 10 // +10 km/h authorized speed headroom on Arakkonam - Katpadi
  });
  const [speedNotice, setSpeedNotice] = useState<string | null>(null);

  // Track Block Interlocking State
  const [blockStatus, setBlockStatus] = useState<Record<string, { aspect: 'GREEN' | 'YELLOW' | 'DOUBLE_YELLOW' | 'RED'; pointLocked: boolean; occupiedBy?: string }>>({
    'B-12': { aspect: 'GREEN', pointLocked: true },
    'B-13': { aspect: 'GREEN', pointLocked: true },
    'B-14': { aspect: 'DOUBLE_YELLOW', pointLocked: true },
    'B-15': { aspect: 'YELLOW', pointLocked: true, occupiedBy: '12627 Karnataka Exp' },
    'B-16': { aspect: 'GREEN', pointLocked: true },
    'B-17': { aspect: 'GREEN', pointLocked: false, occupiedBy: '20608 Vande Bharat' },
    'B-18': { aspect: 'GREEN', pointLocked: true }
  });

  // Network Replay state
  const [replayStep, setReplayStep] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<'1x' | '2x' | '5x' | '10x'>('1x');

  const replayTimeline = [
    { time: '10:00 AM', label: 'Normal Operations', delay: 0, desc: 'Quad tracks running nominal 110 km/h.' },
    { time: '10:08 AM', label: 'Signal Warning Detected', delay: 3, desc: 'Caution aspect displayed at Katpadi outer home.' },
    { time: '10:14 AM', label: 'Train 12627 Stopped', delay: 8, desc: 'Signal circuit 42 trip; train brought to complete halt.' },
    { time: '10:21 AM', label: 'ETA Dynamically Increased', delay: 10, desc: 'RailSync AI recalculates destination ETA to 8:29 PM.' },
    { time: '10:28 AM', label: 'Delay Propagated', delay: 12, desc: 'Downstream Train 16528 looped; 8 connection risks flagged.' },
    { time: '10:35 AM', label: 'Downstream Recovery Initiated', delay: 9, desc: 'Signal cleared; high-speed speed headroom buffer deployed.' }
  ];

  const handleAuthorizeSpeedHeadroom = (secId: string, deltaKmH: number) => {
    setSpeedOverrides(prev => ({
      ...prev,
      [secId]: (prev[secId] || 0) + deltaKmH
    }));
    const sec = CORRIDOR_SECTIONS.find(s => s.id === secId);
    const secTitle = sec ? `${sec.fromName} - ${sec.toName}` : secId;
    setSpeedNotice(`Authorized +${deltaKmH} km/h speed headroom notch on ${secTitle}. Potential ETA recovery: ~3.5 min.`);
    addNotification({
      title: `Speed Headroom Authorized`,
      message: `Section Controller authorized +${deltaKmH} km/h on ${secTitle}. Headroom buffer engaged.`,
      severity: 'INFO',
      scope: 'ALL'
    });
    setTimeout(() => setSpeedNotice(null), 4000);
  };

  const handleToggleBlockSignal = (blockId: string) => {
    setBlockStatus(prev => {
      const current = prev[blockId] || { aspect: 'GREEN', pointLocked: true };
      const nextAspect: 'GREEN' | 'YELLOW' | 'DOUBLE_YELLOW' | 'RED' =
        current.aspect === 'GREEN' ? 'YELLOW' : current.aspect === 'YELLOW' ? 'RED' : 'GREEN';
      return {
        ...prev,
        [blockId]: {
          ...current,
          aspect: nextAspect
        }
      };
    });
    addNotification({
      title: `Block Signal Interlocking Shift: ${blockId}`,
      message: `Section Controller toggled aspect on Block ${blockId}. Interlocking relay energized.`,
      severity: 'WARNING',
      scope: 'ALL'
    });
  };

  const handleTogglePointLock = (blockId: string) => {
    setBlockStatus(prev => {
      const current = prev[blockId] || { aspect: 'GREEN', pointLocked: true };
      return {
        ...prev,
        [blockId]: {
          ...current,
          pointLocked: !current.pointLocked
        }
      };
    });
  };

  const filteredTrains = trains.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchFilter.toLowerCase()) || t.number.includes(searchFilter);
    if (filterRisk === 'ALL') return matchesSearch;
    if (filterRisk === 'HIGH') return matchesSearch && t.predictedDelayMin >= 9;
    if (filterRisk === 'MED') return matchesSearch && t.predictedDelayMin >= 4 && t.predictedDelayMin < 9;
    return matchesSearch && t.predictedDelayMin < 4;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Control Room Top Cockpit Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                RAILSYNC CENTRAL OPERATIONS CONTROL
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE NETWORK FEED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Southern Railway Divisional Operations Center • Chennai Central (MAS) - KSR Bengaluru (SBC) Corridor
            </p>
          </div>
        </div>

        {/* Health Index Meter */}
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Network Health</span>
            <span className="text-xl font-black font-mono text-emerald-600">
              {networkHealth.overallScore} / 100
            </span>
          </div>
          <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300">
            <div
              className={`h-2 rounded-full ${
                networkHealth.overallScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${networkHealth.overallScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Corridor Operations KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Monitored Trains</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{trains.length}</div>
          <span className="text-[10px] text-emerald-600 font-mono">100% telemetry locked</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Corridor Punctuality</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{networkHealth.punctualityRate}%</div>
          <span className="text-[10px] text-emerald-600 font-mono">Target: &gt;90%</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">Average Delay</span>
          <div className="text-2xl font-black text-amber-600 font-mono mt-1">
            +{networkHealth.averageDelayMinutes}m
          </div>
          <span className="text-[10px] text-amber-600 font-mono">En-route recovery active</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">Active Disruptions</span>
          <div className="text-2xl font-black text-rose-600 font-mono mt-1">
            {disruptions.filter(d => d.isActive).length}
          </div>
          <span className="text-[10px] text-rose-500 font-mono">Signal & track</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">Connection Risks</span>
          <div className="text-2xl font-black text-blue-600 font-mono mt-1">
            {networkHealth.highRiskConnectionsCount}
          </div>
          <span className="text-[10px] text-blue-500 font-mono">Passenger transfers</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="pb-1">
        <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 inline-flex items-center gap-1 overflow-x-auto max-w-full shadow-2xs">
          <button
            onClick={() => setControlTab('network')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              controlTab === 'network'
                ? 'bg-white text-amber-900 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Live Corridor & ETA Intelligence
          </button>
          <button
            onClick={() => setControlTab('propagation')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              controlTab === 'propagation'
                ? 'bg-white text-amber-900 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Delay Propagation Graph
          </button>
          <button
            onClick={() => setControlTab('whatif')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              controlTab === 'whatif'
                ? 'bg-white text-amber-900 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            What-If Simulation Workspace
          </button>
          <button
            onClick={() => setControlTab('speed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              controlTab === 'speed'
                ? 'bg-white text-amber-900 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Speed Headroom & Buffer</span>
          </button>
          <button
            onClick={() => setControlTab('track_blocks')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              controlTab === 'track_blocks'
                ? 'bg-white text-amber-900 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Track Blocks & Interlocking</span>
          </button>
          <button
            onClick={() => setControlTab('replay')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              controlTab === 'replay'
                ? 'bg-white text-amber-900 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Network Replay Time Machine
          </button>
          <button
            onClick={() => setControlTab('risk')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              controlTab === 'risk'
                ? 'bg-white text-amber-900 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Risk Center
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE CORRIDOR & ETA INTELLIGENCE */}
      {controlTab === 'network' && (
        <div className="space-y-6">
          {/* Corridor Map Centerpiece */}
          <CorridorNetworkMap />

          {/* High-Density ETA Intelligence Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Live Corridor Fleet ETA Telemetry
                </h3>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filter train..."
                    value={searchFilter}
                    onChange={e => setSearchFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-900 pl-7 w-32 sm:w-40 focus:outline-none focus:border-blue-600"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                </div>

                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px] font-mono">
                  {(['ALL', 'HIGH', 'MED', 'LOW'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterRisk(f)}
                      className={`px-2 py-0.5 rounded ${
                        filterRisk === f
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Train Rake</th>
                    <th className="p-3.5">Sector</th>
                    <th className="p-3.5">Current Location</th>
                    <th className="p-3.5">Current Spd</th>
                    <th className="p-3.5">Sched Dest</th>
                    <th className="p-3.5 text-blue-700">Dynamic AI ETA</th>
                    <th className="p-3.5">Predicted Delay</th>
                    <th className="p-3.5">Confidence</th>
                    <th className="p-3.5">Primary Delay Vector</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredTrains.map(train => (
                    <tr
                      key={train.id}
                      onClick={() => setSelectedTrainId(train.number)}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        selectedTrain.id === train.id ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <td className="p-3.5 font-bold font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900">{train.number}</span>
                          <span className="text-[11px] text-slate-500 font-sans font-normal truncate max-w-[130px]">
                            {train.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600 text-[11px]">
                        {train.origin} ➔ {train.destination}
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">
                        {train.currentLocation}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">
                        {train.speedKmH} km/h
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">
                        {train.scheduledArrival}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-900 text-sm bg-blue-50/40">
                        {train.predictedArrival}
                      </td>
                      <td className="p-3.5">
                        <DelayBadge delayMin={train.predictedDelayMin} />
                      </td>
                      <td className="p-3.5">
                        <ConfidenceBadge confidence={train.confidence} />
                      </td>
                      <td className="p-3.5 text-slate-600 text-[11px] max-w-xs truncate">
                        {train.primaryCause}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DELAY PROPAGATION GRAPH */}
      {controlTab === 'propagation' && (
        <div className="space-y-6">
          <DelayPropagationGraph />
        </div>
      )}

      {/* TAB 3: WHAT-IF SIMULATION WORKSPACE */}
      {controlTab === 'whatif' && (
        <div className="space-y-6">
          <WhatIfSimulatorPanel />
        </div>
      )}

      {/* TAB 4: SPEED HEADROOM & BUFFER OPTIMIZER (CONTROL ROOM EXCLUSIVE) */}
      {controlTab === 'speed' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dynamic Speed Headroom & Buffer Optimizer</h2>
              <p className="text-xs text-slate-500">
                Section Controllers can grant authorization for drivers to exploit speed buffers and recover schedule delay
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" />
              <span>Speed Headroom: +29 km/h Network Reserve</span>
            </span>
          </div>

          {speedNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{speedNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CORRIDOR_SECTIONS.map(sec => {
              const currentOverride = speedOverrides[sec.id] || 0;
              const effectiveSpeed = Math.min(sec.maxSpeedKmH, sec.currentSpeedKmH + currentOverride);
              const headroom = sec.maxSpeedKmH - effectiveSpeed;
              return (
                <div key={sec.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{sec.id}</span>
                      <h4 className="text-sm font-bold text-slate-900">{sec.fromName} ➔ {sec.toName}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      MPS {sec.maxSpeedKmH} km/h
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Avg Speed</span>
                      <span className="font-mono font-bold text-slate-800">{effectiveSpeed} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Headroom</span>
                      <span className="font-mono font-bold text-emerald-600">+{headroom} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Line Load</span>
                      <span className={`font-mono font-bold ${sec.congestionLevel === 'HIGH' ? 'text-rose-600' : 'text-slate-700'}`}>
                        {sec.congestionLevel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {currentOverride > 0 ? `+${currentOverride} km/h granted` : 'Standard timetable notch'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAuthorizeSpeedHeadroom(sec.id, 5)}
                        disabled={headroom < 5}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition disabled:opacity-40"
                      >
                        +5 km/h
                      </button>
                      <button
                        onClick={() => handleAuthorizeSpeedHeadroom(sec.id, 10)}
                        disabled={headroom < 10}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition disabled:opacity-40 shadow-2xs"
                      >
                        +10 km/h
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: TRACK BLOCKS & INTERLOCKING (CONTROL ROOM EXCLUSIVE) */}
      {controlTab === 'track_blocks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Track Block Signaling & Electronic Interlocking (EI)</h2>
              <p className="text-xs text-slate-500">
                Divisional section interlocking console. Override signal aspects and point machines for track clearance
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Route Relay Interlocking: Secure</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.entries(blockStatus) as [string, { aspect: 'GREEN' | 'YELLOW' | 'DOUBLE_YELLOW' | 'RED'; pointLocked: boolean; occupiedBy?: string }][]).map(([bId, status]) => (
              <div key={bId} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900">{bId}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full ${
                      status.aspect === 'GREEN'
                        ? 'bg-emerald-500 shadow-xs shadow-emerald-300 animate-pulse'
                        : status.aspect === 'DOUBLE_YELLOW'
                        ? 'bg-amber-400'
                        : status.aspect === 'YELLOW'
                        ? 'bg-amber-500'
                        : 'bg-rose-600 shadow-xs shadow-rose-300'
                    }`} />
                    <span className="text-[10px] font-mono font-bold text-slate-700">{status.aspect}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] text-slate-400 block uppercase">Block Occupancy</span>
                  <span className="font-semibold text-slate-900">{status.occupiedBy || 'Block Clear (Unoccupied)'}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => handleTogglePointLock(bId)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition ${
                      status.pointLocked
                        ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-amber-50 text-amber-700 border-amber-300'
                    }`}
                  >
                    {status.pointLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{status.pointLocked ? 'Point Locked' : 'Point Unlocked'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleBlockSignal(bId)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-2xs text-[11px]"
                  >
                    Cycle Aspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: NETWORK REPLAY TIME MACHINE */}
      {controlTab === 'replay' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Corridor Incident Replay (Time-Machine)
                </h3>
                <p className="text-xs text-slate-500">
                  Step-by-step reconstruction of the Katpadi signaling incident from initiation to recovery
                </p>
              </div>

              {/* Replay Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReplayStep(Math.max(0, replayStep - 1))}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition text-xs font-semibold"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={() => setReplayStep(Math.min(replayTimeline.length - 1, replayStep + 1))}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition text-xs font-semibold"
                >
                  Next →
                </button>

                {/* Speed Toggles */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-mono">
                  {(['1x', '2x', '5x', '10x'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setReplaySpeed(s)}
                      className={`px-2 py-1 rounded ${
                        replaySpeed === s ? 'bg-blue-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Selected Stage Spotlight */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono text-blue-700 font-bold block">
                  {replayTimeline[replayStep].time} • Replay Stage {replayStep + 1} of 6
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {replayTimeline[replayStep].label}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {replayTimeline[replayStep].desc}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500 block font-mono">Corridor Delay</span>
                <span className="text-2xl font-black font-mono text-amber-600">
                  +{replayTimeline[replayStep].delay} min
                </span>
              </div>
            </div>

            {/* Step-by-Step Timeline Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {replayTimeline.map((item, idx) => {
                const isCurrent = idx === replayStep;
                return (
                  <button
                    key={idx}
                    onClick={() => setReplayStep(idx)}
                    className={`p-3 rounded-xl text-left border transition ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-400 text-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-blue-600 font-bold block">{item.time}</span>
                    <span className="text-xs font-bold text-slate-900 block mt-1 truncate">{item.label}</span>
                    <span className="text-[10px] text-amber-600 font-mono font-bold">+{item.delay}m</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: RISK CENTER */}
      {controlTab === 'risk' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              High Risk Trains Matrix
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Evaluated against signal density, ghat grade, and headway
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trains.map(train => {
              const riskPercent = Math.min(96, Math.round(train.predictedDelayMin * 6.5 + (train.type === 'EXPRESS' ? 12 : 5)));
              return (
                <div key={train.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {train.number}
                    </span>
                    <span className={`text-xs font-bold font-mono ${riskPercent > 60 ? 'text-rose-600' : 'text-amber-600'}`}>
                      {riskPercent}% Risk
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{train.name}</h4>
                    <p className="text-xs text-slate-500 truncate">{train.origin} ➔ {train.destination}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-400 block text-[10px] uppercase font-semibold">Delay Factor:</strong>
                    {train.primaryCause}
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Predicted Delay:</span>
                    <span className="font-mono font-bold text-slate-900">+{train.predictedDelayMin}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
