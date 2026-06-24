# Guia Deploy Railway

## Quando usar

Use Railway para publicar backends, workers e servicos pequenos ou medios que precisam de URL publica, HTTPS, variaveis de ambiente, banco gerenciado e logs sem operar servidor manualmente.

Casos comuns:

- API Django, FastAPI, Flask, Express, Nest ou equivalente;
- worker ou bot com processo continuo;
- job agendado;
- scraper autorizado;
- banco Postgres, MySQL, Redis ou Mongo gerenciado;
- ambiente de staging simples;
- projeto que precisa sair do local para uma URL publica rapidamente.

## Quando nao usar

Nao use Railway como padrao automatico quando o projeto exigir:

- infraestrutura on-premise obrigatoria;
- compliance que impeca PaaS externo;
- GPU dedicada pesada;
- controle fino de rede, kernel ou orquestracao;
- escala que ja justifique Kubernetes, ECS, GKE, AKS ou infra propria;
- custo previsivel por contrato enterprise em outro provedor.

## Resultado esperado

Ao aplicar este guia, o backend deve ter:

- build reproduzivel;
- start command claro;
- porta lida de `PORT`;
- variaveis e segredos no Railway;
- banco gerenciado, quando necessario;
- dominio HTTPS;
- logs acessiveis;
- deploy por GitHub autodeploy ou `railway up`;
- checklist de producao antes de divulgacao.

## Fontes oficiais verificadas

- Railway CLI: https://docs.railway.com/cli
- `railway init`: https://docs.railway.com/cli/init
- `railway add`: https://docs.railway.com/cli/add
- `railway up`: https://docs.railway.com/cli/up
- `railway login`: https://docs.railway.com/cli/login
- Railway variables: https://docs.railway.com/variables
- Railway domains: https://docs.railway.com/cli/domain

## Conceitos centrais

| Conceito | Papel |
|---|---|
| Workspace | Conta ou area onde projetos ficam agrupados |
| Project | Produto ou aplicacao |
| Environment | Ambiente isolado, como `production` ou `staging` |
| Service | Processo deployavel, como API, worker ou banco |
| Deployment | Versao publicada de um service |

O CLI trabalha sobre um project, environment e service linkados ao diretorio atual.

## 1. Instalar e autenticar

Instale o CLI conforme a documentacao oficial do Railway para o seu sistema operacional.

Depois valide:

```bash
railway --version
railway login
railway whoami
```

Em ambiente sem navegador, use login browserless:

```bash
railway login --browserless
```

Em CI ou automacao, use variavel de ambiente. A documentacao do Railway diferencia:

| Variavel | Uso |
|---|---|
| `RAILWAY_TOKEN` | Token de projeto para deploy e operacoes dentro de um projeto |
| `RAILWAY_API_TOKEN` | Token de conta/workspace para operacoes mais amplas |

Nao defina as duas ao mesmo tempo.

## 2. Fluxo rapido: deploy da pasta atual

Dentro da pasta do backend:

```bash
railway init --name nome-do-projeto
railway add --service api
railway up
railway domain
```

Uso:

- `railway init` cria um projeto e linka o diretorio atual.
- `railway add --service api` cria um service vazio chamado `api`.
- `railway up` compacta a pasta atual, respeita `.gitignore`/`.railwayignore` e faz deploy.
- `railway domain` configura dominio para o service.

Opcoes uteis de `railway up`:

| Comando | Quando usar |
|---|---|
| `railway up` | Deploy local com stream de logs |
| `railway up --detach` | Enviar deploy sem ficar preso no stream |
| `railway up --ci` | CI, stream de build e saida controlada |
| `railway up --service api` | Deploy para service especifico |
| `railway up --environment staging` | Deploy para ambiente especifico |

## 3. Deploy por GitHub

Para producao, prefira conectar o repositorio ao Railway e usar autodeploy pelo GitHub. O Railway ja faz build e deploy quando o branch configurado recebe push.

Regra:

- use GitHub Actions para testes, lint, type-check e validacoes;
- nao crie workflow so para redeployar no Railway se o autodeploy nativo ja cobre o caso;
- documente branch de producao e branch de staging.

Criar service a partir de repo:

```bash
railway add --repo owner/repo
```

## 4. Banco de dados

Adicionar banco gerenciado:

```bash
railway add --database postgres
```

Outras opcoes comuns: `mysql`, `redis`, `mongo`.

Regra:

