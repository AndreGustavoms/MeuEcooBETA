# Guia Onboarding e Ajuda

## Quando usar

Use quando a interface tem varias acoes, conceitos novos ou fluxo inicial que o usuario precisa entender rapidamente.

## Quando nao usar

Nao use onboarding como compensacao para uma interface confusa. Se a acao principal nao e evidente, primeiro simplifique a tela. Tambem evite tours longos em produtos pequenos.

## Resultado esperado

Um onboarding curto de primeira visita, uma central de ajuda permanente e conteudo declarativo que cada projeto consegue adaptar sem mexer na estrutura do componente.

## Principios

- Ensine so o primeiro passo necessario.
- Permita fechar imediatamente.
- Nao bloqueie trabalho recorrente.
- Guarde estado por fluxo, nao por aplicacao inteira.
- Mantenha ajuda disponivel depois do onboarding.

## Hook de primeira visita

```tsx
import { useEffect, useState } from "react";

export function useFirstVisit(id: string) {
  const storageKey = `onboarding:${id}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(storageKey) !== "done");
    } catch {
      setVisible(false);
    }
  }, [storageKey]);

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey, "done");
    } catch {
      // Sem persistencia, apenas fecha a sessao atual.
    }
    setVisible(false);
  };

  const reset = () => {
    localStorage.removeItem(storageKey);
    setVisible(true);
  };

  return { visible, dismiss, reset };
}
```

## Onboarding compacto

```tsx
import { X } from "lucide-react";
import { Button } from "./ui/Button";

interface OnboardingProps {
  title: string;
  description: string;
  actionLabel?: string;
  onClose: () => void;
}

export function OnboardingCard({ title, description, actionLabel = "Entendi", onClose }: OnboardingProps) {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/40 p-4 backdrop-blur-sm">
      <div className="ml-auto mt-auto flex min-h-full max-w-sm items-end">
        <section className="w-full rounded-md border border-zinc-200 bg-white p-4 shadow-xl">
          <header className="mb-2 flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
            <button type="button" aria-label="Fechar onboarding" onClick={onClose}>
              <X className="h-4 w-4 text-zinc-500" />
            </button>
          </header>
          <p className="text-sm text-zinc-600">{description}</p>
          <Button type="button" className="mt-4 w-full" onClick={onClose}>
            {actionLabel}
          </Button>
        </section>
      </div>
    </div>
  );
}
```

## Central de ajuda

```tsx
import { HelpCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";

interface HelpSection {
  title: string;
  content: React.ReactNode;
}

export function HelpCenter({ title = "Ajuda", sections }: { title?: string; sections: HelpSection[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" size="icon" className="fixed bottom-6 right-6 z-40 rounded-full" onClick={() => setOpen(true)} aria-label="Abrir ajuda">
        <HelpCircle className="h-5 w-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4" onClick={() => setOpen(false)}>
          <section className="max-h-[80vh] w-full max-w-xl overflow-auto rounded-md border border-zinc-200 bg-white shadow-xl" onClick={(event) => event.stopPropagation()}>
            <header className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
              <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
              <button type="button" aria-label="Fechar ajuda" onClick={() => setOpen(false)}>
                <X className="h-4 w-4 text-zinc-500" />
              </button>
            </header>

            <div className="space-y-5 p-4">
              {sections.map((section) => (
                <section key={section.title}>
                  <h3 className="text-sm font-semibold text-zinc-900">{section.title}</h3>
                  <div className="mt-1 text-sm text-zinc-600">{section.content}</div>
                </section>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
```

## Integracao

```tsx
const helpSections = [
  {
    title: "Primeiro passo",
    content: <p>Cadastre o primeiro item para liberar os indicadores principais.</p>,
  },
  {
    title: "Exportacao",
    content: <p>Use exportacao quando precisar levar os dados para outra ferramenta.</p>,
  },
];

export function AppShell() {
  const onboarding = useFirstVisit("main-flow-v1");

  return (
    <>
      <main>{/* aplicacao */}</main>
      <HelpCenter sections={helpSections} />
      {onboarding.visible && (
        <OnboardingCard
          title="Comece pelo primeiro cadastro"
          description="A tela principal fica completa depois que voce cria o primeiro registro."
          onClose={onboarding.dismiss}
        />
      )}
    </>
  );
}
```

## Conteudo recomendado

Uma central de ajuda pratica deve ter:

- objetivo do produto em uma frase
- primeira acao recomendada
- explicacao dos principais status
- importacao/exportacao quando existir
- onde encontrar configuracoes
- como corrigir erros comuns

## Checklist

- [ ] Onboarding aparece uma vez por fluxo.
- [ ] Existe botao claro para fechar.
- [ ] A ajuda continua acessivel depois.
- [ ] Conteudo e especifico do produto atual.
- [ ] Modal fecha com clique fora e botao de fechar.
- [ ] Elementos interativos tem `aria-label` quando usam apenas icone.

