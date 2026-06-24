# Guia Rapido de Uso

Este guia mostra como aplicar o Doktor System-Design em um projeto novo sem ler o repositorio inteiro.

O objetivo pratico e deixar a IA orientada desde o primeiro pedido: contrato minimo claro, memoria operacional curta e guias sob demanda. O Doktor deve reduzir retrabalho e consumo de contexto, nao adicionar burocracia.

## Quando usar

Use quando voce quer iniciar, revisar ou organizar um projeto com padroes claros de arquitetura, documentacao, qualidade e apoio por IA.

## Quando nao usar

Nao use como checklist cego. Se o projeto for muito pequeno, aplique apenas o minimo necessario: README, `IA.md`, stack real e validacao objetiva.

## Escolha o tamanho da adocao

| Nivel | Use quando | Inclua |
|-------|------------|--------|
| Minimo | Script, estudo pequeno ou prototipo curto | `AGENTS.md`, `README.md`, `IA.md`, guia minimo e stack real |
| Recomendado | Projeto que outra pessoa ou IA deve continuar depois | Minimo + checklist de pronto, template de README e contexto IA |
| Completo | App web, API, fullstack ou projeto publicavel | Recomendado + design system de frontend/backend, deploy, seguranca e guias sob demanda |

Comece pelo menor nivel que ainda permita responder: o que e o projeto, como roda, como valida e quais decisoes ja foram tomadas.

## Fluxo de 5 minutos

1. Crie a estrutura base no projeto destino:

```text
AGENTS.md
README.md
IA.md
docs/
core/
```

2. Copie o roteiro raiz para agentes:

```text
templates/AGENTS-template.md -> AGENTS.md
```

3. Copie os arquivos essenciais:

```text
core/GUIA_MINIMO_QUALIDADE.md
core/DESIGN_SYSTEM_API_REST.md
core/DESIGN_SYSTEM_ARQUITETURA.md
core/DESIGN_SYSTEM_README.md
core/DESIGN_SYSTEM_SEGURANCA.md
core/DESIGN_SYSTEM_TESTES.md
core/TEMPLATE-CONTEXTO-IA.md
docs/STACK-E-ARQUITETURA.md
docs/CHECKLIST-PROJETO-PRONTO.md
```

4. Use os templates:

| Necessidade | Template |
|-------------|----------|
| Roteiro para IA | [../templates/AGENTS-template.md](../templates/AGENTS-template.md) |
| README inicial | [../templates/README-template.md](../templates/README-template.md) |
| Memoria operacional IA | [../templates/IA-template.md](../templates/IA-template.md) |
| Deploy | [../templates/DEPLOY-template.md](../templates/DEPLOY-template.md) |
| Seguranca | [../templates/SECURITY-template.md](../templates/SECURITY-template.md) |
| Decisao arquitetural | [../templates/ADR-0001-template.md](../templates/ADR-0001-template.md) |

5. Escolha a stack no contexto correto:

| Tipo de projeto | Caminho recomendado |
|-----------------|--------------------|
| Frontend app | React + TypeScript + Vite + Tailwind |
| Frontend simples | HTML + CSS + JavaScript |
| Backend CRUD/API | Python + Django + DRF |
| Fullstack JS pragmatico | React + TypeScript + Node + PostgreSQL |
| Script/automacao | Python ou PowerShell conforme ambiente |

6. Copie documentos extras somente quando a tarefa pedir:

| Quando pedir... | Copie/consulte |
|-----------------|----------------|
| Frontend | `core/DESIGN_SYSTEM_FRONTEND.md` |
| Backend | `core/DESIGN_SYSTEM_BACKEND.md` |
| API REST, contratos ou status codes | `core/DESIGN_SYSTEM_API_REST.md` |
| Estrutura, camadas ou organizacao de codigo | `core/DESIGN_SYSTEM_ARQUITETURA.md` |
| Secrets, auth, permissao ou dados sensiveis | `core/DESIGN_SYSTEM_SEGURANCA.md` |
| Testes, cobertura ou validacao automatica | `core/DESIGN_SYSTEM_TESTES.md` |
| App web rodavel | `core/GUIA-START-APP-SCRIPT.md` |
| Guia especifico | Apenas o arquivo correspondente em `guias/` |

