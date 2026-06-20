export const DEBTS = [
  { name: "Kawasaki", monthly: 650, remaining: 30 },
  { name: "Cartão Nubank", monthly: 317, remaining: 4 },
  { name: "Cartão Banco do Brasil", monthly: 255, remaining: 9 },
  { name: "Serasa", monthly: 180, remaining: 5 },
];

export const FIXED_EXPENSES = [
  { name: "Aluguel (Quixadá)", value: 345 },
  { name: "Gasolina (Quixadá)", value: 80 },
  { name: "CNH", value: 115 },
  { name: "Celular", value: 400 },
];

export const SCENARIOS = {
  conservador: { label: "Conservador", weeklyGross: 1200, color: "#e07b54" },
  realista: { label: "Realista", weeklyGross: 1600, color: "#4a9eca" },
  otimista: { label: "Otimista", weeklyGross: 2000, color: "#5cb85c" },
};

export const RIDE_TYPES = [
  { tipo: "Curta", distancia: "2–4 km", valorMin: 9, valorIdeal: 12, tempoMedio: 8, emoji: "🟡", dica: "Só aceitar se já estiver perto. Evitar no início da noite.", horario: "Qualquer horário" },
  { tipo: "Média", distancia: "5–10 km", valorMin: 14, valorIdeal: 20, tempoMedio: 14, emoji: "🟢", dica: "Melhor custo-benefício. Prioridade sempre.", horario: "Qualquer horário" },
  { tipo: "Longa", distancia: "11–20 km", valorMin: 25, valorIdeal: 38, tempoMedio: 22, emoji: "🟢", dica: "Ótima no pico com surge. Aceitar sempre acima de R$25.", horario: "Sex e Sab noite" },
  { tipo: "Aeroporto", distancia: "15–30 km", valorMin: 35, valorIdeal: 60, tempoMedio: 30, emoji: "✈️", dica: "Sempre aceitar. Alta tarifa, passageiro pontual.", horario: "Madrugada e manhã" },
  { tipo: "Surge 1.5x+", distancia: "qualquer", valorMin: 18, valorIdeal: 999, tempoMedio: 10, emoji: "🔥", dica: "NUNCA recusar. Sex/Sab após meia-noite. Fique em Meireles e Iracema.", horario: "Sex e Sab 22h–03h" },
];

export const DAYS_OF_WEEK = ["Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
export const DAY_GOALS = [0.15, 0.18, 0.28, 0.28, 0.11];
