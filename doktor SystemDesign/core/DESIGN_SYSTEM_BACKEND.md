# Design System Backend

Este documento define o padrao de qualidade para backends no Doktor System-Design. Use-o para avaliar arquitetura, contratos, persistencia, integracoes, testes, seguranca e manutencao.

Para escolher stack, consulte tambem [../docs/STACK-E-ARQUITETURA.md](../docs/STACK-E-ARQUITETURA.md).

## 1. Papel deste documento

Use este guia para responder:

- A arquitetura esta simples e coerente?
- As responsabilidades estao bem separadas?
- A API tem contrato previsivel?
- O dominio esta protegido de detalhes de framework, banco e integracoes?
- O sistema esta testavel, observavel e seguro?
- As decisoes tecnicas facilitam manutencao futura?

Este arquivo nao e prompt operacional para IA. Para isso, use [PROMPT_BASE_BACKEND.md](PROMPT_BASE_BACKEND.md).

## 2. Principios obrigatorios

### Simplicidade antes de sofisticacao

- Prefira a solucao mais simples que resolva o problema real.
- Nao introduza filas, microservicos, caches, camadas ou abstracoes sem necessidade concreta.
- O codigo deve ser facil de entender por leitura direta.

### Separacao explicita de responsabilidades

- Entrada e saida HTTP ficam na camada de API.
- Regras de negocio ficam fora de controllers/views.
- Acesso a banco fica em repositorios, models ou camada equivalente.
- Integracoes externas ficam isoladas em clientes/adapters.
- Configuracao, autenticacao, logging e infraestrutura ficam separados do dominio.

Arquivos "faz-tudo" indicam necessidade de refatoracao.

### Contratos previsiveis

- Requests, responses, DTOs, serializers e erros devem seguir formato consistente.
- Mudanca quebradora precisa ser explicita, documentada e justificada.
- Campos, nomes e tipos devem permanecer estaveis quando ja forem parte do contrato publico.

### Testabilidade como requisito

- Regras criticas precisam ser testaveis sem depender de acoplamento excessivo.
- Bugs corrigidos devem virar testes de regressao quando fizer sentido.
- Fluxos destrutivos, autenticacao, autorizacao, parsers e integracoes merecem cobertura proporcional ao risco.

### Seguranca por padrao

- Segredos nunca entram no repositorio.
- Logs nao devem expor tokens, cookies, senhas, dados pessoais ou HTML sensivel.
- Erros internos nao devem vazar stack trace para clientes.
- Operacoes destrutivas precisam de confirmacao, permissao e registro quando aplicavel.

### Extensao antes de modificacao

Quando houver variacoes previsiveis de comportamento, prefira pontos de extensao:

- strategies;
- policies;
- adapters;
- handlers;
- services especializados;
- configuracao declarativa.

Evite `if/else` crescente concentrando varias regras no mesmo lugar.

## 3. Stack padrao

A baseline atual esta em [../docs/STACK-E-ARQUITETURA.md](../docs/STACK-E-ARQUITETURA.md). Resumo:

| Cenario | Padrao |
|---------|--------|
| Backend comum com CRUD/API | Python + Django + Django REST Framework |
| API pequena e focada | FastAPI |
| Integracao forte com ecossistema JS | Node.js + TypeScript |
| Contexto corporativo/legado/requisito explicito | C#/.NET |
| Banco inicial/local | SQLite |
| Banco relacional em producao | PostgreSQL |
| Cache compartilhado | Redis |

Regra pratica:

- Comece com Django + DRF quando houver usuarios, permissoes, CRUD, admin ou banco relacional.
- Use FastAPI quando o servico for pequeno, focado e sem necessidade do ecossistema Django.
- Use .NET apenas quando houver motivo concreto.
- Documente qualquer desvio no `IA.md` do projeto.

## 4. Estrutura recomendada

Uma estrutura backend saudavel separa pelo menos estas responsabilidades:

```text
backend/
|-- app/
|   |-- api/              # rotas, views, serializers, DTOs
|   |-- services/         # casos de uso e orquestracao
|   |-- domain/           # regras centrais e entidades de negocio
|   |-- repositories/     # consultas e acesso estruturado a dados
|   |-- integrations/     # APIs externas, storage, email, filas
|   `-- core/             # config, auth, logging, utilidades
|-- tests/
|-- docs/
|-- README.md
|-- .env.example
`-- start_app.py
```

Adapte nomes ao framework, mas preserve as fronteiras.

## 5. Responsabilidade por camada

