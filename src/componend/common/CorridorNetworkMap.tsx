import React, { useState } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import { CORRIDOR_SECTIONS } from '../../data/mockRailwayData';
import { DataSourceBadge } from './Badges';
import { AlertTriangle, TrainTrack, Compass, Zap, Info } from 'lucide-react';

interface StationCoord {
  code: string;
  name: string;
  x: number;
  y: number;
  km: number;
  platforms: number;
}

const STATIONS: StationCoord[] = [
  { code: 'MAS', name: 'Chennai Central', x: 70, y: 130, km: 0, platforms: 12 },
  { code: 'AJJ', name: 'Arakkonam Jn', x: 230, y: 130, km: 69, platforms: 6 },
  { code: 'KPD', name: 'Katpadi Jn', x: 390, y: 140, km: 130, platforms: 6 },
  { code: 'JTJ', name: 'Jolarpettai Jn', x: 570, y: 155, km: 214, platforms: 5 },
  { code: 'KJM', name: 'Krishnarajapuram', x: 740, y: 145, km: 342, platforms: 4 },
  { code: 'SBC', name: 'KSR Bengaluru', x: 890, y: 130, km: 356, platforms: 10 }
];

export const CorridorNetworkMap: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    trains,
    selectedTrainId,
    setSelectedTrainId,
    disruptions,
    selectedStationCode,
    setSelectedStationCode,
    triggerDisruption
  } = useRailSync();

  const [hoveredStation, setHoveredStation] = useState<StationCoord | null>(null);

  // Position trains along the horizontal schematic based on progressKm (0 to 356 km)
  const getTrainPosition = (progressKm: number, trainId: string) => {
    const minX = 70;
    const maxX = 890;
    const ratio = Math.max(0, Math.min(1, progressKm / 356));
    const x = minX + ratio * (maxX - minX);
    // Offset alternating trains vertically so they don't overlap
    const yOffset = trainId === '12028' ? -18 : trainId === '12296' ? 22 : trainId === '16528' ? 14 : 0;
    const y = 135 + yOffset;
    return { x, y };
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 text-slate-800 overflow-hidden relative shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <TrainTrack className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-2">
              Chennai Central ➔ KSR Bengaluru Quad Corridor
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-semibold border border-blue-200">
                356 KM • 130 km/h
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Live block-section signal interlocking & dynamic train GPS telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge source="LIVE DATA" />
          <button
            onClick={() => triggerDisruption('SIGNAL_CONGESTION', 'Signal Interlock Congestion', 'Katpadi Jn Approach', 'KPD', 10)}
            className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition flex items-center gap-1.5 font-semibold shadow-2xs"
            title="Simulate signal delay at Katpadi Jn"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Inject Katpadi Delay (+10m)</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto bg-slate-50/50 rounded-xl p-2 border border-slate-100">
        <svg
          viewBox="0 0 960 250"
          className={`w-full ${compact ? 'h-44' : 'h-60'} min-w-[720px] select-none`}
        >
          <defs>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#dc2626" stopOpacity="0.95" />
              <stop offset="65%" stopColor="#059669" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.9" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Background grid markings */}
          <line x1="70" y1="40" x2="890" y2="40" stroke="#cbd5e1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="70" y1="210" x2="890" y2="210" stroke="#cbd5e1" strokeDasharray="3 3" opacity="0.6" />

          {/* Track ballast background */}
          <path
            d="M 70 135 L 230 135 L 390 140 L 570 155 L 740 145 L 890 135"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* High speed / Main Track Line */}
          <path
            d="M 70 135 L 230 135 L 390 140 L 570 155 L 740 145 L 890 135"
            fill="none"
            stroke="url(#trackGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Railway Ties / Sleepers along track */}
          {Array.from({ length: 42 }).map((_, i) => {
            const ratio = i / 41;
            const x = 70 + ratio * 820;
            // Interpolate y
            const y = 135 + Math.sin(ratio * Math.PI) * 15;
            return (
              <line
                key={`tie-${i}`}
                x1={x}
                y1={y - 6}
                x2={x}
                y2={y + 6}
                stroke="#94a3b8"
                strokeWidth="1.5"
                opacity="0.8"
              />
            );
          })}

          {/* Section Congestion zones */}
          {CORRIDOR_SECTIONS.map((sec, idx) => {
            if (sec.congestionLevel === 'HIGH' || sec.speedRestrictionKmH) {
              return (
                <g key={`zone-${sec.id}`}>
                  <rect
                    x={230}
                    y={110}
                    width={160}
                    height={55}
                    rx="8"
                    fill="#fee2e2"
                    fillOpacity="0.6"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text x={310} y={105} fill="#dc2626" fontSize="10" textAnchor="middle" fontWeight="700">
                    ⚠ Signal Congestion Zone (+10 min)
                  </text>
                </g>
              );
            }
            return null;
          })}

          {/* Stations */}
          {STATIONS.map(st => {
            const isSelected = selectedStationCode === st.code;
            const isHovered = hoveredStation?.code === st.code;
            const hasDisruption = disruptions.some(d => d.isActive && d.stationCode === st.code);

            return (
              <g
                key={st.code}
                className="cursor-pointer transition-transform"
                onClick={() => setSelectedStationCode(st.code)}
                onMouseEnter={() => setHoveredStation(st)}
                onMouseLeave={() => setHoveredStation(null)}
              >
                {/* Station circle base */}
                <circle
                  cx={st.x}
                  cy={st.y}
                  r={isSelected ? 10 : 8}
                  fill={hasDisruption ? '#ef4444' : isSelected ? '#2563eb' : '#ffffff'}
                  stroke={hasDisruption ? '#b91c1c' : isSelected ? '#1d4ed8' : '#475569'}
                  strokeWidth={isSelected ? 3 : 2}
                  filter={isSelected ? 'url(#glow)' : undefined}
                />
                <circle cx={st.x} cy={st.y} r={3} fill={isSelected || hasDisruption ? '#ffffff' : '#0f172a'} />

                {/* Station Label */}
                <text
                  x={st.x}
                  y={st.y - 20}
                  fill={isSelected ? '#1d4ed8' : '#0f172a'}
                  fontSize={isSelected ? '13' : '11'}
                  fontWeight={isSelected ? '800' : '700'}
                  textAnchor="middle"
                >
                  {st.code}
                </text>
                <text
                  x={st.x}
                  y={st.y + 25}
                  fill="#475569"
                  fontSize="9.5"
                  fontWeight="600"
                  textAnchor="middle"
                  className="hidden sm:block"
                >
                  {st.name.split(' ')[0]}
                </text>
                <text
                  x={st.x}
                  y={st.y + 36}
                  fill="#64748b"
                  fontSize="8.5"
                  textAnchor="middle"
                >
                  {st.km} km
                </text>
              </g>
            );
          })}

          {/* Trains Live on Track */}
          {trains.map(train => {
            const pos = getTrainPosition(train.progressKm, train.id);
            const isSelected = selectedTrainId === train.id;
            const isDelayed = train.predictedDelayMin > 5;

            return (
              <g
                key={train.id}
                className="cursor-pointer transition-all duration-500"
                onClick={() => setSelectedTrainId(train.id)}
              >
                {/* Train pulse ring when selected or delayed */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="20"
                    fill={isDelayed ? '#ef4444' : '#3b82f6'}
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Train marker body */}
                <rect
                  x={pos.x - 22}
                  y={pos.y - 12}
                  width="44"
                  height="24"
                  rx="6"
                  fill={isSelected ? (isDelayed ? '#dc2626' : '#2563eb') : '#0f172a'}
                  stroke={isDelayed ? '#fca5a5' : isSelected ? '#93c5fd' : '#334155'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />

                {/* Train Number Text */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {train.number}
                </text>

                {/* Speed & Delay badge above train */}
                <g transform={`translate(${pos.x - 32}, ${pos.y - 32})`}>
                  <rect
                    x="0"
                    y="0"
                    width="64"
                    height="16"
                    rx="4"
                    fill="#ffffff"
                    stroke={isDelayed ? '#ef4444' : '#10b981'}
                    strokeWidth="1.5"
                  />
                  <text
                    x="32"
                    y="11"
                    fill={isDelayed ? '#b91c1c' : '#047857'}
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {isDelayed ? `+${train.predictedDelayMin}m` : 'On Time'} • {train.currentSpeedKmH}k
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Corridor Legend & Telemetry Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Track Interlock Clear (110 km/h)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Caution Order Zone
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            Signal Congestion / Restricted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-blue-600 border border-blue-400" />
            Selected Rake ({selectedTrainId})
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
          <span>GPS Telemetry Refresh: 4s</span>
          <span>•</span>
          <span>Section Headway: 6.2 km</span>
        </div>
      </div>
    </div>
  );
};
