# GUIA-START-APP-SCRIPT - SCRIPT PADRAO DE INICIALIZACAO (OBRIGATORIO)

> **O que e**: Um contrato obrigatorio que define que **toda aplicacao web** do `Doktor System-Design` deve trazer um **script de start em Python** que instala dependencias, inicia/reinicia o app e abre o navegador - em **um unico comando**.
>
> **Por que e obrigatorio**: Nem todo mundo que roda o projeto tem facilidade com terminal, e quem automatiza servidor local nao quer reaprender o setup a cada projeto. Um `start_app.py` padronizado torna "rodar o app" uma tarefa de **um comando**, identica em qualquer projeto.
>
> **Quando aplicar**: Sempre que o projeto tiver uma aplicacao web rodavel localmente (frontend, backend ou fullstack). Cada **aplicacao web** do repositorio precisa do seu proprio script.

---

## 1. Regra central

> **Toda aplicacao web e obrigada a ter um `start_app.py` na raiz que: (1) instala dependencias, (2) inicia ou reinicia o app, (3) abre o app no navegador - tudo com um unico comando.**

O objetivo e que qualquer pessoa - mesmo sem experiencia com terminal - consiga rodar o projeto com:

```bash
python start_app.py
```

E que quem automatiza servidor local tenha um ponto de entrada **previsivel e padronizado** para script-ar (CI local, agendadores, atalhos de desktop, etc.).

---

## 2. Contrato obrigatorio do script

Todo `start_app.py` **deve**:

1. **Instalar dependencias** automaticamente (ou pular se ja instaladas).
   - Python: `pip install -r requirements.txt` (de preferencia em venv).
   - Node: `npm install` quando houver `package.json`.
2. **Iniciar o app** - subir o servidor de dev/producao local.
3. **Reiniciar** quando ja houver uma instancia rodando na porta (matar a anterior antes de subir, ou avisar e oferecer reinicio).
4. **Abrir o navegador** automaticamente na URL local correta, **depois** de o servidor estar de pe.
5. **Funcionar cross-platform** (Windows, Linux, macOS) - usar `sys.executable`, `webbrowser`, e nada de comando preso a um SO so.
6. **Falhar de forma clara** - se faltar Python/Node, porta ocupada por outro processo, ou comando inexistente, imprimir mensagem legivel dizendo **o que fazer**.
7. **Nao guardar segredo** - o script orquestra; config sensivel continua em variavel de ambiente (ver Railway / `.env` ignorado).

### Suportar subcomandos minimos

O script deve aceitar pelo menos:

| Comando | O que faz |
|---|---|
| `python start_app.py` | Instala (se preciso) + inicia + abre o navegador. Padrao. |
| `python start_app.py restart` | Mata a instancia atual e sobe de novo. |
| `python start_app.py --no-browser` | Sobe sem abrir o navegador (ideal para servidor/automacao). |
| `python start_app.py --no-install` | Pula a instalacao (quando ja esta tudo instalado). |

---

## 3. Template de referencia (`start_app.py`)

Template cross-platform, sem dependencias externas (so stdlib). Ajuste `CONFIG` por projeto.

