import React from 'react';
import { cn } from '../../lib/utils';

interface PriceSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

export const PriceSlider: React.FC<PriceSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value[1] - step);
    onChange([newMin, value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value[0] + step);
    onChange([value[0], newMax]);
  };

  const minPos = ((value[0] - min) / (max - min)) * 100;
  const maxPos = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="w-full px-2 py-4">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white border border-neutral-100 rounded-xl px-3 py-2 shadow-sm">
          <p className="text-[10px] font-black uppercase text-neutral-400 mb-0.5">Min</p>
          <p className="font-bold text-sm text-neutral-900">£{value[0]}</p>
        </div>
        <div className="h-px w-4 bg-neutral-200" />
        <div className="bg-white border border-neutral-100 rounded-xl px-3 py-2 shadow-sm text-right">
          <p className="text-[10px] font-black uppercase text-neutral-400 mb-0.5">Max</p>
          <p className="font-bold text-sm text-neutral-900">£{value[1]}</p>
        </div>
      </div>

      <div className="relative h-2 w-full bg-neutral-100 rounded-full">
        {/* Track highlight */}
        <div 
          className="absolute h-full bg-brand rounded-full transition-all duration-75"
          style={{ 
            left: `${minPos}%`, 
            right: `${100 - maxPos}%` 
          }}
        />
        
        {/* Thumb Min */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:shadow-lg active:[&::-webkit-slider-thumb]:scale-110 transition-all"
        />

        {/* Thumb Max */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:shadow-lg active:[&::-webkit-slider-thumb]:scale-110 transition-all"
        />
      </div>
    </div>
  );
};