7. Antes de considerar pronto, rode a validacao real do projeto:

```bash
comando de teste, lint ou validacao manual documentada
```

Se voce estiver validando uma copia completa deste repositorio, rode:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/validate-repo.ps1
```

No Windows PowerShell antigo:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/validate-repo.ps1
```

## Por tipo de tarefa

### Novo frontend

Leia:

- [../core/DESIGN_SYSTEM_FRONTEND.md](../core/DESIGN_SYSTEM_FRONTEND.md)
- [../core/DESIGN_SYSTEM_ARQUITETURA.md](../core/DESIGN_SYSTEM_ARQUITETURA.md)
- [../guias/frontend/GUIA-COMPONENTES-UI-COMPOSTOS.md](../guias/frontend/GUIA-COMPONENTES-UI-COMPOSTOS.md)
- [../guias/frontend/GUIA-BREADCRUMB-E-METADATA-BAR.md](../guias/frontend/GUIA-BREADCRUMB-E-METADATA-BAR.md), se houver caminho tecnico ou arquivo

Entregue:

- componentes base em `components/ui`;
- estados de loading, vazio e erro;
- layout mobile e desktop;
- README com setup e validacao.

### Novo backend

Leia:

- [../core/DESIGN_SYSTEM_ARQUITETURA.md](../core/DESIGN_SYSTEM_ARQUITETURA.md)
- [../core/DESIGN_SYSTEM_BACKEND.md](../core/DESIGN_SYSTEM_BACKEND.md)
- [../core/DESIGN_SYSTEM_API_REST.md](../core/DESIGN_SYSTEM_API_REST.md), se houver API HTTP
- [../core/DESIGN_SYSTEM_SEGURANCA.md](../core/DESIGN_SYSTEM_SEGURANCA.md)
- [../core/DESIGN_SYSTEM_TESTES.md](../core/DESIGN_SYSTEM_TESTES.md)
- [../core/PROMPT_BASE_BACKEND.md](../core/PROMPT_BASE_BACKEND.md)
- [../docs/STACK-E-ARQUITETURA.md](STACK-E-ARQUITETURA.md)

Entregue:

- contratos de API claros;
- validacao de entrada;
- testes minimos;
- docs de variaveis e deploy;
- registro em `IA.md`.

### Novo fullstack

Leia primeiro:

- [../core/GUIA_MINIMO_QUALIDADE.md](../core/GUIA_MINIMO_QUALIDADE.md)
- [../core/DESIGN_SYSTEM_ARQUITETURA.md](../core/DESIGN_SYSTEM_ARQUITETURA.md)
- [../core/DESIGN_SYSTEM_FRONTEND.md](../core/DESIGN_SYSTEM_FRONTEND.md)
- [../core/DESIGN_SYSTEM_BACKEND.md](../core/DESIGN_SYSTEM_BACKEND.md)
- [../core/DESIGN_SYSTEM_API_REST.md](../core/DESIGN_SYSTEM_API_REST.md), se houver API HTTP
- [../core/DESIGN_SYSTEM_SEGURANCA.md](../core/DESIGN_SYSTEM_SEGURANCA.md)
- [../core/DESIGN_SYSTEM_TESTES.md](../core/DESIGN_SYSTEM_TESTES.md)

Depois escolha guias opcionais apenas quando a funcionalidade aparecer.

## Primeiro pedido para a IA

Use este formato ao iniciar um projeto com o Doktor:

```text
Use o AGENTS.md deste projeto como roteiro.
Leia primeiro core/GUIA_MINIMO_QUALIDADE.md e IA.md.
Depois abra apenas os documentos necessarios para esta tarefa.

Objetivo do projeto:
[descreva em uma frase]

Tarefa agora:
[descreva a primeira entrega]

Stack desejada ou restricao:
[preencha se ja souber, senao peca para justificar]

Criterio de pronto:
[como validar que a entrega funcionou]
```

## Regra pratica

O Doktor nao deve deixar o projeto mais pesado. Ele deve deixar mais facil responder:

- o que esta sendo construido;
- como roda;
- como valida;
- quais decisoes ja foram tomadas;
- o que falta para publicar.
