import React from 'react';

export default function MensalTab({ sc, months, barMax }) {
  const totalAccumulated = months.reduce((s, m) => s + m.net, 0);

  return (
    <div className="tab-content mensal-tab">
      {/* Lucro líquido mensal chart */}
      <div className="card">
        <div className="card-title">Lucro líquido mensal</div>
        <div className="monthly-chart-container">
          {months.map(m => {
            const pct = Math.abs(m.net) / barMax;
            const isPositive = m.net >= 0;
            return (
              <div key={m.month} className="chart-column-wrapper">
                <div
                  className="chart-column-fill"
                  style={{
                    height: `${Math.max(4, pct * 90)}px`,
                    backgroundColor: isPositive ? 'var(--theme-color)' : '#e05454'
                  }}
                  title={`Mês ${m.month}: R$ ${Math.round(m.net).toLocaleString("pt-BR")}`}
                />
                <span className="chart-column-label">M{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela de listagem mensal */}
      <div className="card">
        <div className="card-title">Projeção 12 meses</div>
        <div className="monthly-rows-list">
          {months.map(m => {
            const isPositive = m.net >= 0;
            return (
              <div key={m.month} className="monthly-row">
                <div className="monthly-row-left">
                  <span className="month-name">Mês {m.month}</span>
                  {m.debts > 0 && (
                    <span className="month-debts-badge">
                      dívidas: −R$ {m.debts.toFixed(0)}
                    </span>
                  )}
                </div>
                <div className="monthly-row-right">
                  <div className={`month-net-value ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? "+" : ""}R$ {Math.abs(m.net).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                  </div>
                  <div className="month-gross-value">
                    fat. R$ {m.monthlyGross.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="monthly-summary-row">
            <span className="summary-accumulated-label">Acumulado 12 meses</span>
            <span className={`summary-accumulated-value ${totalAccumulated >= 0 ? 'positive' : 'negative'}`}>
              {totalAccumulated >= 0 ? "+" : ""}R$ {Math.abs(totalAccumulated).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
