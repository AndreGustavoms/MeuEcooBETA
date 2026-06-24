# Guia Arvore de Materiais Dual View

## Quando usar

Use quando o usuario precisa navegar por materiais, documentos, aulas, arquivos ou links organizados em pastas e tambem acompanhar o que ja foi visto.

## Quando nao usar

Nao use este padrao quando:

- todos os itens cabem em uma lista simples
- nao existe progresso por item
- a arvore tera milhares de itens sem paginacao ou busca
- o usuario precisa editar a estrutura com frequencia

## Resultado esperado

Uma arvore com dois modos: simples, para desempenho e baixa complexidade; dinamico, para uma experiencia mais polida com icones e animacoes. Ambos compartilham progresso, persistencia e contagem por pasta.

## Modelo de dados

```ts
export interface MaterialNode {
  id: string;
  label: string;
  type: "folder" | "file";
  url?: string;
  children?: MaterialNode[];
}
```

Exemplo:

```ts
const materials: MaterialNode[] = [
  {
    id: "modulo-1",
    label: "Modulo 1",
    type: "folder",
    children: [
      { id: "modulo-1-slides", label: "Slides", type: "file", url: "/slides/modulo-1.pdf" },
      { id: "modulo-1-exercicio", label: "Exercicio", type: "file", url: "/exercicios/modulo-1" },
    ],
  },
];
```

## Helpers

```ts
export function collectFileIds(node: MaterialNode): string[] {
  if (node.type === "file") return [node.id];
  return (node.children ?? []).flatMap(collectFileIds);
}

export function toggleSetValue<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
}
```

Persistencia:

```ts
const VIEWED_KEY = "materials:viewed";
const MODE_KEY = "materials:viewMode";

type ViewMode = "simple" | "dynamic";

export function loadViewed(): Set<string> {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveViewed(value: Set<string>) {
  localStorage.setItem(VIEWED_KEY, JSON.stringify([...value]));
}

export function loadMode(): ViewMode {
  return localStorage.getItem(MODE_KEY) === "simple" ? "simple" : "dynamic";
}
```

## Modo simples

Use estado local por no. Para "recolher tudo", passe um contador que muda quando o container manda resetar.

```tsx
function SimpleNode({
  node,
  depth,
  collapseSignal,
  viewedIds,
  onToggleViewed,
}: {
  node: MaterialNode;
  depth: number;
  collapseSignal: number;
  viewedIds: Set<string>;
  onToggleViewed: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [collapseSignal]);

  if (node.type === "file") {
    const viewed = viewedIds.has(node.id);

    return (
      <div className="flex min-h-9 items-center gap-2 rounded-md px-2 text-sm hover:bg-zinc-100" style={{ paddingLeft: depth * 16 + 8 }}>
        <input type="checkbox" checked={viewed} onChange={() => onToggleViewed(node.id)} />
        <a className={viewed ? "truncate text-zinc-400 line-through" : "truncate text-zinc-800"} href={node.url} target="_blank" rel="noreferrer">
          {node.label}
        </a>
      </div>
    );
  }

  const fileIds = collectFileIds(node);
  const viewedCount = fileIds.filter((id) => viewedIds.has(id)).length;

  return (
    <div>
      <button
        type="button"
        className="flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm font-medium hover:bg-zinc-100"
        style={{ paddingLeft: depth * 16 + 8 }}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? "v" : ">"}</span>
        <span className="truncate">{node.label}</span>
        <span className="ml-auto text-xs text-zinc-500">{viewedCount}/{fileIds.length}</span>
      </button>

      {open && node.children?.map((child) => (
        <SimpleNode key={child.id} node={child} depth={depth + 1} collapseSignal={collapseSignal} viewedIds={viewedIds} onToggleViewed={onToggleViewed} />
      ))}
    </div>
  );
}
```

## Modo dinamico

Use quando o projeto ja usa `lucide-react` e `framer-motion`, ou quando a arvore e uma parte importante da experiencia.

