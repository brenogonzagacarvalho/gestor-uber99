import { useState, useMemo } from "react";

const DEBTS = [
  { name: "Kawasaki", monthly: 650, remaining: 30 },
  { name: "Cartão Nubank", monthly: 317, remaining: 4 },
  { name: "Cartão Banco do Brasil", monthly: 255, remaining: 9 },
  { name: "Serasa", monthly: 180, remaining: 5 },
];

const FIXED_EXPENSES = [
  { name: "Aluguel (Quixadá)", value: 345 },
  { name: "Gasolina (Quixadá)", value: 80 },
  { name: "CNH", value: 115 },
  { name: "Celular", value: 400 },
];

const SCENARIOS = {
  conservador: { label: "Conservador", weeklyGross: 1200, color: "#e07b54" },
  realista: { label: "Realista", weeklyGross: 1600, color: "#4a9eca" },
  otimista: { label: "Otimista", weeklyGross: 2000, color: "#5cb85c" },
};

const RIDE_TYPES = [
  { tipo: "Curta", distancia: "2–4 km", valorMin: 9, valorIdeal: 12, tempoMedio: 8, emoji: "🟡", dica: "Só aceitar se já estiver perto. Evitar no início da noite.", horario: "Qualquer horário" },
  { tipo: "Média", distancia: "5–10 km", valorMin: 14, valorIdeal: 20, tempoMedio: 14, emoji: "🟢", dica: "Melhor custo-benefício. Prioridade sempre.", horario: "Qualquer horário" },
  { tipo: "Longa", distancia: "11–20 km", valorMin: 25, valorIdeal: 38, tempoMedio: 22, emoji: "🟢", dica: "Ótima no pico com surge. Aceitar sempre acima de R$25.", horario: "Sex e Sab noite" },
  { tipo: "Aeroporto", distancia: "15–30 km", valorMin: 35, valorIdeal: 60, tempoMedio: 30, emoji: "✈️", dica: "Sempre aceitar. Alta tarifa, passageiro pontual.", horario: "Madrugada e manhã" },
  { tipo: "Surge 1.5x+", distancia: "qualquer", valorMin: 18, valorIdeal: 999, tempoMedio: 10, emoji: "🔥", dica: "NUNCA recusar. Sex/Sab após meia-noite. Fique em Meireles e Iracema.", horario: "Sex e Sab 22h–03h" },
];

const DAYS_OF_WEEK = ["Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const DAY_GOALS = [0.15, 0.18, 0.28, 0.28, 0.11];

function getDebtPayment(month) {
  return DEBTS.reduce((sum, d) => sum + (month <= d.remaining ? d.monthly : 0), 0);
}
function getFixedExpenses() {
  return FIXED_EXPENSES.reduce((sum, e) => sum + e.value, 0);
}
function calcRides(weeklyGross) {
  const avgRideValue = 18;
  const total = Math.ceil(weeklyGross / avgRideValue);
  const perNight = Math.ceil(total / 5);
  const perHour = (perNight / 6).toFixed(1);
  return { total, perNight, perHour };
}

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  // Semana começa na Quarta (3)
  const diff = (day >= 3) ? day - 3 : day + 4;
  const wed = new Date(today);
  wed.setDate(today.getDate() - diff);
  return DAYS_OF_WEEK.map((_, i) => {
    const d = new Date(wed);
    d.setDate(wed.getDate() + i);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  });
}

