
import React from 'react';
import { MODES } from '../constants';
import { DisagreementMode } from '../types';

interface Props {
  selectedMode: DisagreementMode;
  onSelect: (mode: DisagreementMode) => void;
}

const ModeSelector: React.FC<Props> = ({ selectedMode, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`p-3 text-left border transition-all duration-200 group ${
            selectedMode === mode.id
              ? 'bg-neutral-100 text-black border-white'
              : 'border-neutral-800 hover:border-neutral-500 text-neutral-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{mode.icon}</span>
            <span className="text-xs font-bold uppercase tracking-tight">{mode.label}</span>
          </div>
          <p className={`text-[10px] leading-tight ${selectedMode === mode.id ? 'text-neutral-700' : 'text-neutral-600 group-hover:text-neutral-400'}`}>
            {mode.description}
          </p>
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
