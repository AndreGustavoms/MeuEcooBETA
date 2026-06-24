# Curadoria dos Guias Importados

Este documento define como revisar e evoluir os guias importados sem perder o valor tecnico original e sem manter marcas pessoais herdadas.

## Objetivo

Transformar os guias em material proprio do Doktor System-Design, com linguagem consistente, exemplos genericos, atribuicao legal centralizada e utilidade pratica para projetos reais.

## Estado atual

- Os guias foram importados e normalizados para ASCII.
- Assinaturas pessoais foram removidas do corpo dos arquivos.
- Atribuicao legal ficou em `NOTICE.md` e `LICENSE`.
- Alguns textos perderam acentos e podem ter termos menos naturais por causa da normalizacao.
- O conteudo tecnico principal foi preservado.

## Prioridade de revisao

| Prioridade | Guias | Motivo |
|------------|-------|--------|
| Alta | `core/GUIA_MINIMO_QUALIDADE.md`, `core/DESIGN_SYSTEM_BACKEND.md`, `core/DESIGN_SYSTEM_FRONTEND.md`, `docs/STACK-E-ARQUITETURA.md` | Sao lidos com mais frequencia e definem padroes gerais. |
| Media | `core/PROMPT_BASE_BACKEND.md`, `core/PROMPT_BASE_FRONTEND.md`, `core/DESIGN_SYSTEM_README.md`, `core/GUIA-START-APP-SCRIPT.md` | Afetam execucao assistida por IA e experiencia de projeto. |
| Media | `guias/integracao/GUIA-DEPLOY-RAILWAY.md`, `guias/integracao/GUIA-SCRAPING-MULTIFORMATO.md`, `guias/integracao/GUIA-INTEGRACAO-API-GITHUB.md` | Tem impacto operacional e risco maior quando usados incorretamente. |
| Baixa | Guias visuais muito especificos em `guias/frontend/` | Uteis como referencia, mas devem ser usados sob demanda. |
| Baixa | Guias educacionais/backend pontuais | Bons exemplos, mas menos centrais para o repositorio. |

## Checklist por guia

Ao revisar um guia, confirme:

- [ ] O titulo descreve o padrao, nao o projeto de onde veio.
- [ ] O texto usa linguagem geral e aplicavel a qualquer projeto.
- [ ] Exemplos usam placeholders genericos.
- [ ] Nao ha autor, assinatura, link pessoal ou projeto pessoal no corpo do guia.
- [ ] O guia explica quando usar e quando nao usar.
- [ ] O guia inclui riscos, limites e criterios de validacao.
- [ ] Links relativos funcionam.
- [ ] O arquivo permanece ASCII, salvo decisao contraria.

## Padrao de abertura recomendado

Cada guia revisado deve comecar com:

```text
# Nome do Guia

## Quando usar

...

## Quando nao usar

...

## Resultado esperado

...
```

## Como registrar progresso

Atualize esta tabela conforme os guias forem revisados.

| Arquivo | Status | Observacao |
|---------|--------|------------|
| `core/GUIA_MINIMO_QUALIDADE.md` | Revisado | Estrutura clara, links relativos validos e conteudo alinhado ao repositorio. |
| `docs/STACK-E-ARQUITETURA.md` | Revisado | Baseline tecnica criada, integrada no README, AGENTS e indice core. |
| `core/DESIGN_SYSTEM_BACKEND.md` | Revisado | Reescrito e alinhado com `docs/STACK-E-ARQUITETURA.md`. |
| `core/DESIGN_SYSTEM_FRONTEND.md` | Revisado | Reescrito como padrao geral de frontend, sem identidade visual herdada. |
| `core/DESIGN_SYSTEM_README.md` | Revisado | Reescrito como padrao neutro e pratico para READMEs. |
| `core/PROMPT_BASE_BACKEND.md` | Revisado | Reescrito com prompt curto, completo, checklist e anti-padroes. |
| `core/PROMPT_BASE_FRONTEND.md` | Revisado | Reescrito com prompt curto, completo, checklist e anti-padroes. |
| `core/GUIA-START-APP-SCRIPT.md` | Revisado | Estrutura e template mantidos; links e ASCII validados. |
| `guias/integracao/GUIA-DEPLOY-RAILWAY.md` | Revisado | Reescrito no padrao Doktor, com comandos conferidos na documentacao oficial do Railway. |
| `guias/integracao/GUIA-SCRAPING-MULTIFORMATO.md` | Revisado | Abertura padronizada; guardrails, limites, testes e criterios de pronto preservados. |
| `guias/integracao/GUIA-INTEGRACAO-API-GITHUB.md` | Revisado | Reescrito no padrao Doktor, sem origem de projeto especifico e com escopos/rate limit alinhados a documentacao oficial do GitHub. |
| `guias/frontend/GUIA-BACKGROUND-VISUAL.md` | Revisado | Reescrito como padrao generico de background em camadas, sem blocos quebrados. |
| `guias/frontend/GUIA-CALENDARIO-ACADEMICO.md` | Revisado | Reescrito como padrao generico de calendario mensal, sem blocos quebrados. |
| `guias/frontend/GUIA-PARTICULAS-E-GLOW.md` | Revisado | Reescrito como padrao generico de particulas e glow, sem blocos quebrados. |
| `guias/frontend/GUIA-COMPONENTES-UI-COMPOSTOS.md` | Revisado | Reescrito como kit proprio e compacto de UI, alinhado ao estilo operacional observado. |
| `guias/frontend/GUIA-BREADCRUMB-E-METADATA-BAR.md` | Revisado | Criado a partir de elementos utilitarios observados: caminho navegavel, copiar e metadata bar. |
| `guias/frontend/GUIA-ARVORE-HIERARQUICA.md` | Revisado | Reescrito como padrao generico de arvore parent-child, sem referencia a projeto especifico. |
| `guias/frontend/GUIA-ARVORE-DE-MATERIAIS-DUAL-VIEW.md` | Revisado | Reescrito como explorador de materiais com progresso e dois modos de visualizacao. |
| `guias/frontend/GUIA-HEATMAP-DE-ATIVIDADE.md` | Revisado | Reescrito como calendario de intensidade generico, sem dependencia de produto especifico. |
| `guias/frontend/GUIA-ONBOARDING-E-AJUDA.md` | Revisado | Reescrito como onboarding curto e central de ajuda declarativa. |
| `guias/frontend/GUIA-SISTEMA-DE-ALERTA-E-GRADE.md` | Revisado | Reescrito como agenda semanal generica com alerta de proximo evento. |
| `guias/backend/GUIA-BACKEND-CPF.md` | Revisado | Reescrito como guia backend generico, com contratos, testes e guardrails de dados pessoais. |
| `guias/backend/GUIA-CRIPTOGRAFIA-CIFRA-DE-CESAR.md` | Revisado | Reescrito como guia educacional de cifra, com aviso claro de nao uso para seguranca real. |

## Regra de ouro

Um guia so deve virar "padrao Doktor" quando uma pessoa conseguir aplicar a recomendacao sem conhecer o projeto original de onde ela veio.
