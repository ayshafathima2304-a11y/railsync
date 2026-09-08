import React, { useState } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import {
  Building2,
  Users,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle,
  Clock,
  Shuffle,
  ShieldAlert,
  HelpCircle,
  Volume2,
  Radio,
  Wrench,
  Droplets,
  Zap,
  CheckSquare,
  Square,
  FileText,
  Send,
  Bell
} from 'lucide-react';
import { DataSourceBadge, ConfidenceBadge, DelayBadge } from '../common/Badges';

export const StationStaffDashboard: React.FC = () => {
  const {
    trains,
    selectedStationCode,
    setSelectedStationCode,
    setCopilotOpen,
    disruptions,
    stationTab,
    setStationTab,
    platformAssignments,
    reassignPlatform,
    addNotification
  } = useRailSync();

  const stations = [
    { code: 'MAS', name: 'Chennai Central', platforms: 12, arrivals: 28, delayed: 4 },
    { code: 'KPD', name: 'Katpadi Junction', platforms: 6, arrivals: 18, delayed: 5 },
    { code: 'SBC', name: 'KSR Bengaluru', platforms: 10, arrivals: 24, delayed: 7 }
  ];

  const currentStation = stations.find(s => s.code === selectedStationCode) || stations[2];

  // Check if Train 12627 has been reassigned
  const train12627Assignment = platformAssignments['12627'];
  const isPlatformSwitched = train12627Assignment && train12627Assignment.platform === 6;

  // Station PA Announcement Console State
  const [paTrain, setPaTrain] = useState('12627');
  const [paPlatform, setPaPlatform] = useState('6');
  const [paLang, setPaLang] = useState<'EN' | 'HI' | 'KN' | 'TA'>('EN');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [paBroadcastLog, setPaBroadcastLog] = useState<string[]>([
    '20:12:04 — Train 22691 Rajdhani Express arriving on Platform 1 broadcasted in EN/HI',
    '20:05:18 — Train 12028 Shatabdi delayed announcement broadcasted in EN/KN'
  ]);

  // Ground Crew Dispatch State
  const [crewTasks, setCrewTasks] = useState([
    { id: '1', train: '12627 Karnataka Exp', task: 'Coach Watering (S1-S8)', crew: 'Watering Squad Alpha (4 pax)', status: 'IN_PROGRESS', time: '8m remaining' },
    { id: '2', train: '12627 Karnataka Exp', task: 'Bio-Toilet Inspection', crew: 'Sanitation Team 3', status: 'PENDING', time: 'Awaiting PF slot' },
    { id: '3', train: '22691 Rajdhani Exp', task: 'Primary Mechanical Rake Inspection', crew: 'TXR Crew Team Beta', status: 'COMPLETED', time: 'Checked by SSE/C&W' },
    { id: '4', train: '12028 Shatabdi Rake', task: 'Electrical & AC Head-End Power', crew: 'Electrical Dept Squad 2', status: 'IN_PROGRESS', time: '14m remaining' }
  ]);

  // Station Incident Logging State
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('Platform 5 FOB');
  const [incidentSubmitted, setIncidentSubmitted] = useState(false);

  const handleBroadcastAnnouncement = () => {
    setIsBroadcasting(true);
    const selectedTrainObj = trains.find(t => t.number === paTrain) || trains[0];
    const text = `Attention passengers: Train ${selectedTrainObj.number} ${selectedTrainObj.name} from ${selectedTrainObj.origin} is arriving on Platform ${paPlatform}.`;

    // Try web speech synthesis if supported
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    addNotification({
      title: `Station PA: Broadcast Dispatched`,
      message: `Announcement for ${selectedTrainObj.number} ${selectedTrainObj.name} played on Platform ${paPlatform} (${paLang}).`,
      severity: 'INFO',
      scope: 'ALL'
    });

    setTimeout(() => {
      setIsBroadcasting(false);
      setPaBroadcastLog(prev => [
        `${new Date().toLocaleTimeString()} — Train ${selectedTrainObj.number} arriving on Platform ${paPlatform} [${paLang}]`,
        ...prev
      ]);
    }, 2500);
  };

  const handleToggleCrewTask = (id: string) => {
    setCrewTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }
          : t
      )
    );
  };

  const handleLogIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle.trim()) return;
    setIncidentSubmitted(true);
    addNotification({
      title: `Ground Incident Logged: ${incidentTitle}`,
      message: `Station staff logged maintenance observation at ${incidentLocation}. Sent to Control Room & Civil Engineering.`,
      severity: 'WARNING',
      scope: 'ALL'
    });
    setIncidentTitle('');
    setTimeout(() => setIncidentSubmitted(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Station Staff Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {currentStation.name} ({currentStation.code})
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                STATION CONCIERGE & OPERATIONS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Station Terminal & Platform Operations Controller • Division SWR / SR
            </p>
          </div>
        </div>

        {/* Station Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Active Station:</span>
          <select
            value={selectedStationCode}
            onChange={e => setSelectedStationCode(e.target.value)}
            className="bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-blue-600 shadow-2xs"
          >
            {stations.map(s => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
          <DataSourceBadge source="LIVE DATA" />
        </div>
      </div>

      {/* Top Station Operations KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider">Scheduled Arrivals</span>
            <ArrowDownRight className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{currentStation.arrivals}</div>
          <span className="text-[11px] text-slate-500">Next arrival in 9 min</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider">Departures</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">19</div>
          <span className="text-[11px] text-emerald-600 font-medium">18 on schedule</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-rose-600">Delayed Trains</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600 font-mono">{currentStation.delayed}</div>
          <span className="text-[11px] text-rose-600 font-medium">Avg delay: +8.4m</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider">Platform Load</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {isPlatformSwitched ? '5/10' : '6/10'}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">
            {isPlatformSwitched ? 'Conflict resolved on PF 6' : '1 potential conflict on PF 5'}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="pb-1">
        <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 inline-flex items-center gap-1 overflow-x-auto max-w-full shadow-2xs">
          <button
            onClick={() => setStationTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              stationTab === 'overview'
                ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Arrival & Departure Boards
          </button>
          <button
            onClick={() => setStationTab('platforms')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              stationTab === 'platforms'
                ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Platform Intelligence & Conflicts
          </button>
          <button
            onClick={() => setStationTab('crowd')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              stationTab === 'crowd'
                ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Crowd & Footfall Heatmap
          </button>
          <button
            onClick={() => setStationTab('pa')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              stationTab === 'pa'
                ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Station PA Dispatch</span>
          </button>
          <button
            onClick={() => setStationTab('staff')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              stationTab === 'staff'
                ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Ground Crew & Maintenance</span>
          </button>
          <button
            onClick={() => setStationTab('incidents')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              stationTab === 'incidents'
                ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Incident Log & Ground Reports
          </button>
        </div>
      </div>

      {/* TAB 1: ARRIVAL & DEPARTURE BOARDS */}
      {stationTab === 'overview' && (
        <div className="space-y-6">
          {/* Dynamic Arrival Board */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Live Dynamic Arrival Board
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <DataSourceBadge source="AI PREDICTION" />
                <span className="text-xs text-slate-500 font-mono">Sorted by expected arrival</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Train</th>
                    <th className="p-3.5">Origin</th>
                    <th className="p-3.5">Scheduled</th>
                    <th className="p-3.5 text-blue-700">RailSync AI ETA</th>
                    <th className="p-3.5">Delay</th>
                    <th className="p-3.5">Platform</th>
                    <th className="p-3.5">Confidence</th>
                    <th className="p-3.5">Turnaround Buffer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {trains.map(train => {
                    const assignedPf = platformAssignments[train.number]?.platform || train.platform;
                    const isConflict = train.number === '12627' && !isPlatformSwitched;
                    return (
                      <tr key={train.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 font-bold font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900">{train.number}</span>
                            <span className="text-[11px] text-slate-500 font-sans font-normal truncate max-w-[140px]">
                              {train.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600">{train.origin}</td>
                        <td className="p-3.5 font-mono text-slate-500">{train.scheduledArrival}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900 text-sm bg-blue-50/40">
                          {train.predictedArrival}
                        </td>
                        <td className="p-3.5">
                          <DelayBadge delayMin={train.predictedDelayMin} />
                        </td>
                        <td className="p-3.5 font-mono font-bold">
                          <span
                            className={`px-2 py-1 rounded border ${
                              isConflict
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : isPlatformSwitched && train.number === '12627'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            PF {assignedPf}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <ConfidenceBadge confidence={train.confidence} />
                        </td>
                        <td className="p-3.5 text-slate-600 font-mono">
                          {train.predictedDelayMin > 8 ? (
                            <span className="text-amber-700 font-semibold">18m (Tight)</span>
                          ) : (
                            <span className="text-emerald-700 font-medium">32m (Normal)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLATFORM INTELLIGENCE & CONFLICTS */}
      {stationTab === 'platforms' && (
        <div className="space-y-6">
          {/* AI Recommendation Spotlight Card */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Platform Occupancy Warning
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                      High Conflict Probability (78%)
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Platform 5 Overlap: Train 12627 (ETA 8:29 PM) overlaps Train 12028 Turnaround
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    Train 12627 delay (+9m) causes rake arrival to intersect with Train 12028 scheduled maintenance slot on Platform 5.
                  </p>
                  <p className="text-xs text-blue-700 font-semibold mt-2">
                    ✦ AI Suggested Alternative: Reassign Train 12627 to Platform 6 (Platform 6 clear from 8:15 PM to 9:10 PM).
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const newPf = isPlatformSwitched ? 5 : 6;
                    reassignPlatform('12627', newPf, 'Station Staff executed AI recommendation to clear turnaround overlap');
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                    isPlatformSwitched
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                  <span>{isPlatformSwitched ? 'Revert to Platform 5' : 'Execute AI Reassignment to PF 6'}</span>
                </button>
                <span className="text-[10px] text-slate-500 text-center font-mono">
                  LOGGED IN AUDIT LEDGER • STATION MASTER CLEARANCE
                </span>
              </div>
            </div>
          </div>

          {/* Visual Platform Gantt Occupancy Timeline */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Platform Occupancy Timeline (20:00 – 21:30)
                </h3>
                <p className="text-xs text-slate-500">
                  Gantt view of platform track bookings, turnaround slots, and buffer gaps
                </p>
              </div>
              <DataSourceBadge source="AI PREDICTION" />
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Platform 1 */}
              <div className="flex items-center gap-3">
                <span className="w-16 font-bold text-slate-700 shrink-0">PF 1</span>
                <div className="flex-1 bg-slate-50 rounded-lg h-9 relative border border-slate-200 overflow-hidden flex items-center px-2">
                  <div className="absolute left-[10%] w-[35%] h-6 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded flex items-center px-2 text-[11px] font-sans font-medium">
                    22691 Rajdhani (8:10 – 8:40)
                  </div>
                  <div className="absolute left-[60%] w-[30%] h-6 bg-blue-50 text-blue-800 border border-blue-200 rounded flex items-center px-2 text-[11px] font-sans font-medium">
                    12296 Sanghamitra (9:05 – 9:30)
                  </div>
                </div>
              </div>

              {/* Platform 2 */}
              <div className="flex items-center gap-3">
                <span className="w-16 font-bold text-slate-700 shrink-0">PF 2</span>
                <div className="flex-1 bg-slate-50 rounded-lg h-9 relative border border-slate-200 overflow-hidden flex items-center px-2">
                  <div className="absolute left-[25%] w-[40%] h-6 bg-blue-50 text-blue-800 border border-blue-200 rounded flex items-center px-2 text-[11px] font-sans font-medium">
                    12028 Shatabdi Rake (8:30 – 9:10)
                  </div>
                </div>
              </div>

              {/* Platform 5 (The Conflict Platform) */}
              <div className="flex items-center gap-3">
                <span className="w-16 font-bold text-slate-700 shrink-0">PF 5</span>
                <div className="flex-1 bg-slate-50 rounded-lg h-9 relative border border-slate-200 overflow-hidden flex items-center px-2">
                  {!isPlatformSwitched ? (
                    <>
                      <div className="absolute left-[20%] w-[28%] h-6 bg-rose-50 text-rose-800 border border-rose-300 rounded flex items-center px-2 text-[11px] font-sans font-bold z-10 animate-pulse">
                        ⚠ 12627 Karnataka (8:29 – 8:55)
                      </div>
                      <div className="absolute left-[40%] w-[35%] h-6 bg-amber-50 text-amber-800 border border-amber-200 rounded flex items-center px-2 text-[11px] font-sans opacity-90 font-medium">
                        Turnaround Rake (8:45 – 9:20)
                      </div>
                    </>
                  ) : (
                    <div className="absolute left-[40%] w-[35%] h-6 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded flex items-center px-2 text-[11px] font-sans font-medium">
                      Turnaround Rake (8:45 – 9:20) • Conflict Cleared
                    </div>
                  )}
                </div>
              </div>

              {/* Platform 6 (The Reassigned Platform) */}
              <div className="flex items-center gap-3">
                <span className="w-16 font-bold text-slate-700 shrink-0">PF 6</span>
                <div className="flex-1 bg-slate-50 rounded-lg h-9 relative border border-slate-200 overflow-hidden flex items-center px-2">
                  {isPlatformSwitched ? (
                    <div className="absolute left-[20%] w-[32%] h-6 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded flex items-center px-2 text-[11px] font-sans font-bold shadow-xs">
                      ✓ 12627 Karnataka Reassigned (8:29 – 8:55)
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-sans italic">
                      Platform Clear (Available for Reassignment)
                    </span>
                  )}
                </div>
              </div>

              {/* Platform 7 */}
              <div className="flex items-center gap-3">
                <span className="w-16 font-bold text-slate-700 shrink-0">PF 7</span>
                <div className="flex-1 bg-slate-50 rounded-lg h-9 relative border border-slate-200 overflow-hidden flex items-center px-2">
                  <div className="absolute left-[30%] w-[32%] h-6 bg-blue-50 text-blue-800 border border-blue-200 rounded flex items-center px-2 text-[11px] font-sans font-medium">
                    12678 Intercity (8:35 – 9:05)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STATION CROWD INTELLIGENCE */}
      {stationTab === 'crowd' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Crowd Density Index
              </h3>

              <div className="text-center py-2">
                <div className="text-5xl font-black text-amber-600 font-mono">78%</div>
                <span className="text-xs text-slate-500 font-medium">Station Concourse Occupancy</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Predicted Peak:</span>
                  <span className="font-mono text-slate-900 font-semibold">8:30 PM – 8:50 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Peak Density Forecast:</span>
                  <span className="font-mono text-rose-600 font-bold">91% (HIGH)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Critical Area:</span>
                  <span className="text-amber-700 font-medium">Platform 5 & FOB 2</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Platform Footfall Density Distribution
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { pf: 'PF 1 & 2 (Main Concierge)', density: 64, count: '1,420 passengers', status: 'Moderate' },
                  { pf: 'PF 3 & 4 (Suburban Loop)', density: 42, count: '890 passengers', status: 'Normal' },
                  { pf: 'PF 5 & 6 (Express Rakes)', density: 88, count: '2,340 passengers', status: 'High Peak' },
                  { pf: 'PF 7 & 8 (Intercity Terminal)', density: 55, count: '1,110 passengers', status: 'Moderate' },
                  { pf: 'PF 9 & 10 (Freight & Bypass)', density: 18, count: '240 crew', status: 'Low' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{item.pf}</span>
                      <span className="text-slate-500 font-mono">
                        {item.count} • <strong className={item.density > 75 ? 'text-rose-600' : 'text-slate-700'}>{item.density}%</strong>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div
                        className={`h-2 rounded-full ${
                          item.density > 75 ? 'bg-rose-500' : item.density > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.density}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STATION PA DISPATCH & PASSENGER BROADCAST (STATION STAFF EXCLUSIVE) */}
      {stationTab === 'pa' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Automated Public Address (PA) Synthesizer</h2>
              <p className="text-xs text-slate-500">
                Trigger high-priority audio announcements and visual LED display boards across station terminals
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>PA Audio Bus: Online</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Announcement Dispatch Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600" />
                <span>Compose Station Announcement</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Target Coaching Train</label>
                  <select
                    value={paTrain}
                    onChange={e => setPaTrain(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  >
                    {trains.map(t => (
                      <option key={t.number} value={t.number}>
                        {t.number} — {t.name} (ETA: {t.predictedArrival})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Target Platform</label>
                    <select
                      value={paPlatform}
                      onChange={e => setPaPlatform(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(pf => (
                        <option key={pf} value={pf}>Platform {pf}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Broadcast Language</label>
                    <div className="grid grid-cols-4 gap-1">
                      {(['EN', 'HI', 'KN', 'TA'] as const).map(l => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setPaLang(l)}
                          className={`py-2 rounded-lg font-bold text-xs border transition ${
                            paLang === l
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono">
                  <span className="text-[10px] text-slate-400 font-sans block uppercase font-bold mb-1">
                    Announcement Preview Script
                  </span>
                  "Attention please: Train number {paTrain} {trains.find(t => t.number === paTrain)?.name} arriving shortly on platform number {paPlatform}. Inconvenience caused is deeply regretted."
                </div>

                <button
                  onClick={handleBroadcastAnnouncement}
                  disabled={isBroadcasting}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                    isBroadcasting
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isBroadcasting ? 'Broadcasting Over Platform Speakers...' : 'Trigger Platform PA Announcement'}</span>
                </button>
              </div>
            </div>

            {/* Broadcast Activity Log */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Recent PA Transmission History</span>
                <span className="text-[10px] text-emerald-600 font-semibold font-mono">All Amps Operational</span>
              </h3>

              <div className="space-y-2 text-xs">
                {paBroadcastLog.map((log, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed font-mono text-[11px]">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GROUND CREW & MAINTENANCE (STATION STAFF EXCLUSIVE) */}
      {stationTab === 'staff' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Ground Crew & Turnaround Maintenance Roster</h2>
              <p className="text-xs text-slate-500">
                Live delegation for carriage watering, mechanical TXR rake inspection, and bio-toilet servicing
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>Shift: General Evening (18:00–02:00)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crewTasks.map(task => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{task.train}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      task.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-700">{task.task}</h4>
                  <p className="text-[11px] text-slate-500">Assigned: {task.crew} • {task.time}</p>
                </div>

                <button
                  onClick={() => handleToggleCrewTask(task.id)}
                  className={`p-2 rounded-lg transition ${
                    task.status === 'COMPLETED'
                      ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                      : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                  }`}
                  title={task.status === 'COMPLETED' ? 'Mark Pending' : 'Mark Completed'}
                >
                  {task.status === 'COMPLETED' ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: STATION INCIDENT LOG & GROUND REPORTS */}
      {stationTab === 'incidents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Station Ground Observations & Safety Notes
            </h3>
            <span className="text-xs text-slate-500 font-mono">Synced with Divisional HQ</span>
          </div>

          {/* Report Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>File Ground Maintenance or Platform Note</span>
            </h4>

            {incidentSubmitted && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Ground report submitted and forwarded to Section Controller.</span>
              </div>
            )}

            <form onSubmit={handleLogIncident} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Station Area / Platform</label>
                  <input
                    type="text"
                    required
                    value={incidentLocation}
                    onChange={e => setIncidentLocation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Issue Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Water hose pressure drop on PF 3 hydrant"
                    value={incidentTitle}
                    onChange={e => setIncidentTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ground Report</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Disruption Log Display */}
          <div className="space-y-3">
            {disruptions.map(disr => (
              <div
                key={disr.id}
                className="p-4 rounded-xl bg-white border border-slate-200/90 flex items-start justify-between gap-3 text-xs shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{disr.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                      +{disr.impactMin}m impact
                    </span>
                  </div>
                  <p className="text-slate-600">{disr.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-slate-500 text-[11px]">
                    <span>Location: {disr.location}</span>
                    <span>•</span>
                    <span>Affects: {disr.affectedTrainNumbers.join(', ')}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCopilotOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition shrink-0"
                >
                  Action Guide
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
