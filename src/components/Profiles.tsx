import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { profiles, type Profile } from '../data/profiles';
import Logo from './Logo';
import JourneyBackground from './journey/JourneyBackground';
import JourneyCard from './journey/JourneyCard';
import JourneyDetail from './journey/JourneyDetail';
import MagneticButton from './journey/MagneticButton';

export default function Profiles({ onSelect }: { onSelect: (profile: Profile) => void }) {
  const reduced = !!useReducedMotion();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = profiles.find((p) => p.id === selectedId) ?? null;

  // Esc fecha o painel; trava o scroll de fundo enquanto aberto.
  useEffect(() => {
    if (selectedId === null) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedId(null);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [selectedId]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#050b16]">
      <JourneyBackground />

      {/* Topo */}
      <header className="relative z-10 flex h-[88px] items-center px-6 sm:px-14">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <Logo className="h-9 sm:h-10" />
        </motion.div>
      </header>

      {/* Conteúdo central */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-10 px-4 pb-16 pt-4 sm:gap-12 sm:px-6">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f5c861]/80"
          >
            MeuEcoo · sua jornada
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16, letterSpacing: '0.12em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '-0.01em' }}
            transition={{ delay: 0.15, duration: 0.8, ease }}
            className="max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl"
          >
            Escolha quem você quer se tornar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-4 max-w-md text-base text-white/45"
          >
            Cada perfil é uma versão sua em evolução. Continue de onde parou.
          </motion.p>
        </div>

        {/* Cards */}
        <ul className="flex max-w-3xl list-none flex-wrap items-start justify-center gap-4 sm:gap-6">
          {profiles.map((profile, i) => (
            <li key={profile.id}>
              <JourneyCard
                profile={profile}
                index={i}
                reduced={reduced}
                selected={selectedId === profile.id}
                dimmed={selectedId !== null && selectedId !== profile.id}
                onSelect={() => setSelectedId(profile.id)}
              />
            </li>
          ))}
        </ul>

        {/* CTA Nova Jornada (some quando há painel aberto) */}
        <AnimatePresence>
          {selectedId === null && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: reduced ? 0 : 0.6, duration: 0.6, ease }}
            >
              <MagneticButton
                reduced={reduced}
                ariaLabel="Criar uma nova jornada"
                className="group flex items-center gap-2.5 rounded-2xl border border-white/12 bg-white/[0.05] px-7 py-3 text-sm font-medium text-white/55 backdrop-blur-md transition-colors duration-200 hover:border-[#f5c861]/50 hover:bg-white/[0.08] hover:text-white"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-base leading-none transition-colors group-hover:border-[#f5c861] group-hover:text-[#f5c861]">
                  +
                </span>
                Nova Jornada
              </MagneticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Painel de evolução */}
      <AnimatePresence>
        {selected && (
          <JourneyDetail
            key={selected.id}
            profile={selected}
            reduced={reduced}
            onContinue={() => onSelect(selected)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
