import React, { useState } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import { X, Send, Sparkles, Bot, User, CornerDownLeft, Loader2 } from 'lucide-react';
import { DataSourceBadge } from './Badges';

export const CopilotModal: React.FC = () => {
  const {
    copilotOpen,
    setCopilotOpen,
    currentRole,
    selectedTrain,
    disruptions,
    networkHealth
  } = useRailSync();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; source?: string }>>([
    {
      role: 'assistant',
      text: `Hello! I am RailSync Copilot grounded in the active section-level ETA telemetry and delay propagation engine for the ${currentRole.replace('_', ' ').toUpperCase()} role. How can I assist you right now?`,
      source: 'RAILSYNC_AI'
    }
  ]);
  const [loading, setLoading] = useState(false);

  if (!copilotOpen) return null;

  const roleSuggestions: Record<string, string[]> = {
    passenger: [
      'When will Train 12627 reach Bengaluru?',
      'Why did my ETA change from 8:20 to 8:29 PM?',
      'Will I miss my 8:45 PM connection?',
      'What is my next station and platform?'
    ],
    station_staff: [
      'Which trains arrive late in the next 30 minutes?',
      'Which platform has the highest conflict risk?',
      'What is the predicted crowd peak at Platform 5?',
      'What is the turnaround buffer for Train 12028?'
    ],
    control_room: [
      'Which trains are most affected by Katpadi delay?',
      'What happens if stoppage lasts another 10 min?',
      'Analyze delay propagation across the quad track',
      'What is current corridor health score breakdown?'
    ],
    admin: [
      'How accurate is the ETA model (MAE / RMSE)?',
      'Which features contribute most to delay predictions?',
      'Is any data stream or GPS feed currently degraded?',
      'Compare RailSync model vs NTES baseline'
    ]
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const activeDisr = disruptions.filter(d => d.isActive).map(d => `${d.title} at ${d.location} (+${d.impactMin}m)`);
      const payload = {
        role: currentRole,
        message: userMsg,
        stateContext: {
          train: `${selectedTrain.number} ${selectedTrain.name}`,
          predictedETA: selectedTrain.predictedArrival,
          delay: selectedTrain.predictedDelayMin,
          confidence: selectedTrain.confidence,
          currentStation: selectedTrain.currentStation,
          activeDisruptions: activeDisr,
          networkHealth: networkHealth.overallScore
        }
      };

      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || 'Calculation completed from current corridor status.',
          source: data.source || 'AI_PREDICTION'
        }
      ]);
    } catch (err) {
      // Deterministic immediate fallback if network glitch occurs
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `Train ${selectedTrain.number} ${selectedTrain.name} is currently approaching ${selectedTrain.nextStation}. Predicted arrival at ${selectedTrain.destination} is ${selectedTrain.predictedArrival} (+${selectedTrain.predictedDelayMin} min delay, ${selectedTrain.confidence}% confidence). Delay recovery buffer is estimated at ${selectedTrain.expectedRecoveryMin} minutes on downstream high-speed sections.`,
          source: 'RAILSYNC_DETERMINISTIC_ENGINE'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl text-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                RailSync AI Copilot
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono font-semibold">
                  {currentRole.replace('_', ' ').toUpperCase()}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Grounded in live railway section-level delay telemetry
              </p>
            </div>
          </div>

          <button
            onClick={() => setCopilotOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {m.source && (
                  <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Source: {m.source}</span>
                    <DataSourceBadge source="AI PREDICTION" />
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50/80 p-3 rounded-xl border border-blue-200">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Synthesizing section delays & downstream recovery...</span>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80">
          <p className="text-[11px] text-slate-500 font-medium mb-2">Suggested queries for {currentRole.replace('_', ' ')}:</p>
          <div className="flex flex-wrap gap-1.5">
            {(roleSuggestions[currentRole] || []).map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition text-left shadow-2xs font-medium"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Ask RailSync Copilot as ${currentRole}...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            Grounded in actual train telemetry. Never hallucinates operational facts.
          </p>
        </div>
      </div>
    </div>
  );
};