```tsx
import { ChevronRight, FileText, Folder, FolderOpen } from "lucide-react";

function DynamicNode({
  node,
  depth,
  expandedIds,
  viewedIds,
  onToggleExpand,
  onToggleViewed,
}: {
  node: MaterialNode;
  depth: number;
  expandedIds: Set<string>;
  viewedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onToggleViewed: (id: string) => void;
}) {
  if (node.type === "file") {
    const viewed = viewedIds.has(node.id);

    return (
      <div className="flex min-h-9 items-center gap-2 rounded-md px-2 text-sm hover:bg-zinc-100" style={{ paddingLeft: depth * 16 + 8 }}>
        <input type="checkbox" checked={viewed} onChange={() => onToggleViewed(node.id)} />
        <FileText className="h-4 w-4 text-zinc-500" />
        <a className={viewed ? "truncate text-zinc-400 line-through" : "truncate text-zinc-800"} href={node.url} target="_blank" rel="noreferrer">
          {node.label}
        </a>
      </div>
    );
  }

  const expanded = expandedIds.has(node.id);
  const fileIds = collectFileIds(node);
  const viewedCount = fileIds.filter((id) => viewedIds.has(id)).length;

  return (
    <div>
      <button
        type="button"
        className="flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm font-medium hover:bg-zinc-100"
        style={{ paddingLeft: depth * 16 + 8 }}
        onClick={() => onToggleExpand(node.id)}
      >
        <ChevronRight className={expanded ? "h-4 w-4 rotate-90 transition" : "h-4 w-4 transition"} />
        {expanded ? <FolderOpen className="h-4 w-4 text-cyan-700" /> : <Folder className="h-4 w-4 text-cyan-700" />}
        <span className="truncate">{node.label}</span>
        <span className="ml-auto text-xs text-zinc-500">{viewedCount}/{fileIds.length}</span>
      </button>

      {expanded && node.children?.map((child) => (
        <DynamicNode key={child.id} node={child} depth={depth + 1} expandedIds={expandedIds} viewedIds={viewedIds} onToggleExpand={onToggleExpand} onToggleViewed={onToggleViewed} />
      ))}
    </div>
  );
}
```

## Container

```tsx
export function MaterialTree({ nodes }: { nodes: MaterialNode[] }) {
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => loadViewed());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [collapseSignal, setCollapseSignal] = useState(0);
  const [mode, setMode] = useState<ViewMode>(() => loadMode());

  const fileIds = useMemo(() => nodes.flatMap(collectFileIds), [nodes]);
  const viewedCount = fileIds.filter((id) => viewedIds.has(id)).length;

  const toggleViewed = (id: string) => {
    setViewedIds((current) => {
      const next = toggleSetValue(current, id);
      saveViewed(next);
      return next;
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => toggleSetValue(current, id));
  };

  const changeMode = (nextMode: ViewMode) => {
    setMode(nextMode);
    localStorage.setItem(MODE_KEY, nextMode);
  };

  return (
    <section className="rounded-md border border-zinc-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-950">Materiais</h2>
          <p className="text-xs text-zinc-500">{viewedCount}/{fileIds.length} vistos</p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => changeMode(mode === "simple" ? "dynamic" : "simple")}>
            {mode === "simple" ? "Modo dinamico" : "Modo simples"}
          </button>
          <button type="button" onClick={() => (mode === "simple" ? setCollapseSignal((value) => value + 1) : setExpandedIds(new Set()))}>
            Recolher tudo
          </button>
        </div>
      </header>

      <div className="p-2">
        {nodes.map((node) =>
          mode === "simple" ? (
            <SimpleNode key={node.id} node={node} depth={0} collapseSignal={collapseSignal} viewedIds={viewedIds} onToggleViewed={toggleViewed} />
          ) : (
            <DynamicNode key={node.id} node={node} depth={0} expandedIds={expandedIds} viewedIds={viewedIds} onToggleExpand={toggleExpanded} onToggleViewed={toggleViewed} />
          )
        )}
      </div>
    </section>
  );
}
```

## Checklist

- [ ] IDs sao estaveis entre deploys.
- [ ] `localStorage` tem fallback seguro.
- [ ] Contagem por pasta ignora pastas vazias.
- [ ] Links externos usam `target="_blank"` e `rel="noreferrer"`.
- [ ] Modo simples funciona sem dependencias extras.
- [ ] Arvores grandes tem busca, lazy loading ou limite de profundidade.

