
import React from 'react';
import { Unit } from '../types';

interface UnitToggleProps {
  unit: Unit;
  setUnit: (unit: Unit) => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unit, setUnit }) => {
  const isKg = unit === 'kg';

  return (
    <div className="flex items-center space-x-2 bg-slate-200/70 dark:bg-slate-700/50 p-1 rounded-full">
      <button
        onClick={() => setUnit('kg')}
        className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-300 ${
          isKg ? 'bg-white dark:bg-slate-600 text-violet-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        kg
      </button>
      <button
        onClick={() => setUnit('lbs')}
        className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-300 ${
          !isKg ? 'bg-white dark:bg-slate-600 text-violet-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        lbs
      </button>
    </div>
  );
};

export default UnitToggle;