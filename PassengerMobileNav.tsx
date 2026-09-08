import React from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import {
  Home,
  Train,
  MapPin,
  Ticket,
  Sparkles,
  Building2,
  Radio
} from 'lucide-react';

interface Props {
  activeTab: 'home' | 'details' | 'map' | 'bookings' | 'alerts' | 'amenities' | 'sms';
  setActiveTab: (tab: 'home' | 'details' | 'map' | 'bookings' | 'alerts' | 'amenities' | 'sms') => void;
}

export const PassengerMobileNav: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const { setCopilotOpen } = useRailSync();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
          activeTab === 'home' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      <button
        onClick={() => setActiveTab('details')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
          activeTab === 'details' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Train className="w-4 h-4" />
        <span>Live ETA</span>
      </button>

      <button
        onClick={() => setActiveTab('bookings')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
          activeTab === 'bookings' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Ticket className="w-4 h-4" />
        <span>PNR</span>
      </button>

      <button
        onClick={() => setActiveTab('amenities')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
          activeTab === 'amenities' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span>Amenities</span>
      </button>

      <button
        onClick={() => setActiveTab('sms')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
          activeTab === 'sms' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Radio className="w-4 h-4" />
        <span>Alerts</span>
      </button>

      <button
        onClick={() => setCopilotOpen(true)}
        className="flex flex-col items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition"
      >
        <Sparkles className="w-4 h-4" />
        <span>Copilot</span>
      </button>
    </nav>
  );
};
