# IA.md - Contexto Operacional

## Objetivo atual

Transformar este repositorio em uma base propria de system design, qualidade e guias reutilizaveis para projetos Doktor, aproveitando o que havia de bom no repositorio de referencia sem copiar identidade pessoal de terceiros para o corpo da documentacao.

## Estado atual

- Estrutura importada: `core/`, `docs/`, `guias/`, `scripts/`, `AGENTS.md`, `CONTRIBUTING.md`, `LICENSE`.
- README reescrito para servir como porta de entrada do Doktor System-Design.
- Identidade pessoal separada em `docs/DECISOES-DE-IDENTIDADE.md`.
- Atribuicao legal centralizada em `NOTICE.md` e `LICENSE`.
- Identidade publica definida: Andre Gustavo Melo da Silva, GitHub `AndreGustavoms`, nome `Doktor System-Design`.
- Comando global escolhido: `doktor`, em minusculo.
- Scripts simplificados para sincronizar este repositorio sem submodulos.
- Stack consolidada em `docs/STACK-E-ARQUITETURA.md` como baseline tecnica por contexto.
- `CONTRIBUTING.md` reescrito em tom neutro.
- Checklist de publicacao criado em `docs/CHECKLIST-PUBLICACAO.md`.
- Indice geral criado em `docs/INDICE-GERAL.md`.
- Identidade Doktor criada em `docs/IDENTIDADE-DOKTOR.md`, misturando autoria local, padroes observados e influencia da origem MIT.
- Plano de curadoria dos guias criado em `docs/CURADORIA-DOS-GUIAS.md`.
- `core/GUIA_MINIMO_QUALIDADE.md` e `docs/STACK-E-ARQUITETURA.md` marcados como revisados na curadoria.
- `core/DESIGN_SYSTEM_BACKEND.md` reescrito e marcado como revisado.
- `core/DESIGN_SYSTEM_FRONTEND.md` reescrito e marcado como revisado.
- `core/DESIGN_SYSTEM_README.md` reescrito e marcado como revisado.
- `core/PROMPT_BASE_BACKEND.md` e `core/PROMPT_BASE_FRONTEND.md` reescritos e marcados como revisados.
- `core/GUIA-START-APP-SCRIPT.md` marcado como revisado apos validacao estrutural.
- Guias de integracao revisados: Railway, Scraping Multiformato e GitHub API.
- Leitura dos repositorios publicos de `AndreGustavoms` registrada em `docs/PADROES-OBSERVADOS-GITHUB.md`.
- Guias frontend revisados/criados: Background Visual, Calendario Academico, Particulas e Glow, Componentes UI Compostos, Breadcrumb e Metadata Bar, Arvore Hierarquica, Arvore de Materiais Dual View, Heatmap de Atividade, Onboarding e Ajuda, Sistema de Alerta e Grade.
- Guia rapido de uso, checklist de projeto pronto e templates copiaveis criados.
- Proposito do Doktor reforcado como padrao leve para orientar IA em projetos novos, reduzir consumo de contexto e evitar leitura desnecessaria.
- Template `templates/AGENTS-template.md` criado para ser copiado como `AGENTS.md` na raiz de projetos destino.
- Guia rapido, checklist de projeto pronto e README-template ajustados para tratar `AGENTS.md` como parte do fluxo de projeto com IA.
- `docs/GUIA-RAPIDO-USO.md` passou a separar niveis de adocao (minimo, recomendado e completo) e incluir prompt inicial para IA.
- README, AGENTS, indice, guia rapido e template de AGENTS alinhados aos documentos recentes de API REST, arquitetura, seguranca, testes e hook de commit.
- Asset `assets/social-preview.png` criado para social preview do GitHub; validador ajustado para ignorar assets binarios na checagem ASCII.
- CI simples adicionada com `scripts/validate-repo.ps1` e `.github/workflows/validate.yml`.
- Guias backend CPF e Cifra de Cesar reescritos no padrao Doktor.
- Versao inicial registrada em `VERSION` e `CHANGELOG.md`.
- Scripts de instalacao validados em ambiente real (PowerShell, CMD, Bash/Git Bash).
- Repositorio renomeado no GitHub para `Doktor-SystemDesign`; remote e todas as referencias internas atualizados.
- Pasta destino do comando `doktor` renomeada para `doktor SystemDesign`.
- Hook Git nativo `scripts/hooks/commit-msg` adicionado para validar Conventional Commits; instrucoes em `docs/GIT-POLITICA-DE-VERSIONAMENTO.md`.
- Politica de commits expandida: estrutura com escopo opcional, tipos `style` e `test`, modo imperativo e regra de nao misturar refatoracao com feature.
- `core/DESIGN_SYSTEM_ARQUITETURA.md` criado: organizacao por camadas, nomenclatura, regras de funcao/arquivo, antipadroes e checklist de entrega.
- `core/DESIGN_SYSTEM_SEGURANCA.md` criado: secrets, variaveis de ambiente, autenticacao, autorizacao, validacao de entrada, SQL injection, XSS, headers HTTP, OWASP Top 10 e checklist de entrega.
- `core/DESIGN_SYSTEM_API_REST.md` criado: nomenclatura de endpoints, metodos HTTP, status codes, envelope data/error, versionamento, paginacao, filtros, autenticacao Bearer e checklist de entrega.
- `core/DESIGN_SYSTEM_TESTES.md` criado: tipos de teste, piramide, nomenclatura deve-X-quando-Y, estrutura AAA, mocks, cobertura minima e checklist de entrega.
- `templates/AGENTS-template.md` criado: template copiavel do AGENTS.md para projetos destino, incluindo os quatro novos padroes no roteiro.
- Duplicatas de API REST removidas de `AGENTS.md` e `docs/CORE-PADROES-OBRIGATORIOS.md`.
- `VERSION` atualizado para 0.2.0. Tag `v0.2.0` publicada.

