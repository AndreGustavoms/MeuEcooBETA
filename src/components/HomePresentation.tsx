import { useState, useEffect, useRef } from 'react';
import type { Category } from '../data/catalog';
import Logo from './Logo';
import { publicAsset } from '../lib/publicAsset';

// 24 frames interleaved across both image folders for maximum visual variety
const flashImages = [
  publicAsset('/images/growth/flash-native/discipline.jpg'),
  publicAsset('/images/growth/reading.jpg'),
  publicAsset('/images/growth/flash-native/ambition.jpg'),
  publicAsset('/images/growth/mindset.jpg'),
  publicAsset('/images/growth/flash-native/fitness.jpg'),
  publicAsset('/images/growth/planning.jpg'),
  publicAsset('/images/growth/flash-native/leadership.jpg'),
  publicAsset('/images/growth/consistency.jpg'),
  publicAsset('/images/growth/flash-native/goals.jpg'),
  publicAsset('/images/growth/evolution.jpg'),
  publicAsset('/images/growth/flash-native/learning.jpg'),
  publicAsset('/images/growth/flash-native/purpose.jpg'),
  publicAsset('/images/growth/flash-native/achievement.jpg'),
  publicAsset('/images/growth/online-learning.jpg'),
  publicAsset('/images/growth/flash-native/balance.jpg'),
  publicAsset('/images/growth/gratitude.jpg'),
  publicAsset('/images/growth/flash-native/reading.jpg'),
  publicAsset('/images/growth/discipline.jpg'),
  publicAsset('/images/growth/flash-native/evolution.jpg'),
  publicAsset('/images/growth/fitness.jpg'),
  publicAsset('/images/growth/flash-native/planning.jpg'),
  publicAsset('/images/growth/leadership.jpg'),
  publicAsset('/images/growth/flash-native/online-learning.jpg'),
  publicAsset('/images/growth/achievement.jpg'),
];

// Predetermined zoom origin per frame — each image pushes from a different angle
const zoomOrigins: [number, number][] = [
  [0.50, 0.50], [0.34, 0.42], [0.66, 0.40], [0.50, 0.62],
  [0.38, 0.50], [0.62, 0.46], [0.50, 0.36], [0.44, 0.56],
  [0.56, 0.44], [0.28, 0.50], [0.72, 0.50], [0.50, 0.66],
  [0.46, 0.40], [0.54, 0.60], [0.36, 0.46], [0.64, 0.54],
  [0.50, 0.50], [0.40, 0.38], [0.60, 0.62], [0.50, 0.54],
  [0.44, 0.44], [0.56, 0.56], [0.50, 0.44], [0.50, 0.56],
];
const easeInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/*
 * Animação de abertura da versão anterior da home. O redesign de
 * 505d913 (grid cinematográfico) deixou de montá-la, mas o componente
 * fica aqui porque as imagens de flash-native/ que ele consome
 * continuam versionadas — remover um sem o outro deixaria lixo dos dois
 * lados. Para reativar, monte <FlashbackOverlay onDone={...} /> antes
 * do conteúdo da home.
 */
