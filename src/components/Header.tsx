import React from 'react';
import { Sprout, MessageSquare, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'fields' | 'weather' | 'doctor' | 'irrigation' | 'operations';
  onSelectTab: (tab: 'fields' | 'weather' | 'doctor' | 'irrigation' | 'operations') => void;
  onOpenAdvisor: () => void;
  onOpenNewField: () => void;
  totalAcres: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenAdvisor,
  onOpenNewField,
  totalAcres,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80">
      {/* Zone 1: Single element Brand Zone */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-700/30 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
          <Sprout className="w-4 h-4" />
        </div>
        <a
          href="#fields"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('fields');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors"
        >
          TerraCrop
        </a>
      </div>

      {/* Zone 2: 4-5 clean text navigation links (Top Bar Contract) */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
        <button
          onClick={() => onSelectTab('fields')}
          className={`transition-colors relative py-1 hover:text-white ${
            activeTab === 'fields' ? 'text-emerald-400 font-semibold' : 'text-stone-300'
          }`}
        >
          Fields & NDVI
          {activeTab === 'fields' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => onSelectTab('weather')}
          className={`transition-colors relative py-1 hover:text-white ${
            activeTab === 'weather' ? 'text-emerald-400 font-semibold' : 'text-stone-300'
          }`}
        >
          Microclimate
          {activeTab === 'weather' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => onSelectTab('doctor')}
          className={`transition-colors relative py-1 hover:text-white ${
            activeTab === 'doctor' ? 'text-emerald-400 font-semibold' : 'text-stone-300'
          }`}
        >
          Crop Doctor (AI)
          {activeTab === 'doctor' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => onSelectTab('irrigation')}
          className={`transition-colors relative py-1 hover:text-white ${
            activeTab === 'irrigation' ? 'text-emerald-400 font-semibold' : 'text-stone-300'
          }`}
        >
          Irrigation & VRA
          {activeTab === 'irrigation' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => onSelectTab('operations')}
          className={`transition-colors relative py-1 hover:text-white ${
            activeTab === 'operations' ? 'text-emerald-400 font-semibold' : 'text-stone-300'
          }`}
        >
          Markets & Fleet
          {activeTab === 'operations' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />
          )}
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenNewField}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-200 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-lg transition-colors whitespace-nowrap"
          title="Add or survey a new crop plot"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>New Field</span>
        </button>

        <button
          onClick={onOpenAdvisor}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-emerald-950"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Agronomist AI</span>
        </button>
      </div>
    </header>
  );
};
