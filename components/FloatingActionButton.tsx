
import React from 'react';
import { PlusIcon } from './icons';

interface FabProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FabProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 bg-violet-600 hover:bg-violet-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 transition-transform duration-200 ease-in-out active:scale-95 z-40"
    aria-label="Add new weight entry"
  >
    <PlusIcon className="w-7 h-7" />
  </button>
);

export default FloatingActionButton;