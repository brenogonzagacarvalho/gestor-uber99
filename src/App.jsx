import { useState, useMemo, useEffect } from "react";
import firebaseApp, { db } from "./services/firebase"; // Initializes Firebase
import { ref, onValue } from "firebase/database";

// Constants & Helpers
import {
  SCENARIOS,
  DAYS_OF_WEEK,
  DAY_GOALS,
  RIDE_TYPES
} from "./constants/simulation";
import {
  getDebtPayment,
  getFixedExpenses,
  calcRides,
  getWeekDates,
  getWednesdayOfDate
} from "./utils/helpers";

// Components
import Header from "./components/Header";
import ScenarioSelector from "./components/ScenarioSelector";
import TabNavigation from "./components/TabNavigation";
import ResumoTab from "./components/ResumoTab";
import GestaoTab from "./components/GestaoTab";
import CorridasTab from "./components/CorridasTab";
import MensalTab from "./components/MensalTab";
import CustosTab from "./components/CustosTab";

export default function App() {
  const [scenario, setScenario] = useState("realista");
  const [koviWeekly, setKoviWeekly] = useState(450);
  const [fuelFortaleza, setFuelFortaleza] = useState(2800);
  const [busMonthly, setBusMonthly] = useState(346);
  const [foodMonthly, setFoodMonthly] = useState(650);
  const [activeTab, setActiveTab] = useState("resumo");

  const [currentWeekWed, setCurrentWeekWed] = useState(() => getWednesdayOfDate(new Date()));
  const [firebaseDailyData, setFirebaseDailyData] = useState({});
  const [addingDay, setAddingDay] = useState(null);

  const weekDates = useMemo(() => getWeekDates(currentWeekWed), [currentWeekWed]);

  // Sync Firebase
  useEffect(() => {
    const dbRef = ref(db, "dailyData");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const val = snapshot.val() || {};
      setFirebaseDailyData(val);
    });
    return () => unsubscribe();
  }, []);

  const dailyData = useMemo(() => {
    return DAYS_OF_WEEK.map((dayName, idx) => {
      const dateInfo = weekDates[idx];
      const dbEntry = firebaseDailyData[dateInfo.dateStr] || {};
      return {
        day: dayName,
        dateStr: dateInfo.dateStr,
        dateLabel: dateInfo.label,
        rides: dbEntry.rides || "",
        value: dbEntry.value || "",
        notes: dbEntry.notes || ""
      };
    });
  }, [weekDates, firebaseDailyData]);

  const totalFaturado = dailyData.reduce((s, d) => s + (parseFloat(d.value) || 0), 0);
  const totalCorridas = dailyData.reduce((s, d) => s + (parseInt(d.rides) || 0), 0);

  const handlePrevWeek = () => {
    setCurrentWeekWed(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekWed(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  const handleCurrentWeek = () => {
    setCurrentWeekWed(getWednesdayOfDate(new Date()));
  };

  const sc = SCENARIOS[scenario];
  const weeklyGross = sc.weeklyGross;
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
  const tabLabels = {
    resumo: "Resumo",
    gestao: "Gestão",
    corridas: "Corridas",
    mensal: "Mensal",
    custos: "Custos"
  };

  return (
    <div className="app-container" style={{ "--theme-color": sc.color }}>
      <Header />
      <ScenarioSelector
        scenarios={SCENARIOS}
        activeScenario={scenario}
        onChange={setScenario}
      />
      <TabNavigation
        tabs={tabs}
        tabLabels={tabLabels}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "resumo" && (
        <ResumoTab
          sc={sc}
          weeklyGross={weeklyGross}
          koviWeekly={koviWeekly}
          setKoviWeekly={setKoviWeekly}
          fuelFortaleza={fuelFortaleza}
          setFuelFortaleza={setFuelFortaleza}
          busMonthly={busMonthly}
          setBusMonthly={setBusMonthly}
          foodMonthly={foodMonthly}
          setFoodMonthly={setFoodMonthly}
          weeklyFuel={weeklyFuel}
          weeklyBus={weeklyBus}
          weeklyFood={weeklyFood}
          weeklyNet={weeklyNet}
        />
      )}

      {activeTab === "gestao" && (
        <GestaoTab
          sc={sc}
          pctMeta={pctMeta}
          weeklyGross={weeklyGross}
          totalFaturado={totalFaturado}
          totalCorridas={totalCorridas}
          metaRestante={metaRestante}
          dailyData={dailyData}
          addingDay={addingDay}
          setAddingDay={setAddingDay}
          weekDates={weekDates}
          DAY_GOALS={DAY_GOALS}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onCurrentWeek={handleCurrentWeek}
          currentWeekWed={currentWeekWed}
          db={db}
        />
      )}

      {activeTab === "corridas" && (
        <CorridasTab
          sc={sc}
          rides={rides}
          DAYS_OF_WEEK={DAYS_OF_WEEK}
          DAY_GOALS={DAY_GOALS}
          weeklyGross={weeklyGross}
          RIDE_TYPES={RIDE_TYPES}
        />
      )}

      {activeTab === "mensal" && (
        <MensalTab
          sc={sc}
          months={months}
          barMax={barMax}
        />
      )}

      {activeTab === "custos" && (
        <CustosTab
          koviWeekly={koviWeekly}
          fuelFortaleza={fuelFortaleza}
          busMonthly={busMonthly}
          foodMonthly={foodMonthly}
          totalMonth1={totalMonth1}
        />
      )}
    </div>
  );
}
