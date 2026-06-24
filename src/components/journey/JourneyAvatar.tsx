import { useId } from 'react';
import { motion } from 'framer-motion';
import type { IconKey } from '../../data/profiles';

type Props = {
  icon: IconKey;
  accent: string;
  active?: boolean;
  reduced?: boolean;
  size?: number;
};

/**
 * Ilustrações SVG animadas que representam cada jornada.
 * Traço com gradiente do acento + microanimações quando `active`.
 */
export default function JourneyAvatar({ icon, accent, active = false, reduced = false, size = 56 }: Props) {
  const gid = useId().replace(/:/g, '');
  const on = active && !reduced;

  const common = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    fill: 'none',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const stroke = `url(#stroke-${gid})`;

  return (
    <svg {...common} aria-hidden="true">
      <defs>
        <linearGradient id={`stroke-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor={accent} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <radialGradient id={`fill-${gid}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.2" />
        </radialGradient>
      </defs>

      {/* ── ALVO / Propósito ── */}
      {icon === 'target' && (
        <motion.g stroke={stroke} animate={on ? { scale: [1, 1.04, 1] } : { scale: 1 }} transition={{ duration: 2.2, repeat: on ? Infinity : 0, ease: 'easeInOut' }} style={{ transformOrigin: '32px 32px' }}>
          <circle cx="32" cy="32" r="24" />
          <circle cx="32" cy="32" r="15" />
          <motion.circle cx="32" cy="32" r="7" animate={on ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }} transition={{ duration: 1.6, repeat: on ? Infinity : 0 }} />
          <circle cx="32" cy="32" r="2.4" fill={`url(#fill-${gid})`} stroke="none" />
          <path d="M32 4v6M32 54v6M4 32h6M54 32h6" />
        </motion.g>
      )}

      {/* ── BROTO / Iniciante ── */}
      {icon === 'sprout' && (
        <g stroke={stroke}>
          <path d="M16 52h32" opacity="0.6" />
          <motion.path d="M32 52c0-7 0-12 0-18" initial={false} animate={on ? { pathLength: [0.7, 1] } : {}} transition={{ duration: 1, ease: 'easeOut' }} />
          <motion.path d="M32 38c-6 0-11-4-12-11 7 0 12 4 12 11Z" fill={`url(#fill-${gid})`} fillOpacity="0.25" animate={on ? { rotate: [0, -6, 0] } : { rotate: 0 }} transition={{ duration: 2.4, repeat: on ? Infinity : 0, ease: 'easeInOut' }} style={{ transformOrigin: '32px 36px' }} />
          <motion.path d="M32 34c6 0 11-4 12-11-7 0-12 4-12 11Z" fill={`url(#fill-${gid})`} fillOpacity="0.25" animate={on ? { rotate: [0, 6, 0] } : { rotate: 0 }} transition={{ duration: 2.4, repeat: on ? Infinity : 0, ease: 'easeInOut', delay: 0.2 }} style={{ transformOrigin: '32px 32px' }} />
        </g>
      )}

      {/* ── FOGUETE / Evolução ── */}
      {icon === 'rocket' && (
        <motion.g stroke={stroke} animate={on ? { y: [0, -3, 0] } : { y: 0 }} transition={{ duration: 1.8, repeat: on ? Infinity : 0, ease: 'easeInOut' }}>
          <path d="M32 8c7 7 8 19 5 31H27c-3-12-2-24 5-31Z" fill={`url(#fill-${gid})`} fillOpacity="0.18" />
          <circle cx="32" cy="24" r="4" />
          <path d="M27 36l-7 9 7-4M37 36l7 9-7-4" />
          <motion.path d="M29 39l3 11 3-11" stroke={accent} animate={on ? { scaleY: [1, 0.6, 1.1, 1], opacity: [0.9, 0.5, 0.9] } : { scaleY: 1 }} transition={{ duration: 0.5, repeat: on ? Infinity : 0 }} style={{ transformOrigin: '32px 39px' }} />
        </motion.g>
      )}

      {/* ── BÚSSOLA / Explorador ── */}
      {icon === 'compass' && (
        <g stroke={stroke}>
          <circle cx="32" cy="32" r="24" />
          <path d="M32 8v4M32 52v4M8 32h4M52 32h4" opacity="0.7" />
          <motion.g animate={on ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 9, repeat: on ? Infinity : 0, ease: 'linear' }} style={{ transformOrigin: '32px 32px' }}>
            <path d="M32 17l5 15-5 15-5-15Z" fill={`url(#fill-${gid})`} fillOpacity="0.3" />
            <circle cx="32" cy="32" r="2.4" fill={accent} stroke="none" />
          </motion.g>
        </g>
      )}
    </svg>
  );
}
