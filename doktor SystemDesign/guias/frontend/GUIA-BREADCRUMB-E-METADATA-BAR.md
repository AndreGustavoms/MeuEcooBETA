# Guia Breadcrumb e Metadata Bar

## Quando usar

Use quando a interface precisa mostrar localizacao dentro de uma estrutura tecnica: repositorio, pasta, arquivo, modulo, documento, pipeline, dataset ou qualquer caminho navegavel.

Tambem use quando for util mostrar a ultima atividade relacionada ao item atual, como autor, acao, mensagem curta e data.

## Quando nao usar

Nao use este padrao quando:

- a tela nao tem hierarquia real;
- o caminho e curto demais para justificar breadcrumb;
- a metadata ficaria decorativa e sem acao util;
- a interface ja possui navegacao lateral suficiente e o breadcrumb repetiria informacao.

## Resultado esperado

Um conjunto de componentes utilitarios para frontend:

- `PathBreadcrumb`: mostra caminho navegavel por segmentos;
- `CopyPathButton`: copia caminho ou identificador;
- `MetadataBar`: mostra avatar, autor, acao, mensagem e data;
- `FileHeader`: junta breadcrumb e metadata no topo de uma tela tecnica.

O visual deve ser compacto, escaneavel e parecido com ferramenta de engenharia: texto pequeno, separadores discretos, foco no caminho e icones claros.

## Estrutura visual

```text
componentes / scraper / data / catalogo.db                  [copiar]

[avatar] Autor e agente   feat: versiona banco de componentes   ha 2 dias
```

## Modelo de dados

```ts
export interface PathSegment {
  label: string;
  href?: string;
}

export interface MetadataItem {
  avatarUrl?: string;
  actor: string;
  agent?: string;
  action?: string;
  message: string;
  dateLabel?: string;
}
```

## PathBreadcrumb

```tsx
import { ChevronRight } from "lucide-react";
import { cx } from "./ui/cx";

export function PathBreadcrumb({ segments }: { segments: PathSegment[] }) {
  return (
    <nav aria-label="Caminho" className="flex min-w-0 items-center gap-1 text-sm">
      {segments.map((segment, index) => {
        const active = index === segments.length - 1;

        return (
          <div key={`${segment.label}-${index}`} className="flex min-w-0 items-center gap-1">
            {index > 0 && <ChevronRight className="h-4 w-4 flex-none text-zinc-400" />}
            {segment.href && !active ? (
              <a
                href={segment.href}
                className="truncate font-medium text-cyan-700 hover:underline"
              >
                {segment.label}
              </a>
            ) : (
              <span
                className={cx(
                  "truncate font-semibold",
                  active ? "text-zinc-950" : "text-zinc-700"
                )}
                aria-current={active ? "page" : undefined}
              >
                {segment.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
```

## CopyPathButton

```tsx
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";

export function CopyPathButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label={copied ? "Caminho copiado" : "Copiar caminho"}
      title={copied ? "Copiado" : "Copiar caminho"}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
```

## MetadataBar

```tsx
import { Bot, UserCircle } from "lucide-react";
import { cx } from "./ui/cx";

export function MetadataBar({ item }: { item: MetadataItem }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm">
      <div className="h-7 w-7 flex-none overflow-hidden rounded-full bg-zinc-100">
        {item.avatarUrl ? (
          <img src={item.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserCircle className="h-7 w-7 text-zinc-400" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-zinc-700">
          <span className="font-semibold text-zinc-950">{item.actor}</span>
          {item.agent && (
            <>
              <span className="mx-1 text-zinc-400">and</span>
              <span className="inline-flex items-center gap-1 font-semibold text-zinc-950">
                <Bot className="h-3.5 w-3.5" />
                {item.agent}
              </span>
            </>
          )}
          {item.action && <span className="ml-2 text-zinc-500">{item.action}</span>}
          <span className={cx("ml-1", item.action ? "text-zinc-700" : "text-zinc-500")}>
            {item.message}
          </span>
        </p>
      </div>

      {item.dateLabel && <time className="hidden flex-none text-xs text-zinc-500 sm:block">{item.dateLabel}</time>}
    </div>
  );
}
```

## FileHeader

```tsx
export function FileHeader({
  segments,
  metadata,
}: {
  segments: PathSegment[];
  metadata?: MetadataItem;
}) {
  const path = segments.map((segment) => segment.label).join("/");

  return (
    <header className="space-y-3">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <PathBreadcrumb segments={segments} />
        <CopyPathButton value={path} />
      </div>

      {metadata && <MetadataBar item={metadata} />}
    </header>
  );
}
```

## Exemplo de uso

```tsx
const segments = [
  { label: "componentes", href: "/repo/componentes" },
  { label: "scraper", href: "/repo/componentes/scraper" },
  { label: "data", href: "/repo/componentes/scraper/data" },
  { label: "catalogo.db" },
];

const metadata = {
  actor: "AndreGustavoms",
  agent: "assistant",
  action: "feat:",
  message: "versiona banco de componentes",
  dateLabel: "ha 2 dias",
};

export function FilePage() {
  return <FileHeader segments={segments} metadata={metadata} />;
}
```

## Regras de design

- O ultimo segmento deve ter peso maior e `aria-current="page"`.
- Segmentos intermediarios devem ser links quando houver destino real.
- Use icone de copiar, nao texto "copiar", quando o espaco for curto.
- A linha de metadata deve caber em uma linha e truncar mensagem longa.
- Avatar e nome ajudam leitura, mas nao devem roubar foco do caminho.
- Em mobile, esconda datas secundarias antes de quebrar o layout.

## Checklist

- [ ] Caminho completo pode ser copiado.
- [ ] Breadcrumb nao quebra a tela em nomes longos.
- [ ] Ultimo segmento nao e link para a propria pagina.
- [ ] Botao de copiar tem feedback visual.
- [ ] Metadata funciona sem avatar.
- [ ] Nome de agente/autor e generico no componente.
- [ ] Visual continua compacto em mobile.
