# Changelog

Todas as mudancas relevantes do Doktor System-Design devem ser registradas aqui.

Formato baseado em Conventional Commits e versoes semanticas.

## [0.2.0] - 2026-06-23

### Adicionado

- `core/DESIGN_SYSTEM_ARQUITETURA.md`: padrao de organizacao por camadas, nomenclatura, regras de funcao e arquivo, antipadroes e checklist de entrega.
- `core/DESIGN_SYSTEM_SEGURANCA.md`: padrao obrigatorio de seguranca com secrets, variaveis de ambiente, autenticacao, autorizacao, validacao de entrada, SQL injection, XSS, headers HTTP, OWASP Top 10 e checklist de entrega.
- `core/DESIGN_SYSTEM_API_REST.md`: padrao obrigatorio de contrato HTTP com nomenclatura de endpoints, metodos, status codes, envelope data/error, versionamento, paginacao, filtros, autenticacao Bearer e checklist de entrega.
- `core/DESIGN_SYSTEM_TESTES.md`: padrao obrigatorio de testes com tipos (unitario, integracao, E2E), piramide, nomenclatura, estrutura AAA, mocks, cobertura minima e checklist de entrega.
- `scripts/hooks/commit-msg`: hook Git nativo para validar Conventional Commits antes de cada commit, sem dependencias externas.
- `templates/AGENTS-template.md`: template copiavel do AGENTS.md para projetos destino, com roteiro por tipo de tarefa incluindo os quatro novos padroes.
- `assets/social-preview.png`: imagem 1280x640 para o social preview do GitHub.
- Instrucoes de instalacao do hook em `docs/GIT-POLITICA-DE-VERSIONAMENTO.md`.

### Alterado

- `AGENTS.md`: roteiro expandido com entradas para arquitetura, seguranca, API REST e testes; regra de commit atualizada para Conventional Commits completo com tipos validos e mencao ao hook.
- `docs/CORE-PADROES-OBRIGATORIOS.md`: adicionadas secoes de seguranca, API REST, arquitetura e testes; secao duplicada de API REST removida.
- Politica de commits expandida: estrutura com escopo opcional, tipos style e test adicionados, modo imperativo e regra de nao misturar refatoracao com feature.
- Pasta destino do comando doktor renomeada de "Padrao de qualidade - Doktor System-Design" para "doktor SystemDesign".
- Repositorio renomeado no GitHub para Doktor-SystemDesign; remote local e todas as referencias internas atualizados.
- README, AGENTS, indice e template de AGENTS alinhados com todos os novos padroes de core.
- Caracteres nao ASCII normalizados em DESIGN_SYSTEM_API_REST.md, DESIGN_SYSTEM_SEGURANCA.md e DESIGN_SYSTEM_TESTES.md.
- Validador ASCII ajustado para ignorar assets binarios, como imagens PNG.

### Corrigido

- `scripts/cmd/doktor-command.cmd`: output exibia caminhos completos da pasta temporaria; corrigido para usar exit code do robocopy com SHA do commit.
- `AGENTS.md` e `docs/CORE-PADROES-OBRIGATORIOS.md`: linhas duplicadas de API REST removidas.

### Validado

- Scripts de instalacao testados em ambiente real: PowerShell (install, doktor, idempotencia, uninstall), CMD (install, doktor, uninstall), Bash/Git Bash (sintaxe, install e uninstall com rsync fake).
- Comando doktor sincroniza 58 arquivos a partir da URL https://github.com/AndreGustavoms/Doktor-SystemDesign.git.
- Hook commit-msg instalado e ativo neste repositorio.

## [0.1.0] - 2026-06-22

### Adicionado

- Estrutura inicial do Doktor System-Design.
- Core de frontend, backend, README, qualidade minima, prompts e contexto IA.
- Guias opcionais de frontend, backend e integracao.
- Identidade Doktor com autoria local e atribuicao de origem.
- Templates copiaveis para README, IA, deploy, seguranca e ADR.
- Guia rapido de uso.
- Checklist de projeto pronto.
- Validador PowerShell e workflow GitHub Actions.
- Scripts do comando global doktor.
- Template de AGENTS.md para orientar agentes de IA em projetos destino.

### Alterado

- README, AGENTS e guia rapido deixam explicito que o Doktor e um padrao leve, progressivo e focado em economia de contexto.
- Checklist e template de README consideram AGENTS.md parte do fluxo de projetos com apoio de IA.
- Guia rapido diferencia adocao minima, recomendada e completa, com prompt inicial para orientar a IA.

### Validado

- ASCII, links Markdown relativos, texto quebrado, parser PowerShell e help CMD.
- Tag v0.1.0 publicada apos confirmacao do remoto correto.
