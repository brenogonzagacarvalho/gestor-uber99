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

export function getWednesdayOfDate(date) {
  const d = new Date(date);
  const day = d.getDay();
  // Semana começa na Quarta (3)
  const diff = (day >= 3) ? day - 3 : day + 4;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDates(wednesdayDate = getWednesdayOfDate(new Date())) {
  return DAYS_OF_WEEK.map((_, i) => {
    const d = new Date(wednesdayDate);
    d.setDate(wednesdayDate.getDate() + i);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayVal = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayVal}`;
    
    return {
      dateStr,
      label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    };
  });
}
