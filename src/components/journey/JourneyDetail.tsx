import { motion } from 'framer-motion';
import type { Profile } from '../../data/profiles';
import JourneyAvatar from './JourneyAvatar';
import MagneticButton from './MagneticButton';

type Props = {
  profile: Profile;
  reduced: boolean;
  onContinue: () => void;
  onClose: () => void;
};

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <span className="text-[11px] uppercase tracking-wider text-white/40">{label}</span>
      <span className="text-lg font-semibold text-white" style={{ color: accent }}>{value}</span>
      {sub && <span className="text-xs text-white/45">{sub}</span>}
    </div>
  );
}

/** Painel de evolução exibido ao focar uma jornada. Backdrop + folha inferior. */
export default function JourneyDetail({ profile, reduced, onContinue, onClose }: Props) {
  const accent = profile.accent;
  const s = profile.stats;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-30 bg-black/55 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Jornada ${profile.name}`}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-lg rounded-t-[28px] border border-white/10 bg-[#0b1812]/95 p-6 shadow-2xl backdrop-blur-2xl sm:bottom-6 sm:rounded-[28px]"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 80 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        style={{ boxShadow: `0 -10px 60px -10px ${accent}55, 0 30px 60px -20px rgba(0,0,0,0.7)` }}
      >
        {/* "Pega" da folha (mobile) */}
        <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-white/20 sm:hidden" />

        {/* Cabeçalho */}
        <div className="flex items-center gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border"
            style={{ borderColor: `${accent}66`, background: `radial-gradient(120% 100% at 50% 0%, ${accent}33, transparent 70%)` }}
          >
            <JourneyAvatar icon={profile.icon} accent={accent} active reduced={reduced} size={42} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-semibold text-white">{profile.name}</h2>
            <p className="truncate text-sm" style={{ color: accent }}>{s.levelName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Nível + progresso */}
        <div className="mt-6">
          <div className="mb-2 flex items-end justify-between">
            <span className="text-sm text-white/55">
              Nível <span className="text-3xl font-bold text-white">{s.level}</span>
            </span>
            <span className="text-xs text-white/45">{s.progress}% para o nível {s.level + 1}</span>
          </div>
          <span className="block h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.span
              className="block h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${accent}, #ffffff)`, boxShadow: `0 0 12px ${accent}` }}
              initial={{ width: 0 }}
              animate={{ width: `${s.progress}%` }}
              transition={{ delay: 0.15, duration: 1, ease: 'easeOut' }}
            />
          </span>
        </div>

        {/* Estatísticas */}
        <div className="mt-5 flex gap-3">
          <Stat label="Sequência" value={`${s.streak} dias`} sub="Em chamas 🔥" accent={accent} />
          <Stat label="Última atividade" value={s.lastActivity} accent={accent} />
        </div>
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <span className="text-[11px] uppercase tracking-wider text-white/40">Próximo objetivo</span>
          <p className="mt-1 text-sm font-medium text-white">{s.nextGoal}</p>
        </div>

        {/* CTA */}
        <MagneticButton
          onClick={onContinue}
          reduced={reduced}
          ariaLabel={`Continuar a jornada ${profile.name}`}
          className="relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-4 text-base font-semibold text-black transition-[filter] hover:brightness-110"
        >
          <span
            aria-hidden
            className="absolute inset-0"
            style={{ background: `linear-gradient(120deg, ${accent}, #ffffff 140%)`, boxShadow: `0 12px 40px -8px ${accent}` }}
          />
          <span className="relative z-10">Continuar jornada →</span>
        </MagneticButton>
      </motion.div>
    </>
  );
}
