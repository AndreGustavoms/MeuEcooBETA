# Guia Calendario Academico

## Quando usar

Use este guia quando o projeto precisar mostrar eventos em uma grade mensal com navegacao, agrupamento por dia e estado do usuario.

Casos comuns:

- calendario academico;
- agenda de entregas;
- painel de tarefas;
- calendario editorial;
- cronograma de aulas;
- dashboard de eventos internos.

## Quando nao usar

Nao use este padrao quando:

- o usuario precisa de agenda por hora/minuto;
- eventos duram varios dias com sobreposicao visual complexa;
- ha necessidade de arrastar e soltar eventos;
- o calendario precisa sincronizar com Google/Outlook em tempo real;
- uma lista simples por data resolver melhor.

## Resultado esperado

Ao aplicar este guia, o projeto deve ter:

- funcoes puras de data;
- grade mensal com semanas completas;
- agrupamento por chave `YYYY-MM-DD`;
- navegacao mes anterior/proximo/hoje;
- destaque do dia atual;
- tratamento para dias fora do mes;
- eventos resumidos na celula;
- card ou painel de detalhe;
- estado vazio.

## Visao geral

O calendario e composto por tres partes:

| Camada | Responsabilidade |
|---|---|
| Utilitarios de data | Criar chaves, comparar datas, gerar grade mensal |
| Grade mensal | Renderizar dias e indicadores de evento |
| Detalhe do evento | Mostrar metadados, status e acoes |

## 1. Utilitarios de data

Use funcoes puras para evitar dependencia pesada quando o caso for simples.

```ts
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function isSameMonth(left: Date, right: Date): boolean {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function startOfWeek(date: Date, weekStartsOn = 1): Date {
  const start = new Date(date);
  const day = start.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  start.setDate(start.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function endOfWeek(date: Date, weekStartsOn = 1): Date {
  return addDays(startOfWeek(date, weekStartsOn), 6);
}

export function getMonthGridDays(monthDate: Date): Date[] {
  const first = startOfWeek(startOfMonth(monthDate), 1);
  const last = endOfWeek(endOfMonth(monthDate), 1);
  const days: Date[] = [];

  for (let day = first; day <= last; day = addDays(day, 1)) {
    days.push(new Date(day));
  }

  return days;
}
```

## 2. Contrato de evento

```ts
export type CalendarEvent = {
  id: string;
  title: string;
  shortTitle?: string;
  startsAt: string;
  endsAt?: string;
  status?: "open" | "done" | "late" | "cancelled";
  category?: string;
  description?: string;
  url?: string;
};
```

Regras:

- `id` precisa ser estavel.
- `startsAt` deve ser ISO string.
- `shortTitle` e usado na celula do calendario.
- Eventos sem data valida devem ser descartados ou enviados para lista de erro.

## 3. Agrupamento por data

```ts
import { useMemo } from "react";

function getEventDate(event: CalendarEvent): Date {
  return new Date(event.endsAt || event.startsAt);
}

export function useEventsByDate(events: CalendarEvent[]) {
  return useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    for (const event of events) {
      const date = getEventDate(event);
      if (Number.isNaN(date.getTime())) continue;

      const key = toDateKey(date);
      const bucket = map.get(key) || [];
      bucket.push(event);
      map.set(key, bucket);
    }

    for (const bucket of map.values()) {
      bucket.sort((a, b) => getEventDate(a).getTime() - getEventDate(b).getTime());
    }

    return map;
  }, [events]);
}
```

## 4. Componente de calendario

```tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type CalendarProps = {
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
};

export function MonthlyCalendar({ events, onSelectEvent }: CalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(today));
  const gridDays = useMemo(() => getMonthGridDays(selectedMonth), [selectedMonth]);
  const eventsByDate = useEventsByDate(events);

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            {selectedMonth.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <p className="text-sm text-slate-500">{events.length} evento(s)</p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" aria-label="Mes anterior" onClick={() => setSelectedMonth(addMonths(selectedMonth, -1))}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => setSelectedMonth(startOfMonth(today))}>
            Hoje
          </button>
          <button type="button" aria-label="Proximo mes" onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-500">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {gridDays.map((day) => {
          const key = toDateKey(day);
          const dayEvents = eventsByDate.get(key) || [];
          return (
            <DayCell
              key={key}
              day={day}
              events={dayEvents}
              currentMonth={selectedMonth}
              today={today}
              onSelectEvent={onSelectEvent}
            />
          );
        })}
      </div>
    </section>
  );
}
```

## 5. Celula do dia

```tsx
type DayCellProps = {
  day: Date;
  events: CalendarEvent[];
  currentMonth: Date;
  today: Date;
  onSelectEvent?: (event: CalendarEvent) => void;
};

function DayCell({ day, events, currentMonth, today, onSelectEvent }: DayCellProps) {
  const inMonth = isSameMonth(day, currentMonth);
  const current = isSameDay(day, today);
  const hasEvents = events.length > 0;

  return (
    <div
      className={[
        "min-h-24 rounded-md border p-2 text-left transition",
        inMonth ? "bg-white text-slate-900" : "bg-slate-50 text-slate-400",
        current ? "border-emerald-500 ring-2 ring-emerald-100" : "border-slate-200",
        hasEvents ? "hover:border-emerald-400" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">{day.getDate()}</span>
        {hasEvents ? (
          <span className="rounded-full bg-emerald-100 px-1.5 text-[10px] font-semibold text-emerald-700">
            {events.length}
          </span>
        ) : null}
      </div>

      <div className="mt-2 space-y-1">
        {events.slice(0, 3).map((event) => (
          <button
            key={event.id}
            type="button"
            className="block w-full truncate rounded bg-slate-100 px-1.5 py-1 text-left text-[11px] hover:bg-emerald-50"
            onClick={() => onSelectEvent?.(event)}
            title={event.title}
          >
            {event.shortTitle || event.title}
          </button>
        ))}
        {events.length > 3 ? (
          <p className="text-[11px] text-slate-500">+{events.length - 3} evento(s)</p>
        ) : null}
      </div>
    </div>
  );
}
```

## 6. Estado do usuario por evento

Quando o calendario representar entregas, permita estado local por evento.

```ts
type UserEventStatus = "will-do" | "done";

function readStatusMap(): Record<string, UserEventStatus> {
  try {
    return JSON.parse(localStorage.getItem("calendar.status") || "{}");
  } catch {
    return {};
  }
}

function writeStatusMap(value: Record<string, UserEventStatus>) {
  localStorage.setItem("calendar.status", JSON.stringify(value));
}
```

Regras:

- status local nao substitui dado oficial do backend;
- status deve ser exportavel ou descartavel;
- se houver usuario autenticado, prefira persistir no backend;
- botao ativo deve usar `aria-pressed`.

## 7. Responsividade

Em mobile, uma grade mensal pode ficar apertada. Opcoes:

| Estrategia | Quando usar |
|---|---|
| Grade compacta com apenas contagem | Eventos simples |
| Lista abaixo do calendario | Muitos eventos por dia |
| Alternar `mes` / `lista` | Mobile como uso principal |
| Scroll horizontal | Agenda densa, mas com cuidado |

Evite texto longo dentro da celula em telas pequenas.

## 8. Checklist de validacao

- [ ] Grade sempre tem multiplo de 7 dias.
- [ ] Semana comeca no dia esperado para o publico.
- [ ] Dia atual fica claro.
- [ ] Dias fora do mes ficam visualmente secundarios.
- [ ] Eventos invalidos nao quebram a tela.
- [ ] Lista vazia tem mensagem util.
- [ ] Navegacao por teclado funciona.
- [ ] O layout mobile nao sobrepoe texto.

## 9. Criterio de pronto

O calendario esta pronto quando a pessoa consegue responder rapidamente: o que acontece hoje, o que vem depois e quais eventos exigem acao.

