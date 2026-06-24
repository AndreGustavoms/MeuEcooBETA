# Guia Arvore Hierarquica

## Quando usar

Use este guia quando o produto precisar exibir dados parent-child em formato de explorador: categorias, pastas, areas, topicos, departamentos, menus ou filtros aninhados.

## Quando nao usar

Nao use arvore quando:

- houver apenas um nivel de dados
- a relacao entre itens for mais bem representada por tags
- a profundidade maxima for desconhecida e puder ficar grande demais para navegacao manual
- o usuario precisa comparar muitos itens ao mesmo tempo

## Resultado esperado

Uma arvore compacta, recursiva, com expandir/recolher, selecao, breadcrumb opcional e acoes contextuais. O componente deve funcionar com dados aninhados vindos de API ou com lista flat transformada no frontend.

## Modelo de dados

```ts
export interface TreeNode {
  id: string;
  name: string;
  parentId?: string | null;
  path?: string;
  children?: TreeNode[];
}
```

Se a API retorna dados flat:

```ts
export function buildTree(items: TreeNode[]): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const item of items) {
    byId.set(item.id, { ...item, children: [] });
  }

  for (const item of items) {
    const node = byId.get(item.id);
    if (!node) continue;

    if (item.parentId && byId.has(item.parentId)) {
      byId.get(item.parentId)?.children?.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
```

## Componente recursivo

```tsx
import { ChevronRight, Folder, FolderOpen, Plus } from "lucide-react";
import { Button } from "./ui/Button";
import { cx } from "./ui/cx";

interface TreeItemProps {
  node: TreeNode;
  level?: number;
  selectedId?: string | null;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (node: TreeNode) => void;
  onAddChild?: (node: TreeNode) => void;
}

export function TreeItem({
  node,
  level = 0,
  selectedId,
  expandedIds,
  onToggle,
  onSelect,
  onAddChild,
}: TreeItemProps) {
  const children = node.children ?? [];
  const hasChildren = children.length > 0;
  const expanded = expandedIds.has(node.id);
  const selected = selectedId === node.id;

  return (
    <div className="select-none">
      <div
        className={cx(
          "group flex min-h-9 items-center gap-2 rounded-md px-2 text-sm",
          selected ? "bg-cyan-50 text-cyan-900" : "text-zinc-800 hover:bg-zinc-100"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded hover:bg-white"
          onClick={(event) => {
            event.stopPropagation();
            if (hasChildren) onToggle(node.id);
          }}
          aria-label={expanded ? "Recolher item" : "Expandir item"}
        >
          {hasChildren ? (
            <ChevronRight className={cx("h-4 w-4 transition", expanded && "rotate-90")} />
          ) : null}
        </button>

        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={() => onSelect(node)}
        >
          {hasChildren && expanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
          <span className="truncate">{node.name}</span>
        </button>

        {onAddChild && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100"
            onClick={(event) => {
              event.stopPropagation();
              onAddChild(node);
            }}
            aria-label="Adicionar filho"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {expanded && hasChildren && (
        <div>
          {children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

## Container

```tsx
import { useMemo, useState } from "react";

interface TreeProps {
  nodes: TreeNode[];
  selectedId?: string | null;
  onSelect: (node: TreeNode | null) => void;
  onAddChild?: (node: TreeNode) => void;
}

export function Tree({ nodes, selectedId, onSelect, onAddChild }: TreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const selectedNode = useMemo(() => {
    let found: TreeNode | null = null;
    const walk = (items: TreeNode[]) => {
      for (const item of items) {
        if (item.id === selectedId) found = item;
        walk(item.children ?? []);
      }
    };
    walk(nodes);
    return found;
  }, [nodes, selectedId]);

  const toggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="rounded-md border border-zinc-200 bg-white">
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-zinc-950">Estrutura</h2>
          <p className="truncate text-xs text-zinc-500">{selectedNode?.path ?? "Nenhum item selecionado"}</p>
        </div>
        <button type="button" className="text-xs text-zinc-500 hover:text-zinc-900" onClick={() => onSelect(null)}>
          Limpar
        </button>
      </header>

      <div className="max-h-96 overflow-auto p-2">
        {nodes.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onToggle={toggle}
            onSelect={onSelect}
            onAddChild={onAddChild}
          />
        ))}
      </div>
    </section>
  );
}
```

## Backend recomendado

Em bancos relacionais, use uma coluna `parent_id` e, se precisar consultar descendentes com frequencia, adicione `path` desnormalizado.

```py
class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey("self", null=True, blank=True, related_name="children", on_delete=models.CASCADE)
    path = models.CharField(max_length=500, db_index=True)
```

Para arvores pequenas, retornar a estrutura aninhada pela API e suficiente. Para arvores grandes, prefira carregar filhos sob demanda.

## Checklist

- [ ] Dados possuem `id` estavel.
- [ ] Itens sem filhos mantem alinhamento visual.
- [ ] Selecao e expansao sao estados separados.
- [ ] Acao de expandir nao dispara selecao sem querer.
- [ ] Profundidade maxima foi testada em mobile.
- [ ] Arvore grande usa lazy loading ou virtualizacao.

