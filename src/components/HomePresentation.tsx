import { useState, useEffect, useRef } from 'react';
import type { Category } from '../data/catalog';
import Logo from './Logo';

const flashFrames = [
  { src: '/images/flash/flash-cursos.svg', label: 'Cursos', title: 'Aulas guiadas', detail: 'Foco, rotina, carreira e bem-estar' },
  { src: '/images/flash/flash-miniapps.svg', label: 'Mini Apps', title: 'Ferramentas práticas', detail: 'Timers, hábitos, planejamento e finanças' },
  { src: '/images/flash/flash-rotina.svg', label: 'Rotina', title: 'Progresso visível', detail: 'Check-ins, streaks e metas acionáveis' },
  { src: '/images/flash/flash-foco.svg', label: 'Foco', title: 'Modo execução', detail: 'Ambientes para aprender e aplicar' },
  { src: '/images/flash/flash-comunidade.svg', label: 'Comunidade', title: 'Evolução em grupo', detail: 'Desafios, ranking, mentorias e lives' },
  { src: '/images/flash/flash-beneficios.svg', label: 'VIP', title: 'Benefícios reais', detail: 'Conteúdos, descontos e experiências exclusivas' },
  { src: '/images/flash/flash-catalogo.svg', label: 'Catálogo', title: 'Tudo em um lugar', detail: 'Cursos e ferramentas com cara de streaming' },
  { src: '/images/flash/flash-dashboard.svg', label: 'Painel', title: 'Seu hub pessoal', detail: 'Acompanhe, escolha e continue' },
  { src: '/images/flash/flash-cursos.svg', label: 'Cursos', title: 'Aulas guiadas', detail: 'Foco, rotina, carreira e bem-estar' },
  { src: '/images/flash/flash-miniapps.svg', label: 'Mini Apps', title: 'Ferramentas práticas', detail: 'Timers, hábitos, planejamento e finanças' },
  { src: '/images/flash/flash-rotina.svg', label: 'Rotina', title: 'Progresso visível', detail: 'Check-ins, streaks e metas acionáveis' },
  { src: '/images/flash/flash-foco.svg', label: 'Foco', title: 'Modo execução', detail: 'Ambientes para aprender e aplicar' },
  { src: '/images/flash/flash-comunidade.svg', label: 'Comunidade', title: 'Evolução em grupo', detail: 'Desafios, ranking, mentorias e lives' },
  { src: '/images/flash/flash-beneficios.svg', label: 'VIP', title: 'Benefícios reais', detail: 'Conteúdos, descontos e experiências exclusivas' },
  { src: '/images/flash/flash-catalogo.svg', label: 'Catálogo', title: 'Tudo em um lugar', detail: 'Cursos e ferramentas com cara de streaming' },
  { src: '/images/flash/flash-dashboard.svg', label: 'Painel', title: 'Seu hub pessoal', detail: 'Acompanhe, escolha e continue' },
];

