# AGENTS.md - Roteiro de IA do Projeto

> **O que e**: Arquivo raiz para orientar agentes de IA neste projeto.
>
> **Objetivo**: Manter a IA direcionada, preservar qualidade minima e reduzir consumo de contexto. A IA deve ler o minimo necessario para a tarefa, sem abrir documentacao "por garantia".
>
> **Como usar**: Copie este arquivo para `AGENTS.md` na raiz do projeto destino. Se os padroes Doktor ficarem em outra pasta, ajuste os caminhos abaixo.

---

## 1. Principio central

Este arquivo nao e um framework rigido. Ele e um roteador leve:

- define o contrato minimo antes de qualquer entrega;
- aponta quais documentos abrir por tipo de tarefa;
- evita reler guias grandes sem necessidade;
- registra onde a IA deve atualizar contexto, decisoes e validacoes.

## 2. Leitura obrigatoria

1. Leia sempre `core/GUIA_MINIMO_QUALIDADE.md`.
2. Antes de alterar arquivos, leia `IA.md` se ele existir.
3. Use `README.md` para entender setup, comandos e objetivo publico.
4. Depois disso, abra apenas os documentos indicados na secao 3.

Se um arquivo indicado ainda nao existir neste projeto, consulte a copia sincronizada do Doktor System-Design ou copie apenas o documento necessario.

## 3. Roteiro por tipo de tarefa

| Se a tarefa e... | Leia alem do guia minimo |
|------------------|--------------------------|
| Frontend, UI ou UX | `core/DESIGN_SYSTEM_FRONTEND.md` |
| Backend, API, banco ou regra de negocio | `core/DESIGN_SYSTEM_BACKEND.md` |
| API REST, contratos ou status codes | `core/DESIGN_SYSTEM_API_REST.md` |
| Estrutura, camadas ou organizacao de codigo | `core/DESIGN_SYSTEM_ARQUITETURA.md` |
| Seguranca, secrets, auth ou dados sensiveis | `core/DESIGN_SYSTEM_SEGURANCA.md` |
| Testes, cobertura, mocks ou nomenclatura | `core/DESIGN_SYSTEM_TESTES.md` |
| README ou documentacao | `core/DESIGN_SYSTEM_README.md` |
| Stack, arquitetura ou decisao tecnica | `docs/STACK-E-ARQUITETURA.md` |
| Aplicacao web rodavel | `core/GUIA-START-APP-SCRIPT.md` |
| Validar projeto pronto | `docs/CHECKLIST-PROJETO-PRONTO.md` |
| Funcionalidade especifica | Guia opcional correspondente, somente se existir e casar com a tarefa |

## 4. Regras praticas

- Nao leia documentos por garantia.
- Nao invente stack se o projeto ja definiu uma.
- Ao mudar comportamento, comandos, estrutura ou decisao, atualize `README.md`, `IA.md` ou `docs/` no mesmo passo.
- Em app web, entregue `start_app.py` na raiz quando aplicavel.
- Registre validacao objetiva: comando de teste, checklist manual ou motivo de nao haver teste automatico.
- Ao versionar, use Conventional Commits: `tipo(escopo): descricao no imperativo`. Tipos validos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- Nunca exponha segredo, token, dado pessoal ou caminho local privado em documentacao publica.

## 5. Criterio de pronto

Uma entrega so esta pronta quando outra pessoa ou outra IA consegue entender:

- o que mudou;
- por que mudou;
- como rodar;
- como validar;
- qual risco ou limite ainda existe.
