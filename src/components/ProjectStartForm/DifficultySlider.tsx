import React from 'react';

interface DifficultySliderProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export const DifficultySlider: React.FC<DifficultySliderProps> = ({
  value,
  onChange,
  error
}) => {
  const getColorClass = (val: number) => {
    if (val <= 3) return 'text-sage-500';
    if (val <= 6) return 'text-gold-500';
    return 'text-rust-500';
  };

  const getBackgroundStyle = (val: number) => {
    const width = `${(val / 10) * 100}%`;
    let color = 'bg-sage-500';
    if (val > 3) color = 'bg-gold-500';
    if (val > 6) color = 'bg-rust-500';
    return { width, className: color };
  };

  const bg = getBackgroundStyle(value);

  return (
    <div className="space-y-2 animate-fade-in">
      <label className="form-label">
        Anticipated Difficulty
      </label>
      <div className="relative pt-1">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${getColorClass(value)}`}>
            Current: {value}
          </span>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded bg-sage-100">
          <div
            style={{ width: bg.width }}
            className={`${bg.className} transition-all duration-200 ease-out rounded`}
          ></div>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-navy-600 mt-2">
          <span className="text-sage-500">Easy</span>
          <span className="text-gold-500">Moderate</span>
          <span className="text-rust-500">Difficult</span>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-rust-500 animate-slide-in">
          {error}
        </p>
      )}
    </div>
  );
};