const flashImages = flashFrames.slice(0, 8).map(({ src }) => src);

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function FlashbackOverlay({ onDone }: { onDone: () => void }) {
  const [dissolving, setDissolving] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let stopped = false;
    let frameId = 0;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });

    if (!gl) {
      finishTimer = setTimeout(() => {
        setDissolving(true);
        finishTimer = setTimeout(onDone, 900);
      }, 900);
      return () => {
        if (finishTimer) clearTimeout(finishTimer);
      };
    }

    const vertexShader = `
      attribute vec2 aPosition;
      attribute vec2 aUv;
      varying vec2 vUv;

      void main() {
        vUv = aUv;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;

      varying vec2 vUv;

      uniform sampler2D uTextureActive;
      uniform sampler2D uTextureNext;
      uniform float uProgress;
      uniform vec2 uCanvasSize;
      uniform vec2 uActiveSize;
      uniform vec2 uNextSize;

      vec2 coverUv(vec2 uv, vec2 imageSize, vec2 canvasSize) {
        vec2 scale = canvasSize / imageSize;
        float cover = max(scale.x, scale.y);
        vec2 drawSize = imageSize * cover;
        vec2 offset = (canvasSize - drawSize) * 0.5;
        return (uv * canvasSize - offset) / drawSize;
      }

      void main() {
        vec2 uvActive = coverUv(vUv, uActiveSize, uCanvasSize);
        vec2 uvNext = coverUv(vUv, uNextSize, uCanvasSize);

        float progress0 = uProgress;
        float progress1 = 1.0 - uProgress;

        vec4 dispActive = texture2D(uTextureActive, uvActive);
        vec4 dispNext = texture2D(uTextureNext, uvNext);

        float verticalNoise = sin((vUv.y + uProgress * 0.75) * 34.0 + dispNext.r * 5.0) * 0.018;
        float activeBend = progress1 * ((dispNext.r * 0.32) + verticalNoise) * 2.0;
        float nextBend = progress0 * ((dispActive.r * 0.26) - verticalNoise) * 2.0;

        vec4 colorActive = texture2D(uTextureActive, vec2(uvActive.x, uvActive.y + activeBend)) * progress1;
        vec4 colorNext = texture2D(uTextureNext, vec2(uvNext.x, uvNext.y - nextBend)) * progress0;

        gl_FragColor = vec4((colorActive + colorNext).rgb, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Unable to create shader');
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) || 'Shader compile failed';
        gl.deleteShader(shader);
        throw new Error(message);
      }
      return shader;
    };

    const createProgram = () => {
      const program = gl.createProgram();
      if (!program) throw new Error('Unable to create WebGL program');
      const vert = createShader(gl.VERTEX_SHADER, vertexShader);
      const frag = createShader(gl.FRAGMENT_SHADER, fragmentShader);
      gl.attachShader(program, vert);
      gl.attachShader(program, frag);
      gl.linkProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const message = gl.getProgramInfoLog(program) || 'Program link failed';
        gl.deleteProgram(program);
        throw new Error(message);
      }
      return program;
    };

    const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.decoding = 'async';
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });

    const createTexture = (image: HTMLImageElement) => {
      const texture = gl.createTexture();
      if (!texture) throw new Error('Unable to create WebGL texture');
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      return texture;
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const run = async () => {
      try {
        const images = await Promise.all(flashImages.map(loadImage));
        if (stopped) return;

        const program = createProgram();
        gl.useProgram(program);

        const geometry = new Float32Array([
          -1, -1, 0, 0,
           1, -1, 1, 0,
          -1,  1, 0, 1,
          -1,  1, 0, 1,
           1, -1, 1, 0,
           1,  1, 1, 1,
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);

        const stride = 4 * Float32Array.BYTES_PER_ELEMENT;
        const positionLocation = gl.getAttribLocation(program, 'aPosition');
        const uvLocation = gl.getAttribLocation(program, 'aUv');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(uvLocation);
        gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

        const textures = images.map(createTexture);
        const sizes = images.map((image) => ({
          width: image.naturalWidth || image.width || 1920,
          height: image.naturalHeight || image.height || 1080,
        }));

        const uniforms = {
          textureActive: gl.getUniformLocation(program, 'uTextureActive'),
          textureNext: gl.getUniformLocation(program, 'uTextureNext'),
          progress: gl.getUniformLocation(program, 'uProgress'),
          canvasSize: gl.getUniformLocation(program, 'uCanvasSize'),
          activeSize: gl.getUniformLocation(program, 'uActiveSize'),
          nextSize: gl.getUniformLocation(program, 'uNextSize'),
        };

        let currentIndex = 0;
        let nextIndex = 1;
        let start = performance.now();
        const duration = 720;
        const hold = 80;
        let readyReported = false;

        const draw = (progress: number) => {
          resize();
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, textures[currentIndex]);
          gl.uniform1i(uniforms.textureActive, 0);

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, textures[nextIndex]);
          gl.uniform1i(uniforms.textureNext, 1);

          gl.uniform1f(uniforms.progress, progress);
          gl.uniform2f(uniforms.canvasSize, canvas.width, canvas.height);
          gl.uniform2f(uniforms.activeSize, sizes[currentIndex].width, sizes[currentIndex].height);
          gl.uniform2f(uniforms.nextSize, sizes[nextIndex].width, sizes[nextIndex].height);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        };

        const render = (now: number) => {
          if (stopped) return;

          const rawProgress = Math.min(1, Math.max(0, (now - start) / duration));
          draw(easeOutCubic(rawProgress));

          if (!readyReported) {
            readyReported = true;
            setCanvasReady(true);
          }

          if (rawProgress >= 1) {
            currentIndex = nextIndex;
            nextIndex += 1;

            if (nextIndex >= textures.length) {
              setDissolving(true);
              finishTimer = setTimeout(onDone, 900);
              return;
            }

            start = now + hold;
          }

          frameId = requestAnimationFrame(render);
        };

        frameId = requestAnimationFrame(render);
      } catch {
        if (stopped) return;
        finishTimer = setTimeout(() => {
          setDissolving(true);
          finishTimer = setTimeout(onDone, 900);
        }, 900);
      }
    };

    run();

    return () => {
      stopped = true;
      cancelAnimationFrame(frameId);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [onDone]);

  useEffect(() => {
    flashImages.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  return (
    <div
      className="fixed inset-0 z-[40] pointer-events-none"
      style={{
        opacity: dissolving ? 0 : 1,
        transition: dissolving ? 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)' : 'none',
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${flashImages[0]})`,
          opacity: canvasReady ? 0 : 1,
          filter: 'brightness(0.82) contrast(1.08) saturate(1.05)',
          transform: 'scale(1.08)',
          transition: 'opacity 0.2s ease-out',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{
          display: 'block',
          filter: 'brightness(0.86) contrast(1.08) saturate(1.05)',
        }}
      />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.58) 100%)',
      }} />
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

