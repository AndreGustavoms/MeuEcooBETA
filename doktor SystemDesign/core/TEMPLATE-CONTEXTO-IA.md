# Template de Contexto IA

Use este arquivo como base para criar `IA.md` em projetos desenvolvidos com apoio de IA.

## Quando usar

Use em qualquer projeto que precise preservar contexto entre sessoes, agentes ou modelos diferentes.

## Quando nao usar

Nao use como diario longo. O arquivo deve guardar decisoes, estado, riscos e validacoes relevantes, nao transcrever conversa.

## Resultado esperado

Um unico arquivo que permite retomar o projeto rapidamente, entendendo:

- objetivo;
- stack;
- decisoes;
- pendencias;
- validacoes;
- bugs relevantes;
- integracoes externas;
- limites conhecidos.

## Como usar

1. Copie este arquivo para a raiz do projeto destino como `IA.md`.
2. Preencha as secoes iniciais no primeiro setup.
3. Atualize sempre que houver decisao tecnica, mudanca de escopo, bug importante ou validacao relevante.
4. Nao registre secrets, tokens, senhas ou dados privados.

## Template

````markdown
# IA.md - Contexto Operacional

## Objetivo do projeto

[YYYY-MM-DD] Descreva o objetivo principal, publico e prioridade.

## Estado atual

- O que ja esta implementado.
- O que esta em progresso.
- O que ainda nao foi feito.

## Stack e dependencias

- Frontend:
- Backend:
- Banco:
- Deploy:
- Testes:

## Decisoes de arquitetura

- [YYYY-MM-DD] Decisao: motivo e impacto.

## Decisoes de design e convencoes

- [YYYY-MM-DD] Convencao de pastas, commits, naming, UI ou API.

## Testes importantes

- [YYYY-MM-DD] `comando`: resultado e o que valida.

## Bugs e fixes relevantes

- [YYYY-MM-DD] BUG: causa e fix aplicado.

## Integracoes e servicos externos

- Servico:
- Como esta configurado:
- Onde ficam variaveis:
- Observacao de seguranca:

## Pendencias

- [ ] Pendente 1.
- [ ] Pendente 2.

## Resumos de decisao

Use quando houver decisao complexa:

```text
[YYYY-MM-DD] CONTEXTO:
ALTERNATIVAS:
DECISAO:
VALIDACAO:
```

Nao registre chain of thought interno. Registre apenas informacao tecnica util, verificavel e retomavel.
````

## Regra de manutencao

Atualize o `IA.md` no mesmo commit da mudanca relevante. Contexto desatualizado conta como documentacao quebrada.
