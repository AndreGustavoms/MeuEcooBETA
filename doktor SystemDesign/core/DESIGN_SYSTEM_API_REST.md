# Design System - Padrao de API REST

> **O que e**: Padrao obrigatorio de contrato, nomenclatura, status codes, versionamento e tratamento de erro para APIs REST em projetos Doktor.
>
> **Quando usar**: Em qualquer projeto que exponha ou consuma uma API HTTP. Define como a API deve se comportar de forma previsivel e consistente.

---

## 1. Principio central

**Uma API e um contrato publico. Quem consome nao deve ser surpreendido.**

Consistencia e mais importante do que criatividade. Endpoints, respostas e erros previsiveis reduzem bugs, facilitam integracao e tornam a API autodocumentavel.

---

## 2. Nomenclatura de endpoints

Use **substantivos no plural** para recursos. Verbos ficam no metodo HTTP, nao na URL.

| Errado | Certo |
|--------|-------|
| `GET /getUsers` | `GET /users` |
| `POST /createUser` | `POST /users` |
| `GET /getUserById/1` | `GET /users/1` |
| `POST /deleteUser/1` | `DELETE /users/1` |
| `GET /user_list` | `GET /users` |

### Hierarquia de recursos

Use aninhamento para expressar relacao entre recursos:

```
GET    /users/1/orders        lista pedidos do usuario 1
GET    /users/1/orders/42     pedido 42 do usuario 1
POST   /users/1/orders        cria pedido para o usuario 1
DELETE /users/1/orders/42     cancela pedido 42 do usuario 1
```

Limite o aninhamento a **dois niveis**. Mais do que isso indica que o recurso filho merece uma rota propria.

### Kebab-case para URLs

```
/product-categories   correto
/productCategories    errado
/product_categories   evitar
```

---

## 3. Metodos HTTP

Use o metodo correto para cada operacao:

| Metodo | Uso | Idempotente | Body |
|--------|-----|-------------|------|
| `GET` | Busca dados, nunca altera estado | Sim | Nao |
| `POST` | Cria novo recurso | Nao | Sim |
| `PUT` | Substitui recurso inteiro | Sim | Sim |
| `PATCH` | Atualiza campos especificos | Nao | Sim |
| `DELETE` | Remove recurso | Sim | Nao |

**GET nunca deve causar efeito colateral.** Chamar a mesma rota GET varias vezes deve sempre retornar o mesmo resultado sem alterar dados.

---

## 4. Status codes

Use o codigo correto. Resposta com corpo de erro mas status 200 e um dos maiores antipadroes de API.

### Sucesso (2xx)

| Codigo | Quando usar |
|--------|-------------|
| `200 OK` | Leitura ou atualizacao bem-sucedida |
| `201 Created` | Recurso criado com sucesso (POST) |
| `204 No Content` | Operacao bem-sucedida sem corpo de resposta (DELETE) |

### Erro do cliente (4xx)

| Codigo | Quando usar |
|--------|-------------|
| `400 Bad Request` | Dados invalidos, payload mal formado |
| `401 Unauthorized` | Nao autenticado (token ausente ou invalido) |
| `403 Forbidden` | Autenticado, mas sem permissao para aquele recurso |
| `404 Not Found` | Recurso nao existe |
| `409 Conflict` | Conflito de estado (ex: email ja cadastrado) |
| `422 Unprocessable Entity` | Dados validos sintaticamente, mas invalidos semanticamente |
| `429 Too Many Requests` | Rate limit atingido |

### Erro do servidor (5xx)

| Codigo | Quando usar |
|--------|-------------|
| `500 Internal Server Error` | Erro inesperado no servidor |
| `503 Service Unavailable` | Servico temporariamente indisponivel |

**Nunca retorne 500 para erro de validacao de input.** Se o cliente mandou dado errado, e 400 ou 422.

---

## 5. Formato de resposta

Mantenha estrutura consistente em todas as rotas.

### Sucesso

```json
{
  "data": {
    "id": 1,
    "name": "Andre Gustavo",
    "email": "andre@exemplo.com"
  }
}
```

Para listas com paginacao:

```json
{
  "data": [
    { "id": 1, "name": "Andre Gustavo" },
    { "id": 2, "name": "Maria Silva" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20,
    "total_pages": 5
  }
}
```

