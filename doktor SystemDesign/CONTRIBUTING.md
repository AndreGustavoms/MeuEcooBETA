# Contribuindo com o Doktor System-Design

Este repositorio reune padroes tecnicos, guias reutilizaveis, scripts de apoio e documentos operacionais para projetos Doktor.

Antes de propor mudancas, leia:

- [AGENTS.md](AGENTS.md), para entender o roteiro de leitura por tipo de tarefa;
- [core/GUIA_MINIMO_QUALIDADE.md](core/GUIA_MINIMO_QUALIDADE.md), para o contrato minimo de qualidade;
- [docs/GIT-POLITICA-DE-VERSIONAMENTO.md](docs/GIT-POLITICA-DE-VERSIONAMENTO.md), para regras de branch, commit e documentacao viva.

## Como contribuir

1. Faca um fork do repositorio.
2. Crie uma branch descritiva, como `docs/ajusta-guia-readme` ou `fix/link-instalacao`.
3. Faca uma mudanca coesa por vez.
4. Atualize a documentacao afetada no mesmo passo.
5. Abra um Pull Request explicando o que mudou, por que mudou, como foi validado e qual risco sobrou.

## Padroes de escrita

- Escreva para qualquer leitor, sem depender de contexto privado.
- Use exemplos genericos quando houver usuario, URL, caminho local, token, ID ou segredo.
- Evite nomes pessoais de terceiros no corpo dos guias; quando a atribuicao for necessaria, use [NOTICE.md](NOTICE.md).
- Prefira linguagem direta e tecnica.
- Nao deixe TODOs soltos sem contexto. Registre pendencias em `IA.md` ou no documento responsavel.

## Padroes de qualidade

Antes de abrir um PR, confirme:

- A mudanca tem escopo claro.
- Links relativos foram conferidos.
- Scripts alterados foram validados pelo menos no parser ou por `--help`, quando aplicavel.
- `README.md`, `AGENTS.md`, `IA.md` ou documentos em `docs/` foram atualizados se o comportamento mudou.
- Nao ha segredo, token, caminho local privado ou identidade pessoal indevida.

## Hook de commit (Conventional Commits)

Este repositorio usa um hook Git nativo para validar mensagens de commit. Instale-o uma vez apos clonar:

```bash
# Bash / Git Bash / WSL
cp scripts/hooks/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
```

```powershell
# PowerShell
Copy-Item scripts/hooks/commit-msg .git/hooks/commit-msg
```

Formato obrigatorio: `tipo(escopo): descricao no imperativo`

Tipos validos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

Exemplos validos:
```
feat(api): adiciona endpoint de listagem de usuarios
fix(cmd): corrige exibicao de caminhos no output do robocopy
docs(readme): atualiza secao de instalacao
```

## Fluxo interno e externo

Quem trabalha direto neste repositorio segue a politica de versionamento em [docs/GIT-POLITICA-DE-VERSIONAMENTO.md](docs/GIT-POLITICA-DE-VERSIONAMENTO.md): por padrao, commits pequenos direto no `main`.

Contribuicoes externas via fork podem usar branch normalmente e abrir Pull Request.
