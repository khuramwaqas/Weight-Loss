
import React, { useState, useEffect } from 'react';
import { Unit } from '../types';
import { TargetIcon, EditIcon } from './icons';

interface GoalSetterProps {
    goalWeight: number | null;
    onSetGoal: (goal: number | null) => void;
    unit: Unit;
}

const GoalSetter: React.FC<GoalSetterProps> = ({ goalWeight, onSetGoal, unit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputVal, setInputVal] = useState('');

    useEffect(() => {
      setInputVal(goalWeight ? goalWeight.toFixed(1) : '');
    }, [goalWeight]);

    const handleSet = () => {
        const val = parseFloat(inputVal);
        if (!isNaN(val) && val > 0) {
            onSetGoal(val);
        } else if (inputVal.trim() === '') {
            onSetGoal(null); // Clear goal
        }
        setIsEditing(false);
    }
    
    const handleCancel = () => {
        setInputVal(goalWeight ? goalWeight.toFixed(1) : '');
        setIsEditing(false);
    }

    if (!isEditing && goalWeight === null) {
        return (
            <div className="p-4 sm:p-6">
                <button onClick={() => setIsEditing(true)} className="w-full text-center py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg font-semibold text-violet-600 dark:text-violet-400 transition">
                    Set a Weight Goal
                </button>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <TargetIcon className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Goal Weight</span>
                </div>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                         <input 
                            type="number"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            step="0.1"
                            placeholder={`Goal in ${unit}`}
                            className="w-28 text-right px-2 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-200"
                            autoFocus
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-violet-600 dark:text-violet-400 text-lg">
                            {goalWeight ? `${goalWeight.toFixed(1)} ${unit}` : 'Not Set'}
                        </span>
                         <button 
                            onClick={() => setIsEditing(true)} 
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                            aria-label="Edit goal"
                        >
                            <EditIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
            {isEditing && (
                 <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 font-bold py-2 px-4 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSet}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      Save Goal
                    </button>
                </div>
            )}
        </div>
    );
};

export default GoalSetter;