```python
#!/usr/bin/env python3
"""
start_app.py - Script padrao de inicializacao (Doktor System-Design).

Instala dependencias, inicia/reinicia o app e abre o navegador com um comando.

Uso:
    python start_app.py                # instala (se preciso) + inicia + abre navegador
    python start_app.py restart        # reinicia a instancia atual
    python start_app.py --no-browser   # sobe sem abrir o navegador
    python start_app.py --no-install   # pula a instalacao de dependencias
"""

import os
import sys
import time
import socket
import argparse
import subprocess
import webbrowser
from pathlib import Path

# ---------------------------------------------------------------------------
# CONFIG - ajuste por projeto
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 8000
URL = f"http://{HOST}:{PORT}"

# Comando que sobe o app. Use sys.executable para o Python certo.
# Exemplos:
#   Django:  [sys.executable, "manage.py", "runserver", f"{HOST}:{PORT}"]
#   FastAPI: [sys.executable, "-m", "uvicorn", "app.main:app", "--host", HOST, "--port", str(PORT)]
#   Flask:   [sys.executable, "-m", "flask", "run", "--host", HOST, "--port", str(PORT)]
START_COMMAND = [sys.executable, "manage.py", "runserver", f"{HOST}:{PORT}"]

# Dependencias: ("python", "requirements.txt") e/ou ("node", None) se houver package.json
INSTALL_PYTHON = ROOT / "requirements.txt"   # None para desativar
INSTALL_NODE = ROOT / "package.json"         # None para desativar
# ---------------------------------------------------------------------------


def log(msg: str) -> None:
    print(f"[start_app] {msg}", flush=True)


def port_in_use(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0


def kill_port(port: int) -> None:
    """Mata o processo que ocupa a porta (cross-platform)."""
    log(f"Liberando a porta {port}...")
    try:
        if os.name == "nt":
            out = subprocess.run(
                ["netstat", "-ano"], capture_output=True, text=True
            ).stdout
            pids = {
                line.split()[-1]
                for line in out.splitlines()
                if f":{port}" in line and "LISTENING" in line
            }
            for pid in pids:
                subprocess.run(["taskkill", "/F", "/PID", pid], capture_output=True)
        else:
            out = subprocess.run(
                ["lsof", "-ti", f"tcp:{port}"], capture_output=True, text=True
            ).stdout
            for pid in out.split():
                subprocess.run(["kill", "-9", pid], capture_output=True)
    except FileNotFoundError:
        log("Nao consegui liberar a porta automaticamente. Feche o processo manualmente.")


def install_deps() -> None:
    if INSTALL_PYTHON and INSTALL_PYTHON.exists():
        log("Instalando dependencias Python (pip install -r requirements.txt)...")
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", str(INSTALL_PYTHON)],
            check=True,
        )
    if INSTALL_NODE and INSTALL_NODE.exists():
        npm = "npm.cmd" if os.name == "nt" else "npm"
        log("Instalando dependencias Node (npm install)...")
        subprocess.run([npm, "install"], cwd=str(ROOT), check=True)


def open_browser_when_ready() -> None:
    log("Aguardando o servidor responder...")
    for _ in range(60):  # ate ~30s
        if port_in_use(HOST, PORT):
            log(f"Servidor de pe. Abrindo {URL}")
            webbrowser.open(URL)
            return
        time.sleep(0.5)
    log("Servidor demorou para subir. Abra manualmente: " + URL)


def main() -> int:
    parser = argparse.ArgumentParser(description="Inicia o app (Doktor System-Design).")
    parser.add_argument("command", nargs="?", default="start", choices=["start", "restart"])
    parser.add_argument("--no-browser", action="store_true", help="nao abre o navegador")
    parser.add_argument("--no-install", action="store_true", help="pula a instalacao")
    args = parser.parse_args()

    os.chdir(ROOT)

    if port_in_use(HOST, PORT):
        if args.command == "restart":
            kill_port(PORT)
            time.sleep(1)
        else:
            log(f"A porta {PORT} ja esta em uso. Use 'python start_app.py restart' para reiniciar.")
            if not args.no_browser:
                webbrowser.open(URL)
            return 0

    if not args.no_install:
        try:
            install_deps()
        except subprocess.CalledProcessError as e:
            log(f"Falha ao instalar dependencias: {e}. Resolva e rode de novo.")
            return 1

    if not args.no_browser:
        # abre o navegador em paralelo, assim que o servidor responder
        import threading
        threading.Thread(target=open_browser_when_ready, daemon=True).start()

    log("Iniciando o app... (Ctrl+C para parar)")
    try:
        return subprocess.run(START_COMMAND).returncode
    except KeyboardInterrupt:
        log("Encerrado pelo usuario.")
        return 0
    except FileNotFoundError:
        log("Comando de start nao encontrado. Confira START_COMMAND no topo do script.")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
```

---

## 4. Ajuste por stack

So o que muda e o `START_COMMAND` e as flags de instalacao.

| Stack | `START_COMMAND` | Instalacao |
|---|---|---|
| **Django** | `[sys.executable, "manage.py", "runserver", f"{HOST}:{PORT}"]` | `requirements.txt` |
| **FastAPI / Uvicorn** | `[sys.executable, "-m", "uvicorn", "app.main:app", "--host", HOST, "--port", str(PORT)]` | `requirements.txt` |
| **Flask** | `[sys.executable, "-m", "flask", "run", "--host", HOST, "--port", str(PORT)]` | `requirements.txt` |
| **Vite / React (dev)** | `["npm.cmd" if os.name=="nt" else "npm", "run", "dev", "--", "--port", str(PORT)]` | `package.json` |
| **Fullstack** | suba backend e frontend (dois processos) e abra o front | ambos |

> Para fullstack, mantenha um `start_app.py` na raiz que orquestra os dois processos, ou um por aplicacao web - o contrato e **um comando para rodar cada app web**.

---

## 5. Documentar no README

O `README.md` do projeto **deve** ter uma secao de execucao que aponte para o script como caminho principal:

```md
## Como rodar

Forma mais simples (instala, inicia e abre no navegador):

\`\`\`bash
python start_app.py
\`\`\`

- `python start_app.py restart` - reinicia
- `python start_app.py --no-browser` - sobe sem abrir o navegador (servidor/automacao)
```

---

## 6. Checklist

- [ ] Existe um `start_app.py` para **cada aplicacao web** do projeto.
- [ ] `python start_app.py` instala dependencias, inicia o app e abre o navegador.
- [ ] Suporta `restart`, `--no-browser` e `--no-install`.
- [ ] Funciona em Windows, Linux e macOS (sem comando preso a um SO).
- [ ] Falha com mensagem clara (sem Python/Node, porta ocupada, comando ausente).
- [ ] Nao contem segredo - config sensivel fica em variavel de ambiente.
- [ ] O `README.md` documenta `python start_app.py` como forma principal de rodar.

---

