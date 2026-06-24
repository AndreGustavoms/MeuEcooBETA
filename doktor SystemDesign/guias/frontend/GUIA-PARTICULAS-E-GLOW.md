# Guia Particulas e Glow

## Quando usar

Use este guia quando uma interface precisar de profundidade visual, movimento sutil ou realce luminoso sem comprometer a tarefa principal.

Casos comuns:

- tela de login;
- landing page tecnica;
- portfolio;
- dashboard com identidade visual forte;
- estado vazio com reforco visual;
- experiencia dark theme.

## Quando nao usar

Nao use este padrao quando:

- a interface for operacional e densa;
- a animacao competir com dados;
- houver restricao de performance;
- a marca pedir visual mais sobrio;
- o usuario precisar de leitura prolongada;
- `prefers-reduced-motion` nao for respeitado.

## Resultado esperado

Ao aplicar este guia, o projeto deve ter:

- camada de particulas sem interacao;
- limite claro de quantidade;
- animacao desativavel;
- glow baseado em tokens;
- foco acessivel;
- contraste preservado;
- fallback sem animacao.

## Visao geral

Particulas e glow sao efeitos de apoio. Eles devem realcar hierarquia, foco e identidade, nao substituir layout, copy ou componentes bem desenhados.

## 1. Background de particulas

Exemplo com React e Framer Motion:

```tsx
import { useMemo } from "react";
import { motion } from "framer-motion";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

const PARTICLE_COUNT = 28;

export function BackgroundParticles() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 8 + 5,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.35 + 0.25,
      })),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-emerald-200 shadow-[0_0_18px_rgba(74,222,128,0.55)]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{ y: [0, -120], opacity: [0, particle.opacity, 0] }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
```

Regras:

- use `useMemo` para gerar particulas uma vez;
- mantenha `pointer-events-none`;
- use `aria-hidden`;
- deixe o conteudo principal com `relative z-10`;
- comece com 20 a 30 particulas, nao 100;
- reduza em mobile se necessario.

## 2. Variante sem Framer Motion

```css
.particle-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: rgba(74, 222, 128, 0.72);
  box-shadow: 0 0 18px rgba(74, 222, 128, 0.45);
  animation: particle-rise 8s linear infinite;
}

@keyframes particle-rise {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  20% {
    opacity: 0.7;
  }
  100% {
    opacity: 0;
    transform: translateY(-140px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .particle {
    animation: none;
    opacity: 0.18;
  }
}
```

## 3. Sistema de glow por tokens

Defina tokens globais:

```css
:root {
  --accent: #047857;
  --accent-soft: #dcfce7;
  --accent-surface: rgba(4, 120, 87, 0.12);
  --accent-glow: rgba(34, 197, 94, 0.22);
  --glow-intensity: 1;
}

.glow-soft {
  box-shadow: 0 0 calc(18px * var(--glow-intensity)) -8px var(--accent-glow);
}

.glow-card {
  border: 1px solid color-mix(in srgb, var(--accent) 34%, transparent);
  box-shadow:
    0 0 calc(24px * var(--glow-intensity)) -12px var(--accent-glow),
    inset 0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent);
}

.glow-focus:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--accent) 55%, transparent),
    0 0 0 5px color-mix(in srgb, var(--accent) 18%, transparent);
}
```

Controle de intensidade:

```css
.glow-25 { --glow-intensity: 0.25; }
.glow-50 { --glow-intensity: 0.5; }
.glow-100 { --glow-intensity: 1; }
.glow-150 { --glow-intensity: 1.5; }
```

## 4. Glow animado

Use com parcimonia.

```css
.glow-breathe {
  animation: glow-breathe 3.4s ease-in-out infinite;
}

@keyframes glow-breathe {
  0%, 100% {
    box-shadow: 0 0 calc(12px * var(--glow-intensity)) -8px var(--accent-glow);
  }
  50% {
    box-shadow: 0 0 calc(34px * var(--glow-intensity)) -14px var(--accent-glow);
  }
}

@media (prefers-reduced-motion: reduce) {
  .glow-breathe {
    animation: none;
  }
}
```

## 5. Uso recomendado

```tsx
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <BackgroundParticles />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
```

Em cards:

```html
<section class="glow-card rounded-md bg-slate-900/80 p-4">
  <h2>Resumo</h2>
</section>
```

Em input:

```html
<input class="glow-focus rounded-md border px-3 py-2" />
```

## 6. Guardrails

- Particulas devem ficar atras do conteudo.
- Nao use glow em todos os cards.
- Glow animado deve aparecer em no maximo um ponto focal por tela.
- Inputs precisam manter contraste em foco.
- Estados de erro nao podem depender de glow.
- Em app operacional, prefira glow sutil ou nenhum glow.
- Respeite `prefers-reduced-motion`.

## 7. Checklist de validacao

- [ ] A tela funciona sem as particulas.
- [ ] O conteudo fica acima da camada visual.
- [ ] O efeito nao intercepta clique.
- [ ] A animacao reduz com `prefers-reduced-motion`.
- [ ] A performance mobile foi considerada.
- [ ] O glow nao reduz contraste.
- [ ] Foco por teclado continua claro.

## 8. Criterio de pronto

O efeito esta pronto quando melhora a percepcao de profundidade sem roubar atencao da tarefa principal.

