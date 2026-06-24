# AGENTS.md - Roteiro de Leitura para Agentes de IA

> **O que e**: O ponto de entrada para qualquer agente de IA (de modelos pequenos a grandes) que use o **Doktor System-Design** como padrao de qualidade - seja trabalhando neste repositorio, seja consumindo uma copia dele dentro de outro projeto.
>
> **Quando usar**: Leia este arquivo **primeiro**. Ele diz exatamente quais documentos abrir conforme a tarefa, para que voce nunca precise ler o repositorio inteiro.
>
> **Objetivo**: Direcionar a IA desde o inicio, preservar qualidade minima e reduzir gasto de contexto. Este arquivo e um roteador progressivo, nao um convite para ler tudo.
>
> Para humanos, o mapa completo esta no [README.md](README.md).
> Para navegacao detalhada, consulte [docs/INDICE-GERAL.md](docs/INDICE-GERAL.md).

---

## 1. Protocolo de leitura

1. **Leia sempre** [`core/GUIA_MINIMO_QUALIDADE.md`](core/GUIA_MINIMO_QUALIDADE.md) - o contrato curto de qualidade (menos de 100 linhas). Ele vale para qualquer entrega.
2. **Identifique o tipo de tarefa** e abra apenas os documentos indicados na secao 2.
3. **Consulte `guias/` somente sob demanda**: use a tabela da secao 3 para ver se a funcionalidade pedida ja tem um guia pronto. Se nao tiver, nao leia nenhum.
4. **Nao leia documentos "por garantia".** Cada arquivo deste repositorio so e necessario no cenario indicado abaixo.
5. **Ao levar o padrao para outro projeto**, copie [`templates/AGENTS-template.md`](templates/AGENTS-template.md) como `AGENTS.md` na raiz do projeto destino.

## 2. Roteiro por tipo de tarefa

| Se a tarefa e... | Leia (alem do guia minimo) | Apoio opcional |
|------------------|----------------------------|----------------|
| Construir ou alterar **frontend** | [`core/DESIGN_SYSTEM_FRONTEND.md`](core/DESIGN_SYSTEM_FRONTEND.md) | [`core/PROMPT_BASE_FRONTEND.md`](core/PROMPT_BASE_FRONTEND.md) (montar o prompt inicial) |
| Construir ou alterar **backend** | [`core/DESIGN_SYSTEM_BACKEND.md`](core/DESIGN_SYSTEM_BACKEND.md) | [`core/PROMPT_BASE_BACKEND.md`](core/PROMPT_BASE_BACKEND.md) (montar o prompt inicial) |
| Organizar **estrutura e responsabilidades** do codigo | [`core/DESIGN_SYSTEM_ARQUITETURA.md`](core/DESIGN_SYSTEM_ARQUITETURA.md) | - |
| Aplicar **seguranca** (secrets, autenticacao, validacao, OWASP) | [`core/DESIGN_SYSTEM_SEGURANCA.md`](core/DESIGN_SYSTEM_SEGURANCA.md) | - |
| Projetar ou revisar **API REST** (contratos, status codes, versionamento) | [`core/DESIGN_SYSTEM_API_REST.md`](core/DESIGN_SYSTEM_API_REST.md) | [`core/DESIGN_SYSTEM_BACKEND.md`](core/DESIGN_SYSTEM_BACKEND.md) quando envolver regra de negocio |
| Escrever ou revisar **testes** (unitario, integracao, E2E, mocks) | [`core/DESIGN_SYSTEM_TESTES.md`](core/DESIGN_SYSTEM_TESTES.md) | - |
| Escolher ou justificar **stack/arquitetura** | [`docs/STACK-E-ARQUITETURA.md`](docs/STACK-E-ARQUITETURA.md) | [`docs/PADROES-OBSERVADOS-GITHUB.md`](docs/PADROES-OBSERVADOS-GITHUB.md) quando precisar alinhar com padroes publicos do autor |
| Escrever ou revisar **README / documentacao** | [`core/DESIGN_SYSTEM_README.md`](core/DESIGN_SYSTEM_README.md) | - |
| Aplicar este system design em **projeto novo** | [`docs/GUIA-RAPIDO-USO.md`](docs/GUIA-RAPIDO-USO.md) | [`templates/AGENTS-template.md`](templates/AGENTS-template.md) para orientar a IA no projeto destino; [`templates/`](templates/) para README, IA, deploy, seguranca e ADR |
| Criar uma **aplicacao web rodavel** | [`core/GUIA-START-APP-SCRIPT.md`](core/GUIA-START-APP-SCRIPT.md) - todo app web exige um `start_app.py` na raiz | - |
| Registrar **contexto/memoria do projeto** | [`core/TEMPLATE-CONTEXTO-IA.md`](core/TEMPLATE-CONTEXTO-IA.md) - copie o template e preencha continuamente | - |
| Validar **projeto pronto** | [`docs/CHECKLIST-PROJETO-PRONTO.md`](docs/CHECKLIST-PROJETO-PRONTO.md) | [`scripts/validate-repo.ps1`](scripts/validate-repo.ps1), quando estiver validando este repo |
| **Versionar mudancas neste repositorio** | [`docs/GIT-POLITICA-DE-VERSIONAMENTO.md`](docs/GIT-POLITICA-DE-VERSIONAMENTO.md) - direto no `main` por padrao; commits `tipo: descricao`; doc viva no mesmo commit | [CONTRIBUTING.md](CONTRIBUTING.md) (se for via fork) |
| Preparar **publicacao/divulgacao** do repositorio | [`docs/CHECKLIST-PUBLICACAO.md`](docs/CHECKLIST-PUBLICACAO.md) | [`docs/DECISOES-DE-IDENTIDADE.md`](docs/DECISOES-DE-IDENTIDADE.md) |
| **Baixar/sincronizar** este repo em outro projeto | [`docs/INSTALACAO-EM-OUTROS-PROJETOS.md`](docs/INSTALACAO-EM-OUTROS-PROJETOS.md) - metodos por clone, ZIP, sparse checkout e scripts | - |
| Funcionalidade especifica (arvore, heatmap, deploy...) | o guia correspondente na tabela abaixo | [`docs/GUIAS-OPCIONAIS.md`](docs/GUIAS-OPCIONAIS.md) (descricoes completas) |

