# Guia Sistema de Alerta e Grade de Horarios

## Quando usar

Use quando o produto precisa mostrar uma agenda semanal e destacar o proximo compromisso, aula, reuniao, turno ou evento operacional.

## Quando nao usar

Nao use este padrao quando:

- os eventos nao seguem horarios previsiveis
- a agenda precisa de calendario completo com recorrencias complexas
- ha fuso horario, excecoes e convites externos como requisito central

Nesses casos, considere uma biblioteca de calendario ou uma integracao com provedor de agenda.

## Resultado esperado

Uma tabela semanal responsiva, com coluna de horario fixa, celulas parseadas, cores por local ou tipo e banner automatico informando o proximo evento.

## Modelo de dados

```ts
type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

export interface ScheduleSlot {
  time: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
}

export interface ParsedScheduleCell {
  title: string;
  owner?: string;
  location?: string;
}
```

Formato recomendado da celula:

```text
Titulo | Responsavel | Local
```

Exemplos:

```text
Backend | Time API | Sala 2
Revisao de projeto | Andre | Online
Plantao | Laboratorio 1
```

## Parser

```ts
export function parseScheduleCell(raw: string): ParsedScheduleCell {
  const parts = raw.split("|").map((part) => part.trim()).filter(Boolean);

  if (parts.length === 0) return { title: "" };
  if (parts.length === 1) return { title: parts[0] };

  if (parts.length === 2) {
    const [title, second] = parts;
    const looksLikeLocation = /^(sala|lab|laboratorio|online|auditorio|bloco)/i.test(second);
    return looksLikeLocation ? { title, location: second } : { title, owner: second };
  }

  return {
    title: parts[0],
    owner: parts[1],
    location: parts.slice(2).join(" | "),
  };
}
```

## Busca do proximo evento

```ts
const weekDays: Array<{ key: WeekDay; dayNumber: number; label: string }> = [
  { key: "monday", dayNumber: 1, label: "segunda" },
  { key: "tuesday", dayNumber: 2, label: "terca" },
  { key: "wednesday", dayNumber: 3, label: "quarta" },
  { key: "thursday", dayNumber: 4, label: "quinta" },
  { key: "friday", dayNumber: 5, label: "sexta" },
];

function getStartTime(timeRange: string) {
  const match = timeRange.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;

  return {
    label: `${match[1].padStart(2, "0")}:${match[2]}`,
    hours: Number(match[1]),
    minutes: Number(match[2]),
  };
}

export function getNextScheduleItem(schedule: ScheduleSlot[], now = new Date()) {
  let next: null | { date: Date; dayOffset: number; startTime: string; cell: ParsedScheduleCell } = null;

  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const candidateDate = new Date(now);
    candidateDate.setDate(now.getDate() + dayOffset);
    candidateDate.setHours(0, 0, 0, 0);

    const weekDay = weekDays.find((day) => day.dayNumber === candidateDate.getDay());
    if (!weekDay) continue;

    for (const slot of schedule) {
      const raw = slot[weekDay.key];
      if (!raw || raw.trim() === "...") continue;

      const startTime = getStartTime(slot.time);
      if (!startTime) continue;

      const date = new Date(candidateDate);
      date.setHours(startTime.hours, startTime.minutes, 0, 0);
      if (date <= now) continue;

      const cell = parseScheduleCell(raw);
      if (!cell.title) continue;

      if (!next || date < next.date) {
        next = { date, dayOffset, startTime: startTime.label, cell };
      }
    }
  }

  return next;
}
```

## Banner

```tsx
export function NextScheduleBanner({ schedule }: { schedule: ScheduleSlot[] }) {
  const [tick, setTick] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const next = getNextScheduleItem(schedule, new Date(tick));

  if (!next) {
    return <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">Nenhum proximo evento encontrado.</div>;
  }

  const when = next.dayOffset === 0 ? "hoje" : next.dayOffset === 1 ? "amanha" : "nos proximos dias";

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      Proximo: {next.cell.title} {when} as {next.startTime}
      {next.cell.owner ? ` com ${next.cell.owner}` : ""}
      {next.cell.location ? ` em ${next.cell.location}` : ""}.
    </div>
  );
}
```

## Cores por local

```ts
const locationColors = [
  { key: "online", className: "bg-cyan-50 text-cyan-900 border-cyan-200" },
  { key: "sala", className: "bg-emerald-50 text-emerald-900 border-emerald-200" },
  { key: "lab", className: "bg-violet-50 text-violet-900 border-violet-200" },
];

export function resolveLocationClass(location?: string): string {
  if (!location) return "bg-zinc-50 text-zinc-700 border-zinc-200";
  return locationColors.find((item) => location.toLowerCase().includes(item.key))?.className ?? "bg-zinc-50 text-zinc-700 border-zinc-200";
}
```

## Tabela semanal

```tsx
const days: WeekDay[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const labels = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta"];

export function ScheduleTable({ schedule }: { schedule: ScheduleSlot[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            <th className="sticky left-0 z-10 bg-zinc-50 p-3 text-left font-semibold text-zinc-900">Horario</th>
            {labels.map((label) => (
              <th key={label} className="p-3 text-left font-semibold text-zinc-900">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedule.map((slot) => (
            <tr key={slot.time} className="border-b border-zinc-100 last:border-b-0">
              <td className="sticky left-0 z-10 whitespace-nowrap bg-white p-3 font-medium text-zinc-700">{slot.time}</td>
              {days.map((day) => {
                const raw = slot[day];
                if (!raw) return <td key={day} className="p-2 text-zinc-300">-</td>;
                if (raw.trim() === "...") return <td key={day} className="p-2 text-zinc-400">...</td>;

                const cell = parseScheduleCell(raw);

                return (
                  <td key={day} className="p-2 align-top">
                    <div className={`rounded-md border p-2 ${resolveLocationClass(cell.location)}`}>
                      <p className="font-semibold">{cell.title}</p>
                      {cell.owner && <p className="mt-1 text-xs opacity-80">{cell.owner}</p>}
                      {cell.location && <p className="mt-1 text-xs opacity-80">{cell.location}</p>}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Checklist

- [ ] Parser aceita celulas incompletas.
- [ ] Continuacoes (`...`) nao viram alerta.
- [ ] Timer limpa intervalo no unmount.
- [ ] Coluna de horario continua legivel em mobile.
- [ ] Cores de celula tem contraste suficiente.
- [ ] O algoritmo considera apenas eventos futuros.

