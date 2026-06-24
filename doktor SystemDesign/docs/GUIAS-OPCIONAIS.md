# Guias - Padroes Especificos

A pasta [`guias/`](../guias/) contem **padroes reutilizaveis por dominio**, organizados para consulta sob demanda. Diferente do `core/`, estes arquivos sao **opcionais** - use apenas quando o projeto precisar daquela funcionalidade.

> Voltar ao [README](../README.md). Agentes de IA: o indice compacto destes guias, com palavras-chave para casar com o prompt, esta em [`AGENTS.md`](../AGENTS.md).

Cada guia responde a tres perguntas:

- Qual problema ele resolve
- Quando usar e quando nao usar
- Em que tipo de sistema vale reutiliza-lo

## Frontend

### Arvore Hierarquica

Padrao de **exploracao hierarquica** para categorias, pastas, areas, topicos ou menus, com componente React recursivo e opcao de backend parent-child.

**Quando usar:** explorador de categorias/pastas, menus hierarquicos, qualquer dado em arvore parent-child.

[Ver guia](../guias/frontend/GUIA-ARVORE-HIERARQUICA.md)

### Background Visual

Padrao de **background visual em camadas** com gradiente, simbolos animados e troca de tema.

**Quando usar:** calculadoras, paginas educacionais, dashboards tecnicos, interfaces com profundidade visual.

[Ver guia](../guias/frontend/GUIA-BACKGROUND-VISUAL.md)

### Heatmap de Atividade

Padrao de **calendario de atividade com intensidade visual** no estilo GitHub.

**Quando usar:** visualizacao de atividade por dia/semana/mes, dashboards de uso, analise temporal.

[Ver guia](../guias/frontend/GUIA-HEATMAP-DE-ATIVIDADE.md)

### Onboarding e Ajuda

Padrao de **primeira experiencia do usuario** com onboarding leve, destaque contextual e centro de ajuda permanente.

**Quando usar:** produtos com multiplas funcionalidades, interfaces com curva de aprendizado, dashboards.

[Ver guia](../guias/frontend/GUIA-ONBOARDING-E-AJUDA.md)

### Componentes UI Compostos

Kit de **componentes UI compostos** com Card, Button, Badge e utilitario de classnames. TypeScript + Tailwind, leve e facil de transportar entre projetos.

**Quando usar:** qualquer projeto React + Tailwind que precise de componentes base consistentes.

[Ver guia](../guias/frontend/GUIA-COMPONENTES-UI-COMPOSTOS.md)

### Breadcrumb e Metadata Bar

Padrao de **cabecalho tecnico utilitario** com caminho navegavel, botao de copiar e linha de metadata/ultima atividade.

**Quando usar:** telas de arquivo, repositorio, documento, dataset, modulo, pipeline ou qualquer estrutura com caminho tecnico.

[Ver guia](../guias/frontend/GUIA-BREADCRUMB-E-METADATA-BAR.md)

### Particulas e Sistema de Glow

**Background de particulas flutuantes** com Framer Motion e **sistema completo de glow CSS** com 5 niveis de intensidade controlados por CSS variable.

**Quando usar:** landing pages, portfolios, dashboards dark-theme, interfaces com efeitos de glow.

[Ver guia](../guias/frontend/GUIA-PARTICULAS-E-GLOW.md)

### Arvore de Materiais Dual-View

**Arvore de materiais com dois modos de visualizacao** (simples e dinamico), tracking de itens vistos via localStorage e contagem de progresso por pasta.

**Quando usar:** bibliotecas de materiais, exploradores de documentos, listas de leitura com progresso.

[Ver guia](../guias/frontend/GUIA-ARVORE-DE-MATERIAIS-DUAL-VIEW.md)

### Calendario Academico

**Calendario mensal interativo** com grade de dias, agrupamento de eventos por data, status do usuario e 11 funcoes de data sem dependencias externas.

**Quando usar:** dashboards academicos, calendarios de entregas, agendas de projeto.

[Ver guia](../guias/frontend/GUIA-CALENDARIO-ACADEMICO.md)

### Sistema de Alerta e Grade de Horarios

**Sistema de alerta automatico de proximo evento** com parser de grade, cores por local/tipo e tabela semanal com coluna sticky.

**Quando usar:** paineis academicos, agendas de time, turnos, reunioes recorrentes e apps de horarios.

[Ver guia](../guias/frontend/GUIA-SISTEMA-DE-ALERTA-E-GRADE.md)

## Backend

### Backend CPF

Padrao de **backend logico para CPF** com algoritmo, contratos, fluxo de validacao, matriz de testes e guardrails para dados reais.

**Quando usar:** geracao sintetica de CPF para testes, validacao backend, normalizacao de entrada, formularios.

[Ver guia](../guias/backend/GUIA-BACKEND-CPF.md)

### Criptografia Cifra de Cesar

Sistemas reutilizaveis da **Cifra de Cesar em Python**: cifra tradicional, cifra numerica, normalizacao de acentos e interface web com Brython.

**Quando usar:** apps educacionais de criptografia, playgrounds web, utilitarios de encode/decode.

[Ver guia](../guias/backend/GUIA-CRIPTOGRAFIA-CIFRA-DE-CESAR.md)

## Integracao

### Integracao API GitHub

Padrao de **coleta robusta de repositorios no GitHub** com autenticacao por token, paginacao, deduplicacao, retry com backoff e tratamento de rate limit.

**Quando usar:** importadores de portfolio, dashboards de projetos, sincronizadores, ETLs de inventario tecnico.

[Ver guia](../guias/integracao/GUIA-INTEGRACAO-API-GITHUB.md)

### Scraping Multiformato

Padrao de **scraping multiformato** com Playwright, parsers offline, JSON embutido, captura manual assistida, persistencia idempotente, URL publica segura, testes e guardrails operacionais.

**Quando usar:** coletores, catalogos, ETLs, comparadores, importadores e pipelines que precisam transformar paginas heterogeneas em dados estruturados auditaveis.

[Ver guia](../guias/integracao/GUIA-SCRAPING-MULTIFORMATO.md)

### Deploy Railway (backend padrao online)

**Servico padrao para colocar backend online**. Railway (PaaS) faz build, deploy, banco gerenciado, variaveis de ambiente, dominio HTTPS e logs sem gerenciar servidor. Inclui fluxo de CLI, conceitos, deploy por Git ou `railway up`, bancos, variaveis e checklist.

**Quando usar:** APIs REST, back-ends de apps, workers, bots, scrapers agendados e qualquer servico que precise ficar online com URL publica e HTTPS.

> **Aviso:** se login/autorizacao falhar repetidamente, o guia instrui o agente a parar e acionar o operador humano com passo a passo claro, em vez de insistir em loop.

[Ver guia](../guias/integracao/GUIA-DEPLOY-RAILWAY.md)
