# Security

## Escopo

Este documento registra cuidados minimos de seguranca do projeto.

## Dados Sensiveis

Liste os dados sensiveis tratados:

- credenciais;
- dados pessoais;
- tokens;
- arquivos privados;
- informacoes financeiras.

## Variaveis e Segredos

- [ ] `.env` real nao esta versionado.
- [ ] `.env.example` existe sem segredo real.
- [ ] Tokens ficam em cofre, variaveis de ambiente ou painel da plataforma.
- [ ] Logs nao imprimem segredo.

## Autenticacao e Autorizacao

- Metodo:
- Rotas protegidas:
- Perfis/permissoes:
- Reautenticacao para acoes sensiveis:

## Validacao de Entrada

- [ ] Inputs de usuario sao validados.
- [ ] Uploads tem limite e tipo permitido.
- [ ] IDs externos sao checados antes de acesso.

## Dependencias

```bash
comando para auditoria de dependencias
```

## Checklist Antes do Deploy

- [ ] CORS revisado.
- [ ] Debug desativado em producao.
- [ ] Banco de producao nao usa credencial padrao.
- [ ] Rate limit aplicado onde fizer sentido.
- [ ] Backups ou exportacao foram considerados.

## Contato

Informe como reportar vulnerabilidades.