## Decisoes tomadas

- Nao trazer submodulos externos do repositorio de origem.
- Manter atribuicao MIT da origem, sem repetir assinaturas pessoais no fim dos guias.
- Usar ASCII nos arquivos normalizados para evitar texto quebrado vindo da origem.
- Tratar stack como baseline tecnica revisavel do repositorio, nao como preferencia pessoal publica.
- Publicar autoria local como Andre Gustavo Melo da Silva / AndreGustavoms.
- Usar padroes observados no GitHub como direcao inicial, nao como regra cega para todo projeto.
- Misturar influencia Felixo/Felipe como heranca estetica/metodologica documentada, sem transferir autoria pessoal para o README principal ou guias tecnicos.
- Tratar o `AGENTS.md` de projetos destino como roteador leve de contexto: guia minimo sempre, documentos por tipo de tarefa e guias opcionais somente sob demanda.

## Pendencias

- Melhorar gradualmente qualquer guia novo importado.
- Seguir `docs/CURADORIA-DOS-GUIAS.md` para manter os guias opcionais como padroes Doktor revisados.
- Testar Bash/Zsh nativo no Linux, macOS ou WSL com `rsync` disponivel (Git Bash no Windows nao inclui `rsync` por padrao).

## Validacao recente (2026-06-23)

- Scripts de instalacao validados em ambiente real:
  - PowerShell: instalacao, `doktor -Help`, `doktor` em pasta temp (58 arquivos), segunda rodada ("ja atualizado"), desinstalacao e perfil limpo.
  - CMD: instalacao, `doktor` em pasta temp (58 arquivos), desinstalacao. CMD nao detecta "ja atualizado" (robocopy compara por timestamp, nao hash); comportamento esperado documentado.
  - Bash: sintaxe valida, instalacao e desinstalacao testadas no Git Bash (Windows) com rsync fake. Requer `rsync` em ambiente real.
- `doktor-command.cmd` corrigido: removida exibicao de caminhos completos da pasta temporaria no preview do robocopy; output usa exit code.
- Checklist de publicacao e `docs/VALIDACAO-SCRIPTS.md` atualizados com resultados reais.
- Repositorio publicado em `https://github.com/AndreGustavoms/Doktor-SystemDesign`, branch `main`, tag `v0.1.0`.
