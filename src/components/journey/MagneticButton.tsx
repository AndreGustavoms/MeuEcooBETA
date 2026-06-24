import { useRef, type ReactNode, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
  reduced?: boolean;
  ariaLabel?: string;
};

/** Botão "magnético" — o conteúdo é atraído suavemente em direção ao cursor. */
export default function MagneticButton({
  children, onClick, className = '', strength = 0.35, reduced = false, ariaLabel,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const move = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onPointerMove={move}
      onPointerLeave={reset}
      whileTap={{ scale: 0.96 }}
      style={{ x: sx, y: sy }}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </motion.button>
  );
}