const features = [
  {
    label: 'Cursos',
    sub: 'Aprenda no seu ritmo',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L2 8l10 5 10-5-10-5z" stroke="#d9b94a" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M2 8v7" stroke="#d9b94a" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M6 10.5v5.5a6 6 0 0012 0v-5.5" stroke="#d9b94a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Mini Apps',
    sub: 'Ferramentas práticas',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="7" y="2" width="10" height="20" rx="2" stroke="#d9b94a" strokeWidth="1.6"/>
        <circle cx="12" cy="18.5" r="1" fill="#d9b94a"/>
      </svg>
    ),
  },
  {
    label: 'FC VIP',
    sub: 'Conteúdo exclusivo',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l3 3-1.5 6L12 15l7.5 3L18 12l3-3-6-.5L12 3l-3 5.5L3 9z" stroke="#d9b94a" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Descontos VIP',
    sub: 'Ofertas imperdíveis',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.6 4.4 5 .8-3.6 3.5.85 5-4.85-2.55L7.1 15.7l.85-5L4.4 7.2l5-.8L12 2z" stroke="#d9b94a" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

void features;

export default function HomePresentation({ onNavigate }: { onNavigate: (c: Category) => void }) {
  const [flashDone, setFlashDone] = useState(false);
  const [ctaHover, setCtaHover] = useState<'cursos' | 'apps' | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const fade = (delay = 0) => ({
    opacity: flashDone ? 1 : 0,
    transform: flashDone ? 'translateY(0)' : 'translateY(12px)',
    transition: flashDone ? `opacity 0.7s ${delay}s ease-out, transform 0.7s ${delay}s ease-out` : 'none',
  });

  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>

      {!flashDone && <FlashbackOverlay onDone={() => setFlashDone(true)} />}

      <div className="relative flex items-center justify-center text-center" style={{ height: '100%' }}>

        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute bg-cover bg-center bg-no-repeat"
            style={{
              inset: -18,
              backgroundImage: 'url(/images/misc/home-bg.jpg)',
              brightness: 1,
              filter: 'brightness(0.64) saturate(1.05) blur(3px)',
              imageRendering: 'auto',
              transform: 'scale(1.02)',
            } as React.CSSProperties}
          />
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
                        style={{
                          aspectRatio: '2/3',
                          opacity: 0.12,
                          imageRendering: 'auto',
                          filter: 'blur(2.6px) brightness(1.05) saturate(1)',
                          transform: 'scale(1.025)',
                        }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 55% 60% at 50% 50%, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.6) 60%, rgba(8,8,8,0.86) 100%)',
          }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, transparent 25%, transparent 75%, rgba(8,8,8,0.72) 100%)',
          }} />
        </div>

        {/* Corner watermarks */}
        {/* Main content */}
        <div style={{
          position: 'relative', zIndex: 50,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          width: '100%', padding: '0 clamp(1rem, 5vw, 4rem)',
          transform: flashDone ? 'scale(1)' : 'scale(1.03)',
          filter: flashDone ? 'blur(0)' : 'blur(0.5px)',
          transition: flashDone ? 'transform 1.4s cubic-bezier(0.16,1,0.3,1), filter 1.2s cubic-bezier(0.16,1,0.3,1)' : 'none',
        }}>

          {/* Logo */}
          <Logo
            className="h-[clamp(9rem,25vw,22rem)] max-w-[94vw]"
            style={{
              margin: 'clamp(-6rem,-6vw,-2.2rem) 0 clamp(-8.5rem,-8.5vw,-3.8rem)',
              opacity: 1,
              transform: flashDone ? 'translateY(0) scale(1)' : 'translateY(0.4rem) scale(0.72)',
              transition: 'transform 1.15s cubic-bezier(0.16, 1, 0.3, 1)',
            } as React.CSSProperties}
          />


          {/* Divider */}
          <div style={{
            width: 464, height: 2, borderRadius: 999, transform: 'translateX(10px)',
            background: 'rgba(255,255,255,0.22)',
            marginBottom: 'clamp(0.6rem,1vw,0.9rem)',
            opacity: flashDone ? 1 : 0,
            transition: flashDone ? 'opacity 0.7s 0.18s ease-out' : 'none',
          }} />

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.8rem, 1.25vw, 0.96rem)',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.65,
            margin: '0 0 clamp(0.7rem,1.2vw,1rem)',
            maxWidth: 450,
            ...fade(0.2),
            transform: flashDone ? 'translateY(-0.35rem)' : 'translateY(calc(12px - 0.35rem))',
          }}>
            Cursos, mini apps e benefícios exclusivos para<br />
            <strong style={{ color: '#f0c040', fontWeight: 700 }}>organizar, aprender</strong>
            {' '}e{' '}
            <strong style={{ color: '#f0c040', fontWeight: 700 }}>evoluir</strong> todos os dias.
          </p>


          {/* CTA — Twin Gate */}
          <div style={{
            marginTop: 'clamp(4.5rem,8vw,7rem)',
            width: 'min(90vw, 640px)',
            borderRadius: 16,
            overflow: 'hidden',
            display: 'flex',
            animation: flashDone ? 'glow-breathe 3.5s ease-in-out 1s infinite' : 'none',
            ...fade(0.42),
          }}>

            {/* Explorar Cursos */}
            <button
              onClick={() => onNavigate('cursos')}
              onMouseEnter={() => setCtaHover('cursos')}
              onMouseLeave={() => setCtaHover(null)}
              style={{
                flex: ctaHover === 'apps' ? 0.82 : 1.1,
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, #b8860b 0%, #f0c040 45%, #e8b830 100%)',
                border: 'none', cursor: 'pointer',
                padding: 'clamp(0.85rem,1.5vw,1.05rem) clamp(1rem,2vw,1.4rem)',
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                transition: 'flex 0.45s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {/* Shimmer sweep */}
              <div className="cta-shimmer" style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.45) 50%, transparent 65%)',
                animation: flashDone ? 'gold-shimmer 3.2s ease-in-out 2s infinite' : 'none',
                pointerEvents: 'none',
              }} />
              {/* Icon */}
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'transform 0.3s ease',
                transform: ctaHover === 'cursos' ? 'rotate(35deg) scale(1.1)' : 'rotate(0deg) scale(1)',
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#1a0e00" strokeWidth="1.7"/>
                  <path d="M15 9l-6 3 3 3 3-6z" fill="#1a0e00"/>
                </svg>
              </div>
              <div style={{ textAlign: 'left', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 'clamp(0.82rem,1.25vw,0.96rem)', fontWeight: 900, color: '#0d1200', lineHeight: 1.2, letterSpacing: '-0.01em' }}>Explorar Cursos</div>
                <div style={{ fontSize: 'clamp(0.6rem,0.85vw,0.7rem)', color: 'rgba(0,0,0,0.45)', fontWeight: 500, marginTop: 2 }}>Comece agora</div>
              </div>
            </button>

            {/* Seam — vertical divider com glow dourado */}
            <div style={{
              width: 1, flexShrink: 0,
              background: 'linear-gradient(to bottom, transparent 0%, rgba(217,185,74,0.7) 40%, rgba(217,185,74,0.9) 60%, transparent 100%)',
              boxShadow: '0 0 8px rgba(217,185,74,0.5)',
              zIndex: 2,
            }} />

            {/* Ver Mini Apps */}
            <button
              onClick={() => onNavigate('miniapps')}
              onMouseEnter={() => setCtaHover('apps')}
              onMouseLeave={() => setCtaHover(null)}
              style={{
                flex: ctaHover === 'cursos' ? 0.82 : 1,
                position: 'relative', overflow: 'hidden',
                background: ctaHover === 'apps'
                  ? 'rgba(28,22,10,0.98)'
                  : 'rgba(14,10,4,0.97)',
                border: 'none', cursor: 'pointer',
                padding: 'clamp(0.85rem,1.5vw,1.05rem) clamp(1rem,2vw,1.4rem)',
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                transition: 'flex 0.45s cubic-bezier(0.34,1.56,0.64,1), background 0.25s ease',
              }}
            >
              {/* Hover glow from seam */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%',
                background: 'linear-gradient(to right, rgba(217,185,74,0.06), transparent)',
                opacity: ctaHover === 'apps' ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              }} />
              {/* Icon */}
              <div style={{
                flexShrink: 0,
                transition: 'transform 0.3s ease',
                transform: ctaHover === 'apps' ? 'scale(1.15)' : 'scale(1)',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={ctaHover === 'apps' ? 'rgba(245,200,97,0.9)' : 'rgba(255,255,255,0.55)'} strokeWidth="1.6" style={{ transition: 'stroke 0.25s' }}/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={ctaHover === 'apps' ? 'rgba(245,200,97,0.9)' : 'rgba(255,255,255,0.55)'} strokeWidth="1.6" style={{ transition: 'stroke 0.25s' }}/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={ctaHover === 'apps' ? 'rgba(245,200,97,0.9)' : 'rgba(255,255,255,0.55)'} strokeWidth="1.6" style={{ transition: 'stroke 0.25s' }}/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={ctaHover === 'apps' ? 'rgba(245,200,97,0.9)' : 'rgba(255,255,255,0.55)'} strokeWidth="1.6" style={{ transition: 'stroke 0.25s' }}/>
                </svg>
              </div>
              <div style={{ textAlign: 'left', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 'clamp(0.82rem,1.25vw,0.96rem)', fontWeight: 800, color: ctaHover === 'apps' ? '#fff' : 'rgba(255,255,255,0.82)', lineHeight: 1.2, transition: 'color 0.25s' }}>Ver Mini Apps</div>
                <div style={{ fontSize: 'clamp(0.6rem,0.85vw,0.7rem)', color: ctaHover === 'apps' ? 'rgba(217,185,74,0.6)' : 'rgba(255,255,255,0.3)', fontWeight: 500, marginTop: 2, transition: 'color 0.25s' }}>Acessar ferramentas</div>
              </div>
            </button>

          </div>

        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes home-up   { from { transform: translateY(0); } to { transform: translateY(-50%); } }
          @keyframes home-down { from { transform: translateY(-50%); } to { transform: translateY(0); } }

          @keyframes gold-shimmer {
            0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
            8%   { opacity: 1; }
            92%  { opacity: 1; }
            100% { transform: translateX(280%) skewX(-18deg); opacity: 0; }
          }

          @keyframes glow-breathe {
            0%, 100% { box-shadow: 0 0 0 1px rgba(217,185,74,0.18), 0 12px 48px rgba(0,0,0,0.55); }
            50%       { box-shadow: 0 0 0 1px rgba(217,185,74,0.42), 0 0 52px rgba(217,185,74,0.14), 0 12px 48px rgba(0,0,0,0.55); }
          }
        }
      `}</style>
    </div>
  );
}
