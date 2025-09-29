
import React, { useState, useEffect, useCallback } from 'react';
import { getMotivationalTip } from '../services/geminiService';
import { LightbulbIcon, RefreshIcon } from './icons';

const MotivationalTip: React.FC = () => {
  const [tip, setTip] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTip = useCallback(async () => {
    setIsLoading(true);
    const newTip = await getMotivationalTip();
    setTip(newTip);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTip();
  }, [fetchTip]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <LightbulbIcon className="w-6 h-6 text-amber-500 dark:text-amber-400" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Daily Tip</h3>
        </div>
        <button
          onClick={fetchTip}
          disabled={isLoading}
          className="p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Refresh tip"
        >
          <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="mt-4 text-slate-600 dark:text-slate-300 min-h-[40px] flex items-center">
        {isLoading ? (
          <p className="italic text-slate-400 dark:text-slate-500">Fetching a fresh tip for you...</p>
        ) : (
          <p>"{tip}"</p>
        )}
      </div>
    </div>
  );
};

export default MotivationalTip;