### Erro

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Os dados enviados sao invalidos.",
    "details": [
      { "field": "email", "message": "Email invalido." },
      { "field": "password", "message": "Minimo de 8 caracteres." }
    ]
  }
}
```

Regras do envelope de erro:

- `code`: identificador maquina-legivel em UPPER_SNAKE_CASE. Permite o cliente tratar erros especificos.
- `message`: descricao humana, generica o suficiente para exibir ao usuario.
- `details`: opcional, lista de erros por campo para validacao de formulario.
- **Nunca inclua stack trace, query SQL ou caminho de arquivo em producao.**

---

## 6. Versionamento

Versione a API desde o inicio. Mudar contrato sem versionar quebra clientes existentes.

### Versao na URL (recomendado)

```
/api/v1/users
/api/v2/users
```

- Simples, explicito, facil de testar no browser e em ferramentas como Postman.
- Use `v1`, `v2`  - nunca datas ou nomes.

### Quando criar uma nova versao

- Ao remover um campo da resposta.
- Ao alterar o tipo de um campo.
- Ao mudar o comportamento de uma rota existente de forma incompativel.

Adicionar campos opcionais ou novas rotas **nao exige** nova versao.

### Deprecacao

Antes de remover uma versao:

1. Documente a deprecacao com data de remocao.
2. Retorne o header `Deprecation: true` nas respostas da versao antiga.
3. Mantenha a versao antiga pelo periodo acordado (minimo 3-6 meses em APIs publicas).

---

## 7. Paginacao

Nunca retorne listas sem limite. Uma tabela com 1 milhao de registros nao deve ser retornada de uma vez.

### Padrao por offset/page

```
GET /users?page=2&per_page=20
```

Resposta inclui `meta` com `total`, `page`, `per_page`, `total_pages`.

### Padrao por cursor (para volumes grandes)

```
GET /users?cursor=eyJpZCI6MTAwfQ&limit=20
```

Resposta inclui `next_cursor` e `has_more`.

Use cursor quando a lista pode mudar enquanto o cliente pagina (evita registros duplicados ou pulados).

---

## 8. Filtros, ordenacao e busca

Use query params de forma consistente:

```
GET /users?status=active                     filtra por status
GET /users?sort=created_at&order=desc        ordena
GET /users?q=andre                           busca textual
GET /users?status=active&sort=name&page=1    combinado
```

- `sort`: nome do campo.
- `order`: `asc` ou `desc`.
- `q`: busca textual generica.
- Campos de filtro: nome do proprio campo (`status`, `role`, `created_after`).

---

## 9. Autenticacao na API

- Use **Bearer token** no header `Authorization`:
  ```
  Authorization: Bearer <token>
  ```
- Nunca passe token em query param (`?token=...`)  - aparece em logs de servidor.
- Tokens de API de longa duracao devem ter escopo restrito (leitura, escrita, admin).
- Rotas publicas devem ser excecao documentada, nao padrao.

---

## 10. Documentacao

Toda API deve ter documentacao atualizada. Use o template `templates/DEPLOY-template.md` como base e documente:

- Autenticacao necessaria.
- Cada endpoint: metodo, URL, parametros, corpo esperado, respostas possiveis.
- Exemplos de request e response para os casos principais.
- Codigos de erro especificos da aplicacao.

Ferramentas recomendadas: **Swagger/OpenAPI** para APIs publicas ou de time. Para APIs internas simples, um `docs/API.md` bem escrito ja resolve.

---

## 11. Checklist de API por entrega

- [ ] Endpoints usam substantivos no plural e kebab-case.
- [ ] Metodo HTTP correto para cada operacao.
- [ ] Status codes corretos  - sem erro com status 200.
- [ ] Formato de resposta consistente com envelope `data` / `error`.
- [ ] Erros nao expoem stack trace ou detalhes internos.
- [ ] Listas sempre paginadas com `meta`.
- [ ] API versionada desde a primeira rota publica.
- [ ] Autenticacao via Bearer token no header.
- [ ] Documentacao atualizada com exemplos de request e response.
- [ ] Validacao de input retorna 400/422 com `details` por campo.
