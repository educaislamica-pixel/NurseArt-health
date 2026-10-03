import { Apple, HeartPulse } from 'lucide-react';
import HabitChecklist from '../components/HabitChecklist.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { weekDays } from '../utils/dates.js';
import { HEALTH, NUTRITION } from '../utils/habits.js';

export default function Wellness() {
  const { weekKey, habits, stats, toggleHabit } = useApp();
  const days = weekDays(weekKey);
  const w = stats.current;

  return (
    <>
      <PageHeader title="Salud y nutrición" subtitle="Checklist semanal: cada hábito marcado suma 5 puntos. Se reinicia cada lunes." />
      <div className="grid gap-4 lg:grid-cols-2">
        <HabitChecklist title="Nutrición" icon={Apple} tone="#37E0C8" habits={NUTRITION} days={days}
          weekData={habits[weekKey]} percent={w.nutritionPct} onToggle={toggleHabit} />
        <HabitChecklist title="Salud" icon={HeartPulse} tone="#9E69FF" habits={HEALTH} days={days}
          weekData={habits[weekKey]} percent={w.healthPct} onToggle={toggleHabit} />
      </div>
    </>
  );
}
