import { useState, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Profile } from '../../data/profiles';
import JourneyAvatar from './JourneyAvatar';

type Props = {
  profile: Profile;
  index: number;
  selected: boolean;
  dimmed: boolean;
  reduced: boolean;
  onSelect: () => void;
};

export default function JourneyCard({ profile, index, selected, dimmed, reduced, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const accent = profile.accent;

  // Tilt 3D — motion values puros (sem re-render por frame)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 180, damping: 20 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 180, damping: 20 });
  const glareX = useTransform(px, [-0.5, 0.5], ['30%', '70%']);
  const glareY = useTransform(py, [-0.5, 0.5], ['30%', '70%']);
  const glare = useTransform([glareX, glareY], (latest) => {
    const [gx, gy] = latest as [string, string];
    return `radial-gradient(150px 150px at ${gx} ${gy}, rgba(255,255,255,0.12), transparent 62%)`;
  });

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { setHovered(false); px.set(0); py.set(0); };

  const lift = hovered || selected;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onPointerMove={onMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={onLeave}
      aria-pressed={selected}
      aria-label={`${profile.name} — ${profile.tagline}, nível ${profile.stats.level}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.94 }}
      animate={{
        opacity: dimmed ? 0.45 : 1,
        y: 0,
        scale: 1,
        filter: dimmed ? 'saturate(0.6)' : 'saturate(1)',
      }}
      transition={{ delay: reduced ? 0 : 0.15 + index * 0.08, type: 'spring', stiffness: 120, damping: 16 }}
      whileTap={{ scale: 0.97 }}
      style={{ rotateX: reduced ? 0 : rx, rotateY: reduced ? 0 : ry, transformPerspective: 900, zIndex: selected ? 40 : undefined }}
      className="group relative flex w-[150px] flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:w-[168px]"
    >
      {/* Glow contextual atrás do card — sutil */}
      <motion.span
        aria-hidden
        className="absolute -inset-1 rounded-[26px] blur-xl"
        animate={{ opacity: lift ? 0.22 : 0, scale: lift ? 1.02 : 0.94 }}
        transition={{ duration: 0.4 }}
        style={{ background: accent }}
      />

      {/* Borda energética animada (selecionado) */}
      {selected && !reduced && (
        <motion.span
          aria-hidden
          className="absolute -inset-[2px] rounded-[24px]"
          style={{ background: `conic-gradient(from 0deg, transparent, ${accent}, #ffffff, ${accent}, transparent)` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Superfície de vidro */}
      <span
        className="relative flex h-[188px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[22px] border backdrop-blur-xl transition-colors duration-300"
        style={{
          borderColor: lift ? `${accent}88` : 'rgba(255,255,255,0.10)',
          background: `linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015)), radial-gradient(120% 80% at 50% 0%, ${accent}1a, transparent 70%)`,
          boxShadow: lift ? `0 18px 44px -20px ${accent}66, inset 0 1px 0 rgba(255,255,255,0.12)` : '0 8px 28px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >
        {/* Reflexo dinâmico que segue o cursor */}
        {!reduced && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glare }}
          />
        )}

        {/* Selo de selecionado */}
        {selected && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 360, damping: 18 }}
            className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-bold text-black"
            style={{ background: accent, boxShadow: `0 0 14px ${accent}` }}
          >
            ✓
          </motion.span>
        )}

        <JourneyAvatar icon={profile.icon} accent={accent} active={lift} reduced={reduced} size={58} />

        {/* Nível + barra de progresso */}
        <div className="flex w-full flex-col items-center gap-1 px-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accent }}>
            Nível {profile.stats.level}
          </span>
          <span className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.span
              className="block h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${accent}, #ffffff)` }}
              initial={{ width: 0 }}
              animate={{ width: `${profile.stats.progress}%` }}
              transition={{ delay: 0.4 + index * 0.08, duration: 0.9, ease: 'easeOut' }}
            />
          </span>
        </div>
      </span>

      {/* Nome + tagline */}
      <span className="mt-4 flex flex-col items-center gap-0.5">
        <span className="text-base font-medium transition-colors duration-200" style={{ color: lift ? '#fff' : '#9aa39e' }}>
          {profile.name}
        </span>
        <span className="text-xs transition-colors duration-200" style={{ color: lift ? `${accent}` : 'rgba(255,255,255,0.28)' }}>
          {profile.tagline}
        </span>
      </span>
    </motion.button>
  );
}
