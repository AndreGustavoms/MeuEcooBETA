# Guia Componentes UI Compostos

## Quando usar

Use este guia quando um projeto React + TypeScript + Tailwind precisar de componentes base proprios, leves e previsiveis, sem depender de uma biblioteca visual grande.

Funciona bem para:

- dashboards
- paineis administrativos
- MVPs
- apps academicos ou operacionais
- ferramentas internas

## Quando nao usar

Nao use este padrao quando:

- o projeto ja tem design system consolidado
- acessibilidade avancada de menu, combobox, dialog ou popover for requisito central
- a equipe precisa de componentes prontos com muitas variacoes

Nesses casos, considere Radix, shadcn/ui ou a biblioteca ja adotada pelo produto.

## Resultado esperado

Um kit pequeno com `Button`, `Card`, `Badge` e `cx`, facil de copiar entre projetos e simples de manter. O visual deve ser limpo, compacto e operacional: neutros fortes, bordas discretas, estados claros e acento de marca aplicado com moderacao.

## Estrutura recomendada

```text
src/
  components/
    ui/
      Badge.tsx
      Button.tsx
      Card.tsx
      cx.ts
      index.ts
```

## `cx`

Use um helper pequeno para juntar classes condicionais.

```ts
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
```

Ele cobre a maior parte dos casos comuns:

```tsx
<div
  className={cx(
    "rounded-md border p-4",
    active && "border-cyan-500 bg-cyan-50",
    disabled && "pointer-events-none opacity-50",
    className
  )}
/>
```

## Button

O botao deve ser previsivel, aceitar props HTML nativas e ter variantes tipadas.

```tsx
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cx } from "./cx";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "border-cyan-700 bg-cyan-700 text-white hover:bg-cyan-800",
  secondary: "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
  outline: "border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-50",
  ghost: "border-transparent bg-transparent text-zinc-700 hover:bg-zinc-100",
  danger: "border-red-700 bg-red-700 text-white hover:bg-red-800",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3",
  md: "h-10 px-4",
  icon: "h-10 w-10 p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", active = false, className, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cx(base, variants[variant], sizes[size], active && "ring-2 ring-cyan-500", className)}
      {...props}
    />
  );
});
```

## Card

Use compound components quando o card tiver partes repetidas, mas sem impor conteudo fixo.

```tsx
import { HTMLAttributes } from "react";
import { cx } from "./cx";

type DivProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return <div className={cx("rounded-md border border-zinc-200 bg-white", className)} {...props} />;
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cx("border-b border-zinc-200 p-4", className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cx("p-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div className={cx("border-t border-zinc-200 p-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cx("text-base font-semibold text-zinc-950", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx("mt-1 text-sm text-zinc-600", className)} {...props} />;
}
```

## Badge

Badge deve comunicar status, tag ou prioridade sem virar botao.

```tsx
import { HTMLAttributes } from "react";
import { cx } from "./cx";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "border-zinc-200 bg-zinc-50 text-zinc-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-800",
  info: "border-cyan-200 bg-cyan-50 text-cyan-800",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cx("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
```

## Barrel file

```ts
export { Badge } from "./Badge";
export { Button } from "./Button";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";
export { cx } from "./cx";
```

## Regras de design

- Use `rounded-md` ou raio equivalente para manter a interface compacta.
- Use icones nos botoes de ferramenta quando houver icone claro em `lucide-react`.
- Evite cards dentro de cards.
- Defina estados `hover`, `focus-visible`, `disabled` e `active`.
- Use acento de marca para acao principal e foco, nao para tudo.
- Mantenha contraste legivel em tema claro e, se houver, tema escuro.

## Checklist

- [ ] Componentes aceitam `className`.
- [ ] Props HTML nativas continuam funcionando.
- [ ] `Button` usa `forwardRef`.
- [ ] Variantes e tamanhos sao tipados.
- [ ] Foco de teclado e visivel.
- [ ] Textos longos nao quebram o layout.
- [ ] O kit nao depende de contexto de produto especifico.