| Camada | Deve conter | Nao deve conter |
|--------|-------------|-----------------|
| API | Parsing, validacao de entrada, autenticacao, autorizacao, serializacao e resposta HTTP | Regra de negocio espalhada, SQL complexo, integracao externa direta |
| Services | Casos de uso, transacoes, orquestracao de fluxo | Detalhes de response HTTP ou framework |
| Domain | Regras centrais, invariantes, linguagem do negocio | Dependencia direta de view/controller |
| Repositories | Consulta e persistencia estruturada | Regra de apresentacao ou regra de negocio principal |
| Integrations | Clientes externos, webhooks, storage, email, filas | Dominio principal |
| Core | Configuracao, logging, auth, utilidades compartilhadas | Casos de uso especificos |

## 6. API e contratos

### Requests

- Valide toda entrada externa.
- Normalize dados antes de aplicar regra de negocio.
- Diferencie erro de validacao, autenticacao, autorizacao, regra de negocio e falha interna.

### Responses

Use respostas consistentes:

```json
{
  "data": {},
  "meta": {},
  "errors": []
}
```

Para APIs pequenas, o envelope pode ser simplificado, mas o padrao de erro ainda deve ser previsivel.

### Erros

Erros devem responder:

- o que aconteceu;
- qual campo ou recurso foi afetado, quando aplicavel;
- se o usuario pode corrigir;
- qual codigo HTTP corresponde ao caso.

Nunca exponha stack trace para cliente.

## 7. Persistencia

- Comece com SQLite quando o projeto for local, pequeno, educacional ou MVP simples.
- Use PostgreSQL quando houver producao real, concorrencia, multiusuario, jobs, crescimento de dados ou necessidade operacional mais robusta.
- Migrations devem ser pequenas, revisaveis e coerentes.
- Evite consultas complexas espalhadas pela aplicacao.
- Operacoes idempotentes devem ter chaves naturais ou constraints claras.

## 8. Integracoes externas

Toda integracao deve ter:

- cliente/adaptador isolado;
- timeout;
- retry/backoff quando fizer sentido;
- tratamento de rate limit;
- logs sem segredo;
- testes com mock/fake/fixture;
- documentacao de credenciais e variaveis de ambiente.

Nao chame API externa diretamente de views/controllers quando isso puder ser isolado.

## 9. Configuracao e segredos

- Use variaveis de ambiente.
- Mantenha `.env.example` sem valores reais.
- Nunca commite `.env`, token, cookie, dump privado ou credencial.
- Valores obrigatorios devem falhar cedo com mensagem clara.
- Diferencie configuracao de desenvolvimento, teste e producao.

## 10. Observabilidade

Logs devem ajudar a entender:

- acao executada;
- recurso afetado;
- resultado;
- motivo da falha;
- correlacao com request/job quando aplicavel.

Evite:

- logar payload sensivel;
- imprimir segredo;
- esconder erro em `except/pass`;
- gerar mensagens que dependem de contexto privado.

## 11. Testes

Priorize testes para:

- regras de negocio;
- validadores;
- contratos de API;
- autenticacao e autorizacao;
- parsers;
- integracoes com adapters;
- bugs corrigidos;
- operacoes destrutivas;
- migrations importantes.

Quando teste automatico nao for viavel, registre verificacao manual objetiva no PR, README ou `IA.md`.

## 12. Start app

Todo app web deve ter `start_app.py` na raiz quando for executavel localmente.

Esse script deve:

- instalar dependencias se necessario;
- iniciar ou reiniciar o app;
- abrir o navegador quando fizer sentido;
- imprimir mensagens claras;
- funcionar em ambiente limpo tanto quanto possivel.

Detalhes em [GUIA-START-APP-SCRIPT.md](GUIA-START-APP-SCRIPT.md).

## 13. Checklist backend

Antes de considerar uma entrega pronta:

- [ ] A stack escolhida esta documentada ou segue a baseline.
- [ ] As responsabilidades estao separadas.
- [ ] Regras de negocio nao estao presas em views/controllers.
- [ ] Entradas externas sao validadas.
- [ ] Erros sao previsiveis e seguros.
- [ ] Segredos nao estao no repositorio nem nos logs.
- [ ] Contratos de API foram preservados ou documentados.
- [ ] Persistencia esta organizada e com migrations coerentes.
- [ ] Integracoes externas estao isoladas.
- [ ] Testes/verificacoes cobrem o risco principal.
- [ ] README, `IA.md` e docs afetados foram atualizados.

## 14. Frase de controle

Um backend bom para o Doktor System-Design e aquele que uma pessoa consegue entender, testar, operar e modificar sem depender da conversa original que levou a sua criacao.
