import React from 'react';

export default function CustosTab({
  koviWeekly,
  fuelFortaleza,
  busMonthly,
  foodMonthly,
  totalMonth1
}) {
  const costItems = [
    { label: "Aluguel Quixadá", value: 345 },
    { label: "Gasolina Quixadá", value: 80 },
    { label: "CNH", value: 115 },
    { label: "Celular", value: 400 },
    { label: "Kawasaki", value: 650 },
    { label: "Cartão Nubank", value: 317 },
    { label: "Cartão BB", value: 255 },
    { label: "Serasa", value: 180 },
    { label: "Kovi (estimado)", value: Math.round(koviWeekly * 4.33) },
    { label: "Combustível Fortaleza", value: fuelFortaleza },
    { label: "Ônibus Quixadá↔Fortaleza", value: busMonthly },
    { label: "Alimentação Fortaleza", value: foodMonthly },
  ];

  return (
    <div className="tab-content custos-tab">
      <div className="card">
        <div className="card-title">Base de custos (mês 1)</div>
        <div className="costs-list">
          {costItems.map(({ label, value }) => (
            <div key={label} className="costs-row">
              <span className="cost-label">{label}</span>
              <span className="cost-value">R$ {value.toLocaleString("pt-BR")}</span>
            </div>
          ))}
          <div className="costs-total-row">
            <span className="total-label">Total mês 1</span>
            <span className="total-value">R$ {totalMonth1.toLocaleString("pt-BR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
