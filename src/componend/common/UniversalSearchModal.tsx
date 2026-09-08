import React, { useState, useEffect, useRef } from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import {
  Search,
  Train,
  Building2,
  AlertTriangle,
  CreditCard,
  ArrowRight,
  X,
  CornerDownLeft,
  Sparkles,
  Clock,
  MapPin,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { DelayBadge, ConfidenceBadge } from './Badges';

export const UniversalSearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    trains,
    setSelectedTrainId,
    setSelectedStationCode,
    currentRole,
    setCurrentRole,
    disruptions,
    bookings,
    setCopilotOpen,
    triggerAccessGuard,
    setPassengerTab,
    setStationTab,
    setControlTab
  } = useRailSync();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'TRAINS' | 'STATIONS' | 'DISRUPTIONS' | 'BOOKINGS'>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(!searchModalOpen);
      } else if (e.key === 'Escape' && searchModalOpen) {
        e.preventDefault();
        setSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [searchModalOpen]);

  if (!searchModalOpen) return null;

  const stations = [
    { code: 'MAS', name: 'Chennai Central', platforms: 12, line: 'Southern Quad' },
    { code: 'AJJ', name: 'Arakkonam Junction', platforms: 6, line: 'Southern Quad' },
    { code: 'KPD', name: 'Katpadi Junction', platforms: 6, line: 'Southern Quad' },
    { code: 'JTJ', name: 'Jolarpettai Junction', platforms: 5, line: 'Southern Quad' },
    { code: 'KJM', name: 'Krishnarajapuram', platforms: 4, line: 'South Western Quad' },
    { code: 'SBC', name: 'KSR Bengaluru City', platforms: 10, line: 'South Western Quad' }
  ];

  // Filtered items
  const matchedTrains = trains.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.number.includes(query) ||
    t.destination.toLowerCase().includes(query.toLowerCase()) ||
    t.origin.toLowerCase().includes(query.toLowerCase())
  );

  const matchedStations = stations.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.code.toLowerCase().includes(query.toLowerCase())
  );

  const matchedDisruptions = disruptions.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.location.toLowerCase().includes(query.toLowerCase()) ||
    d.stationCode.toLowerCase().includes(query.toLowerCase())
  );

  const matchedBookings = bookings.filter(b =>
    b.passengerName.toLowerCase().includes(query.toLowerCase()) ||
    b.pnr.includes(query) ||
    b.trainNumber.includes(query)
  );

  // Flattened results for keyboard navigation
  type SearchResultItem =
    | { type: 'TRAIN'; item: typeof trains[0] }
    | { type: 'STATION'; item: typeof stations[0] }
    | { type: 'DISRUPTION'; item: typeof disruptions[0] }
    | { type: 'BOOKING'; item: typeof bookings[0] };

  const combinedResults: SearchResultItem[] = [];

  if (filterType === 'ALL' || filterType === 'TRAINS') {
    matchedTrains.forEach(item => combinedResults.push({ type: 'TRAIN', item }));
  }
  if (filterType === 'ALL' || filterType === 'STATIONS') {
    matchedStations.forEach(item => combinedResults.push({ type: 'STATION', item }));
  }
  if (filterType === 'ALL' || filterType === 'DISRUPTIONS') {
    matchedDisruptions.forEach(item => combinedResults.push({ type: 'DISRUPTION', item }));
  }
  if (filterType === 'ALL' || filterType === 'BOOKINGS') {
    matchedBookings.forEach(item => combinedResults.push({ type: 'BOOKING', item }));
  }

  const handleSelect = (item: SearchResultItem) => {
    if (item.type === 'TRAIN') {
      setSelectedTrainId(item.item.id);
      if (currentRole === 'passenger') {
        setPassengerTab('details');
      }
    } else if (item.type === 'STATION') {
      setSelectedStationCode(item.item.code);
      if (currentRole === 'passenger') {
        setPassengerTab('amenities');
      } else if (currentRole === 'station_staff') {
        setStationTab('platforms');
      }
    } else if (item.type === 'DISRUPTION') {
      if (currentRole !== 'control_room' && currentRole !== 'admin') {
        triggerAccessGuard(
          item.item.id,
          item.item.title,
          'control_room',
          'Corridor line blocks and disruption management require Level 3 Clearance (Control Room Traffic Controller).'
        );
        setSearchModalOpen(false);
        return;
      }
      setControlTab('blocks');
    } else if (item.type === 'BOOKING') {
      if (currentRole !== 'passenger' && currentRole !== 'admin') {
        triggerAccessGuard(
          item.item.pnr,
          `PNR Booking ${item.item.pnr}`,
          'passenger',
          'Passenger ticket details and PNR records are strictly isolated to the Passenger Portal for privacy protection.'
        );
        setSearchModalOpen(false);
        return;
      }
      setSelectedTrainId(item.item.trainNumber);
      setPassengerTab('bookings');
    }
    setSearchModalOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, combinedResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + combinedResults.length) % Math.max(1, combinedResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (combinedResults[selectedIndex]) {
        handleSelect(combinedResults[selectedIndex]);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={() => setSearchModalOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search trains, stations, disruptions, bookings (e.g. 12627, Katpadi, Signal)..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 font-semibold">
            ESC
          </span>
        </div>

        {/* Categories / Filter Pills */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mr-1 shrink-0">
            Filter:
          </span>
          {(['ALL', 'TRAINS', 'STATIONS', 'DISRUPTIONS', 'BOOKINGS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setFilterType(tab);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterType === tab
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Results' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
          {combinedResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No matching railway assets found</p>
              <p className="mt-0.5 text-slate-400">Try searching for "12627", "Katpadi", or "Signal"</p>
            </div>
          ) : (
            combinedResults.map((res, index) => {
              const isSelected = index === selectedIndex;

              if (res.type === 'TRAIN') {
                const train = res.item;
                return (
                  <div
                    key={`train-${train.id}`}
                    onClick={() => handleSelect(res)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected ? 'bg-blue-50/80 border border-blue-200 shadow-2xs' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                        <Train className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                            {train.number}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{train.name}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">({train.type})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {train.origin} ➔ {train.destination} • Next: {train.nextStation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-mono">AI ETA</span>
                        <span className="font-mono font-bold text-slate-900 text-xs">{train.predictedArrival}</span>
                      </div>
                      <DelayBadge delayMin={train.predictedDelayMin} />
                      <CornerDownLeft className={`w-3.5 h-3.5 text-blue-600 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </div>
                );
              }

              if (res.type === 'STATION') {
                const station = res.item;
                return (
                  <div
                    key={`station-${station.code}`}
                    onClick={() => handleSelect(res)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected ? 'bg-blue-50/80 border border-blue-200 shadow-2xs' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900 bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                            {station.code}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{station.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {station.platforms} Platforms • {station.line}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-right text-xs text-slate-500 shrink-0">
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 flex items-center gap-1">
                        Station Staff
                      </span>
                      <CornerDownLeft className={`w-3.5 h-3.5 text-blue-600 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </div>
                );
              }

              if (res.type === 'DISRUPTION') {
                const disruption = res.item;
                const isUnauthorized = currentRole !== 'control_room' && currentRole !== 'admin';
                return (
                  <div
                    key={`disruption-${disruption.id}`}
                    onClick={() => handleSelect(res)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected ? 'bg-blue-50/80 border border-blue-200 shadow-2xs' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[10px] text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                            {disruption.severity}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{disruption.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {disruption.location} ({disruption.stationCode}) • Impact: +{disruption.impactDelayMin} min
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isUnauthorized ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 font-semibold">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Control Room</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-rose-700 font-bold">+{disruption.impactDelayMin}m</span>
                      )}
                      <CornerDownLeft className={`w-3.5 h-3.5 text-blue-600 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </div>
                );
              }

              if (res.type === 'BOOKING') {
                const booking = res.item;
                const isUnauthorized = currentRole !== 'passenger' && currentRole !== 'admin';
                return (
                  <div
                    key={`booking-${booking.id}`}
                    onClick={() => handleSelect(res)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected ? 'bg-blue-50/80 border border-blue-200 shadow-2xs' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            PNR: {booking.pnr}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{booking.passengerName}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Train {booking.trainNumber} • {booking.from} ➔ {booking.to} ({booking.seatClass})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isUnauthorized ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 font-semibold">
                          <Lock className="w-3 h-3 text-blue-600" />
                          <span>Passenger Only</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-semibold font-mono">ETA {booking.predictedArrival}</span>
                      )}
                      <CornerDownLeft className={`w-3.5 h-3.5 text-blue-600 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </div>
                );
              }

              return null;
            })
          )}
        </div>

        {/* Footer with keyboard navigation cues */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-2xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-2xs">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-2xs">↵</kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-2xs">esc</kbd>
              <span>to close</span>
            </span>
          </div>

          <button
            onClick={() => {
              setSearchModalOpen(false);
              setCopilotOpen(true);
            }}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Ops Copilot instead</span>
          </button>
        </div>
      </div>
    </div>
  );
};
