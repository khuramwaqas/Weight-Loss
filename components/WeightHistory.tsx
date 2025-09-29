
import React from 'react';
import { WeightEntry, Unit } from '../types';
import { formatDate } from '../utils';
import { TrashIcon, NoteIcon, ExportIcon, EditIcon } from './icons';

interface WeightHistoryProps {
  entries: WeightEntry[];
  onDeleteEntry: (id: string) => void;
  onEditEntry: (entry: WeightEntry) => void;
  unit: Unit;
}

const WeightHistory: React.FC<WeightHistoryProps> = ({ entries, onDeleteEntry, onEditEntry, unit }) => {
  const exportToCsv = () => {
    const headers = ['date', `weight_(${unit})`, 'notes'];
    const rows = entries.map(entry => [
        entry.date,
        entry.weight.toFixed(1),
        `"${entry.notes?.replace(/"/g, '""') || ''}"`
    ].join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `weight_log_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  if (entries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">History</h2>
        <p className="text-slate-500 dark:text-slate-400">No entries yet. Add your first weight log!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">History</h2>
        <button
            onClick={exportToCsv}
            className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition"
        >
            <ExportIcon className="w-4 h-4" />
            Export
        </button>
      </div>
      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {entries.map((entry) => (
          <li key={entry.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(entry.date)}</span>
                <span className="font-bold text-lg text-violet-600 dark:text-violet-400">{entry.weight.toFixed(1)} {unit}</span>
              </div>
              {entry.notes && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <NoteIcon className="w-4 h-4 flex-shrink-0"/> 
                    {entry.notes}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 flex-shrink-0">
                <button
                    onClick={() => onEditEntry(entry)}
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                    aria-label="Edit entry"
                >
                    <EditIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => onDeleteEntry(entry.id)} 
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition"
                    aria-label="Delete entry"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeightHistory;