import React from 'react';

export default function ResumoTab({
  sc,
  weeklyGross,
  koviWeekly,
  setKoviWeekly,
  fuelFortaleza,
  setFuelFortaleza,
  busMonthly,
  setBusMonthly,
  foodMonthly,
  setFoodMonthly,
  weeklyFuel,
  weeklyBus,
  weeklyFood,
  weeklyNet
}) {
  const summaryItems = [
    { label: "Faturamento bruto", value: weeklyGross, isPositive: true },
    { label: "Carro", value: -koviWeekly, isPositive: false },
    { label: "Combustível", value: -Math.round(weeklyFuel), isPositive: false },
    { label: "Ônibus", value: -Math.round(weeklyBus), isPositive: false },
    { label: "Alimentação", value: -Math.round(weeklyFood), isPositive: false },
  ];

  const adjustmentItems = [
    { label: "Carro (semanal)", value: koviWeekly, set: setKoviWeekly, min: 300, max: 800, step: 25 },
    { label: "Combustível Fortaleza (mensal)", value: fuelFortaleza, set: setFuelFortaleza, min: 400, max: 1200, step: 50 },
    { label: "Ônibus Quixadá↔Fortaleza (mensal)", value: busMonthly, set: setBusMonthly, min: 200, max: 600, step: 20 },
    { label: "Alimentação Fortaleza (mensal)", value: foodMonthly, set: setFoodMonthly, min: 300, max: 1000, step: 50 },
  ];

  return (
    <div className="tab-content resumo-tab">
      <div className="card highlight-card">
        <div className="card-badge">Resumo semanal · {sc.label}</div>
        <div className="summary-list">
          {summaryItems.map(({ label, value, isPositive }) => (
            <div key={label} className="summary-item">
              <span className="summary-label">{label}</span>
              <span className={`summary-value ${isPositive ? 'positive' : 'negative'}`}>
                {value > 0 ? "+" : ""}R$ {Math.abs(value).toLocaleString("pt-BR")}
              </span>
            </div>
          ))}
        </div>
        <div className="summary-total">
          <span className="total-label">Lucro líquido/semana</span>
          <span className={`total-value ${weeklyNet >= 0 ? 'positive' : 'negative'}`}>
            {weeklyNet >= 0 ? "+" : ""}R$ {Math.round(weeklyNet).toLocaleString("pt-BR")}
          </span>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Ajustar custos</div>
        <div className="adjustments-list">
          {adjustmentItems.map(({ label, value, set, min, max, step }) => (
            <div key={label} className="adjustment-item">
              <div className="adjustment-header">
                <span className="adjustment-label">{label}</span>
                <span className="adjustment-value">R$ {value.toLocaleString("pt-BR")}</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => set(Number(e.target.value))}
                className="custom-range"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
