import { useState } from 'react';
import { BottomNav, Sidebar } from './components/Navigation.jsx';
import Logo from './components/Logo.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import Nutrition from './pages/Nutrition.jsx';
import Health from './pages/Health.jsx';
import Stats from './pages/Stats.jsx';

const SCREENS = { dashboard: Dashboard, tasks: Tasks, nutrition: Nutrition, health: Health, stats: Stats };

export default function App() {
  const [page, setPage] = useState('dashboard');
  const Screen = SCREENS[page];

  return (
    <div className="min-h-screen">
      <Sidebar page={page} onChange={setPage} />
      <header className="sticky top-0 z-10 flex items-center border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <Logo height={36} />
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 md:ml-60 md:px-8 md:pb-10 md:pt-8">
        <Screen go={setPage} />
      </main>
      <BottomNav page={page} onChange={setPage} />
    </div>
  );
}