## 3. Indice de guias opcionais

Use um guia **somente** quando a tarefa pedir aquela funcionalidade. As palavras-chave servem para casar com o prompt do usuario.

| Guia | O que resolve | Palavras-chave |
|------|---------------|----------------|
| [`guias/frontend/GUIA-ARVORE-HIERARQUICA.md`](guias/frontend/GUIA-ARVORE-HIERARQUICA.md) | Arvore de categorias parent-child (Django self-FK + React recursivo) | arvore, categorias, pastas, menu aninhado, file explorer |
| [`guias/frontend/GUIA-ARVORE-DE-MATERIAIS-DUAL-VIEW.md`](guias/frontend/GUIA-ARVORE-DE-MATERIAIS-DUAL-VIEW.md) | Arvore de materiais com 2 modos de visualizacao e progresso em localStorage | materiais, documentos, lista de leitura, progresso, visto/nao visto |
| [`guias/frontend/GUIA-BACKGROUND-VISUAL.md`](guias/frontend/GUIA-BACKGROUND-VISUAL.md) | Background em camadas com gradiente, simbolos animados e troca de tema | fundo, gradiente, tema claro/escuro, ambientacao |
| [`guias/frontend/GUIA-PARTICULAS-E-GLOW.md`](guias/frontend/GUIA-PARTICULAS-E-GLOW.md) | Particulas flutuantes (Framer Motion) + sistema de glow CSS com niveis | particulas, glow, neon, dark theme, landing page |
| [`guias/frontend/GUIA-HEATMAP-DE-ATIVIDADE.md`](guias/frontend/GUIA-HEATMAP-DE-ATIVIDADE.md) | Calendario de atividade com intensidade visual estilo GitHub | heatmap, streak, habito, atividade diaria, contribuicoes |
| [`guias/frontend/GUIA-CALENDARIO-ACADEMICO.md`](guias/frontend/GUIA-CALENDARIO-ACADEMICO.md) | Calendario mensal interativo com eventos agrupados por data | calendario, eventos, agenda, entregas, utilitarios de data |
| [`guias/frontend/GUIA-SISTEMA-DE-ALERTA-E-GRADE.md`](guias/frontend/GUIA-SISTEMA-DE-ALERTA-E-GRADE.md) | Alerta automatico de proxima aula + grade semanal de horarios | horarios, grade, aulas, alerta, tabela semanal |
| [`guias/frontend/GUIA-ONBOARDING-E-AJUDA.md`](guias/frontend/GUIA-ONBOARDING-E-AJUDA.md) | Onboarding de primeira visita + centro de ajuda permanente | onboarding, tooltip, ajuda, tutorial, primeira visita |
| [`guias/frontend/GUIA-COMPONENTES-UI-COMPOSTOS.md`](guias/frontend/GUIA-COMPONENTES-UI-COMPOSTOS.md) | Kit base Card/Button/Badge em TypeScript + Tailwind, zero dependencias | componentes base, card, button, badge, design kit |
| [`guias/frontend/GUIA-BREADCRUMB-E-METADATA-BAR.md`](guias/frontend/GUIA-BREADCRUMB-E-METADATA-BAR.md) | Breadcrumb tecnico, copiar caminho e metadata bar | breadcrumb, path, copiar, metadata, arquivo, repositorio |
| [`guias/backend/GUIA-BACKEND-CPF.md`](guias/backend/GUIA-BACKEND-CPF.md) | Geracao, validacao e normalizacao de CPF com testes e guardrails | cpf, validacao de documento, dados sinteticos, formulario |
| [`guias/backend/GUIA-CRIPTOGRAFIA-CIFRA-DE-CESAR.md`](guias/backend/GUIA-CRIPTOGRAFIA-CIFRA-DE-CESAR.md) | Cifra de Cesar tradicional e numerica + normalizacao de acentos + web (Brython) | criptografia, cifra, encode/decode, educacional |
| [`guias/integracao/GUIA-INTEGRACAO-API-GITHUB.md`](guias/integracao/GUIA-INTEGRACAO-API-GITHUB.md) | Coleta de repositorios GitHub com token, paginacao, retry e rate limit | github api, importar repositorios, portfolio, rate limit |
| [`guias/integracao/GUIA-SCRAPING-MULTIFORMATO.md`](guias/integracao/GUIA-SCRAPING-MULTIFORMATO.md) | Pipelines de scraping com Playwright, parsers offline e persistencia auditavel | scraping, playwright, crawler, etl, coleta de dados |
| [`guias/integracao/GUIA-DEPLOY-RAILWAY.md`](guias/integracao/GUIA-DEPLOY-RAILWAY.md) | Deploy de backend no Railway (PaaS): build, banco, HTTPS, logs | deploy, hospedagem, producao, railway, backend online |

