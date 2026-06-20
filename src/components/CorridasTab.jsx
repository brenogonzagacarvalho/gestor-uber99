import React from 'react';

export default function CorridasTab({
  sc,
  rides,
  DAYS_OF_WEEK,
  DAY_GOALS,
  weeklyGross,
  RIDE_TYPES
}) {
  return (
    <div className="tab-content corridas-tab">
      {/* Meta de corridas */}
      <div className="card highlight-card">
        <div className="card-badge">Meta de corridas · {sc.label}</div>
        <div className="rides-target-grid">
          {[
            { label: "Total/semana", value: rides.total, unit: "corridas" },
            { label: "Por noite", value: rides.perNight, unit: "corridas" },
            { label: "Por hora", value: rides.perHour, unit: "corridas" },
          ].map(({ label, value, unit }) => (
            <div key={label} className="rides-target-mini-card">
              <div className="rides-target-value" style={{ color: 'var(--theme-color)' }}>{value}</div>
              <div className="rides-target-unit">{unit}</div>
              <div className="rides-target-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mix ideal por noite */}
      <div className="card">
        <div className="card-title">Mix ideal por noite</div>
        <div className="ideal-mix-list">
          {DAYS_OF_WEEK.map((noite, i) => {
            const meta = Math.round(weeklyGross * DAY_GOALS[i]);
            const corridas = Math.ceil(meta / 18);
            const isPeak = i === 2 || i === 3;
            return (
              <div key={noite} className="mix-row">
                <div className="mix-row-header">
                  <span className={`mix-day-name ${isPeak ? 'peak' : ''}`} style={isPeak ? { color: 'var(--theme-color)' } : {}}>{noite}</span>
                  <span className="mix-day-values">R$ {meta.toLocaleString("pt-BR")} · {corridas} corridas</span>
                </div>
                <div className="mix-day-tip">
                  {isPeak ? "🔥 PICO — surge, Meireles, Iracema" : i === 4 ? "Manhã boa, tarde fraca" : "Corridas médias, sem pressão"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tipos de corrida */}
      <div className="card">
        <div className="card-title">Tipos de corrida</div>
        <div className="ride-types-list">
          {RIDE_TYPES.map(r => {
            const isHot = r.emoji === "🔥";
            return (
              <div
                key={r.tipo}
                className={`ride-type-card ${isHot ? 'hot' : ''}`}
                style={isHot ? { borderColor: 'var(--theme-color)50' } : {}}
              >
                <div className="ride-type-header">
                  <span className="ride-type-title">{r.emoji} {r.tipo}</span>
                  <span className="ride-type-distance">{r.distancia}</span>
                </div>
                <div className="ride-type-badges">
                  <div className="badge badge-danger">
                    <span className="badge-label">Mín: </span>
                    <span className="badge-val">R$ {r.valorMin}</span>
                  </div>
                  {r.valorIdeal < 999 && (
                    <div className="badge badge-success">
                      <span className="badge-label">Ideal: </span>
                      <span className="badge-val">R$ {r.valorIdeal}+</span>
                    </div>
                  )}
                  <div className="badge badge-info">
                    <span className="badge-label">⏱ </span>
                    <span className="badge-val">{r.tempoMedio} min</span>
                  </div>
                </div>
                <div className="ride-type-tip">{r.dica}</div>
                <div className="ride-type-time">🕐 {r.horario}</div>
              </div>
            );
          })}
        </div>

        <div className="card-golden-rule" style={{ backgroundColor: 'var(--theme-color)15', borderColor: 'var(--theme-color)40' }}>
          <div className="golden-rule-title" style={{ color: 'var(--theme-color)' }}>⚡ Regra de ouro</div>
          <div className="golden-rule-text">
            Nunca aceite abaixo de <strong>R$ 2,10/km</strong>.<br />
            Divida o valor pelo km antes de aceitar.<br />
            Ex: R$ 14 ÷ 6 km = R$ 2,33/km ✅
          </div>
        </div>
      </div>
    </div>
  );
}
