#!/usr/bin/env bash
#
# Instalador do comando global "doktor" para Bash/Zsh.

set -euo pipefail

REPO_URL="https://github.com/AndreGustavoms/Doktor-SystemDesign.git"
DEST_NAME="doktor SystemDesign"
BLOCK_BEGIN="# >>> doktor command (managed by install-doktor.sh) >>>"
BLOCK_END="# <<< doktor command (managed by install-doktor.sh) <<<"

if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  C_RESET=$'\033[0m'; C_INFO=$'\033[1;34m'; C_OK=$'\033[1;32m'; C_WARN=$'\033[1;33m'; C_ERR=$'\033[1;31m'; C_DIM=$'\033[2m'
else
  C_RESET=''; C_INFO=''; C_OK=''; C_WARN=''; C_ERR=''; C_DIM=''
fi

log()  { printf '%s[doktor-install]%s %s\n' "$C_INFO" "$C_RESET" "$*"; }
ok()   { printf '%s[doktor-install OK]%s %s\n' "$C_OK" "$C_RESET" "$*"; }
warn() { printf '%s[doktor-install !]%s %s\n' "$C_WARN" "$C_RESET" "$*" >&2; }
err()  { printf '%s[doktor-install X]%s %s\n' "$C_ERR" "$C_RESET" "$*" >&2; }

print_help() {
  sed -n '2,40p' "$0" | sed 's/^# \{0,1\}//'
}

detect_rc_file() {
  local shell_name
  shell_name="$(basename "${SHELL:-}")"
  case "$shell_name" in
    zsh) printf '%s\n' "${ZDOTDIR:-$HOME}/.zshrc" ;;
    bash)
      if [ "$(uname -s)" = "Darwin" ] && [ -f "$HOME/.bash_profile" ]; then
        printf '%s\n' "$HOME/.bash_profile"
      else
        printf '%s\n' "$HOME/.bashrc"
      fi ;;
    *)
      if [ -f "$HOME/.zshrc" ]; then printf '%s\n' "$HOME/.zshrc"
      elif [ -f "$HOME/.bashrc" ]; then printf '%s\n' "$HOME/.bashrc"
      else printf '%s\n' "$HOME/.profile"; fi ;;
  esac
}

check_deps() {
  local missing=()
  command -v git >/dev/null 2>&1 || missing+=(git)
  command -v rsync >/dev/null 2>&1 || missing+=(rsync)
  if [ "${#missing[@]}" -gt 0 ]; then
    err "Dependencias ausentes: ${missing[*]}. Instale-as e rode novamente."
    exit 1
  fi
}

doktor_block() {
  cat <<BLOCK
$BLOCK_BEGIN
doktor() {
  local dest="./$DEST_NAME"
  local repo_url="$REPO_URL"

  if [ "\${1:-}" = "-h" ] || [ "\${1:-}" = "--help" ]; then
    printf '[doktor] Uso: doktor\\n'
    printf '[doktor] Sincroniza o Doktor System-Design em: %s\\n' "\$dest"
    return 0
  fi

  local missing=()
  command -v git >/dev/null 2>&1 || missing+=(git)
  command -v rsync >/dev/null 2>&1 || missing+=(rsync)
  if [ "\${#missing[@]}" -gt 0 ]; then
    printf '[doktor X] Dependencias ausentes: %s\\n' "\${missing[*]}" >&2
    return 1
  fi

  local tmp_dir changes_file source_sha
  tmp_dir="\$(mktemp -d)" || return 1

  printf '[doktor] Clonando %s\\n' "\$repo_url"
  if ! git clone --depth 1 --quiet "\$repo_url" "\$tmp_dir/repo"; then
    printf '[doktor X] Falha ao clonar. Verifique a conexao e o acesso ao repositorio.\\n' >&2
    rm -rf "\$tmp_dir"
    return 1
  fi

  source_sha="\$(git -C "\$tmp_dir/repo" rev-parse --short HEAD 2>/dev/null || printf '?')"
  rm -rf "\$tmp_dir/repo/.git"
  mkdir -p "\$dest" || { rm -rf "\$tmp_dir"; return 1; }

  changes_file="\$(mktemp)" || { rm -rf "\$tmp_dir"; return 1; }
  if ! rsync -a --no-times --omit-dir-times --delete --checksum --itemize-changes "\$tmp_dir/repo/" "\$dest/" > "\$changes_file"; then
    printf '[doktor X] Falha ao sincronizar arquivos.\\n' >&2
    rm -f "\$changes_file"; rm -rf "\$tmp_dir"
    return 1
  fi

  if [ -s "\$changes_file" ]; then
    printf '[doktor OK] Atualizado para %s. Mudancas aplicadas:\\n' "\$source_sha"
    awk '
      /^\\*deleting/ { p=\$0; sub(/^\\*deleting[[:space:]]+/,"",p); printf "  - %s\\n", p; next }
      /^[>c]f/ { p=\$0; sub(/^[^ ]+ /,"",p); printf "  ~ %s\\n", p; next }
    ' "\$changes_file"
  else
    printf '[doktor OK] Ja estava atualizado em %s.\\n' "\$source_sha"
  fi

  rm -f "\$changes_file"; rm -rf "\$tmp_dir"
  printf '[doktor OK] Concluido em %s\\n' "\$dest"
}
$BLOCK_END
BLOCK
}

remove_block() {
  local rc_file="$1"
  [ -f "$rc_file" ] || return 0
  if grep -qF "$BLOCK_BEGIN" "$rc_file"; then
    local tmp
    tmp="$(mktemp)"
    awk -v b="$BLOCK_BEGIN" -v e="$BLOCK_END" '$0 == b {skip=1; next} $0 == e {skip=0; next} skip != 1 {print}' "$rc_file" > "$tmp"
    cat "$tmp" > "$rc_file"
    rm -f "$tmp"
  fi
}

install() {
  check_deps
  local rc_file action
  rc_file="$(detect_rc_file)"
  touch "$rc_file"
  action="instalado"
  if grep -qF "$BLOCK_BEGIN" "$rc_file"; then
    action="atualizado"
    remove_block "$rc_file"
  fi
  { printf '\n'; doktor_block; } >> "$rc_file"
  ok "Comando \"doktor\" $action em: $rc_file"
  log "Abra um novo terminal ou rode: ${C_DIM}source \"$rc_file\"${C_RESET}"
}

uninstall() {
  local rc_file
  rc_file="$(detect_rc_file)"
  if [ -f "$rc_file" ] && grep -qF "$BLOCK_BEGIN" "$rc_file"; then
    remove_block "$rc_file"
    ok "Comando \"doktor\" removido de: $rc_file"
  else
    warn "Nenhuma instalacao do comando \"doktor\" encontrada em: $rc_file"
  fi
}

case "${1:-}" in
  --uninstall|-u) uninstall ;;
  --help|-h) print_help ;;
  ""|--install) install ;;
  *) err "Opcao desconhecida: $1"; print_help; exit 1 ;;
esac
