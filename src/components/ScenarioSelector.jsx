import React from 'react';

export default function ScenarioSelector({ scenarios, activeScenario, onChange }) {
  return (
    <div className="scenario-selector-container">
      {Object.entries(scenarios).map(([key, s]) => {
        const isActive = activeScenario === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`scenario-btn ${isActive ? 'active' : ''}`}
            style={{
              '--sc-color': s.color,
              '--sc-color-alpha': `${s.color}1c`
            }}
          >
            <span className="scenario-label">{s.label}</span>
            <div className="scenario-subtitle">
              R$ {s.weeklyGross.toLocaleString("pt-BR")}/sem
            </div>
          </button>
        );
      })}
    </div>
  );
}
