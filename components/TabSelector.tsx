
import React from 'react';

interface TabSelectorProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`whitespace-nowrap pb-3 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-sm
                            ${activeTab === tab 
                                ? 'border-violet-500 text-violet-600 dark:text-violet-400' 
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default TabSelector;