1. O app le a URL do banco por variavel de ambiente.
2. Credenciais nao entram no codigo.
3. Migracoes devem rodar com comando explicito e reversivel.
4. Backup e retencao precisam ser decididos antes de dados reais.

## 5. Variaveis e segredos

Railway variables sao disponibilizadas no build, no runtime, em `railway run <COMMAND>` e em `railway shell`.

Comandos uteis:

```bash
railway variable set "SECRET_KEY=valor"
railway variable set "DEBUG=False" --skip-deploys
railway variable list
railway variable list --kv
railway variable delete SECRET_KEY
```

Regras:

- segredos ficam no Railway, nao no repositorio;
- `.env` local e permitido apenas como apoio temporario e nunca deve ser a fonte principal;
- novas variaveis do codigo devem ser registradas no Railway no mesmo ciclo de mudanca;
- logs nao podem imprimir valores de segredo;
- documente variaveis obrigatorias no README do projeto consumidor.

Rodar comando local com variaveis do Railway:

```bash
railway run python manage.py migrate
railway shell
```

## 6. Porta e start command

O service deve escutar na porta indicada pela variavel `PORT`.

Exemplo Python:

```python
import os

port = int(os.environ.get("PORT", "8000"))
```

Exemplo `railway.json`:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
  }
}
```

Use Dockerfile apenas quando Nixpacks/Railpack nao atenderem o ambiente necessario.

## 7. Operacao do dia a dia

```bash
railway status
railway logs
railway open
railway redeploy
railway restart
railway down
railway link
railway environment
```

Registre em `IA.md` do projeto consumidor:

- nome do project;
- services;
- environments;
- branch de deploy;
- variaveis obrigatorias, sem valores;
- comando de migracao;
- URL publica;
- pendencias de dominio customizado.

## 8. Falhas de login e autorizacao

Se `railway login`, `railway whoami`, `railway link` ou `railway up` falharem por autenticacao duas vezes seguidas, pare e acione o operador humano. Nao rode loop de tentativas.

Checklist de recuperacao:

```bash
railway logout
railway login --browserless
railway whoami
```

Se for automacao:

1. Gere token no dashboard do Railway.
2. Configure somente uma variavel: `RAILWAY_TOKEN` ou `RAILWAY_API_TOKEN`.
3. Rode `railway whoami` ou o comando alvo novamente.

Quando o CLI nao cooperar, use a interface web:

1. Abra o dashboard do Railway.
2. Crie ou selecione o project.
3. Conecte o repositorio GitHub.
4. Configure variables.
5. Gere dominio.
6. Acompanhe build e logs pela interface.

## 9. Checklist antes de publicar

- [ ] App le config de variaveis de ambiente.
- [ ] Nenhum segredo foi commitado.
- [ ] `PORT` e usado no start command.
- [ ] Build local ou CI passa.
- [ ] Migrations foram testadas em ambiente controlado.
- [ ] Banco esta provisionado, se necessario.
- [ ] Healthcheck ou rota raiz responde.
- [ ] Dominio HTTPS foi gerado e testado.
- [ ] Logs nao vazam segredos.
- [ ] `production` e `staging` estao separados quando houver risco.
- [ ] Autodeploy esta configurado para o branch correto.
- [ ] Rollback/redeploy foi entendido antes de divulgar a URL.

## 10. Referencia rapida

| Objetivo | Comando |
|---|---|
| Login | `railway login` |
| Login sem navegador | `railway login --browserless` |
| Usuario autenticado | `railway whoami` |
| Criar project | `railway init --name nome` |
| Criar service | `railway add --service api` |
| Criar banco | `railway add --database postgres` |
| Deploy local | `railway up` |
| Deploy sem stream | `railway up --detach` |
| Deploy CI | `railway up --ci` |
| Gerar/configurar dominio | `railway domain` |
| Setar variavel | `railway variable set "K=V"` |
| Listar variaveis | `railway variable list` |
| Rodar com vars | `railway run <comando>` |
| Abrir shell com vars | `railway shell` |
| Ver status | `railway status` |
| Ver logs | `railway logs` |
| Abrir dashboard | `railway open` |

## 11. Criterio de pronto

O deploy esta pronto quando uma pessoa consegue:

1. reconstruir o service a partir do repositorio;
2. saber quais variaveis configurar;
3. rodar migracoes;
4. acessar logs;
5. validar dominio HTTPS;
6. entender como voltar para um deploy anterior;
7. operar sem depender da conversa original que criou o deploy.
