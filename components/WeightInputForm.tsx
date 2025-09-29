
import React, { useState, useEffect } from 'react';
import { WeightEntry, Unit } from '../types';
import { getTodayDateString, kgToLbs } from '../utils';

interface WeightInputFormProps {
  onSave: (entry: Omit<WeightEntry, 'id'>, id?: string) => void;
  onCancel: () => void;
  unit: Unit;
  entryToEdit?: WeightEntry | null;
}

const WeightInputForm: React.FC<WeightInputFormProps> = ({ onSave, onCancel, unit, entryToEdit }) => {
  const [date, setDate] = useState(getTodayDateString());
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (entryToEdit) {
      const displayWeight = unit === 'lbs' ? kgToLbs(entryToEdit.weight) : entryToEdit.weight;
      setDate(entryToEdit.date);
      setWeight(displayWeight > 0 ? displayWeight.toFixed(1) : '');
      setNotes(entryToEdit.notes || '');
    } else {
      setDate(getTodayDateString());
      setWeight('');
      setNotes('');
    }
  }, [entryToEdit, unit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
      alert('Please enter a valid weight.');
      return;
    }
    onSave({
      date,
      weight: weightNum,
      notes,
    }, entryToEdit?.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
        />
      </div>
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
          Weight ({unit})
        </label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          step="0.1"
          placeholder="0.0"
          required
          className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="How are you feeling today?"
          className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
        />
      </div>
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 font-bold py-2.5 px-4 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-violet-500 transition-transform duration-150 active:scale-[0.98]"
        >
          {entryToEdit ? 'Save Changes' : 'Add Entry'}
        </button>
      </div>
    </form>
  );
};

export default WeightInputForm;