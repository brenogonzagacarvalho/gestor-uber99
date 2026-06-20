import React from 'react';

export default function TabNavigation({ tabs, tabLabels, activeTab, onChange }) {
  return (
    <nav className="tab-navigation">
      {tabs.map(t => {
        const isActive = activeTab === t;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`tab-btn ${isActive ? 'active' : ''}`}
          >
            {tabLabels[t]}
          </button>
        );
      })}
    </nav>
  );
}
