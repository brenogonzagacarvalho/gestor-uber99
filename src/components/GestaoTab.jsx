import React from 'react';

export default function GestaoTab({
  sc,
  pctMeta,
  weeklyGross,
  totalFaturado,
  totalCorridas,
  metaRestante,
  dailyData,
  addingDay,
  setAddingDay,
  weekDates,
  updateDaily,
  DAY_GOALS
}) {
  return (
    <div className="tab-content gestao-tab">
      {/* Progresso da semana */}
      <div className="card highlight-card">
        <div className="card-badge">Progresso da semana</div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${pctMeta}%`,
              backgroundColor: pctMeta >= 100 ? '#5cb85c' : 'var(--theme-color)'
            }}
          />
        </div>
        <div className="progress-details">
          <span className="progress-pct">{pctMeta.toFixed(0)}% da meta</span>
          <span className="progress-target">Meta: R$ {weeklyGross.toLocaleString("pt-BR")}</span>
        </div>
        <div className="progress-summary-cards">
          {[
            { label: "Faturado", value: `R$ ${totalFaturado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, className: "faturado-value" },
            { label: "Corridas", value: totalCorridas, className: "normal-value" },
            { label: "Falta", value: `R$ ${metaRestante.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, className: metaRestante === 0 ? "success-value" : "danger-value" },
          ].map(({ label, value, className }) => (
            <div key={label} className="summary-mini-card">
              <div className={`mini-card-value ${className}`}>{value}</div>
              <div className="mini-card-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Registro por noite */}
      <div className="card">
        <div className="card-title">Registro por noite</div>
        <div className="nights-list">
          {dailyData.map((d, idx) => {
            const dayMeta = Math.round(weeklyGross * DAY_GOALS[idx]);
            const dayVal = parseFloat(d.value) || 0;
            const dayRides = parseInt(d.rides) || 0;
            const dayPct = Math.min(100, (dayVal / dayMeta) * 100);
            const isOpen = addingDay === idx;
            return (
              <div
                key={d.day}
                className={`night-row-card ${isOpen ? 'active' : ''}`}
                style={isOpen ? { borderColor: 'var(--theme-color)' } : {}}
              >
                <div className="night-row-header">
                  <div className="night-row-title-container">
                    <span className="night-name">{d.day}</span>
                    <span className="night-date">{weekDates[idx]}</span>
                  </div>
                  <button
                    onClick={() => setAddingDay(isOpen ? null : idx)}
                    className={`launch-btn ${isOpen ? 'active' : ''}`}
                    style={isOpen ? { backgroundColor: 'var(--theme-color)', color: '#fff', borderColor: 'var(--theme-color)' } : {}}
                  >
                    {isOpen ? "Fechar" : dayVal > 0 ? "Editar" : "+ Lançar"}
                  </button>
                </div>

                {/* Mini progress bar */}
                <div className="mini-progress-bar-container">
                  <div
                    className="mini-progress-bar-fill"
                    style={{
                      width: `${dayPct}%`,
                      backgroundColor: dayPct >= 100 ? '#5cb85c' : 'var(--theme-color)'
                    }}
                  />
                </div>

                <div className="night-row-footer">
                  <span className="night-rides-count">
                    {dayRides > 0 ? `${dayRides} corridas` : "—"}
                  </span>
                  <span className={`night-value ${dayVal > 0 ? 'active-value' : 'meta-value'}`}>
                    {dayVal > 0 ? `R$ ${dayVal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `Meta: R$ ${dayMeta}`}
                  </span>
                </div>

                {/* Form de lançamento */}
                {isOpen && (
                  <div className="launch-form">
                    <div className="form-group">
                      <label className="form-label">Corridas realizadas</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Ex: 18"
                        value={d.rides}
                        onChange={e => updateDaily(idx, "rides", e.target.value)}
                        className="custom-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Valor faturado (R$)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ex: 320.50"
                        value={d.value}
                        onChange={e => updateDaily(idx, "value", e.target.value)}
                        className="custom-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Observações (opcional)</label>
                      <input
                        type="text"
                        placeholder="Ex: surge em Meireles, chuva..."
                        value={d.notes}
                        onChange={e => updateDaily(idx, "notes", e.target.value)}
                        className="custom-input"
                      />
                    </div>
                    <div className="form-status-summary">
                      <span className="day-meta-text">Meta do dia: <strong>R$ {dayMeta}</strong></span>
                      <span className={`day-status-text ${dayVal >= dayMeta ? 'success-text' : 'warning-text'}`}>
                        {dayVal >= dayMeta ? "✅ Meta batida!" : `Falta R$ ${Math.max(0, dayMeta - dayVal).toFixed(2)}`}
                      </span>
                    </div>
                    <button
                      onClick={() => setAddingDay(null)}
                      className="save-btn"
                      style={{ backgroundColor: 'var(--theme-color)' }}
                    >
                      Salvar
                    </button>
                  </div>
                )}

                {/* Notas salvas */}
                {!isOpen && d.notes && (
                  <div className="saved-notes">📝 {d.notes}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket médio e projeção */}
      {totalCorridas > 0 && (
        <div className="card">
          <div className="card-title">Análise da semana</div>
          <div className="analysis-list">
            {[
              { label: "Ticket médio real", value: `R$ ${(totalFaturado / totalCorridas).toFixed(2)}` },
              { label: "Média por corrida", value: `R$ ${(totalFaturado / totalCorridas).toFixed(2)}` },
              { label: "Corridas p/ bater meta", value: `${Math.ceil(metaRestante / (totalFaturado / totalCorridas))} corridas` },
            ].map(({ label, value }) => (
              <div key={label} className="analysis-row">
                <span className="analysis-label">{label}</span>
                <span className="analysis-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
