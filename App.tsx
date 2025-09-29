
import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from './hooks/useLocalStorage';
import { WeightEntry, Unit } from './types';
// Fix: Import formatDate to resolve reference error.
import { formatDate, getTodayDateString, getYesterdayDateString, kgToLbs, lbsToKg } from './utils';

import WeightInputForm from './components/WeightInputForm';
import WeightHistory from './components/WeightHistory';
import ProgressChart from './components/ProgressChart';
import ComparisonChart from './components/ComparisonChart';
import MotivationalTip from './components/MotivationalTip';
import ProgressSummary from './components/ProgressSummary';
import GoalSetter from './components/GoalSetter';
import UnitToggle from './components/UnitToggle';
import TabSelector from './components/TabSelector';
import { ScaleIcon } from './components/icons';
import Modal from './components/Modal';
import FloatingActionButton from './components/FloatingActionButton';


function App() {
  const [entries, setEntries] = useLocalStorage<WeightEntry[]>('weight-tracker-entries', []);
  const [unit, setUnit] = useLocalStorage<Unit>('weight-tracker-unit', 'kg');
  const [goalWeightInKg, setGoalWeightInKg] = useLocalStorage<number | null>('weight-tracker-goal', null);
  const [heightInM, setHeightInM] = useLocalStorage<number | null>('weight-tracker-height-m', null);
  const [streak, setStreak] = useLocalStorage<number>('weight-tracker-streak', 0);
  const [lastLogDate, setLastLogDate] = useLocalStorage<string>('weight-tracker-last-log', '');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<WeightEntry | null>(null);

  const [mainTab, setMainTab] = useState('Dashboard');
  const [analyticsTab, setAnalyticsTab] = useState('Progress');

  useEffect(() => {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    if (lastLogDate && lastLogDate !== today && lastLogDate !== yesterday) {
      setStreak(0);
    }
  }, [lastLogDate, setStreak]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries]);

  const handleSaveEntry = (entryData: Omit<WeightEntry, 'id'>, id?: string) => {
    const weightInKg = unit === 'lbs' ? lbsToKg(entryData.weight) : entryData.weight;
    const entryWithKg = { ...entryData, weight: weightInKg };

    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    if (id) { // Updating an entry
      setEntries(entries.map(e => e.id === id ? { ...e, ...entryWithKg } : e));
    } else { // Adding a new entry
      const existingEntryForDate = entries.find(e => e.date === entryWithKg.date);
      if (existingEntryForDate) {
         setEntries(entries.map(e => e.id === existingEntryForDate.id ? { ...e, ...entryWithKg } : e));
      } else {
        setEntries([...entries, { ...entryWithKg, id: uuidv4() }]);
      }
      
      // Streak logic
      if (entryData.date === today) {
        if (lastLogDate !== today) {
            if (lastLogDate === yesterday) {
                setStreak(s => s + 1);
            } else {
                setStreak(1);
            }
            setLastLogDate(today);
        }
      }
    }
    setIsModalOpen(false);
    setEntryToEdit(null);
  };

  const deleteWeightEntry = (id: string) => {
    const entryToDelete = displayEntries.find(entry => entry.id === id);
    if (!entryToDelete) return;
    
    if (window.confirm(`Are you sure you want to delete the entry for ${formatDate(entryToDelete.date)}?`)) {
        setEntries(entries.filter(entry => entry.id !== id));
    }
  };
  
  const handleSetGoal = (goal: number | null) => {
      if (goal === null) {
          setGoalWeightInKg(null);
          return;
      }
      const goalInKg = unit === 'lbs' ? lbsToKg(goal) : goal;
      setGoalWeightInKg(goalInKg);
  }
  
  const handleOpenAddModal = () => {
    setEntryToEdit(null);
    setIsModalOpen(true);
  }

  const handleOpenEditModal = (entryToOpen: WeightEntry) => {
    const originalEntry = entries.find(e => e.id === entryToOpen.id);
    if (originalEntry) {
      setEntryToEdit(originalEntry);
      setIsModalOpen(true);
    }
  }

  const displayEntries = useMemo(() => {
      if (unit === 'kg') return sortedEntries;
      return sortedEntries.map(e => ({...e, weight: kgToLbs(e.weight)}));
  }, [sortedEntries, unit]);

  const displayGoalWeight = useMemo(() => {
      if (goalWeightInKg === null || unit === 'kg') return goalWeightInKg;
      return kgToLbs(goalWeightInKg);
  }, [goalWeightInKg, unit]);

  const mainTabs = ['Dashboard', 'History'];
  const analyticsTabs = ['Progress', 'Comparison'];

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ScaleIcon className="w-7 h-7 text-violet-600" />
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Weight Tracker</h1>
          </div>
          <UnitToggle unit={unit} setUnit={setUnit} />
        </div>
      </header>

      <main className="container mx-auto pt-4 pb-24">
        <div className="px-4 mb-4">
            <TabSelector tabs={mainTabs} activeTab={mainTab} setActiveTab={setMainTab} />
        </div>

        <div className="px-4 flex flex-col gap-6">
            {mainTab === 'Dashboard' && (
              <>
                <ProgressSummary 
                    entries={sortedEntries} // Pass original KG entries
                    goalWeightInKg={goalWeightInKg} 
                    unit={unit} 
                    heightInM={heightInM}
                    setHeightInM={setHeightInM}
                    streak={streak}
                />
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-6">
                    <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Analytics</h2>
                    <div className="mb-4">
                        <TabSelector tabs={analyticsTabs} activeTab={analyticsTab} setActiveTab={setAnalyticsTab} />
                    </div>
                    {analyticsTab === 'Progress' ? (
                        <ProgressChart data={displayEntries} unit={unit} goalWeight={displayGoalWeight} />
                    ) : (
                        <ComparisonChart data={displayEntries} unit={unit} />
                    )}
                </div>
                 <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md divide-y divide-slate-200 dark:divide-slate-700">
                    <GoalSetter onSetGoal={handleSetGoal} goalWeight={displayGoalWeight} unit={unit} />
                 </div>
                <MotivationalTip />
              </>
            )}
            
            {mainTab === 'History' && (
                <WeightHistory
                  entries={displayEntries}
                  onDeleteEntry={deleteWeightEntry}
                  onEditEntry={handleOpenEditModal}
                  unit={unit}
                />
            )}
        </div>
      </main>
      
      <FloatingActionButton onClick={handleOpenAddModal} />
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={entryToEdit ? "Edit Entry" : "Log New Weight"}>
        <WeightInputForm 
          onSave={handleSaveEntry} 
          onCancel={() => setIsModalOpen(false)}
          unit={unit}
          entryToEdit={entryToEdit}
        />
      </Modal>

      <footer className="text-center pb-6 text-slate-500 dark:text-slate-400 text-sm">
        <p>Built with React & Gemini.</p>
      </footer>
    </div>
  );
}

export default App;
