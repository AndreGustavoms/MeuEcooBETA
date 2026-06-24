@echo off
setlocal EnableDelayedExpansion
rem ============================================================================
rem  install-doktor-cmd.cmd - registra o comando "doktor" no CMD.
rem
rem  >>> PARA QUAL TERMINAL <<<
rem    Shell:    CMD (Prompt de Comando classico)
rem    Sistemas: Windows
rem    Use os outros instaladores se o seu terminal for:
rem      - Bash ou Zsh (Linux, macOS, Git Bash, WSL) -> bash-zsh/install-doktor-bash-zsh.sh
rem      - PowerShell (qualquer SO)                  -> powershell/install-doktor-powershell.ps1
rem
rem  O que faz: copia doktor-command.cmd (ao lado deste arquivo) para
rem  %LOCALAPPDATA%\doktor como "doktor.cmd" e adiciona a pasta ao PATH do
rem  usuario. Depois, abra um novo terminal e use "doktor".
rem
rem  >>> O CMD USA DOIS ARQUIVOS <<<
rem    install-doktor-cmd.cmd (este) -> o INSTALADOR; voce roda uma vez.
rem    doktor-command.cmd            -> o COMANDO "doktor" em si, que este
rem                                     instalador copia para o PATH (como
rem                                     doktor.cmd). Voce nao roda direto.
rem    (No Bash/Zsh e PowerShell o instalador escreve a funcao dentro do arquivo
rem     de config, entao basta um arquivo. No CMD, um comando precisa ser um
rem     arquivo proprio no PATH -- por isso sao dois.)
rem
rem  Uso:
rem    install-doktor-cmd.cmd              instala
rem    install-doktor-cmd.cmd --uninstall  remove
rem ============================================================================

set "SRC=%~dp0doktor-command.cmd"
set "TARGET_DIR=%LOCALAPPDATA%\doktor"
set "TARGET=%TARGET_DIR%\doktor.cmd"

if /I "%~1"=="--uninstall" goto :uninstall
if /I "%~1"=="-u" goto :uninstall

if not exist "%SRC%" (
  echo [doktor-install X] Nao encontrei doktor-command.cmd ao lado deste instalador.
  exit /b 1
)

where git >nul 2>nul
if errorlevel 1 echo [doktor-install !] Aviso: git nao esta no PATH. Instale o Git antes de usar "doktor".

if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
copy /y "%SRC%" "%TARGET%" >nul
if errorlevel 1 (
  echo [doktor-install X] Falha ao copiar doktor.cmd para %TARGET_DIR%.
  exit /b 1
)

rem --- adiciona ao PATH do usuario se ainda nao estiver ---
echo %PATH% | find /I "%TARGET_DIR%" >nul
if errorlevel 1 (
  for /f "skip=2 tokens=2,*" %%A in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%B"
  if defined USER_PATH (
    setx PATH "!USER_PATH!;%TARGET_DIR%" >nul
  ) else (
    setx PATH "%TARGET_DIR%" >nul
  )
  echo [doktor-install OK] Pasta adicionada ao PATH do usuario: %TARGET_DIR%
) else (
  echo [doktor-install] Pasta ja estava no PATH: %TARGET_DIR%
)

echo [doktor-install OK] Comando "doktor" instalado.
echo [doktor-install] Abra um NOVO terminal e rode: doktor
echo [doktor-install]   doktor                  -^> sincroniza o Doktor System-Design
exit /b 0

:uninstall
if exist "%TARGET%" del /q "%TARGET%"
if exist "%TARGET_DIR%" rmdir "%TARGET_DIR%" 2>nul
echo [doktor-install OK] doktor.cmd removido de %TARGET_DIR%.
echo [doktor-install] Remova manualmente "%TARGET_DIR%" do PATH em:
echo [doktor-install]   Painel de Controle ^> Sistema ^> Variaveis de Ambiente (se desejar).
exit /b 0
