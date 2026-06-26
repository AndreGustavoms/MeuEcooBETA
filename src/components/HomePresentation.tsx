import { useState, useEffect, useRef } from 'react';
import type { Category } from '../data/catalog';
import Logo from './Logo';

const flashImages = [
  '/images/films/thriller/joker/small.jpg',
  '/images/films/drama/fight-club/small.jpg',
  '/images/films/romance/la-la-land/small.jpg',
  '/images/films/drama/the-revenant/small.jpg',
  '/images/films/suspense/prisoners/small.jpg',
  '/images/films/thriller/black-swan/small.jpg',
  '/images/films/drama/the-social-network/small.jpg',
  '/images/films/suspense/seven/small.jpg',
  '/images/films/romance/a-star-is-born/small.jpg',
  '/images/films/thriller/nightcrawler/small.jpg',
  '/images/films/suspense/shutter-island/small.jpg',
  '/images/films/drama/kings-speech/small.jpg',
  '/images/films/romance/titanic/small.jpg',
  '/images/films/suspense/gone-girl/small.jpg',
  '/images/films/thriller/joker/small.jpg',
  '/images/films/drama/fight-club/small.jpg',
];

function FlashbackOverlay({ onDone }: { onDone: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [dissolving, setDissolving] = useState(false);
  const frameRef = useRef(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    function next() {
      const fi = frameRef.current;
      if (fi >= flashImages.length - 1) {
        setDissolving(true);
        t = setTimeout(onDone, 900);
        return;
      }
      frameRef.current = fi + 1;
      setImgIndex(fi + 1);
      t = setTimeout(next, 120);
    }
    t = setTimeout(next, 120);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[40] pointer-events-none"
      style={{
        opacity: dissolving ? 0 : 1,
        transition: dissolving ? 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)' : 'none',
      }}
    >
      {flashImages.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === imgIndex ? 1 : 0,
            filter: 'brightness(0.46) contrast(1.12)',
          }}
        />
      ))}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.58) 100%)',
      }} />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <Logo className="h-[clamp(7rem,18vw,16rem)] max-w-[min(90vw,68rem)]" />
      </div>
    </div>
  );
}

const cols = [
  [
    '/images/films/thriller/joker/small.jpg',
    '/images/films/drama/fight-club/small.jpg',
    '/images/films/suspense/prisoners/small.jpg',
    '/images/films/drama/the-revenant/small.jpg',
    '/images/films/thriller/black-swan/small.jpg',
    '/images/films/suspense/shutter-island/small.jpg',
    '/images/films/romance/la-la-land/small.jpg',
  ],
  [
    '/images/series/crime/making-a-murderer/small.jpg',
    '/images/films/drama/the-prestige/small.jpg',
    '/images/films/suspense/gone-girl/small.jpg',
    '/images/films/thriller/nightcrawler/small.jpg',
    '/images/films/drama/the-social-network/small.jpg',
    '/images/films/suspense/seven/small.jpg',
    '/images/films/romance/a-star-is-born/small.jpg',
  ],
  [
    '/images/films/thriller/a-quiet-place/small.jpg',
    '/images/films/drama/kings-speech/small.jpg',
    '/images/films/suspense/zodiac/small.jpg',
    '/images/series/crime/the-staircase/small.jpg',
    '/images/films/romance/titanic/small.jpg',
    '/images/films/thriller/the-silence-of-the-lambs/small.jpg',
    '/images/films/romance/blue-valentine/small.jpg',
  ],
  [
    '/images/films/drama/fight-club/small.jpg',
    '/images/films/children/spirited-away/small.jpg',
    '/images/series/crime/the-innocent-man/small.jpg',
    '/images/films/children/up/small.jpg',
    '/images/series/documentaries/citizenfour/small.jpg',
    '/images/films/thriller/joker/small.jpg',
    '/images/films/suspense/prisoners/small.jpg',
  ],
  [
    '/images/series/comedies/the-office/small.jpg',
    '/images/films/drama/the-revenant/small.jpg',
    '/images/series/crime/making-a-murderer/small.jpg',
    '/images/films/romance/la-la-land/small.jpg',
    '/images/films/thriller/black-swan/small.jpg',
    '/images/films/drama/the-prestige/small.jpg',
    '/images/films/suspense/shutter-island/small.jpg',
  ],
];

const colConfig = [
  { duration: 110, direction: 'up' },
  { duration: 85,  direction: 'down' },
  { duration: 70,  direction: 'up' },
  { duration: 85,  direction: 'down' },
  { duration: 110, direction: 'up' },
] as const;


