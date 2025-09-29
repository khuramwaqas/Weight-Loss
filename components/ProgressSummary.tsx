
import React, { useState } from 'react';
import { WeightEntry, Unit } from '../types';
import { calculateBMI, getBMICategory, kgToLbs, lbsToKg } from '../utils';
import { FireIcon, PersonIcon, EditIcon } from './icons';
import HeightInput from './HeightInput';

interface ProgressSummaryProps {
  entries: WeightEntry[]; // Expects entries in KG
  goalWeightInKg: number | null;
  unit: Unit;
  heightInM: number | null;
  setHeightInM: (height: number | null) => void;
  streak: number;
}

const StatCard = ({ title, value, unit, change, changeColor, icon, footer }: { title: string; value: string; unit?: string; change?: string, changeColor?: string, icon?: React.ReactNode, footer?: string }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex-1 min-w-[140px]">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <h4 className="text-sm font-semibold">{title}</h4>
            {icon}
        </div>
        <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
            {value} <span className="text-xl font-medium text-slate-500 dark:text-slate-400">{unit}</span>
        </p>
        {change && <p className={`text-sm font-semibold ${changeColor}`}>{change}</p>}
        {footer && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{footer}</p>}
    </div>
);

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ entries, goalWeightInKg, unit, heightInM, setHeightInM, streak }) => {
    const [isEditingHeight, setIsEditingHeight] = useState(false);

    if (entries.length === 0) {
        return (
             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md text-center">
                <p className="text-slate-500 dark:text-slate-400">Log your first weight to see your summary.</p>
            </div>
        );
    }

  const startWeightKg = entries[entries.length - 1].weight;
  const currentWeightKg = entries[0].weight;
  const weightChangeKg = currentWeightKg - startWeightKg;

  const displayCurrentWeight = unit === 'lbs' ? kgToLbs(currentWeightKg) : currentWeightKg;
  const displayWeightChange = unit === 'lbs' ? kgToLbs(weightChangeKg) : weightChangeKg;
  const displayGoalWeight = goalWeightInKg !== null ? (unit === 'lbs' ? kgToLbs(goalWeightInKg) : goalWeightInKg) : null;

  const bmi = heightInM ? calculateBMI(currentWeightKg, heightInM) : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Current" value={displayCurrentWeight.toFixed(1)} unit={unit} />
            <StatCard 
                title="Change" 
                value={Math.abs(displayWeightChange).toFixed(1)} 
                unit={unit} 
                change={weightChangeKg >= 0 ? `+${displayWeightChange.toFixed(1)} since start` : `${displayWeightChange.toFixed(1)} since start`}
                changeColor={weightChangeKg >= 0 ? 'text-red-500' : 'text-green-500'}
            />
            {displayGoalWeight !== null ? (
                <StatCard 
                    title="To Goal" 
                    value={Math.abs(displayCurrentWeight - displayGoalWeight).toFixed(1)} 
                    unit={unit} 
                />
            ) : (
                <StatCard title="Goal" value="N/A" />
            )}
             <StatCard 
                title="Day Streak" 
                value={streak.toString()}
                icon={<FireIcon className={`w-5 h-5 ${streak > 0 ? 'text-orange-500' : 'text-slate-400'}`} />}
            />
        </div>
        {heightInM && !isEditingHeight ? (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <PersonIcon className="w-4 h-4" />
                            <h4 className="text-sm font-semibold">BMI</h4>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{bmi ? bmi.toFixed(1) : 'N/A'}</p>
                        <p className="text-xs text-slate-400 font-semibold">{bmiCategory}</p>
                    </div>
                     <button 
                        onClick={() => setIsEditingHeight(true)} 
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                        aria-label="Edit height"
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ) : (
            <HeightInput onSetHeight={setHeightInM} onCancel={() => setIsEditingHeight(false)} isEditing={isEditingHeight} heightInM={heightInM} />
        )}
    </>
  );
};

export default ProgressSummary;