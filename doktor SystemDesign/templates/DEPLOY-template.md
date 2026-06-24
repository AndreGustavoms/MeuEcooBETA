# Deploy

## Ambiente

| Item | Valor |
|------|-------|
| Plataforma | Railway / Render / VPS / outro |
| Dominio | `https://exemplo.com` |
| Banco | PostgreSQL / SQLite / outro |
| Branch de deploy | `main` |

## Pre-requisitos

- Conta na plataforma.
- Variaveis de ambiente configuradas.
- Banco provisionado, se aplicavel.

## Variaveis de Ambiente

| Variavel | Obrigatoria | Exemplo | Uso |
|----------|-------------|---------|-----|
| `DATABASE_URL` | Sim | `postgres://...` | Banco de dados. |
| `SECRET_KEY` | Sim | `change-me` | Chave da aplicacao. |

Nao coloque valores reais neste arquivo.

## Build

```bash
comando de build
```

## Start

```bash
comando de start
```

## Passo a Passo

1. Configure variaveis.
2. Configure banco.
3. Rode build.
4. Rode migracoes, se houver.
5. Publique.
6. Valide URL publica.

## Validacao Pos-Deploy

- [ ] Pagina ou healthcheck responde.
- [ ] Login/autenticacao funciona, se houver.
- [ ] Banco grava e le dados.
- [ ] Logs nao mostram erro recorrente.
- [ ] Variaveis sensiveis nao aparecem em resposta ou log.

## Rollback

Descreva como voltar para a versao anterior.

## Pendencias

- [ ] Pendente de deploy 1.