## 4. Regras deste repositorio (resumo)

Valem para agentes alterando **este** repositorio; a fonte completa e [`docs/GIT-POLITICA-DE-VERSIONAMENTO.md`](docs/GIT-POLITICA-DE-VERSIONAMENTO.md).

- **Git**: commite direto no `main` por padrao; branch **so** para feature grande, refatoracao significativa ou alto risco. Commits no formato `tipo(escopo): descricao no imperativo` - tipos validos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`. Um hook nativo em `scripts/hooks/commit-msg` rejeita mensagens fora do padrao.
- **Documentacao viva**: ao mudar comportamento, estrutura ou comandos, atualize README, `docs/`, guias e `IA.md` afetados **no mesmo commit**.
- **Linguagem**: escrita open source - acessivel a qualquer leitor, sem valores hardcoded, caminhos locais ou contexto privado (referencia: [`core/DESIGN_SYSTEM_README.md`](core/DESIGN_SYSTEM_README.md), secao 3.5).

## 5. O que este repositorio nao e

- **Nao e codigo de producao** - e documentacao de padroes; o unico codigo executavel sao os instaladores em [`scripts/`](scripts/).
- **Identidade parcialmente definida** - nome, autoria e comando global ja foram decididos; consulte [`docs/DECISOES-DE-IDENTIDADE.md`](docs/DECISOES-DE-IDENTIDADE.md) antes de tratar a stack como preferencia pessoal publica.
- **Nao e checklist cego** - o valor esta em abrir so o necessario, manter `IA.md` atualizado e validar o que foi entregue.
