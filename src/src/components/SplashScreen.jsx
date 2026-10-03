import { useEffect, useState } from 'react';

/** Pantalla de carga inicial con el logo. */
export default function SplashScreen() {
  const [phase, setPhase] = useState('show');
  useEffect(() => {
    const a = setTimeout(() => setPhase('fade'), 900);
    const b = setTimeout(() => setPhase('gone'), 1400);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (phase === 'gone') return null;
  return (
    <div
      role="status"
      aria-label="Cargando NurseArt"
      className={`fixed inset-0 z-50 grid place-items-center bg-[#004aad] transition-opacity duration-500 ${phase === 'fade' ? 'opacity-0' : 'opacity-100'}`}
    >
      <img src="/logo-nurseart.png" alt="NurseArt" className="h-20 w-auto animate-pulse" />
    </div>
  );
}
