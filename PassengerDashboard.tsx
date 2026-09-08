import React, { useState } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import {
  Train as TrainIcon,
  Search,
  MapPin,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  QrCode,
  Sparkles,
  ChevronRight,
  Calendar,
  Layers,
  Building2,
  Radio,
  Bell,
  Trash2,
  Phone,
  MessageSquare,
  Coffee,
  Accessibility,
  Droplets,
  Users,
  Info
} from 'lucide-react';
import { DataSourceBadge, ConfidenceBadge, DelayBadge } from '../common/Badges';
import { CorridorNetworkMap } from '../common/CorridorNetworkMap';
import { PassengerMobileNav } from './PassengerMobileNav';
import { ETAHero } from '../common/ETAHero';
import { ExplainableAICard } from '../common/ExplainableAICard';

export const PassengerDashboard: React.FC = () => {
  const {
    trains,
    selectedTrain,
    setSelectedTrainId,
    alerts,
    bookings,
    createBooking,
    setCopilotOpen,
    passengerTab,
    setPassengerTab,
    smsSubscriptions,
    subscribeSmsAlert,
    removeSmsAlert
  } = useRailSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: 'Aayush Sharma',
    seatClass: '3A',
    trainNumber: '12627'
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // SMS Alert Subscription Form State
  const [smsPhone, setSmsPhone] = useState('+91 98450 88219');
  const [smsTrain, setSmsTrain] = useState(selectedTrain.number);
  const [smsThreshold, setSmsThreshold] = useState(5);
  const [smsChannel, setSmsChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [smsSuccessNotice, setSmsSuccessNotice] = useState(false);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trainObj = trains.find(t => t.number === smsTrain) || selectedTrain;
    subscribeSmsAlert(smsTrain, trainObj.name, smsPhone, smsThreshold, smsChannel);
    setSmsSuccessNotice(true);
    setTimeout(() => setSmsSuccessNotice(false), 3000);
  };

  const filteredTrains = trains.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.number.includes(searchQuery) ||
    t.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking({
      trainNumber: selectedTrain.number,
      trainName: selectedTrain.name,
      from: selectedTrain.origin,
      to: selectedTrain.destination,
      date: '05 Sep 2026',
      seatClass: bookingForm.seatClass,
      coach: bookingForm.seatClass === '1A' ? 'H1' : bookingForm.seatClass === '2A' ? 'A2' : 'B4',
      berth: `${Math.floor(10 + Math.random() * 50)} (Lower)`,
      passengerName: bookingForm.name,
      fare: bookingForm.seatClass === '2A' ? 1420 : 765,
      scheduledArrival: selectedTrain.scheduledArrival,
      predictedArrival: selectedTrain.predictedArrival
    });
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalOpen(false);
      setPassengerTab('bookings');
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Passenger Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 inline-flex items-center gap-1 overflow-x-auto max-w-full shadow-2xs">
          <button
            onClick={() => setPassengerTab('home')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition font-semibold whitespace-nowrap ${
              passengerTab === 'home'
                ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setPassengerTab('details')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition font-semibold whitespace-nowrap ${
              passengerTab === 'details'
                ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Train Details & ETA
          </button>
          <button
            onClick={() => setPassengerTab('map')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition font-semibold whitespace-nowrap ${
              passengerTab === 'map'
                ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Live Map
          </button>
          <button
            onClick={() => setPassengerTab('bookings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition font-semibold whitespace-nowrap ${
              passengerTab === 'bookings'
                ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            My Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setPassengerTab('amenities')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition font-semibold whitespace-nowrap ${
              passengerTab === 'amenities'
                ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Station Amenities
          </button>
          <button
            onClick={() => setPassengerTab('sms')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition font-semibold whitespace-nowrap ${
              passengerTab === 'sms'
                ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Live SMS / WhatsApp ({smsSubscriptions.length})
          </button>
          <button
            onClick={() => setPassengerTab('alerts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition font-semibold whitespace-nowrap ${
              passengerTab === 'alerts'
                ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            ETA Alerts ({alerts.length})
          </button>
        </div>

        <button
          onClick={() => setBookingModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs shadow-blue-500/15"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Demo Ticket Booking</span>
        </button>
      </div>

      {/* VIEW 1: HOME */}
      {passengerTab === 'home' && (
        <div className="space-y-6">
          {/* Top My Journey Hero Container */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 font-mono block">
                  Passenger Live Journey
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                  My Journey
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#0F2747] text-white font-mono font-bold text-xs">
                    Train {selectedTrain.number}
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {selectedTrain.origin} → {selectedTrain.destination}
                  </span>
                </div>
              </div>

              {/* Search / Train Switcher */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Switch train (e.g. 12627)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 shadow-2xs transition"
                />
              </div>
            </div>

            {/* Expected Arrival Hero Card */}
            <ETAHero
              trainNumber={selectedTrain.number}
              trainName={selectedTrain.name}
              origin={selectedTrain.origin}
              destination={selectedTrain.destination}
              scheduledArrival={selectedTrain.scheduledArrival}
              predictedArrival={selectedTrain.predictedArrival}
              currentDelayMin={selectedTrain.currentDelayMin}
              predictedDelayMin={selectedTrain.predictedDelayMin}
              confidence={selectedTrain.confidence}
              bestCaseArrival={selectedTrain.bestCaseArrival}
              worstCaseArrival={selectedTrain.worstCaseArrival}
              primaryCause={selectedTrain.primaryDelayCause}
              onExploreWhy={() => setPassengerTab('details')}
            />
          </div>

          {/* 1. Journey Progress Track: Chennai ●──●──●──● Bengaluru */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Live Journey Progress
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  Approaching {selectedTrain.nextStation} (PF 3)
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Current Speed: <strong className="text-slate-800 font-bold">{selectedTrain.currentSpeedKmH || 92} km/h</strong>
              </span>
            </div>

            {/* Graphical Step Track */}
            <div className="pt-2 pb-3 px-2">
              <div className="flex items-center justify-between relative">
                {/* Track line */}
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 transition-all duration-500"
                  style={{ width: '45%' }}
                />

                {/* Stops */}
                {[
                  { code: 'MAS', name: 'Chennai', status: 'COMPLETED' },
                  { code: 'AJJ', name: 'Arakkonam', status: 'COMPLETED' },
                  { code: 'KPD', name: 'Katpadi (Next)', status: 'CURRENT' },
                  { code: 'JTJ', name: 'Jolarpettai', status: 'UPCOMING' },
                  { code: 'SBC', name: 'Bengaluru', status: 'DESTINATION' }
                ].map((st) => {
                  const isCompleted = st.status === 'COMPLETED';
                  const isCurrent = st.status === 'CURRENT';
                  const isDest = st.status === 'DESTINATION';

                  return (
                    <div key={st.code} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[10px] transition-all shadow-xs ${
                          isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isDest
                            ? 'bg-[#0F2747] text-white'
                            : 'bg-white text-slate-600 border-2 border-slate-300'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : st.code}
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 mt-1.5 whitespace-nowrap">
                        {st.name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {isCurrent ? 'ETA in 14m' : isCompleted ? 'Passed' : isDest ? selectedTrain.predictedArrival : 'Scheduled'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Location, Next Station, Platform & Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Current Location</span>
                <span className="font-semibold text-slate-800">Km 114.2 (Katpadi Block)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                <span className="text-blue-600 text-[10px] uppercase font-mono block">Next Station & Platform</span>
                <span className="font-bold text-blue-800">Katpadi Jn • Platform 3</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
                <span className="text-amber-700 text-[10px] uppercase font-mono block">Connection Risk</span>
                <span className="font-bold text-amber-800">16 min buffer at SBC</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-emerald-700 text-[10px] uppercase font-mono block">Expected Recovery</span>
                <span className="font-bold text-emerald-800">-3.5 min on quad track</span>
              </div>
            </div>
          </div>

          {/* 2. ETA Evolution Timeline */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold font-mono uppercase text-blue-600 block">
                  Temporal Intelligence
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  ETA Evolution Timeline
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Updated across 4 checkpoints
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-400 block">60 min ago</span>
                <div className="text-sm font-bold font-mono text-slate-700">18:30 (On Time)</div>
                <span className="text-[10px] text-slate-500">Departed Chennai MAS</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80">
                <span className="text-[10px] font-mono text-amber-700 block">35 min ago</span>
                <div className="text-sm font-bold font-mono text-amber-800">18:52 (+22m)</div>
                <span className="text-[10px] text-amber-700">Arakkonam signal block</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80">
                <span className="text-[10px] font-mono text-emerald-700 block">15 min ago</span>
                <div className="text-sm font-bold font-mono text-emerald-800">18:49 (+19m)</div>
                <span className="text-[10px] text-emerald-700">Headway speed headroom</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-300 ring-2 ring-blue-100">
                <span className="text-[10px] font-mono text-blue-700 block font-bold">Now (AI Predicted)</span>
                <div className="text-sm font-black font-mono text-blue-900">18:47 (+17m)</div>
                <span className="text-[10px] text-blue-700 font-medium">89% Confidence Interval</span>
              </div>
            </div>
          </div>

          {/* 3. Why ETA Changed? (Explainable AI Attribution) */}
          <ExplainableAICard
            trainNumber={selectedTrain.number}
            netChangeMin={selectedTrain.predictedDelayMin}
            factors={selectedTrain.whyETAChanged}
          />

          {/* 4. Connection Risk Radar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Connection Risk Analysis at Bengaluru SBC
                  </h3>
                  <p className="text-xs text-slate-500">
                    Connecting to Train 16535 Golgumbaz Express (Departs 19:30)
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono text-xs font-bold">
                Buffer: 43 min (Tight Connection)
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              With expected arrival of 18:47 at Bengaluru City, your onward connection buffer has decreased from 60 min to 43 min. RailSync AI recommends using Platform Overbridge 2 for fastest interchange.
            </p>
          </div>

          {/* 5. Smart Alerts & SMS Subscription */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Alert */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 shadow-2xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900 block">Smart Delay Advisory</strong>
                <p className="text-amber-800 text-xs mt-0.5">
                  Preceding freight rake cleared at Katpadi loop line. Speed headroom restored to 110 km/h on Quad track.
                </p>
              </div>
            </div>

            {/* Notification Subscription */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 shadow-2xs flex items-center justify-between gap-3">
              <div>
                <strong className="font-bold text-blue-900 block">SMS & WhatsApp Alerts</strong>
                <p className="text-blue-800 text-xs mt-0.5">
                  Receive automated ETA delta notifications directly on your mobile device.
                </p>
              </div>
              <button
                onClick={() => setPassengerTab('sms')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition text-xs shrink-0 shadow-2xs"
              >
                Configure
              </button>
            </div>
          </div>

          {/* 6. AI Copilot Quick Prompt Chips */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  RailSync AI Copilot Assistant
                </span>
                <span className="text-[11px] text-slate-500">
                  Ask questions grounded in live corridor telemetry
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCopilotOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition shadow-2xs cursor-pointer"
              >
                "Where is my train?"
              </button>
              <button
                onClick={() => setCopilotOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition shadow-2xs cursor-pointer"
              >
                "When will I reach Bengaluru?"
              </button>
              <button
                onClick={() => setCopilotOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition shadow-2xs cursor-pointer"
              >
                "Why is my train delayed?"
              </button>
            </div>
          </div>

          {/* 7. My Bookings Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold font-mono uppercase text-blue-600 block">
                  Digital Tickets
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  My Bookings ({bookings.length})
                </h3>
              </div>
              <button
                onClick={() => setPassengerTab('bookings')}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition"
              >
                <span>View All Tickets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {bookings.slice(0, 1).map((bkg) => (
              <div key={bkg.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">PNR {bkg.pnr}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      CONFIRMED
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <strong>{bkg.trainNumber} {bkg.trainName}</strong> • {bkg.fromStation} → {bkg.toStation}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-slate-700">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Coach & Seat</span>
                    <span className="font-bold">{bkg.coach} - {bkg.berth}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Passenger</span>
                    <span className="font-semibold">{bkg.passengerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Class</span>
                    <span className="font-semibold">{bkg.seatClass}</span>
                  </div>
                </div>

                <button
                  onClick={() => setPassengerTab('bookings')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0F2747] hover:bg-blue-900 text-white font-bold text-xs transition shadow-2xs"
                >
                  Manage Ticket
                </button>
              </div>
            ))}
          </div>

          {/* Quick Active Alert Banner */}
          {alerts.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-3 text-xs text-amber-900 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-900 block">{alerts[0].title}</strong>
                  <p className="text-amber-800 text-xs mt-0.5">{alerts[0].message}</p>
                </div>
              </div>
              <button
                onClick={() => setPassengerTab('alerts')}
                className="text-xs px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold transition shrink-0"
              >
                View Alerts
              </button>
            </div>
          )}

          {/* Other Running Trains on the Corridor */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Active Trains on Southern Quad Corridor
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {filteredTrains.length} rakes tracked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredTrains.map(train => {
                const isSelected = selectedTrain.id === train.id;
                return (
                  <div
                    key={train.id}
                    onClick={() => {
                      setSelectedTrainId(train.id);
                      setPassengerTab('details');
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {train.number}
                      </span>
                      <DelayBadge delayMin={train.predictedDelayMin} />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 truncate">{train.name}</h4>
                    <p className="text-xs text-slate-500 truncate mb-3">
                      {train.origin} ➔ {train.destination}
                    </p>

                    <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">AI ETA</span>
                        <span className="font-mono font-bold text-slate-900 text-base">
                          {train.predictedArrival}
                        </span>
                      </div>
                      <ConfidenceBadge confidence={train.confidence} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TRAIN DETAILS & WHY ETA CHANGED */}
      {passengerTab === 'details' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Coaching Train Telemetry & Forecast
              </span>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>{selectedTrain.number} {selectedTrain.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedTrain.type}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {selectedTrain.origin} ➔ {selectedTrain.destination}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <DataSourceBadge source="AI PREDICTION" />
              <ConfidenceBadge confidence={selectedTrain.confidence} />
            </div>
          </div>

          {/* Scheduled vs Current vs RailSync AI Comparison Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              ETA Comparison & Recovery Intelligence
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 block">
                  Scheduled Arrival
                </span>
                <div className="text-2xl font-bold font-mono text-slate-800 mt-1">
                  {selectedTrain.scheduledArrival}
                </div>
                <span className="text-[10px] text-slate-500">Official IRCTC timetable</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
                <span className="text-[11px] uppercase tracking-wider text-amber-700 block font-semibold">
                  Current Observed Delay
                </span>
                <div className="text-2xl font-bold font-mono text-amber-700 mt-1">
                  +{selectedTrain.currentDelayMin} min
                </div>
                <span className="text-[10px] text-amber-600">Signal stop at Katpadi approach</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 shadow-2xs">
                <span className="text-[11px] uppercase tracking-wider text-blue-700 font-bold block">
                  RailSync Dynamic AI ETA
                </span>
                <div className="text-3xl font-black font-mono text-slate-900 mt-1">
                  {selectedTrain.predictedArrival}
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  +{selectedTrain.predictedDelayMin} min (Recovers 4 min buffer)
                </span>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <strong className="text-blue-700">Section-Level Prediction Principle: </strong>
              RailSync predicts approximately <strong>{selectedTrain.predictedDelayMin} minutes of delay</strong> at destination after accounting for downstream track speed headroom, clear quad signaling, and recovery buffers on the Jolarpettai-KJM section.
            </div>
          </div>

          {/* Section: "Why Did ETA Change?" */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Why Did ETA Change?
                </h3>
                <p className="text-xs text-slate-500">
                  Attribution breakdown of the +11 min generated delay vs -4 min downstream recovery
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                Primary: Signal Congestion
              </span>
            </div>

            <div className="space-y-3">
              {selectedTrain.whyETAChanged.map((factor, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-800 font-medium">
                      {factor.name}
                    </span>
                    <span className="font-mono text-rose-600 font-bold">
                      +{factor.delayMin} min ({factor.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full"
                      style={{ width: `${factor.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Delay Recovery Capability */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                Downstream Speed Recovery Potential
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedTrain.recoveryBreakdown.map((sec, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-500 block truncate">{sec.sectionName}</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {sec.recoveryMin < 0 ? `${sec.recoveryMin} min` : '0 min'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive ETA Evolution Timeline */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              ETA Evolution Chart (Last 75 Minutes)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time progression of predicted delay as events occurred along the corridor
            </p>

            {/* SVG Line Chart for Evolution */}
            <div className="w-full h-44 bg-slate-50/70 rounded-xl p-3 border border-slate-200 relative">
              <svg viewBox="0 0 600 130" className="w-full h-full">
                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="580" y2="20" stroke="#cbd5e1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="40" y1="60" x2="580" y2="60" stroke="#cbd5e1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="40" y1="100" x2="580" y2="100" stroke="#cbd5e1" strokeDasharray="3 3" opacity="0.6" />

                {/* Y-axis labels */}
                <text x="10" y="24" fill="#64748b" fontSize="9" fontFamily="monospace">+10m</text>
                <text x="10" y="64" fill="#64748b" fontSize="9" fontFamily="monospace">+5m</text>
                <text x="10" y="104" fill="#64748b" fontSize="9" fontFamily="monospace">0m</text>

                {/* Evolution Path: (75m:0 -> 45m:2 -> 25m:4 -> 10m:8 -> 0m:9) */}
                <path
                  d="M 60 100 L 180 84 L 300 68 L 440 36 L 560 28"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="60" cy="100" r="4" fill="#2563eb" />
                <circle cx="180" cy="84" r="4" fill="#2563eb" />
                <circle cx="300" cy="68" r="4" fill="#2563eb" />
                <circle cx="440" cy="36" r="4" fill="#f59e0b" />
                <circle cx="560" cy="28" r="5" fill="#ef4444" />

                {/* Point Labels */}
                <text x="60" y="118" fill="#64748b" fontSize="9" textAnchor="middle">6:15 PM (0m)</text>
                <text x="180" y="118" fill="#64748b" fontSize="9" textAnchor="middle">6:45 PM (+2m)</text>
                <text x="300" y="118" fill="#64748b" fontSize="9" textAnchor="middle">7:05 PM (+4m)</text>
                <text x="440" y="118" fill="#64748b" fontSize="9" textAnchor="middle">7:20 PM (+8m)</text>
                <text x="560" y="118" fill="#1d4ed8" fontSize="9" fontWeight="700" textAnchor="middle">Now (+9m)</text>
              </svg>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-right">
              ETA net change: <span className="font-mono text-amber-600 font-bold">+9 minutes</span> since origin departure.
            </p>
          </div>

          {/* Passenger Journey Vertical Timeline */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Corridor Station Progress Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {selectedTrain.stops.map((stop, index) => {
                const isDeparted = stop.status === 'DEPARTED';
                const isNext = stop.status === 'UPCOMING' && index === 2;

                return (
                  <div key={stop.stationCode} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    {/* Bullet marker */}
                    <div
                      className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full flex items-center justify-center ${
                        isDeparted
                          ? 'bg-emerald-600 text-white'
                          : isNext
                          ? 'bg-blue-600 ring-4 ring-blue-500/20 animate-pulse text-white'
                          : 'bg-slate-100 border-2 border-slate-300'
                      }`}
                    >
                      {isDeparted && <CheckCircle2 className="w-3 h-3" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {stop.stationName}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          ({stop.stationCode})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                          Plat {stop.platform}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Scheduled: {stop.scheduledArrival} • Sched Dep: {stop.scheduledDeparture}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                          AI Predicted Arrival
                        </span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {stop.predictedArrival}
                        </span>
                      </div>
                      <DelayBadge delayMin={stop.delayMin} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connection Risk Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Connection Advisory at KSR Bengaluru (SBC)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Transfer to Train 16216 Chamundi Express (Dep 8:45 PM). Buffer: 16 minutes.
                </p>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold mt-1.5 inline-block">
                  Connection Safety Probability: 82% (SAFE BUFFER)
                </span>
              </div>
            </div>

            <button
              onClick={() => setCopilotOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shrink-0"
            >
              Ask Copilot About Alternatives
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: LIVE MAP */}
      {passengerTab === 'map' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Corridor Live Schematic Map</h2>
              <p className="text-xs text-slate-500">
                Real-time block section positions, signal statuses, and speed restrictions
              </p>
            </div>
            <DataSourceBadge source="LIVE DATA" />
          </div>

          <CorridorNetworkMap />
        </div>
      )}

      {/* VIEW 4: MY BOOKINGS & DIGITAL TICKET */}
      {passengerTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Digital Journey Tickets</h2>
              <p className="text-xs text-slate-500">
                Connected with RailSync Dynamic ETA for live platform & arrival updates
              </p>
            </div>
            <button
              onClick={() => setBookingModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs"
            >
              + Book New Journey (Demo)
            </button>
          </div>

          {bookings.map(bkg => (
            <div
              key={bkg.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    {bkg.status} • PNR: {bkg.pnr}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1.5">
                    {bkg.trainNumber} {bkg.trainName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {bkg.from} ➔ {bkg.to} • {bkg.date}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Current AI ETA</span>
                  <span className="text-3xl font-black font-mono text-blue-600">
                    {bkg.predictedArrival}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block">Passenger</span>
                  <span className="font-semibold text-slate-900">{bkg.passengerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Class & Coach</span>
                  <span className="font-semibold text-slate-900">{bkg.seatClass} / {bkg.coach}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Berth Allocation</span>
                  <span className="font-semibold text-slate-900">{bkg.berth}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Fare Paid</span>
                  <span className="font-mono font-bold text-emerald-700">₹{bkg.fare} (Demo)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 p-1.5 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-slate-800" />
                  </div>
                  <span className="text-slate-500 text-[11px] font-medium">Valid Digital RailSync Pass</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTrainId(bkg.trainNumber);
                      setPassengerTab('details');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-2xs"
                  >
                    Track Journey Live
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 5: STATION AMENITIES & CONCOURSE CROWD LEVEL (PASSENGER EXCLUSIVE) */}
      {passengerTab === 'amenities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Station Terminal Amenities & Walkway Guide</h2>
              <p className="text-xs text-slate-500">
                Verified live facilities, wheelchair assistance, water vending units & platform crowd index
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Terminal Concierge</span>
            </span>
          </div>

          {/* Quick Station Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium block">Water Dispensers</span>
              <span className="text-xl font-bold text-slate-900 font-mono">14 Active</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">100% Operational (72 ppm)</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium block">Lifts & Escalators</span>
              <span className="text-xl font-bold text-slate-900 font-mono">8 / 8 Running</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Zero outages reported</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium block">Buggy / Wheelchair</span>
              <span className="text-xl font-bold text-slate-900 font-mono">6 Available</span>
              <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Gate 1 & Gate 3 Kiosks</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium block">Average Concourse Crowd</span>
              <span className="text-xl font-bold text-emerald-600 font-mono">34% (Normal)</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Smooth movement</span>
            </div>
          </div>

          {/* Platform Crowd Heatmap */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Live Platform Density & Walking Estimates (KSR Bengaluru - SBC)</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Sensor Updated 1m ago</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { plat: 'Platform 1', crowd: '44%', status: 'Moderate Flow', train: '12627 Karnataka Exp (Dep 19:20)', walkMin: '2 min from Main Gate' },
                { plat: 'Platform 2', crowd: '18%', status: 'Light Traffic', train: 'Clear for Shunting', walkMin: '3 min via Escalator 2' },
                { plat: 'Platform 3', crowd: '62%', status: 'Heavy Density', train: '20608 Vande Bharat Arrival', walkMin: '4 min via Foot Overbridge' },
                { plat: 'Platform 4', crowd: '25%', status: 'Normal Flow', train: '12008 Shatabdi Boarding', walkMin: '5 min via Central Lift' }
              ].map(p => (
                <div key={p.plat} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{p.plat}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        parseInt(p.crowd) > 50 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.crowd} • {p.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{p.train}</p>
                    <p className="text-[11px] text-blue-600 font-medium mt-0.5">{p.walkMin}</p>
                  </div>
                  <div className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    <div
                      className={`h-full rounded-full ${parseInt(p.crowd) > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: p.crowd }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Directory of Essential Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Coffee className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Executive AC Waiting Lounge</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Located on 1st Floor concourse, above Platform 1. Features high-speed RailWire Wi-Fi, charging desks, sofa recliners, and cafeteria. ₹50/hr access.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">RO Pure Drinking Water Units</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Free chilled drinking water available on all platforms opposite Coach S3 and B4. IRCTC Water Vending Machines provide refill at ₹5 per litre.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Accessibility className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Divyangjan & Senior Citizen Buggy</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Battery-operated buggy service available at Main Portico Gate 1. Dial station assistance at <strong>139</strong> or book at the Sahayak booth.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 6: LIVE SMS & WHATSAPP DELAY ALERT SUBSCRIPTIONS (PASSENGER EXCLUSIVE) */}
      {passengerTab === 'sms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">SMS & WhatsApp Dynamic Delay Subscriptions</h2>
              <p className="text-xs text-slate-500">
                Receive proactive automated alerts directly on your phone when train delays or platform changes occur
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              <span>Live Telemetry Broadcast</span>
            </span>
          </div>

          {/* Subscription Creation Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Register New Instant Notification Trigger</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              RailSync AI continuously tracks block progression and dispatches instant alerts whenever the ETA shifts beyond your threshold.
            </p>

            {smsSuccessNotice && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Subscription activated! Automated ML tracking dispatched for train {smsTrain}.</span>
              </div>
            )}

            <form onSubmit={handleSubscribeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Select Monitored Train</label>
                  <select
                    value={smsTrain}
                    onChange={e => setSmsTrain(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  >
                    {trains.map(t => (
                      <option key={t.number} value={t.number}>
                        {t.number} — {t.name} ({t.origin} ➔ {t.destination})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Mobile Number (with country code)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={smsPhone}
                      onChange={e => setSmsPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 pl-8 text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Alert Sensitivity Threshold</label>
                  <select
                    value={smsThreshold}
                    onChange={e => setSmsThreshold(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  >
                    <option value={5}>Any delay change &gt; 5 minutes (Recommended)</option>
                    <option value={10}>Only major delays &gt; 10 minutes</option>
                    <option value={15}>Severe delays &gt; 15 minutes only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Delivery Channel</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSmsChannel('WHATSAPP')}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                        smsChannel === 'WHATSAPP'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp (Rich)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSmsChannel('SMS')}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                        smsChannel === 'SMS'
                          ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Standard SMS</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Subscribe for Live Alerts</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Subscriptions List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Active Subscriptions ({smsSubscriptions.length})
            </h3>

            {smsSubscriptions.map(sub => (
              <div
                key={sub.id}
                className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    sub.channel === 'WHATSAPP' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}>
                    {sub.channel === 'WHATSAPP' ? <MessageSquare className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{sub.trainNumber}</span>
                      <h4 className="text-xs font-bold text-slate-800">{sub.trainName}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Phone: <span className="font-mono text-slate-700">{sub.phone}</span> • Channel: <strong>{sub.channel}</strong> • Threshold: <strong>+{sub.thresholdMin}m shift</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeSmsAlert(sub.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Cancel Subscription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 7: ALERTS */}
      {passengerTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Passenger Journey Alerts</h2>
              <p className="text-xs text-slate-500">
                Personalized notifications on signal delays, platform shifts, and connections
              </p>
            </div>
            <DataSourceBadge source="AI PREDICTION" />
          </div>

          <div className="space-y-2.5">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-white border border-slate-200/90 flex items-start gap-3 shadow-xs"
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : alert.severity === 'WARNING'
                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{alert.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{alert.timeAgo}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEMO BOOKING MODAL */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-slate-800">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Book Journey Ticket (Demo)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Demo ticket booking module with automated RailSync Dynamic ETA tracking
            </p>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Ticket Confirmed!</h4>
                <p className="text-xs text-slate-500">
                  PNR generated and synchronized with RailSync live corridor tracking.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Train</label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedTrain.number} ${selectedTrain.name}`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Passenger Full Name</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Class</label>
                    <select
                      value={bookingForm.seatClass}
                      onChange={e => setBookingForm({ ...bookingForm, seatClass: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                    >
                      <option value="3A">3A AC Three Tier (₹765)</option>
                      <option value="2A">2A AC Two Tier (₹1,420)</option>
                      <option value="SL">SL Sleeper Class (₹295)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Date of Journey</label>
                    <input
                      type="text"
                      disabled
                      value="05 Sep 2026"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-500 font-medium"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800">
                  <span className="font-bold block">IRCTC Demo Note:</span>
                  This simulated booking issues a demo digital pass to showcase end-to-end passenger ETA alerts.
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                  >
                    Confirm Demo Booking (₹{bookingForm.seatClass === '2A' ? '1,420' : '765'})
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Mobile Bottom Navigation Dock */}
      <PassengerMobileNav activeTab={passengerTab} setActiveTab={setPassengerTab} />
    </div>
  );
};
