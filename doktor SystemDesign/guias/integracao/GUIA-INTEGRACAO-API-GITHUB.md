# Guia Integracao API GitHub

## Quando usar

Use este guia quando um projeto precisar coletar, sincronizar ou enriquecer metadados de repositorios do GitHub com seguranca operacional.

Casos comuns:

- portfolio tecnico;
- dashboard de projetos;
- inventario de repositorios;
- ETL de metadados;
- sincronizacao periodica de linguagens, README, topicos e datas;
- importacao de repositorios publicos e, quando autorizado, privados do usuario autenticado.

## Quando nao usar

Nao use este padrao para:

- coletar repositorios privados de terceiros sem autorizacao explicita;
- contornar permissoes, rate limit ou autenticacao;
- armazenar tokens em repositorio, logs, analytics ou URLs;
- fazer chamadas sem limite de pagina, timeout ou retry controlado;
- depender de scraping do site do GitHub quando a REST API cobre o caso.

## Resultado esperado

Ao aplicar este guia, o projeto deve ter:

- cliente GitHub isolado da UI;
- token tratado como segredo;
- contrato de dados estavel para repositorios;
- paginacao controlada;
- deduplicacao;
- tratamento de `401`, `403`, `404`, `429` e `5xx`;
- leitura de headers de rate limit;
- enriquecimento opcional desacoplado;
- testes com respostas JSON sanitizadas.

## Fontes oficiais verificadas

- GitHub REST API - repositories: https://docs.github.com/en/rest/repos/repos
- GitHub REST API - rate limits: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- GitHub fine-grained token permissions: https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens

## Visao geral

O padrao e composto por 6 camadas:

| Camada | Responsabilidade |
|---|---|
| Token e autenticacao | Ler token de fonte segura e montar headers HTTP |
| Cliente resiliente | Centralizar `fetch`, timeout, retry, backoff e erros |
| Descoberta de repositorios | Listar repositorios publicos e privados autorizados |
| Enriquecimento | Buscar linguagens, README, topicos e arquivos especificos sob demanda |
| Orquestracao | Importar um ou varios perfis sem abortar tudo por uma falha pontual |
| Governanca | Rate limit, logs seguros, mensagens acionaveis e limites operacionais |

## 1. Regra central para publicos e privados

Para comportamento previsivel:

1. Repositorios publicos de qualquer usuario:
   - `GET /users/{username}/repos`
2. Dados do usuario autenticado:
   - `GET /user`
3. Repositorios privados:
   - use `GET /user/repos`
   - somente quando o usuario buscado for o mesmo usuario autenticado;
   - somente quando o token tiver permissao adequada.

Essa separacao evita misturar contexto publico com contexto privado.

## 2. Contrato de dados

Normalize a saida em um objeto unico por repositorio.

```js
function mapGitHubRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || "",
    language: repo.language || "",
    repoUrl: repo.html_url,
    homepage: repo.homepage || "",
    topics: repo.topics || [],
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    private: Boolean(repo.private),
    archived: Boolean(repo.archived),
    defaultBranch: repo.default_branch || "main",
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
  };
}
```

Regras:

1. O contrato nao deve expor token, headers ou resposta bruta inteira.
2. `repoUrl` deve apontar para `html_url`.
3. Campos opcionais devem ter fallback previsivel.
4. Dados de enriquecimento entram em campos separados ou em tabela propria.

## 3. Token e headers

Em backend, leia o token de variavel de ambiente. Em frontend puro, use storage local apenas quando o usuario inserir o proprio token e entender o escopo.

```js
const API_VERSION = "2022-11-28";

function getGitHubHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": API_VERSION,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}
```

Permissoes recomendadas:

| Caso | Permissao minima |
|---|---|
| Repositorios publicos | Sem token ou token com leitura de metadata |
| Repositorios privados do usuario autenticado | Fine-grained token com `Metadata: read` nos repositorios permitidos |
| README/arquivo especifico em repositorio privado | `Contents: read` quando o endpoint exigir conteudo |

Nao coloque token em query string. Use sempre header `Authorization`.

## 4. Cliente HTTP resiliente

Centralize a chamada HTTP para evitar retry inconsistente.

```js
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRateLimitInfo(response) {
  return {
    limit: Number(response.headers.get("x-ratelimit-limit") || 0),
    remaining: Number(response.headers.get("x-ratelimit-remaining") || 0),
    reset: Number(response.headers.get("x-ratelimit-reset") || 0),
    retryAfter: Number(response.headers.get("retry-after") || 0),
  };
}

async function githubFetch(url, { token, attempts = 3 } = {}) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const response = await fetch(url, {
      headers: getGitHubHeaders(token),
    });

    const rateLimit = getRateLimitInfo(response);

    if (response.status === 429 || (response.status === 403 && rateLimit.remaining === 0)) {
      const error = new Error("GitHub rate limit atingido.");
      error.status = response.status;
      error.rateLimit = rateLimit;
      throw error;
    }

    if (response.status >= 500 && response.status < 600 && attempt < attempts - 1) {
      lastError = new Error(`GitHub indisponivel: ${response.status}`);
      await sleep(500 * Math.pow(2, attempt));
      continue;
    }

    return response;
  }

  throw lastError || new Error("Falha inesperada na chamada GitHub.");
}
```

Regra de rate limit: se `x-ratelimit-remaining` for `0`, nao repita antes do horario indicado por `x-ratelimit-reset`. Se `retry-after` existir, respeite esse valor.

## 5. Paginacao

