
import React, { useState, useEffect } from 'react';
import { HeightUnit } from '../types';
import { PersonIcon } from './icons';
import { mToFtIn, ftInToM, mToCm, cmToM } from '../utils';

interface HeightInputProps {
    heightInM: number | null;
    onSetHeight: (heightInM: number | null) => void;
    isEditing: boolean;
    onCancel: () => void;
}

const HeightInput: React.FC<HeightInputProps> = ({ heightInM, onSetHeight, isEditing, onCancel }) => {
    const [unit, setUnit] = useState<HeightUnit>('cm');
    const [cm, setCm] = useState('');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');

    useEffect(() => {
        if(heightInM) {
            if(unit === 'cm') {
                setCm(Math.round(mToCm(heightInM)).toString());
            } else {
                const { feet, inches } = mToFtIn(heightInM);
                setFeet(feet.toString());
                setInches(inches.toString());
            }
        } else {
            setCm('');
            setFeet('');
            setInches('');
        }
    }, [heightInM, unit]);


    const handleSet = () => {
        let heightMeters: number | null = null;
        if(unit === 'cm') {
            const cmVal = parseInt(cm, 10);
            if (!isNaN(cmVal) && cmVal > 0) heightMeters = cmToM(cmVal);
        } else {
            const ftVal = parseInt(feet, 10) || 0;
            const inVal = parseInt(inches, 10) || 0;
            if(ftVal > 0 || inVal > 0) heightMeters = ftInToM(ftVal, inVal);
        }
        onSetHeight(heightMeters);
        if (isEditing) {
            onCancel(); // Exits editing mode only if we were editing
        }
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
                <PersonIcon className="w-4 h-4"/>
                {isEditing ? 'Update Your Height' : 'Enter Height for BMI'}
            </h4>
            
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-md mb-3">
                <button onClick={() => setUnit('cm')} className={`flex-1 text-center text-sm py-1 rounded ${unit === 'cm' ? 'bg-white dark:bg-slate-600 shadow-sm font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>cm</button>
                <button onClick={() => setUnit('ft')} className={`flex-1 text-center text-sm py-1 rounded ${unit === 'ft' ? 'bg-white dark:bg-slate-600 shadow-sm font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>ft, in</button>
            </div>

            {unit === 'cm' ? (
                <input 
                    type="number"
                    value={cm}
                    onChange={(e) => setCm(e.target.value)}
                    placeholder="Height in cm"
                    className="w-full text-lg px-2 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-200"
                    autoFocus={isEditing}
                />
            ) : (
                <div className="flex items-center gap-2">
                    <input type="number" value={feet} onChange={e => setFeet(e.target.value)} placeholder="ft" className="w-1/2 text-lg px-2 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"/>
                    <input type="number" value={inches} onChange={e => setInches(e.target.value)} placeholder="in" className="w-1/2 text-lg px-2 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"/>
                </div>
            )}
            
            <div className="flex gap-4 pt-4">
                {isEditing && (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 font-bold py-2 px-4 rounded-lg transition"
                    >
                      Cancel
                    </button>
                )}
                <button
                  type="button"
                  onClick={handleSet}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Save Height
                </button>
            </div>
        </div>
    );
}

export default HeightInput;