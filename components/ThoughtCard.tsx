
import React from 'react';
import { ThoughtEntry } from '../types';
import { MODES, REFLECTION_LABELS } from '../constants';

interface Props {
  entry: ThoughtEntry;
}

const ThoughtCard: React.FC<Props> = ({ entry }) => {
  const mode = MODES.find(m => m.id === entry.mode);
  
  return (
    <div className="border border-neutral-800 p-6 space-y-4 bg-neutral-900/50 relative overflow-hidden">
      <div className="flex justify-between items-start border-b border-neutral-800 pb-2">
        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
          {new Date(entry.timestamp).toLocaleDateString()} — {mode?.label} — {entry.confidence}%
        </span>
      </div>
      
      <div>
        <h3 className="text-lg font-bold leading-tight italic">"{entry.text}"</h3>
      </div>

      {entry.response && (
        <ul className="space-y-3 pl-4 border-l-2 border-neutral-700">
          {entry.response.map((bullet, idx) => (
            <li key={idx} className="text-sm text-neutral-300 leading-relaxed list-disc">
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {entry.reflection && (
        <div className="pt-4 border-t border-neutral-800">
          <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Reflection:</div>
          <div className="text-sm font-bold text-neutral-100">
             {REFLECTION_LABELS[entry.reflection]}
          </div>
          {entry.reflectionNote && (
            <p className="text-xs text-neutral-400 mt-2 italic">"{entry.reflectionNote}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ThoughtCard;
