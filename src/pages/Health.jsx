import { Activity, BedDouble, Brain, Dumbbell, Footprints } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CounterCard from '../components/CounterCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ToggleCard from '../components/ToggleCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { GOALS } from '../utils/helpers.js';

export default function Health() {
  const { health, patchHealth, stats, today } = useApp();
  const day = health[today] || {};
  const set = (key) => (v) => patchHealth({ [key]: v });

  return (
    <>
      <PageHeader title="Salud" subtitle={`Progreso de hoy: ${stats.today.health}%`} />

      <div className="grid gap-3 md:grid-cols-2">
        <CounterCard icon={Dumbbell} label="Ejercicio" unit="min" goal={GOALS.exercise} step={5} max={600}
          value={day.exercise || 0} tone="#0D4FB5" onChange={set('exercise')} />
        <CounterCard icon={Footprints} label="Pasos" unit="pasos" goal={GOALS.steps} step={500} max={100000}
          value={day.steps || 0} tone="#37E0C8" onChange={set('steps')} />
        <CounterCard icon={BedDouble} label="Sueño" unit="h" goal={GOALS.sleep} step={0.5} max={16}
          value={day.sleep || 0} tone="#9E69FF" onChange={set('sleep')} />
        <CounterCard icon={Brain} label="Meditación" unit="min" goal={GOALS.meditation} step={5} max={240}
          value={day.meditation || 0} tone="#0D4FB5" onChange={set('meditation')} />
        <div className="md:col-span-2">
          <ToggleCard icon={Activity} label="Estiramientos" hint="Cuello, espalda y piernas" tone="#9E69FF"
            checked={!!day.stretching} onChange={set('stretching')} />
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="mb-3 font-bold">Salud esta semana</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.week} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} unit="%" />
              <Tooltip cursor={{ fill: '#F1F5F9' }} formatter={(v) => [`${v}%`, 'Salud']} labelFormatter={(_, p) => p?.[0]?.payload.long} />
              <Bar dataKey="health" fill="#9E69FF" radius={[8, 8, 8, 8]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