export default function HomePresentation({ onNavigate }: { onNavigate: (c: Category) => void }) {
  const [flashDone, setFlashDone] = useState(false);

  // trava scroll enquanto home estiver ativa
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>

      {/* Flash overlay — z-40, abaixo do texto */}
      {!flashDone && <FlashbackOverlay onDone={() => setFlashDone(true)} />}

      {/* ── Hero ── */}
      <div
        className="relative flex items-center justify-center text-center"
        style={{ height: '100%' }}
      >
        {/* Backgrounds */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Fundo base — sem blur, sharp */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/misc/home-bg.jpg)',
              brightness: 1,
              filter: 'brightness(0.28)',
              imageRendering: 'auto',
            } as React.CSSProperties}
          />
          {/* Colunas — opacidade baixa, sem blend que suja */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="flex gap-3 h-full items-start" style={{ marginTop: '-5%' }}>
              {cols.map((col, ci) => {
                const { duration, direction } = colConfig[ci];
                const anim = direction === 'up'
                  ? `home-up ${duration}s linear infinite`
                  : `home-down ${duration}s linear infinite`;
                return (
                  <div
                    key={ci}
                    className="flex flex-col gap-3 shrink-0"
                    style={{ width: '20vw', minWidth: 140, animation: anim, willChange: 'transform' }}
                  >
                    {[...col, ...col].map((src, i) => (
                      <img
                        key={i} src={src} alt="" draggable={false}
                        className="w-full rounded-md object-cover select-none"
                        style={{ aspectRatio: '2/3', opacity: 0.07, imageRendering: 'auto' }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Vinheta — centro escuro e limpo, ruído empurrado pras bordas */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 55% 60% at 50% 50%, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.82) 60%, rgba(8,8,8,0.97) 100%)',
          }} />
          {/* Gradiente top/bottom */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(8,8,8,0.75) 0%, transparent 25%, transparent 75%, rgba(8,8,8,0.9) 100%)',
          }} />
        </div>

        {/* Ghost MEUECOO — watermark */}
        {/* Conteúdo B — centralizado e simétrico */}
        <div style={{
          position: 'relative', zIndex: 50,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          width: '100%', padding: '0 clamp(1.5rem, 6vw, 5rem)',
          transform: flashDone ? 'scale(1) translateY(-8vh)' : 'scale(1.04) translateY(calc(-8vh + 20px))',
          filter: flashDone ? 'blur(0)' : 'blur(0.5px)',
          transition: flashDone ? 'transform 1.4s cubic-bezier(0.16,1,0.3,1), filter 1.2s cubic-bezier(0.16,1,0.3,1)' : 'none',
        }}>

          {/* Descriptor acima */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.2rem',
            opacity: flashDone ? 1 : 0,
            transition: flashDone ? 'opacity 0.9s ease-out' : 'none',
          }}>
            <div style={{ width: 24, height: 1, background: 'rgba(217,185,74,0.45)' }} />
            <span style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(217,185,74,0.6)' }}>
              O ecossistema
            </span>
            <div style={{ width: 24, height: 1, background: 'rgba(217,185,74,0.45)' }} />
          </div>

          {/* Nome em Bebas Neue — nítido, sem PNG */}
          <Logo
            className="h-[clamp(12rem,34vw,32rem)] max-w-[99vw]"
            style={{
              margin: 'clamp(-8rem, -8vw, -3rem) 0',
              opacity: flashDone ? 1 : 0,
              transition: flashDone ? 'opacity 0.9s 0.1s ease-out' : 'none',
            } as React.CSSProperties}
          />

          {/* Linha simétrica */}
          <div style={{
            width: 'clamp(3rem, 6vw, 5rem)', height: 1,
            background: 'linear-gradient(to right, transparent, rgba(217,185,74,0.4), transparent)',
            margin: '0.8rem 0',
            opacity: flashDone ? 1 : 0,
            transition: flashDone ? 'opacity 0.9s 0.2s ease-out' : 'none',
          }} />

          {/* Produtos — separados por ponto */}
          <div style={{ transform: 'translateY(2.8rem)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            opacity: flashDone ? 1 : 0,
            transition: flashDone ? 'opacity 0.8s 0.3s ease-out' : 'none',
          }}>
            {['Cursos', 'Mini Apps', 'FC VIP', 'Descontos VIP'].map((item, i, arr) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)',
                }}>
                  {item}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(217,185,74,0.3)', display: 'block', flexShrink: 0 }} />
                )}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: '0.7rem', marginTop: '1.2rem', justifyContent: 'center',
            opacity: flashDone ? 1 : 0,
            transform: flashDone ? 'translateY(0)' : 'translateY(10px)',
            transition: flashDone ? 'opacity 0.7s 0.45s ease-out, transform 0.7s 0.45s ease-out' : 'none',
          }}>
            <button
              onClick={() => onNavigate('cursos')}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = ''; }}
              style={{
                padding: '0.72rem 1.9rem', borderRadius: 999,
                fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.02em',
                color: '#0a140d', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #c9a93a, #f5c861)',
              }}
            >
              Explorar Cursos
            </button>
            <button
              onClick={() => onNavigate('miniapps')}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.72)'; }}
              style={{
                padding: '0.72rem 1.9rem', borderRadius: 999,
                fontWeight: 600, fontSize: '0.82rem', letterSpacing: '0.02em',
                color: 'rgba(255,255,255,0.72)', background: 'transparent', cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.16)',
              }}
            >
              Ver Mini Apps
            </button>
          </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes home-up   { from { transform: translateY(0); } to { transform: translateY(-50%); } }
          @keyframes home-down { from { transform: translateY(-50%); } to { transform: translateY(0); } }
        }
      `}</style>
    </div>
  );
}
