import React, { useState, useEffect, useRef } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import { X, Mic, MicOff, Volume2, VolumeX, Sparkles, Loader2, Play } from 'lucide-react';
import { DataSourceBadge } from './Badges';

export const VoiceAssistantModal: React.FC = () => {
  const {
    voiceModalOpen,
    setVoiceModalOpen,
    selectedTrain,
    currentRole
  } = useRailSync();

  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'error'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [spokenResponse, setSpokenResponse] = useState<string>('');
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!voiceModalOpen) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setVoiceState('idle');
      return;
    }
  }, [voiceModalOpen]);

  if (!voiceModalOpen) return null;

  const speakText = (text: string) => {
    if (audioMuted || !window.speechSynthesis) {
      setVoiceState('idle');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setVoiceState('speaking');
    utterance.onend = () => setVoiceState('idle');
    utterance.onerror = () => setVoiceState('idle');
    window.speechSynthesis.speak(utterance);
  };

  const executeVoiceQuery = (queryText: string) => {
    setTranscript(queryText);
    setVoiceState('processing');

    setTimeout(() => {
      let reply = '';
      const q = queryText.toLowerCase();

      if (q.includes('bengaluru') || q.includes('arrive') || q.includes('when') || q.includes('reach')) {
        reply = `Train ${selectedTrain.number} Karnataka Express is expected to reach KSR Bengaluru at ${selectedTrain.predictedArrival}. Current predicted delay is ${selectedTrain.predictedDelayMin} minutes with ${selectedTrain.confidence}% confidence. Next station is ${selectedTrain.nextStation}.`;
      } else if (q.includes('why') || q.includes('delay')) {
        reply = `The delay is primarily due to signal congestion approaching Katpadi Junction. Approximately 4 minutes of recovery is expected on the downstream high-speed quad section.`;
      } else if (q.includes('connection') || q.includes('miss')) {
        reply = `Your connecting train has a 16-minute buffer at KSR Bengaluru. Connection safety probability is currently calculated at 82%, categorized as Safe.`;
      } else {
        reply = `RailSync ETA status: Train ${selectedTrain.number} is running between ${selectedTrain.currentStation} and ${selectedTrain.nextStation}. Predicted destination ETA is ${selectedTrain.predictedArrival}.`;
      }

      setSpokenResponse(reply);
      speakText(reply);
    }, 600);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
          setVoiceState('listening');
          setTranscript('Listening for your railway query...');
        };

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          executeVoiceQuery(text);
        };

        recognition.onerror = () => {
          // Fallback simulation if permission or sandbox prevents mic
          simulateListeningQuery('When will Train 12627 reach Bengaluru?');
        };

        recognition.start();
        return;
      } catch (err) {
        // Fallback simulation
      }
    }

    // Fallback if browser doesn't permit Web Speech
    simulateListeningQuery('When will Train 12627 reach Bengaluru?');
  };

  const simulateListeningQuery = (sampleText: string) => {
    setVoiceState('listening');
    setTranscript('Listening...');
    setTimeout(() => {
      setTranscript(`"${sampleText}"`);
      executeVoiceQuery(sampleText);
    }, 1200);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setVoiceState('idle');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-slate-800 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            stopListening();
            setVoiceModalOpen(false);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-900 flex items-center gap-2">
              RailSync Voice Assistant
              <DataSourceBadge source="AI PREDICTION" />
            </h3>
            <p className="text-xs text-slate-500">
              Speak naturally in English or query via rapid railway prompts
            </p>
          </div>
        </div>

        {/* Central Animated Visualizer */}
        <div className="my-6 flex flex-col items-center justify-center py-6 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden">
          {/* Audio wave rings */}
          <div className="relative flex items-center justify-center">
            {voiceState === 'listening' && (
              <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping" />
            )}
            {voiceState === 'speaking' && (
              <div className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-pulse" />
            )}

            <button
              onClick={() => {
                if (voiceState === 'listening') stopListening();
                else startListening();
              }}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md ${
                voiceState === 'listening'
                  ? 'bg-rose-600 text-white shadow-rose-600/30 scale-105'
                  : voiceState === 'speaking'
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
              }`}
            >
              {voiceState === 'listening' ? (
                <MicOff className="w-8 h-8" />
              ) : voiceState === 'processing' ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Voice State Indicator */}
          <div className="mt-4 text-center">
            <span
              className={`text-xs font-mono font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                voiceState === 'listening'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  : voiceState === 'processing'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : voiceState === 'speaking'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              State: {voiceState}
            </span>
          </div>

          {/* Transcript / Spoken Result */}
          <div className="mt-3 px-6 text-center max-w-sm">
            {transcript && (
              <p className="text-xs text-blue-700 font-semibold italic mb-1">
                "{transcript}"
              </p>
            )}
            {spokenResponse ? (
              <p className="text-xs text-slate-800 leading-relaxed font-sans mt-2 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                {spokenResponse}
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Tap the microphone or select a railway query below to test
              </p>
            )}
          </div>
        </div>

        {/* Quick Sample Voice Queries */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Click to ask by voice:</span>
            <button
              onClick={() => setAudioMuted(!audioMuted)}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition font-medium"
            >
              {audioMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{audioMuted ? 'Muted' : 'Audio On'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => executeVoiceQuery('When will Train 12627 reach Bengaluru?')}
              className="p-2.5 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition flex items-center justify-between shadow-2xs font-medium"
            >
              <span>"When will Train 12627 reach Bengaluru?"</span>
              <Play className="w-3 h-3 text-blue-600 shrink-0 ml-1" />
            </button>

            <button
              onClick={() => executeVoiceQuery('Why is my train delayed?')}
              className="p-2.5 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition flex items-center justify-between shadow-2xs font-medium"
            >
              <span>"Why is my train delayed?"</span>
              <Play className="w-3 h-3 text-blue-600 shrink-0 ml-1" />
            </button>

            <button
              onClick={() => executeVoiceQuery('Will I miss my connection?')}
              className="p-2.5 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition flex items-center justify-between shadow-2xs font-medium"
            >
              <span>"Will I miss my connection?"</span>
              <Play className="w-3 h-3 text-blue-600 shrink-0 ml-1" />
            </button>

            <button
              onClick={() => executeVoiceQuery('What is the latest ETA?')}
              className="p-2.5 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition flex items-center justify-between shadow-2xs font-medium"
            >
              <span>"What is the latest ETA?"</span>
              <Play className="w-3 h-3 text-blue-600 shrink-0 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
