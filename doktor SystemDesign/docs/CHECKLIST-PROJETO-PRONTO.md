# Checklist de Projeto Pronto

Use este checklist antes de chamar um projeto de pronto, entregar para outra pessoa ou publicar.

## Escopo

- [ ] O objetivo do projeto esta claro em uma frase.
- [ ] O que esta fora do escopo foi registrado.
- [ ] A stack real esta documentada.
- [ ] `AGENTS.md` existe quando o projeto usa IA como apoio operacional.
- [ ] As principais decisoes estao em `IA.md` ou `docs/`.

## README

- [ ] Explica o que o projeto faz.
- [ ] Explica como instalar.
- [ ] Explica como rodar.
- [ ] Explica como testar ou validar manualmente.
- [ ] Lista variaveis de ambiente sem segredo real.
- [ ] Aponta para docs importantes.
- [ ] Registra limitacoes conhecidas.

## Frontend

- [ ] Layout funciona em mobile e desktop.
- [ ] Componentes base foram reutilizados.
- [ ] Estados de loading, vazio, erro e sucesso existem.
- [ ] Formularios tem label, validacao e erro claro.
- [ ] Botoes de icone tem `aria-label` ou tooltip.
- [ ] Textos longos nao quebram containers.
- [ ] Cores tem contraste suficiente.

## Backend

- [ ] Entradas sao validadas.
- [ ] Erros tem formato previsivel.
- [ ] Contratos de API usam status codes, paginacao e formato de erro consistentes quando houver API HTTP.
- [ ] Regras de negocio ficam fora de controllers/views quando possivel.
- [ ] Operacoes sensiveis exigem autenticacao/autorizacao.
- [ ] Logs nao gravam segredo.
- [ ] Banco e migracoes estao documentados.
- [ ] Testes cobrem fluxo feliz e erros principais.

## Seguranca

- [ ] `.env` real nao esta versionado.
- [ ] `.env.example` existe quando houver variaveis.
- [ ] Tokens, senhas e chaves nao aparecem no repo.
- [ ] CORS, permissao e auth foram revisados.
- [ ] Dados pessoais tem justificativa e cuidado minimo.
- [ ] Dependencias criticas foram revisadas.

## Deploy

- [ ] Existe `docs/DEPLOY.md` ou equivalente.
- [ ] Plataforma de deploy esta definida.
- [ ] Variaveis de ambiente de producao foram listadas.
- [ ] Comando de build/start esta documentado.
- [ ] Rollback ou re-deploy esta descrito.
- [ ] Logs de producao sao acessiveis.

## Qualidade

- [ ] Estrutura, nomes e responsabilidades seguem o padrao do projeto.
- [ ] Testes automatizados rodam localmente ou ha validacao manual objetiva.
- [ ] CI roda validacoes basicas.
- [ ] `AGENTS.md` aponta apenas para documentos existentes ou para uma copia Doktor sincronizada.
- [ ] Links Markdown relevantes funcionam.
- [ ] Encoding/texto quebrado foi verificado.
- [ ] `IA.md` esta atualizado.
- [ ] O historico Git tem commits pequenos e descritivos.

## Frase de controle

Um projeto esta pronto quando outra pessoa consegue rodar, validar, entender decisoes e continuar o trabalho sem depender da conversa original.
