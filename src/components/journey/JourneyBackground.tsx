import { useEffect, useMemo, type CSSProperties } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

/* ── Geração das curvas de nível (topográficas) ─────────────────── */

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Catmull-Rom fechado → curva suave. */
function smoothClosed(pts: [number, number][]): string {
  const n = pts.length;
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} `;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} `;
  }
  return d + 'Z';
}

type Peak = { cx: number; cy: number; color: string; rings: number[]; noise: number[] };

function buildContours(): Peak[] {
  const rng = mulberry32(20260624);
  const K = 22;
  const defs = [
    { cx: 30, cy: 32, color: '#f5c861', from: 5, to: 44 },   // pico dourado (maestria)
    { cx: 73, cy: 54, color: '#4f9dff', from: 5, to: 38 },   // pico azul (início)
  ];
  return defs.map((p) => {
    const noise = Array.from({ length: K }, () => rng() * 2 - 1);
    const rings: number[] = [];
    for (let r = p.from; r <= p.to; r += 4.4) rings.push(r);
    return { cx: p.cx, cy: p.cy, color: p.color, rings, noise };
  });
}

function ringPoints(cx: number, cy: number, r: number, noise: number[]): [number, number][] {
  const K = noise.length;
  return noise.map((nz, i) => {
    const a = (i / K) * Math.PI * 2;
    const rr = r * (1 + 0.15 * nz);
    return [cx + Math.cos(a) * rr * 1.05, cy + Math.sin(a) * rr] as [number, number];
  });
}

function ContourPaths({ peaks, opacity, width }: { peaks: Peak[]; opacity: number; width: number }) {
  return (
    <>
      {peaks.map((pk, pi) =>
        pk.rings.map((r, ri) => (
          <path
            key={`${pi}-${ri}`}
            d={smoothClosed(ringPoints(pk.cx, pk.cy, r, pk.noise))}
            fill="none"
            stroke={pk.color}
            strokeOpacity={opacity}
            strokeWidth={width}
            vectorEffect="non-scaling-stroke"
          />
        ))
      )}
    </>
  );
}

/* ── Partículas (esparsas, elegantes) ──────────────────────────── */

type Particle = { left: number; top: number; size: number; dur: number; delay: number; drift: number; opacity: number; color: string };

function makeParticles(n: number): Particle[] {
  const colors = ['#f5c861', '#4f9dff'];
  return Array.from({ length: n }, (_, i) => ({
    left: Math.random() * 100,
    top: 45 + Math.random() * 55,
    size: 2 + Math.random() * 3,
    dur: 16 + Math.random() * 12,
    delay: -Math.random() * 20,
    drift: (Math.random() - 0.5) * 60,
    opacity: 0.2 + Math.random() * 0.3,
    color: colors[i % 2],
  }));
}

/**
 * Fundo temático de "evolução": curvas topográficas (ascensão) com dois picos
 * — dourado (maestria) e azul (início) — sobre aurora profunda. As curvas
 * acendem ao redor do cursor, como revelar o caminho ao explorar.
 */
export default function JourneyBackground() {
  const peaks = useMemo(buildContours, []);
  const particles = useMemo(() => makeParticles(12), []);

  // Cursor → revelação das curvas (rápida) + glow (suave)
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const gx = useSpring(mx, { stiffness: 110, damping: 24, mass: 0.6 });
  const gy = useSpring(my, { stiffness: 110, damping: 24, mass: 0.6 });
  const glowLeft = useTransform(gx, (v) => v - 230);
  const glowTop = useTransform(gy, (v) => v - 230);
  const reveal = useMotionTemplate`radial-gradient(260px 260px at ${mx}px ${my}px, #000 0%, #000 28%, transparent 72%)`;

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return;
    const move = (e: PointerEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [mx, my]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base azul profunda */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(130% 100% at 50% -10%, #0c1a30 0%, #081222 45%, #050b16 100%)' }} />

      {/* Aurora — dourado + azul, deriva lenta */}
      <div className="j-drift absolute -left-[12%] -top-[14%] h-[52vw] w-[52vw] rounded-full opacity-[0.28] blur-[130px]" style={{ background: 'radial-gradient(circle, #f5c861 0%, transparent 65%)', animationDelay: '0s' } as CSSVars} />
      <div className="j-drift absolute -right-[10%] bottom-[-10%] h-[50vw] w-[50vw] rounded-full opacity-30 blur-[140px]" style={{ background: 'radial-gradient(circle, #2f6dd0 0%, transparent 65%)', animationDelay: '-12s' } as CSSVars} />

      {/* Curvas topográficas — camada base (discreta) */}
      <svg className="j-breathe absolute inset-0 h-full w-full" viewBox="0 0 100 72" preserveAspectRatio="xMidYMid slice">
        <ContourPaths peaks={peaks} opacity={0.1} width={0.18} />
      </svg>

      {/* Curvas acesas ao redor do cursor (interativo) */}
      <motion.div className="absolute inset-0 hidden md:block" style={{ WebkitMaskImage: reveal, maskImage: reveal }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 72" preserveAspectRatio="xMidYMid slice">
          <ContourPaths peaks={peaks} opacity={0.55} width={0.32} />
        </svg>
      </motion.div>

      {/* Partículas */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="j-particle absolute rounded-full"
          style={{
            left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size,
            background: p.color, mixBlendMode: 'screen', boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            '--p-dur': `${p.dur}s`, '--p-delay': `${p.delay}s`, '--p-x': `${p.drift}px`, '--p-o': p.opacity,
          } as CSSVars}
        />
      ))}

      {/* Glow do cursor — sutil */}
      <motion.div
        className="absolute hidden h-[460px] w-[460px] rounded-full md:block"
        style={{
          left: glowLeft, top: glowTop,
          background: 'radial-gradient(circle, rgba(245,200,97,0.10) 0%, rgba(79,157,255,0.06) 45%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Vinheta de leitura */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 100% at 50% 38%, transparent 52%, rgba(3,7,14,0.7) 100%)' }} />
    </div>
  );
}
