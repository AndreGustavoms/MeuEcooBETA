# Guia Background Visual

## Quando usar

Use este guia quando uma interface precisar de ambientacao visual sem prejudicar leitura, clique ou performance.

Casos comuns:

- calculadoras;
- paginas educacionais;
- dashboards tecnicos;
- telas de login;
- ferramentas com identidade visual propria;
- experiencias que precisam de profundidade visual sem virar landing page decorativa.

## Quando nao usar

Nao use este padrao quando:

- a tela for operacional e densa demais para efeitos de fundo;
- houver risco de reduzir contraste;
- o background competir com formularios, tabelas ou dados;
- o produto ja tiver identidade visual definida por marca;
- a animacao piorar performance em mobile;
- o usuario precisar manter foco por longos periodos em texto ou planilhas.

## Resultado esperado

Ao aplicar este guia, o projeto deve ter:

- background separado do conteudo;
- camada visual sem `pointer-events`;
- conteudo sempre acima do fundo;
- tema claro/escuro opcional;
- animacao respeitando `prefers-reduced-motion`;
- tokens de cor documentados;
- fallback estatico quando animacao for excesso.

## Visao geral

Um background visual bom e uma camada de contexto, nao uma segunda interface. Ele pode reforcar o tema do produto, mas nao deve interceptar clique, causar scroll inesperado, esconder texto ou competir com controles.

Arquitetura recomendada:

```text
Conteudo principal   z-index alto, interativo
Camada animada       fixed, pointer-events none
Gradiente/base       body ou app shell
```

## 1. Estrutura HTML

```html
<body>
  <div class="app-background" aria-hidden="true">
    <div class="ambient-layer" id="ambient-layer"></div>
  </div>

  <main class="app-shell">
    <!-- interface real -->
  </main>
</body>
```

Regras:

- `app-background` nunca recebe foco.
- `aria-hidden="true"` evita ruido para leitor de tela.
- `app-shell` concentra a experiencia util.
- O background nao deve conter informacao necessaria para usar o app.

## 2. CSS base

```css
:root {
  --bg-start: #07111f;
  --bg-end: #101827;
  --ambient-color: rgba(34, 197, 94, 0.16);
  --ambient-strong: rgba(14, 165, 233, 0.18);
  --surface: rgba(255, 255, 255, 0.92);
  --text: #0b1220;
}

body {
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(circle at 20% 12%, var(--ambient-strong), transparent 34%),
    linear-gradient(135deg, var(--bg-start), var(--bg-end));
  color: var(--text);
}

.app-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.app-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}
```

## 3. Camada animada simples

Use elementos leves, poucos e descartaveis. Evite criar DOM infinito.

```css
.ambient-symbol {
  position: absolute;
  color: var(--ambient-color);
  font: 700 24px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  opacity: 0;
  user-select: none;
  animation: ambient-drift 9s linear forwards;
  will-change: transform, opacity;
}

@keyframes ambient-drift {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(0.8) rotate(0deg);
  }
  10% {
    opacity: 0.18;
  }
  70% {
    opacity: 0.16;
  }
  100% {
    opacity: 0;
    transform:
      translate3d(var(--move-x, 40px), var(--move-y, -80px), 0)
      scale(1.05)
      rotate(var(--rotate, 24deg));
  }
}

@media (prefers-reduced-motion: reduce) {
  .ambient-symbol {
    animation: none;
    opacity: 0.08;
  }
}
```

## 4. Gerador JavaScript

```js
const AMBIENT_SYMBOLS = [
  "01",
  "{}",
  "</>",
  "fn",
  "db",
  "api",
  "auth",
  "log",
];

function createAmbientSymbol() {
  const layer = document.getElementById("ambient-layer");
  if (!layer) return;

  const element = document.createElement("span");
  element.className = "ambient-symbol";
  element.textContent =
    AMBIENT_SYMBOLS[Math.floor(Math.random() * AMBIENT_SYMBOLS.length)];

  const duration = 7 + Math.random() * 5;
  element.style.left = `${Math.random() * 100}vw`;
  element.style.top = `${Math.random() * 100}vh`;
  element.style.fontSize = `${16 + Math.random() * 18}px`;
  element.style.setProperty("--move-x", `${Math.random() * 160 - 80}px`);
  element.style.setProperty("--move-y", `${Math.random() * -160 - 40}px`);
  element.style.setProperty("--rotate", `${Math.random() * 80 - 40}deg`);
  element.style.animationDuration = `${duration}s`;

  layer.appendChild(element);

  window.setTimeout(() => {
    element.remove();
  }, duration * 1000 + 200);
}

function initAmbientBackground() {
  for (let i = 0; i < 24; i += 1) {
    window.setTimeout(createAmbientSymbol, i * 120);
  }

  window.setInterval(createAmbientSymbol, 650);
}

initAmbientBackground();
```

## 5. Tema claro e escuro

```css
.theme-light {
  --bg-start: #e9edf3;
  --bg-end: #f8fafc;
  --ambient-color: rgba(4, 120, 87, 0.12);
  --ambient-strong: rgba(14, 165, 233, 0.14);
  --surface: rgba(255, 255, 255, 0.92);
  --text: #0b1220;
}

.theme-dark {
  --bg-start: #070a12;
  --bg-end: #101827;
  --ambient-color: rgba(74, 222, 128, 0.15);
  --ambient-strong: rgba(14, 165, 233, 0.14);
  --surface: rgba(2, 6, 23, 0.74);
  --text: #f8fafc;
}
```

Controle simples:

```js
const THEME_KEY = "app.theme";

function loadTheme() {
  const theme = localStorage.getItem(THEME_KEY) || "theme-light";
  document.documentElement.classList.add(theme);
}

function setTheme(theme) {
  document.documentElement.classList.remove("theme-light", "theme-dark");
  document.documentElement.classList.add(theme);
  localStorage.setItem(THEME_KEY, theme);
}

loadTheme();
```

## 6. Guardrails de usabilidade

- `pointer-events: none` no background e nos elementos.
- `z-index` do conteudo maior que o fundo.
- Nada no fundo pode ser necessario para entender a tela.
- Nao anime mais elementos do que o dispositivo consegue sustentar.
- Em telas de formulario, reduza opacidade e quantidade.
- Em dashboards densos, prefira background estatico.
- Teste mobile real ou em viewport pequena.

## 7. Checklist de validacao

- [ ] O conteudo continua legivel em claro e escuro.
- [ ] O background nao intercepta clique.
- [ ] Nao ha scroll causado por elementos animados.
- [ ] A animacao para ou reduz com `prefers-reduced-motion`.
- [ ] O DOM nao cresce indefinidamente.
- [ ] O projeto funciona sem JavaScript de background.
- [ ] Tokens de cor estao documentados.

## 8. Criterio de pronto

O background esta pronto quando melhora a identidade visual sem alterar a tarefa principal do usuario. Se a pessoa percebe o fundo, mas ainda consegue usar a interface sem esforco, o equilibrio esta correto.