Use `per_page=100` e pare quando a pagina vier vazia ou menor que o tamanho solicitado. Mantenha teto operacional.

```js
async function fetchPaged(urlBuilder, { token, maxPages = 10 } = {}) {
  const items = [];

  for (let page = 1; page <= maxPages; page++) {
    const response = await githubFetch(urlBuilder(page), { token });

    if (!response.ok) {
      const error = new Error(`GitHub respondeu ${response.status}.`);
      error.status = response.status;
      error.rateLimit = getRateLimitInfo(response);
      throw error;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) break;

    items.push(...data);
    if (data.length < 100) break;
  }

  return items;
}
```

## 6. Coleta de repositorios

```js
async function fetchAuthenticatedLogin(token) {
  if (!token) return null;

  const response = await githubFetch("https://api.github.com/user", { token });
  if (response.status === 401) {
    throw new Error("Token GitHub invalido ou expirado.");
  }
  if (!response.ok) return null;

  const data = await response.json();
  return data.login || null;
}

export async function fetchUserRepositories(username, { token, includePrivate = true } = {}) {
  const normalizedUsername = username.trim();
  const reposByUrl = new Map();

  const publicRepos = await fetchPaged(
    (page) =>
      `https://api.github.com/users/${encodeURIComponent(normalizedUsername)}/repos` +
      `?per_page=100&page=${page}&sort=updated`,
    { token, maxPages: 10 }
  );

  for (const repo of publicRepos) {
    reposByUrl.set(repo.html_url, repo);
  }

  if (token && includePrivate) {
    const authenticatedLogin = await fetchAuthenticatedLogin(token);
    const sameUser =
      authenticatedLogin &&
      authenticatedLogin.toLowerCase() === normalizedUsername.toLowerCase();

    if (sameUser) {
      const privateRepos = await fetchPaged(
        (page) =>
          "https://api.github.com/user/repos" +
          `?per_page=100&page=${page}&sort=updated&visibility=all&affiliation=owner`,
        { token, maxPages: 10 }
      );

      for (const repo of privateRepos) {
        if ((repo.owner?.login || "").toLowerCase() === normalizedUsername.toLowerCase()) {
          reposByUrl.set(repo.html_url, repo);
        }
      }
    }
  }

  return Array.from(reposByUrl.values())
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .map(mapGitHubRepo);
}
```

## 7. Enriquecimento opcional

Busque detalhes sob demanda para nao gastar rate limit sem necessidade.

| Dado | Endpoint | Observacao |
|---|---|---|
| Linguagens | `GET /repos/{owner}/{repo}/languages` | Retorna mapa de linguagem para bytes |
| README | `GET /repos/{owner}/{repo}/readme` | Use `Accept: application/vnd.github.raw+json` quando quiser conteudo cru |
| Arquivo especifico | `GET /repos/{owner}/{repo}/contents/{path}` | Exige atencao a branch/ref |
| Topicos | `GET /repos/{owner}/{repo}/topics` | Pode exigir metadata read em token fine-grained |

## 8. Entrada flexivel por URL

Aceite URL completa ou `owner/repo`.

```js
export function parseGitHubRepoInput(value) {
  const input = value.trim();
  const patterns = [
    /github\.com\/([^/]+)\/([^/?#]+)(?:[/?#].*)?$/i,
    /^([^/]+)\/([^/?#]+)$/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ""),
      };
    }
  }

  return null;
}
```

## 9. Orquestracao em lote

Para importar varios perfis:

1. Receba uma lista de usernames ou URLs.
2. Normalize cada entrada.
3. Execute cada perfil de forma independente.
4. Acumule erros por perfil.
5. Deduplicate por `repoUrl` ou `fullName`.
6. Compare `updatedAt` com o estado salvo.
7. Mostre resumo de novos, atualizados, inalterados e erros.

Nao aborte o lote inteiro porque um usuario retornou `404` ou rate limit.

## 10. Seguranca e governanca

- Token e segredo.
- Backend: use variavel de ambiente ou cofre de segredos.
- Frontend: salve token apenas se ele for informado pelo proprio usuario.
- Nunca envie token para logs, analytics ou mensagens de erro.
- Mostre escopo necessario antes de pedir token.
- Separe publicos e privados no contrato de UI.
- Nao exponha repositorios privados em exportacao publica por padrao.
- Respeite `x-ratelimit-reset` e `retry-after`.
- Use teto de paginas e de repositorios por execucao.

## 11. Testes obrigatorios

| Teste | O que valida |
|---|---|
| Headers | `Accept`, API version e `Authorization` sem vazar token |
| Paginacao | Para na pagina vazia, menor que 100 ou no teto |
| Publicos | Usa `/users/{username}/repos` |
| Privados | Usa `/user/repos` somente para o usuario autenticado |
| Deduplicacao | Remove duplicatas por `html_url` |
| Rate limit | Interrompe quando `remaining=0` e expoe reset |
| Retry | Repete apenas falhas transitorias |
| Parse de entrada | Aceita URL completa e `owner/repo` |
| Erros | Trata `401`, `403`, `404`, `429` e `5xx` |

## 12. Criterio de pronto

A integracao esta pronta quando:

- token nao aparece em logs;
- chamadas tem teto de pagina;
- rate limit e tratado;
- repositorios privados so aparecem quando autorizados;
- contrato de saida e estavel;
- enriquecimento e opcional;
- testes usam fixtures JSON sanitizadas;
- a UI ou API mostra resumo acionavel de sucesso, erro e limites.