export default function Simulador() {
  const [scenario, setScenario] = useState("realista");
  const [koviWeekly, setKoviWeekly] = useState(450);
  const [fuelFortaleza, setFuelFortaleza] = useState(800);
  const [busMonthly, setBusMonthly] = useState(346);
  const [foodMonthly, setFoodMonthly] = useState(650);
  const [activeTab, setActiveTab] = useState("resumo");

  // Gestão diária: array de 5 dias (Qua-Dom)
  const [dailyData, setDailyData] = useState(
    DAYS_OF_WEEK.map(d => ({ day: d, rides: "", value: "", notes: "" }))
  );
  const [inputRide, setInputRide] = useState({ dayIdx: 0, rides: "", value: "" });
  const [addingDay, setAddingDay] = useState(null);

  const weekDates = getWeekDates();

  const updateDaily = (idx, field, val) => {
    setDailyData(prev => prev.map((d, i) => i === idx ? { ...d, [field]: val } : d));
  };

  const totalFaturado = dailyData.reduce((s, d) => s + (parseFloat(d.value) || 0), 0);
  const totalCorridas = dailyData.reduce((s, d) => s + (parseInt(d.rides) || 0), 0);

  const sc = SCENARIOS[scenario];
  const weeklyGross = SCENARIOS[scenario].weeklyGross;
  const weeklyFuel = fuelFortaleza / 4.33;
  const weeklyBus = busMonthly / 4.33;
  const weeklyFood = foodMonthly / 4.33;
  const weeklyTotal = koviWeekly + weeklyFuel + weeklyBus + weeklyFood;
  const weeklyNet = weeklyGross - weeklyTotal;
  const rides = calcRides(weeklyGross);
  const metaRestante = Math.max(0, weeklyGross - totalFaturado);
  const pctMeta = Math.min(100, (totalFaturado / weeklyGross) * 100);

  const months = useMemo(() => {
    const monthlyGross = weeklyGross * 4.33;
    const fixed = getFixedExpenses();
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const debts = getDebtPayment(month);
      const koviMonthly = koviWeekly * 4.33;
      const totalExpenses = fixed + debts + koviMonthly + fuelFortaleza + busMonthly + foodMonthly;
      const net = monthlyGross - totalExpenses;
      return { month, monthlyGross, totalExpenses, debts, net };
    });
  }, [scenario, koviWeekly, fuelFortaleza, busMonthly, foodMonthly]);

  const barMax = Math.max(...months.map(m => Math.abs(m.net))) * 1.2 || 1;
  const totalMonth1 = getFixedExpenses() + getDebtPayment(1) + Math.round(koviWeekly * 4.33) + fuelFortaleza + busMonthly + foodMonthly;

  const tabs = ["resumo", "gestao", "corridas", "mensal", "custos"];
  const tabLabels = { resumo: "Resumo", gestao: "Gestão", corridas: "Corridas", mensal: "Mensal", custos: "Custos" };

  const inputStyle = {
    background: "#0f1117", border: "1px solid #2a2d35", borderRadius: 8,
    color: "#fff", padding: "8px 12px", fontSize: 14, width: "100%",
    boxSizing: "border-box", outline: "none",
  };

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: "#0f1117", minHeight: "100vh", color: "#e8eaf0",
      padding: "24px 16px", maxWidth: 480, margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#666", textTransform: "uppercase", marginBottom: 4 }}>Simulador</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#fff" }}>Uber/99 · Fortaleza</h1>
        <p style={{ fontSize: 13, color: "#888", marginTop: 4, marginBottom: 0 }}>Turno noturno · Qua–Dom · Ônibus Quixadá↔Fortaleza</p>
      </div>

      {/* Scenario selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button key={key} onClick={() => setScenario(key)} style={{
            flex: 1, padding: "10px 0", borderRadius: 8,
            border: scenario === key ? `2px solid ${s.color}` : "2px solid #2a2d35",
            background: scenario === key ? `${s.color}18` : "#1a1d24",
            color: scenario === key ? s.color : "#666",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>
            {s.label}
            <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2, opacity: 0.8 }}>R$ {s.weeklyGross.toLocaleString("pt-BR")}/sem</div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 3, marginBottom: 20, background: "#1a1d24", borderRadius: 10, padding: 4 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            flex: 1, padding: "7px 0", borderRadius: 7, border: "none",
            background: activeTab === t ? sc.color : "transparent",
            color: activeTab === t ? "#fff" : "#666",
            fontSize: 10, fontWeight: 600, cursor: "pointer",
          }}>{tabLabels[t]}</button>
        ))}
      </div>

      {/* ===== TAB: RESUMO ===== */}
      {activeTab === "resumo" && (
        <>
          <div style={{ background: `${sc.color}12`, border: `1px solid ${sc.color}40`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: sc.color, textTransform: "uppercase", marginBottom: 12 }}>
              Resumo semanal · {sc.label}
            </div>
            {[
              { label: "Faturamento bruto", value: weeklyGross, pos: true },
              { label: "Kovi", value: -koviWeekly },
              { label: "Combustível", value: -Math.round(weeklyFuel) },
              { label: "Ônibus", value: -Math.round(weeklyBus) },
              { label: "Alimentação", value: -Math.round(weeklyFood) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ fontSize: 12, color: "#999" }}>{label}</span>
                <span style={{ fontSize: 12, color: value > 0 ? "#5cb85c" : "#e05454" }}>
                  {value > 0 ? "+" : ""}R$ {Math.abs(value).toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${sc.color}30`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Lucro líquido/semana</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: weeklyNet >= 0 ? sc.color : "#e05454" }}>
                {weeklyNet >= 0 ? "+" : ""}R$ {Math.round(weeklyNet).toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
          <div style={{ background: "#1a1d24", borderRadius: 12, padding: 16, border: "1px solid #2a2d35" }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#555", textTransform: "uppercase", marginBottom: 14 }}>Ajustar custos</div>
            {[
              { label: "Kovi (semanal)", value: koviWeekly, set: setKoviWeekly, min: 300, max: 800, step: 25 },
              { label: "Combustível Fortaleza (mensal)", value: fuelFortaleza, set: setFuelFortaleza, min: 400, max: 1200, step: 50 },
              { label: "Ônibus Quixadá↔Fortaleza (mensal)", value: busMonthly, set: setBusMonthly, min: 200, max: 600, step: 20 },
              { label: "Alimentação Fortaleza (mensal)", value: foodMonthly, set: setFoodMonthly, min: 300, max: 1000, step: 50 },
            ].map(({ label, value, set, min, max, step }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#aaa" }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>R$ {value.toLocaleString("pt-BR")}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={value}
                  onChange={e => set(Number(e.target.value))}
                  style={{ width: "100%", accentColor: sc.color, cursor: "pointer" }} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== TAB: GESTÃO ===== */}
      {activeTab === "gestao" && (
        <>
          {/* Progresso da semana */}
          <div style={{ background: `${sc.color}12`, border: `1px solid ${sc.color}40`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: sc.color, textTransform: "uppercase", marginBottom: 14 }}>
              Progresso da semana
            </div>
            {/* Barra de progresso */}
            <div style={{ background: "#0f1117", borderRadius: 8, height: 12, marginBottom: 10, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${pctMeta}%`,
                background: pctMeta >= 100 ? "#5cb85c" : sc.color,
                borderRadius: 8, transition: "width 0.4s",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: "#888" }}>{pctMeta.toFixed(0)}% da meta</span>
              <span style={{ fontSize: 12, color: "#888" }}>Meta: R$ {weeklyGross.toLocaleString("pt-BR")}</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "Faturado", value: `R$ ${totalFaturado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: sc.color },
                { label: "Corridas", value: totalCorridas, color: "#fff" },
                { label: "Falta", value: `R$ ${metaRestante.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: metaRestante === 0 ? "#5cb85c" : "#e05454" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ flex: 1, background: "#0f1117", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontSize: 10, color: "#666", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Registro por dia */}
          <div style={{ background: "#1a1d24", borderRadius: 12, padding: 16, border: "1px solid #2a2d35", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#555", textTransform: "uppercase", marginBottom: 14 }}>
              Registro por noite
            </div>
            {dailyData.map((d, idx) => {
              const dayMeta = Math.round(weeklyGross * DAY_GOALS[idx]);
              const dayVal = parseFloat(d.value) || 0;
              const dayRides = parseInt(d.rides) || 0;
              const dayPct = Math.min(100, (dayVal / dayMeta) * 100);
              const isOpen = addingDay === idx;
              return (
                <div key={d.day} style={{
                  background: "#0f1117", borderRadius: 10, padding: 14,
                  marginBottom: 10, border: isOpen ? `1px solid ${sc.color}60` : "1px solid #22252e",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{d.day}</span>
                      <span style={{ fontSize: 11, color: "#555", marginLeft: 8 }}>{weekDates[idx]}</span>
                    </div>
                    <button onClick={() => setAddingDay(isOpen ? null : idx)} style={{
                      background: isOpen ? sc.color : "#1a1d24",
                      border: `1px solid ${isOpen ? sc.color : "#2a2d35"}`,
                      borderRadius: 6, color: isOpen ? "#fff" : "#888",
                      fontSize: 11, padding: "4px 10px", cursor: "pointer", fontWeight: 600,
                    }}>
                      {isOpen ? "Fechar" : dayVal > 0 ? "Editar" : "+ Lançar"}
                    </button>
                  </div>

                  {/* Mini barra */}
                  <div style={{ background: "#1a1d24", borderRadius: 4, height: 6, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${dayPct}%`,
                      background: dayPct >= 100 ? "#5cb85c" : sc.color,
                      borderRadius: 4, transition: "width 0.3s",
                    }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#666" }}>
                      {dayRides > 0 ? `${dayRides} corridas` : "—"}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: dayVal > 0 ? sc.color : "#444" }}>
                      {dayVal > 0 ? `R$ ${dayVal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `Meta: R$ ${dayMeta}`}
                    </span>
                  </div>

                  {/* Form de lançamento */}
                  {isOpen && (
                    <div style={{ marginTop: 14, borderTop: "1px solid #22252e", paddingTop: 14 }}>
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Corridas realizadas</div>
                        <input
                          type="number" min="0" placeholder="Ex: 18"
                          value={d.rides}
                          onChange={e => updateDaily(idx, "rides", e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Valor faturado (R$)</div>
                        <input
                          type="number" min="0" step="0.01" placeholder="Ex: 320.50"
                          value={d.value}
                          onChange={e => updateDaily(idx, "value", e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Observações (opcional)</div>
                        <input
                          type="text" placeholder="Ex: surge em Meireles, chuva..."
                          value={d.notes}
                          onChange={e => updateDaily(idx, "notes", e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "#666" }}>
                        <span>Meta do dia: <strong style={{ color: "#fff" }}>R$ {dayMeta}</strong></span>
                        <span style={{ color: dayVal >= dayMeta ? "#5cb85c" : "#e07b54" }}>
                          {dayVal >= dayMeta ? "✅ Meta batida!" : `Falta R$ ${Math.max(0, dayMeta - dayVal).toFixed(2)}`}
                        </span>
                      </div>
                      <button
                        onClick={() => setAddingDay(null)}
                        style={{
                          marginTop: 12, width: "100%", padding: "10px",
                          background: sc.color, border: "none", borderRadius: 8,
                          color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        }}>
                        Salvar
                      </button>
                    </div>
                  )}

                  {/* Notas salvas */}
                  {!isOpen && d.notes && (
                    <div style={{ marginTop: 6, fontSize: 11, color: "#666", fontStyle: "italic" }}>📝 {d.notes}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Ticket médio e projeção */}
          {totalCorridas > 0 && (
            <div style={{ background: "#1a1d24", borderRadius: 12, padding: 16, border: "1px solid #2a2d35" }}>
              <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#555", textTransform: "uppercase", marginBottom: 14 }}>
                Análise da semana
              </div>
              {[
                { label: "Ticket médio real", value: `R$ ${(totalFaturado / totalCorridas).toFixed(2)}` },
                { label: "Média por corrida", value: `R$ ${(totalFaturado / totalCorridas).toFixed(2)}` },
                { label: "Corridas p/ bater meta", value: `${Math.ceil(metaRestante / (totalFaturado / totalCorridas))} corridas` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #22252e" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== TAB: CORRIDAS ===== */}
      {activeTab === "corridas" && (
        <>
          <div style={{ background: `${sc.color}12`, border: `1px solid ${sc.color}40`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: sc.color, textTransform: "uppercase", marginBottom: 14 }}>
              Meta de corridas · {sc.label}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "Total/semana", value: rides.total, unit: "corridas" },
                { label: "Por noite", value: rides.perNight, unit: "corridas" },
                { label: "Por hora", value: rides.perHour, unit: "corridas" },
              ].map(({ label, value, unit }) => (
                <div key={label} style={{ flex: 1, background: "#0f1117", borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: sc.color }}>{value}</div>
                  <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{unit}</div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#1a1d24", borderRadius: 12, padding: 16, border: "1px solid #2a2d35", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#555", textTransform: "uppercase", marginBottom: 14 }}>Mix ideal por noite</div>
            {DAYS_OF_WEEK.map((noite, i) => {
              const meta = Math.round(weeklyGross * DAY_GOALS[i]);
              const corridas = Math.ceil(meta / 18);
              const isPeak = i === 2 || i === 3;
              return (
                <div key={noite} style={{ padding: "10px 0", borderBottom: "1px solid #22252e" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: isPeak ? sc.color : "#aaa" }}>{noite}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>R$ {meta.toLocaleString("pt-BR")} · {corridas} corridas</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#666" }}>
                    {isPeak ? "🔥 PICO — surge, Meireles, Iracema" : i === 4 ? "Manhã boa, tarde fraca" : "Corridas médias, sem pressão"}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "#1a1d24", borderRadius: 12, padding: 16, border: "1px solid #2a2d35" }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#555", textTransform: "uppercase", marginBottom: 14 }}>Tipos de corrida</div>
            {RIDE_TYPES.map(r => (
              <div key={r.tipo} style={{
                background: "#0f1117", borderRadius: 10, padding: 14, marginBottom: 10,
                border: r.emoji === "🔥" ? `1px solid ${sc.color}50` : "1px solid #22252e",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{r.emoji} {r.tipo}</span>
                  <span style={{ fontSize: 12, color: "#aaa" }}>{r.distancia}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <div style={{ background: "#1a1d24", borderRadius: 6, padding: "4px 10px", fontSize: 11 }}>
                    <span style={{ color: "#666" }}>Mín: </span>
                    <span style={{ color: "#e05454", fontWeight: 700 }}>R$ {r.valorMin}</span>
                  </div>
                  {r.valorIdeal < 999 && (
                    <div style={{ background: "#1a1d24", borderRadius: 6, padding: "4px 10px", fontSize: 11 }}>
                      <span style={{ color: "#666" }}>Ideal: </span>
                      <span style={{ color: "#5cb85c", fontWeight: 700 }}>R$ {r.valorIdeal}+</span>
                    </div>
                  )}
                  <div style={{ background: "#1a1d24", borderRadius: 6, padding: "4px 10px", fontSize: 11 }}>
                    <span style={{ color: "#666" }}>⏱ </span>
                    <span style={{ color: "#aaa" }}>{r.tempoMedio} min</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>{r.dica}</div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>🕐 {r.horario}</div>
              </div>
            ))}
            <div style={{ background: `${sc.color}15`, border: `1px solid ${sc.color}40`, borderRadius: 10, padding: 14, marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: sc.color, marginBottom: 6 }}>⚡ Regra de ouro</div>
              <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>
                Nunca aceite abaixo de <strong style={{ color: "#fff" }}>R$ 2,10/km</strong>.<br />
                Divida o valor pelo km antes de aceitar.<br />
                Ex: R$ 14 ÷ 6 km = R$ 2,33/km ✅
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== TAB: MENSAL ===== */}
      {activeTab === "mensal" && (
        <>
          <div style={{ background: "#1a1d24", borderRadius: 12, padding: 16, border: "1px solid #2a2d35", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#555", textTransform: "uppercase", marginBottom: 16 }}>Lucro líquido mensal</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100 }}>
              {months.map(m => {
                const pct = Math.abs(m.net) / barMax;
                return (
                  <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: "100%", height: Math.max(4, pct * 90),
                      background: m.net >= 0 ? sc.color : "#e05454",
                      borderRadius: "3px 3px 0 0", transition: "height 0.3s",
                    }} />
                    <div style={{ fontSize: 9, color: "#555" }}>M{m.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ background: "#1a1d24", borderRadius: 12, padding: 16, border: "1px solid #2a2d35" }}>
            {months.map(m => (
              <div key={m.month} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #22252e" }}>
                <div>
                  <span style={{ fontSize: 12, color: "#aaa" }}>Mês {m.month}</span>
                  {m.debts > 0 && <span style={{ fontSize: 10, color: "#e07b54", marginLeft: 6 }}>dívidas: −R${m.debts.toFixed(0)}</span>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: m.net >= 0 ? sc.color : "#e05454" }}>
                    {m.net >= 0 ? "+" : ""}R$ {Math.abs(m.net).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                  </div>
                  <div style={{ fontSize: 10, color: "#555" }}>fat. R${m.monthlyGross.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0" }}>
              <span style={{ fontSize: 13, color: "#aaa", fontWeight: 600 }}>Acumulado 12 meses</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: months.reduce((s, m) => s + m.net, 0) >= 0 ? sc.color : "#e05454" }}>
                {months.reduce((s, m) => s + m.net, 0) >= 0 ? "+" : ""}R$ {Math.abs(months.reduce((s, m) => s + m.net, 0)).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </>
      )}

      {/* ===== TAB: CUSTOS ===== */}
      {activeTab === "custos" && (
        <div style={{ background: "#1a1d24", borderRadius: 12, padding: 16, border: "1px solid #2a2d35" }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#555", textTransform: "uppercase", marginBottom: 14 }}>Base de custos (mês 1)</div>
          {[
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
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #22252e" }}>
              <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
              <span style={{ fontSize: 12, color: "#ccc" }}>R$ {value.toLocaleString("pt-BR")}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Total mês 1</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#e05454" }}>R$ {totalMonth1.toLocaleString("pt-BR")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
