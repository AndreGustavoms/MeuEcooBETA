# Validacao dos Scripts

Este documento registra como validar os scripts do comando global `doktor` sem confundir teste de parser com instalacao real.

## Estado atual

Validacao completa realizada em Windows (Git Bash + PowerShell 5.1 + CMD), em 2026-06-23:

| Script | Validacao | Resultado |
|--------|-----------|-----------|
| `scripts/powershell/install-doktor-powershell.ps1` | Instalacao real, `doktor -Help`, `doktor` em pasta temp, desinstalacao, perfil limpo | OK |
| `scripts/cmd/install-doktor-cmd.cmd` | Instalacao real em `%LOCALAPPDATA%\doktor`, PATH atualizado, reinstalacao | OK |
| `scripts/cmd/doktor-command.cmd` | `doktor` em pasta temp (58 arquivos sincronizados), segunda rodada | OK |
| `scripts/bash-zsh/install-doktor-bash-zsh.sh` | `bash -n` (sintaxe), instalacao e desinstalacao com rsync fake no Git Bash (Windows) | OK |

**Notas:**

- PowerShell: `doktor` detecta "Ja estava atualizado" corretamente via comparacao MD5.
- CMD: `doktor` sempre aplica o sync (robocopy compara por timestamp, nao hash); idempotente em conteudo, mas nao exibe "ja atualizado". Comportamento documentado e esperado.
- Bash/Zsh: requer `rsync` instalado. Git Bash para Windows nao inclui `rsync` por padrao; instale via MSYS2 (`pacman -S rsync`) ou use no Linux/macOS/WSL onde `rsync` ja esta disponivel.
- `doktor-command.cmd` corrigido: removida exibicao de caminhos completos da pasta temporaria no output (flag `/FP` e secao de preview removidos; output usa exit code do robocopy).

## O que ainda pode ser validado em ambiente adicional

- Testar Bash/Zsh nativo no Linux, macOS ou WSL com `rsync` disponivel.
- Confirmar que `doktor` em Zsh detecta corretamente o `.zshrc`.

## Validacao segura automatizada

Rode:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/validate-repo.ps1
```

Ou, se tiver PowerShell 7:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/validate-repo.ps1
```

Essa validacao cobre:

- ASCII em arquivos de texto;
- links Markdown relativos;
- texto quebrado conhecido;
- parser do instalador PowerShell;
- help do comando CMD;
- presenca dos scripts esperados.

## Validacao manual recomendada

Use uma pasta temporaria fora de qualquer projeto importante:

```powershell
$tmp = Join-Path $env:TEMP ("doktor-real-test-" + [guid]::NewGuid())
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
Set-Location $tmp
```

Depois teste o terminal desejado.

### PowerShell

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\caminho\Doktor-System-Design\scripts\powershell\install-doktor-powershell.ps1
```

Abra um novo terminal e rode:

```powershell
doktor -Help
doktor
```

### CMD

```cmd
C:\caminho\Doktor-System-Design\scripts\cmd\install-doktor-cmd.cmd
```

Abra um novo CMD e rode:

```cmd
doktor --help
doktor
```

### Bash/Zsh

```bash
sh /caminho/Doktor-System-Design/scripts/bash-zsh/install-doktor-bash-zsh.sh
```

Abra um novo terminal ou rode `source ~/.bashrc`/`source ~/.zshrc`, depois:

```bash
doktor --help
doktor
```

## Criterio de aceite

O teste real passa quando:

- o comando `doktor --help` ou `doktor -Help` responde;
- `doktor` cria ou atualiza somente a pasta destino;
- arquivos fora da pasta destino nao sao removidos;
- uma segunda execucao informa que ja estava atualizado ou nao aplica mudancas inesperadas.
