import React, { useState } from 'react';
import { GitFork, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2, Train, Info } from 'lucide-react';
import { DataSourceBadge } from './Badges';

interface NodeInfo {
  id: string;
  station: string;
  stationCode: string;
  distanceKm: number;
  delayMin: number;
  propagationMin: number;
  connectionRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  affectedDownstreamTrains: string[];
  notes: string;
}

export const DelayPropagationGraph: React.FC<{ className?: string }> = ({ className = '' }) => {
  const nodes: NodeInfo[] = [
    {
      id: 'mas',
      station: 'Chennai Central',
      stationCode: 'MAS',
      distanceKm: 0,
      delayMin: 0,
      propagationMin: 0,
      connectionRisk: 'LOW',
      affectedDownstreamTrains: [],
      notes: 'Departed on time with clear starter signal.'
    },
    {
      id: 'ajj',
      station: 'Arakkonam Jn',
      stationCode: 'AJJ',
      distanceKm: 69,
      delayMin: 7,
      propagationMin: 7,
      connectionRisk: 'LOW',
      affectedDownstreamTrains: ['12028 Shatabdi'],
      notes: 'Signal restriction at AJJ outer home (+7m added).'
    },
    {
      id: 'kpd',
      station: 'Katpadi Jn',
      stationCode: 'KPD',
      distanceKm: 130,
      delayMin: 9,
      propagationMin: 9,
      connectionRisk: 'MEDIUM',
      affectedDownstreamTrains: ['16528 Kannur Express', '12628 Karnataka (Up)'],
      notes: 'Platform 3 congestion; loop track hold (+9m cumulative).'
    },
    {
      id: 'jtj',
      station: 'Jolarpettai Jn',
      stationCode: 'JTJ',
      distanceKm: 214,
      delayMin: 14,
      propagationMin: 11,
      connectionRisk: 'HIGH',
      affectedDownstreamTrains: ['22691 Rajdhani', '16528 Kannur Exp'],
      notes: 'Critical connection risk: 14 passengers connecting to Salem mainline.'
    },
    {
      id: 'bwt',
      station: 'Bangarapet Jn',
      stationCode: 'BWT',
      distanceKm: 289,
      delayMin: 12,
      propagationMin: 8,
      connectionRisk: 'MEDIUM',
      affectedDownstreamTrains: ['66531 MEMU'],
      notes: 'Speed headroom buffer recovery: 2 minutes recovered on grade descent.'
    },
    {
      id: 'sbc',
      station: 'KSR Bengaluru',
      stationCode: 'SBC',
      distanceKm: 356,
      delayMin: 11,
      propagationMin: 0,
      connectionRisk: 'LOW',
      affectedDownstreamTrains: [],
      notes: 'Final forecasted destination arrival: 18:47 (+11m delay, 89% confidence).'
    }
  ];

  const [selectedNode, setSelectedNode] = useState<NodeInfo>(nodes[2]); // Katpadi by default

  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Network Delay Propagation Graph
            </h3>
            <p className="text-[11px] text-slate-500">
              Graph Neural Network (GNN) downstream cascading forecast across MAS-SBC Quad Corridor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge source="AI PREDICTION" />
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            6 Nodes • 356 km
          </span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Horizontal Network Flow Pipeline */}
        <div className="overflow-x-auto pb-3">
          <div className="min-w-[650px] flex items-center justify-between relative px-4">
            {/* Background connecting rail track line */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />

            {nodes.map((node, idx) => {
              const isSelected = selectedNode.id === node.id;
              const hasCriticalRisk = node.connectionRisk === 'HIGH';
              const hasMediumRisk = node.connectionRisk === 'MEDIUM';

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`relative z-10 flex flex-col items-center group focus:outline-none transition-all ${
                    isSelected ? 'scale-105' : 'hover:scale-102'
                  }`}
                >
                  {/* Circular Node Glyph */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-xs border-2 transition-all ${
                      isSelected
                        ? 'bg-[#0F2747] text-white border-blue-500 ring-4 ring-blue-100'
                        : hasCriticalRisk
                        ? 'bg-rose-50 text-rose-800 border-rose-400'
                        : hasMediumRisk
                        ? 'bg-amber-50 text-amber-800 border-amber-400'
                        : 'bg-white text-slate-700 border-slate-300 group-hover:border-slate-400'
                    }`}
                  >
                    {node.stationCode}
                  </div>

                  {/* Delay & Station Label */}
                  <div className="mt-2 text-center">
                    <span className="text-xs font-bold text-slate-800 block">
                      {node.station}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                        node.delayMin > 10
                          ? 'bg-rose-100 text-rose-800'
                          : node.delayMin > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      +{node.delayMin}m
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Node Inspection Detail Card */}
        {selectedNode && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Selected Section Node
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-bold text-slate-900 font-mono">
                  {selectedNode.station} ({selectedNode.stationCode})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Distance: {selectedNode.distanceKm} km from origin
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Cascading Impact & Risk
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    selectedNode.connectionRisk === 'HIGH'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : selectedNode.connectionRisk === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {selectedNode.connectionRisk} Connection Risk
                </span>
                <span className="text-xs font-mono text-slate-600">
                  +{selectedNode.propagationMin}m downstream
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5">
                {selectedNode.notes}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Potentially Affected Trains ({selectedNode.affectedDownstreamTrains.length})
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {selectedNode.affectedDownstreamTrains.length > 0 ? (
                  selectedNode.affectedDownstreamTrains.map((train, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700"
                    >
                      {train}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-700 font-medium">
                    No downstream train holds required
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