// @ts-expect-error -- declarado de propósito sem uso; ver comentário acima.
function FlashbackOverlay({ onDone }: { onDone: () => void }) {
  const [dissolving, setDissolving] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [phase, setPhase] = useState<'frames' | 'converging'>('frames');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef(
    Array.from({ length: 22 }, () => ({
      x: Math.round(Math.random() * 100),
      y: Math.round(Math.random() * 100),
      size: +(1.2 + Math.random() * 1.8).toFixed(1),
      delay: +(Math.random() * 5).toFixed(2),
      dur: +(5 + Math.random() * 6).toFixed(1),
    }))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let stopped = false;
    let frameId = 0;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      finishTimer = setTimeout(() => {
        setDissolving(true);
        finishTimer = setTimeout(onDone, 450);
      }, 1600);
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
      uniform vec2 uActiveOrigin;
      uniform vec2 uNextOrigin;

      vec2 coverUv(vec2 uv, vec2 imageSize, vec2 canvasSize) {
        vec2 scale = canvasSize / imageSize;
        float cover = max(scale.x, scale.y);
        vec2 drawSize = imageSize * cover;
        vec2 offset = (canvasSize - drawSize) * 0.5;
        return (uv * canvasSize - offset) / drawSize;
      }

      void main() {
        vec2 uvActive = coverUv(vUv, uActiveSize, uCanvasSize);
        vec2 uvNext   = coverUv(vUv, uNextSize,   uCanvasSize);

        float e = uProgress * uProgress * (3.0 - 2.0 * uProgress);

        vec2 uvA = (uvActive - uActiveOrigin) * (1.0 + (1.0 - e) * 0.07) + uActiveOrigin;
        vec2 uvN = (uvNext   - uNextOrigin)   / (1.0 + e * 0.055)         + uNextOrigin;

        vec4 colA = texture2D(uTextureActive, uvA);
        vec4 colN = texture2D(uTextureNext,   uvN);

        // Snap cut: transition only in middle 22% of frame time
        float blend = clamp((uProgress - 0.39) * 4.5, 0.0, 1.0);
        vec3 color = mix(colA.rgb, colN.rgb, blend);

        // Gamma lift — makes images pop like projected film
        color = pow(max(color, 0.0), vec3(0.88));

        // Quadratic vignette (clean, no edge-case issues)
        vec2 center = vUv - 0.5;
        float vig = 1.0 - dot(center * vec2(1.5, 0.95), center * vec2(1.5, 0.95));
        color *= clamp(vig * 0.35 + 0.65, 0.0, 1.0);

        gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
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
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      return texture;
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 3);
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
          activeOrigin: gl.getUniformLocation(program, 'uActiveOrigin'),
          nextOrigin: gl.getUniformLocation(program, 'uNextOrigin'),
        };

        let currentIndex = 0;
        let nextIndex = 1;
        let start = performance.now();
        const duration = 48;
        const hold = 72;
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
          const ao = zoomOrigins[currentIndex % zoomOrigins.length];
          const no = zoomOrigins[nextIndex % zoomOrigins.length];
          gl.uniform2f(uniforms.activeOrigin, ao[0], ao[1]);
          gl.uniform2f(uniforms.nextOrigin, no[0], no[1]);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        };

        const render = (now: number) => {
          if (stopped) return;

          const rawProgress = Math.min(1, Math.max(0, (now - start) / duration));
          draw(easeInOut(rawProgress));

          if (!readyReported) {
            readyReported = true;
            setCanvasReady(true);
          }

          if (rawProgress >= 1) {
            currentIndex = nextIndex;
            nextIndex += 1;

            if (nextIndex >= textures.length) {
              setPhase('converging');
              finishTimer = setTimeout(() => {
                setDissolving(true);
                finishTimer = setTimeout(onDone, 450);
              }, 1000);
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
          finishTimer = setTimeout(onDone, 450);
        }, 500);
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
      className="fixed inset-0 z-[80] pointer-events-none"
      style={{
        opacity: dissolving ? 0 : 1,
        transition: dissolving ? 'opacity 0.45s cubic-bezier(0.4,0,0.2,1)' : 'none',
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${flashImages[0]})`,
          opacity: canvasReady ? 0 : 1,
          filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
          transform: 'scale(1)',
          transition: 'opacity 0.2s ease-out',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{
          display: 'block',
          filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
          opacity: phase === 'converging' ? 0 : 1,
          transition: phase === 'converging' ? 'opacity 1.3s ease-in-out' : 'none',
        }}
      />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.0) 20%, rgba(0,0,0,0.0) 70%, rgba(0,0,0,0.38) 100%)',
      }} />

      {/* Letterbox — timeline of evolution */}
      <div className="letterbox letterbox-top" aria-hidden="true">
        <div className="lb-ticker">
          <span>
            APRENDER&nbsp;·&nbsp;CRESCER&nbsp;·&nbsp;DISCIPLINA&nbsp;·&nbsp;FOCO&nbsp;·&nbsp;CRIAR&nbsp;·&nbsp;LIDERAR&nbsp;·&nbsp;CONQUISTA&nbsp;·&nbsp;EVOLUIR&nbsp;·&nbsp;
            APRENDER&nbsp;·&nbsp;CRESCER&nbsp;·&nbsp;DISCIPLINA&nbsp;·&nbsp;FOCO&nbsp;·&nbsp;CRIAR&nbsp;·&nbsp;LIDERAR&nbsp;·&nbsp;CONQUISTA&nbsp;·&nbsp;EVOLUIR&nbsp;·&nbsp;
          </span>
        </div>
        <div className="letterbox-rule" />
      </div>
      <div className="letterbox letterbox-bottom" aria-hidden="true">
        <div className="letterbox-rule" />
        <div className="lb-ticker lb-ticker-rev">
          <span>
            PROPÓSITO&nbsp;·&nbsp;CONSISTÊNCIA&nbsp;·&nbsp;AMBIÇÃO&nbsp;·&nbsp;MAESTRIA&nbsp;·&nbsp;VISÃO&nbsp;·&nbsp;IMPACTO&nbsp;·&nbsp;EXCELÊNCIA&nbsp;·&nbsp;LEGADO&nbsp;·&nbsp;
            PROPÓSITO&nbsp;·&nbsp;CONSISTÊNCIA&nbsp;·&nbsp;AMBIÇÃO&nbsp;·&nbsp;MAESTRIA&nbsp;·&nbsp;VISÃO&nbsp;·&nbsp;IMPACTO&nbsp;·&nbsp;EXCELÊNCIA&nbsp;·&nbsp;LEGADO&nbsp;·&nbsp;
          </span>
        </div>
      </div>

      <div className="cinematic-copy cinematic-copy-left" aria-hidden="true">
        <span>MEUECOO</span>
        <strong>EVOLUÇÃO</strong>
      </div>
      <div className="cinematic-copy cinematic-copy-right" aria-hidden="true">
        <span>CURSOS · FERRAMENTAS</span>
        <strong>PROPÓSITO</strong>
      </div>

      <div className="particles-layer" aria-hidden="true">
        {particlesRef.current.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className={`convergence-overlay${phase === 'converging' ? ' is-active' : ''}`} aria-hidden="true">
        <p className="tagline-text">Seu melhor projeto é você.</p>
      </div>

    </div>
  );
}

// 15 panels for the cinematic 5×3 film-grid background
const filmGrid = [
  { src: publicAsset('/images/growth/flash-native/discipline.jpg'),      dur: 12, delay: 0.0 },
  { src: publicAsset('/images/growth/reading.jpg'),                       dur:  9, delay: 1.8 },
  { src: publicAsset('/images/growth/flash-native/mindset.jpg'),          dur: 15, delay: 0.4 },
  { src: publicAsset('/images/growth/planning.jpg'),                      dur: 10, delay: 3.1 },
  { src: publicAsset('/images/growth/flash-native/fitness.jpg'),          dur: 13, delay: 0.9 },
  { src: publicAsset('/images/growth/flash-native/ambition.jpg'),         dur:  8, delay: 2.5 },
  { src: publicAsset('/images/growth/balance.jpg'),                       dur: 16, delay: 1.2 },
  { src: publicAsset('/images/growth/flash-native/consistency.jpg'),      dur: 11, delay: 4.0 },
  { src: publicAsset('/images/growth/flash-native/goals.jpg'),            dur:  9, delay: 0.6 },
  { src: publicAsset('/images/growth/online-learning.jpg'),               dur: 14, delay: 3.5 },
  { src: publicAsset('/images/growth/flash-native/leadership.jpg'),       dur: 10, delay: 1.5 },
  { src: publicAsset('/images/growth/purpose.jpg'),                       dur: 12, delay: 2.2 },
  { src: publicAsset('/images/growth/flash-native/evolution.jpg'),        dur:  8, delay: 0.8 },
  { src: publicAsset('/images/growth/achievement.jpg'),                   dur: 15, delay: 4.8 },
  { src: publicAsset('/images/growth/flash-native/gratitude.jpg'),        dur: 11, delay: 1.0 },
];

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
  const [phase, setPhase] = useState<'intro' | 'main'>('intro');
  const [ctaHover, setCtaHover] = useState<'cursos' | 'apps' | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPhase('main'), 2100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: '#07060c' }}>

      {/* ── Logo flutuante — desliza do centro (intro) para 34% (main) ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          zIndex: 95,
          pointerEvents: 'none',
          left: '50%',
          top: phase === 'main' ? '34%' : '50%',
          transform: 'translate(-50%, -50%)',
          transition: phase === 'main'
            ? 'top 1.2s cubic-bezier(0.16,1,0.3,1)'
            : 'none',
        }}
      >
        <Logo className="h-[clamp(9rem,25vw,22rem)] max-w-[94vw]" />
      </div>

      {/* ── Intro overlay: letterbox + corner texts, fades out after 2s ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 20,
          opacity: phase === 'intro' ? 1 : 0,
          transition: 'opacity 0.65s ease-out',
          pointerEvents: 'none',
        }}
      >
        <div className="letterbox letterbox-top">
          <div className="lb-ticker">
            <span>APRENDER&nbsp;·&nbsp;CRESCER&nbsp;·&nbsp;DISCIPLINA&nbsp;·&nbsp;FOCO&nbsp;·&nbsp;CRIAR&nbsp;·&nbsp;LIDERAR&nbsp;·&nbsp;CONQUISTA&nbsp;·&nbsp;EVOLUIR&nbsp;·&nbsp;APRENDER&nbsp;·&nbsp;CRESCER&nbsp;·&nbsp;DISCIPLINA&nbsp;·&nbsp;FOCO&nbsp;·&nbsp;CRIAR&nbsp;·&nbsp;LIDERAR&nbsp;·&nbsp;CONQUISTA&nbsp;·&nbsp;EVOLUIR&nbsp;·&nbsp;</span>
          </div>
          <div className="letterbox-rule" />
        </div>
        <div className="letterbox letterbox-bottom">
          <div className="letterbox-rule" />
          <div className="lb-ticker lb-ticker-rev">
            <span>PROPÓSITO&nbsp;·&nbsp;CONSISTÊNCIA&nbsp;·&nbsp;AMBIÇÃO&nbsp;·&nbsp;MAESTRIA&nbsp;·&nbsp;VISÃO&nbsp;·&nbsp;IMPACTO&nbsp;·&nbsp;EXCELÊNCIA&nbsp;·&nbsp;LEGADO&nbsp;·&nbsp;PROPÓSITO&nbsp;·&nbsp;CONSISTÊNCIA&nbsp;·&nbsp;AMBIÇÃO&nbsp;·&nbsp;MAESTRIA&nbsp;·&nbsp;VISÃO&nbsp;·&nbsp;IMPACTO&nbsp;·&nbsp;EXCELÊNCIA&nbsp;·&nbsp;LEGADO&nbsp;·&nbsp;</span>
          </div>
        </div>
        <div className="cinematic-copy cinematic-copy-left">
          <span>MEUECOO</span>
          <strong>EVOLUÇÃO</strong>
        </div>
        <div className="cinematic-copy cinematic-copy-right">
          <span>CURSOS&nbsp;·&nbsp;FERRAMENTAS</span>
          <strong>ASCENSÃO</strong>
        </div>
      </div>

      {/* ── Cinematic film-grid background ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '3px',
          width: '100%',
          height: '100%',
        }}>
          {filmGrid.map((p, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <img
                src={p.src} alt="" draggable={false}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  display: 'block',
                  filter: 'brightness(0.55) saturate(0.72) contrast(1.25)',
                  animation: `panel-pulse ${p.dur}s ${p.delay}s ease-in-out infinite`,
                  willChange: 'opacity',
                }}
              />
            </div>
          ))}
        </div>
        {/* Vignette + readability overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 88% 82% at 50% 46%, rgba(7,6,12,0.22) 0%, rgba(7,6,12,0.58) 62%, rgba(7,6,12,0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(7,6,12,0.52) 0%, transparent 18%, transparent 74%, rgba(7,6,12,0.65) 100%)',
        }} />
      </div>

      {/* ── Conteúdo — posicionado abaixo da logo via calc ── */}
      {/* top = logo center (34%) + metade da altura da logo + gap */}
      <div style={{
        position: 'absolute',
        top: 'calc(34% + clamp(4.5rem, 12.5vw, 11rem) + clamp(1.2rem, 3vw, 2rem))',
        left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        padding: '0 clamp(1rem, 5vw, 4rem)',
        zIndex: 90,
        opacity: phase === 'main' ? 1 : 0,
        transform: phase === 'main' ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}>

          {/* Divider */}
          <div style={{
            width: 464, height: 2, borderRadius: 999, transform: 'translateX(10px)',
            background: 'rgba(255,210,0,0.25)',
            marginBottom: 'clamp(0.6rem,1vw,0.9rem)',
          }} />

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.8rem, 1.25vw, 0.96rem)',
            color: '#ffffff',
            lineHeight: 1.65,
            margin: '0 0 clamp(0.7rem,1.2vw,1rem)',
            maxWidth: 450,
            transform: 'translateY(-0.35rem)',
          }}>
            Cursos, mini apps e benefícios exclusivos para<br />
            <strong style={{ color: '#ffd200', fontWeight: 700 }}>organizar, aprender</strong>
            {' '}e{' '}
            <strong style={{ color: '#ffd200', fontWeight: 700 }}>evoluir</strong> todos os dias.
          </p>


          {/* CTA — Twin Gate */}
          <div style={{
            marginTop: 'clamp(4.5rem,8vw,7rem)',
            width: 'min(90vw, 640px)',
            borderRadius: 16,
            overflow: 'hidden',
            display: 'flex',
            animation: phase === 'main' ? 'glow-breathe 3.5s ease-in-out 1s infinite' : 'none',
          }}>

            {/* Explorar Cursos */}
            <button
              onClick={() => onNavigate('cursos')}
              onMouseEnter={() => setCtaHover('cursos')}
              onMouseLeave={() => setCtaHover(null)}
              style={{
                flex: ctaHover === 'apps' ? 0.82 : 1.1,
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, #e8a800 0%, #ffd200 50%, #f5c400 100%)',
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
                animation: 'gold-shimmer 3.2s ease-in-out 2s infinite',
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
              background: 'linear-gradient(to bottom, transparent 0%, rgba(255,210,0,0.7) 40%, rgba(255,210,0,0.9) 60%, transparent 100%)',
              boxShadow: '0 0 8px rgba(255,210,0,0.5)',
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
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={ctaHover === 'apps' ? 'rgba(255,210,0,0.95)' : 'rgba(214,232,242,0.6)'} strokeWidth="1.6" style={{ transition: 'stroke 0.25s' }}/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={ctaHover === 'apps' ? 'rgba(255,210,0,0.95)' : 'rgba(214,232,242,0.6)'} strokeWidth="1.6" style={{ transition: 'stroke 0.25s' }}/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={ctaHover === 'apps' ? 'rgba(255,210,0,0.95)' : 'rgba(214,232,242,0.6)'} strokeWidth="1.6" style={{ transition: 'stroke 0.25s' }}/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={ctaHover === 'apps' ? 'rgba(255,210,0,0.95)' : 'rgba(214,232,242,0.6)'} strokeWidth="1.6" style={{ transition: 'stroke 0.25s' }}/>
                </svg>
              </div>
              <div style={{ textAlign: 'left', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 'clamp(0.82rem,1.25vw,0.96rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, transition: 'color 0.25s' }}>Ver Mini Apps</div>
                <div style={{ fontSize: 'clamp(0.6rem,0.85vw,0.7rem)', color: ctaHover === 'apps' ? 'rgba(255,210,0,0.65)' : 'rgba(255,255,255,0.55)', fontWeight: 500, marginTop: 2, transition: 'color 0.25s' }}>Acessar ferramentas</div>
              </div>
            </button>

          </div>

      </div>{/* end conteúdo */}

      <style>{`
        @keyframes panel-pulse {
          0%   { opacity: 0.04; }
          18%  { opacity: 0.52; }
          44%  { opacity: 0.10; }
          70%  { opacity: 0.48; }
          90%  { opacity: 0.06; }
          100% { opacity: 0.04; }
        }

        @media (prefers-reduced-motion: no-preference) {
          @keyframes gold-shimmer {
            0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
            8%   { opacity: 1; }
            92%  { opacity: 1; }
            100% { transform: translateX(280%) skewX(-18deg); opacity: 0; }
          }

          @keyframes glow-breathe {
            0%, 100% { box-shadow: 0 0 0 1px rgba(255,210,0,0.18), 0 12px 48px rgba(0,0,0,0.55); }
            50%       { box-shadow: 0 0 0 1px rgba(255,210,0,0.42), 0 0 52px rgba(255,210,0,0.14), 0 12px 48px rgba(0,0,0,0.55); }
          }

          @keyframes logo-enter {
            0%   { opacity: 0; transform: scale(0.91) translateY(6px); filter: blur(4px); }
            60%  { opacity: 1; filter: blur(0px); }
            100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
          }

          @keyframes copy-left-cut {
            0%, 10% { clip-path: inset(0 100% 0 0); transform: translateX(-32px); opacity: 0; }
            18%, 44% { clip-path: inset(0 0 0 0); transform: translateX(0); opacity: 1; }
            52%, 100% { clip-path: inset(0 0 0 100%); transform: translateX(28px); opacity: 0; }
          }

          @keyframes copy-right-cut {
            0%, 34% { clip-path: inset(0 0 0 100%); transform: translateX(28px); opacity: 0; }
            41%, 67% { clip-path: inset(0 0 0 0); transform: translateX(0); opacity: 1; }
            74%, 100% { clip-path: inset(0 100% 0 0); transform: translateX(-24px); opacity: 0; }
          }

        }

        /* ── Cinematic letterbox ── */
        .letterbox {
          position: absolute;
          left: 0;
          right: 0;
          height: 9vh;
          background: rgba(0,0,0,0.95);
          z-index: 5;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .letterbox-top {
          top: 0;
          justify-content: flex-end;
          animation: letterbox-drop 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }

        .letterbox-bottom {
          bottom: 0;
          justify-content: flex-start;
          animation: letterbox-rise 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }

        .letterbox-rule {
          width: 100%;
          height: 1px;
          flex-shrink: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(217,185,74,0.45) 18%, rgba(217,185,74,0.85) 50%, rgba(217,185,74,0.45) 82%, transparent 100%);
        }

        .lb-ticker {
          flex: 1;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .lb-ticker span {
          display: block;
          white-space: nowrap;
          font-size: clamp(0.4rem, 0.56vw, 0.52rem);
          letter-spacing: 0.4em;
          color: rgba(217,185,74,0.38);
          font-weight: 700;
          animation: ticker-l 32s linear infinite;
        }

        .lb-ticker-rev span {
          animation: ticker-r 36s linear infinite;
        }

        @media (prefers-reduced-motion: no-preference) {
          @keyframes letterbox-drop {
            from { transform: translateY(-100%); }
            to   { transform: translateY(0); }
          }
          @keyframes letterbox-rise {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
          @keyframes ticker-l {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          @keyframes ticker-r {
            from { transform: translateX(-50%); }
            to   { transform: translateX(0); }
          }
        }

        .home-logo-layer {
          position: fixed;
          left: 50%;
          top: 50%;
          z-index: 90;
          pointer-events: none;
          transform-origin: center;
          transition:
            left 1.25s cubic-bezier(0.16, 1, 0.3, 1),
            top 1.25s cubic-bezier(0.16, 1, 0.3, 1),
            transform 1.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .home-logo-layer.is-intro {
          transform: translate3d(-50%, -50%, 0);
        }

        .home-logo-layer.is-intro img {
          animation: logo-intro-pulse 1.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .home-logo-layer.is-final {
          transform: translate3d(-50%, -50%, 0);
        }

        /* sweep removed — too theatrical */

        .cinematic-copy {
          position: absolute;
          z-index: 8;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          color: white;
          text-shadow: 0 4px 28px #000;
        }

        .cinematic-copy span { color: rgba(217,185,74,0.88); font-size: clamp(0.5rem, 0.68vw, 0.62rem); letter-spacing: 0.42em; font-weight: 800; text-transform: uppercase; }
        .cinematic-copy strong { font-size: clamp(1.2rem, 2.8vw, 2.8rem); letter-spacing: -0.03em; line-height: 0.92; font-weight: 900; }
        .cinematic-copy-left  { left: clamp(2rem, 6vw, 6rem); top: 16vh; animation: copy-left-cut 2s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 0.15s; }
        .cinematic-copy-right { right: clamp(2rem, 6vw, 6rem); bottom: 16vh; text-align: right; animation: copy-right-cut 2s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 0.55s; }

        @media (max-width: 640px) {
          .letterbox { height: 7vh; }
          .cinematic-copy-right { bottom: 11vh; }
          .cinematic-copy-left { top: 11vh; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cinematic-copy, .letterbox, .lb-ticker span { animation-duration: 0.01ms !important; }
        }


        /* ── Gold dust particles ── */
        .particles-layer {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(240, 192, 64, 0.6);
          animation: particle-rise linear infinite;
          opacity: 0;
        }

        @media (prefers-reduced-motion: no-preference) {
          @keyframes particle-rise {
            0%   { opacity: 0; transform: translateY(0) scale(0.5); }
            18%  { opacity: 0.5; }
            55%  { opacity: 0.2; }
            82%  { opacity: 0.38; }
            100% { opacity: 0; transform: translateY(-55px) scale(1.4); }
          }
        }

        /* ── Convergence + tagline reveal ── */
        .convergence-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          background: rgba(0,0,0,0);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.85s ease-in-out, background 1.5s ease-in-out;
        }

        .convergence-overlay.is-active {
          opacity: 1;
          background: rgba(8,6,3,0.88);
        }

        .convergence-overlay::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: clamp(18rem, 48vw, 42rem);
          height: clamp(18rem, 48vw, 42rem);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,215,0,0.11) 0%, transparent 68%);
          opacity: 0;
          transition: opacity 1.3s ease 0.35s;
        }

        .convergence-overlay.is-active::before {
          opacity: 1;
        }

        .tagline-text {
          position: absolute;
          bottom: 26%;
          left: 50%;
          transform: translateX(-50%);
          margin: 0;
          font-size: clamp(0.82rem, 1.8vw, 1.3rem);
          color: rgba(217,185,74,0);
          font-weight: 400;
          letter-spacing: 0.2em;
          text-align: center;
          white-space: nowrap;
          text-shadow: 0 2px 32px rgba(200,160,0,0.4);
          transition: color 1.5s ease 0.5s;
        }

        .convergence-overlay.is-active .tagline-text {
          color: rgba(217,185,74,0.92);
        }

        @media (max-width: 640px) {
          .tagline-text { white-space: normal; width: 80vw; text-align: center; }
        }
      `}</style>
    </div>
  );
}
