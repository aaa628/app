
import React from 'react';

interface Props {
  value: number;
  onChange: (val: number) => void;
}

const ConfidenceSlider: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
          Confidence Level
        </label>
        <span className={`text-xl font-bold ${value > 85 ? 'text-red-500' : 'text-neutral-300'}`}>
          {value}%
        </span>
      </div>
      <input
        type="range"
        min="40"
        max="100"
        step="5"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-white"
      />
      <div className="flex justify-between text-[10px] text-neutral-600 uppercase font-bold">
        <span>Dubious (40%)</span>
        <span>Zealot (100%)</span>
      </div>
    </div>
  );
};

export default ConfidenceSlider;
