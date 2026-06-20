import { DEBTS, FIXED_EXPENSES, DAYS_OF_WEEK } from "../constants/simulation";

export function getDebtPayment(month) {
  return DEBTS.reduce((sum, d) => sum + (month <= d.remaining ? d.monthly : 0), 0);
}

export function getFixedExpenses() {
  return FIXED_EXPENSES.reduce((sum, e) => sum + e.value, 0);
}

export function calcRides(weeklyGross) {
  const avgRideValue = 18;
  const total = Math.ceil(weeklyGross / avgRideValue);
  const perNight = Math.ceil(total / 5);
  const perHour = (perNight / 6).toFixed(1);
  return { total, perNight, perHour };
}

export function getWeekDates() {
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
