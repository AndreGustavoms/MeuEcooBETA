# Guia Heatmap de Atividade

## Quando usar

Use heatmap quando o usuario precisa enxergar consistencia ou intensidade ao longo do tempo: commits, estudos, exercicios, vendas, tarefas concluidas, acessos ou qualquer metrica diaria.

## Quando nao usar

Nao use heatmap quando:

- o dado principal nao tem data
- a comparacao exata entre valores e mais importante que a tendencia
- existem poucas ocorrencias e uma lista seria mais clara
- a metrica exige grafico de linha, barras ou tabela detalhada

## Resultado esperado

Uma grade temporal com celulas quadradas, escala de intensidade, tooltip ou painel de detalhe, navegacao por periodo e agregacao rapida por data.

## Estrutura de dados

Entrada generica:

```ts
export interface ActivityEvent {
  id: string;
  date: string;
  value?: number;
  durationMin?: number;
  label?: string;
}
```

Saida agregada por dia:

```ts
export interface ActivityDay {
  date: string;
  total: number;
  count: number;
  durationMin: number;
}
```

## Agregacao

```ts
export function aggregateByDay(events: ActivityEvent[]): Map<string, ActivityDay> {
  const byDate = new Map<string, ActivityDay>();

  for (const event of events) {
    const date = event.date.slice(0, 10);
    const current = byDate.get(date) ?? { date, total: 0, count: 0, durationMin: 0 };

    current.total += event.value ?? 1;
    current.count += 1;
    current.durationMin += event.durationMin ?? 0;

    byDate.set(date, current);
  }

  return byDate;
}
```

## Nivel de intensidade

Comece com cinco niveis. Ajuste os limites ao dominio do projeto.

```ts
export function getActivityLevel(value: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (value <= 0) return 0;
  if (value < 3) return 1;
  if (value < 6) return 2;
  if (value < 10) return 3;
  if (value < 20) return 4;
  return 5;
}

export function levelClass(level: number): string {
  const classes = [
    "bg-zinc-100 border-zinc-200",
    "bg-emerald-100 border-emerald-200",
    "bg-emerald-200 border-emerald-300",
    "bg-emerald-400 border-emerald-500",
    "bg-emerald-600 border-emerald-700",
    "bg-emerald-800 border-emerald-900",
  ];

  return classes[level] ?? classes[0];
}
```

## Geracao de grade mensal

```ts
export function getMonthGrid(month: Date): Date[] {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const gridStart = new Date(start);
  const gridEnd = new Date(end);

  const startOffset = (gridStart.getDay() + 6) % 7;
  gridStart.setDate(gridStart.getDate() - startOffset);

  const endOffset = 6 - ((gridEnd.getDay() + 6) % 7);
  gridEnd.setDate(gridEnd.getDate() + endOffset);

  const days: Date[] = [];
  for (const current = new Date(gridStart); current <= gridEnd; current.setDate(current.getDate() + 1)) {
    days.push(new Date(current));
  }

  return days;
}

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
```

## Componente

```tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cx } from "./ui/cx";

export function ActivityHeatmap({ events }: { events: ActivityEvent[] }) {
  const [month, setMonth] = useState(() => new Date());

  const byDate = useMemo(() => aggregateByDay(events), [events]);
  const days = useMemo(() => getMonthGrid(month), [month]);

  const changeMonth = (offset: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  return (
    <section className="rounded-md border border-zinc-200 bg-white p-4">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-950">Atividade</h2>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Mes anterior" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="w-36 text-center text-sm font-medium">
            {month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </span>
          <button type="button" aria-label="Proximo mes" onClick={() => changeMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-zinc-500">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const key = dateKey(day);
          const data = byDate.get(key);
          const level = getActivityLevel(data?.total ?? 0);
          const outsideMonth = day.getMonth() !== month.getMonth();

          return (
            <button
              key={key}
              type="button"
              title={`${key}: ${data?.total ?? 0}`}
              className={cx(
                "aspect-square rounded-md border text-xs font-medium transition hover:scale-105",
                levelClass(level),
                outsideMonth && "opacity-35"
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <footer className="mt-4 flex items-center justify-end gap-2 text-xs text-zinc-500">
        <span>Menos</span>
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <span key={level} className={cx("h-3 w-3 rounded-sm border", levelClass(level))} />
        ))}
        <span>Mais</span>
      </footer>
    </section>
  );
}
```

## Variacoes

- Heatmap semanal: renderize apenas os ultimos 7 ou 14 dias.
- Heatmap anual: agrupe meses em linhas horizontais e reduza celulas para 10-12px.
- Multimetrica: permita alternar entre quantidade, tempo, valor financeiro ou score.
- Com detalhe: clique em uma celula para abrir drawer ou modal com eventos daquele dia.

## Performance

- Use `Map` para lookup por data.
- Use `useMemo` na agregacao.
- Para anos inteiros, evite tooltips pesados em cada celula.
- Para muitos anos, virtualize por mes ou por linha.

## Checklist

- [ ] Celulas tem tamanho estavel com `aspect-square`.
- [ ] Escala de cores tem contraste suficiente.
- [ ] Periodo atual e dias fora do mes sao distinguiveis.
- [ ] Valores nulos viram nivel zero.
- [ ] Tooltip ou detalhe mostra o valor real.
- [ ] Navegacao por teclado funciona nos dias clicaveis.

