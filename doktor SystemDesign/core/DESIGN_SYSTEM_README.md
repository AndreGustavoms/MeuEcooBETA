# Design System README

Este documento define o padrao de qualidade para `README.md` em projetos que usam o Doktor System-Design.

Um bom README deve permitir que uma pessoa entenda rapidamente o que o projeto faz, como rodar, como validar e onde encontrar detalhes.

## 1. Objetivo

O README deve responder:

- O que e este projeto?
- Para que ele serve?
- Como instalar e rodar?
- Como validar se esta funcionando?
- Qual stack foi usada?
- Onde estao os documentos importantes?
- Quais limites, riscos ou pendencias importam?

## 2. Estrutura recomendada

Use esta ordem como base:

```text
1. Titulo
2. Descricao curta
3. Links rapidos
4. Sobre o projeto
5. Stack
6. Como rodar
7. Como testar/validar
8. Estrutura do projeto
9. Documentacao
10. Configuracao e variaveis de ambiente
11. Decisoes tecnicas relevantes
12. Limitacoes e riscos
13. Contribuicao
14. Licenca
```

Nem todo projeto precisa de todas as secoes. Remova o que nao fizer sentido, mas nao esconda informacao necessaria para uso e manutencao.

## 3. Header

Padrao recomendado:

```markdown
# Nome do Projeto

Descricao curta em uma ou duas linhas, explicando o valor do projeto sem marketing vazio.

[Como rodar](#como-rodar) | [Documentacao](#documentacao) | [Testes](#como-testar)
```

Badges podem ser usados, mas nao devem substituir explicacao clara.

Use badges para:

- linguagem/framework principal;
- status de CI;
- licenca;
- versao publicada.

Evite excesso de badges.

## 4. Sobre o projeto

Explique:

- problema que resolve;
- publico ou contexto de uso;
- principais fluxos;
- o que esta fora do escopo.

Exemplo:

```markdown
## Sobre

Este projeto e uma API para gerenciar tarefas internas. Ele oferece autenticacao,
CRUD de tarefas, filtros por status e exportacao CSV. Nao inclui interface web.
```

## 5. Stack

Liste a stack real, nao uma stack desejada.

```markdown
## Stack

- Python 3.12
- Django 5
- Django REST Framework
- PostgreSQL
- pytest
```

Se a escolha fugir da baseline do Doktor System-Design, inclua uma justificativa curta ou aponte para `IA.md`.

## 6. Como rodar

Todo projeto executavel deve ter instrucoes de setup reproduziveis.

Para app web, priorize:

```bash
python start_app.py
```

Quando houver setup manual, explique:

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Inclua pre-requisitos:

- versao de linguagem;
- banco;
- variaveis de ambiente;
- dependencias externas.

## 7. Como testar

Explique a validacao principal:

```bash
pytest
```

ou:

```bash
npm test
```

Se nao houver testes automaticos, registre verificacao manual objetiva:

```markdown
## Como validar

1. Rode `python start_app.py`.
2. Acesse `http://localhost:8000`.
3. Crie um usuario de teste.
4. Confirme que a listagem aparece sem erro.
```

## 8. Estrutura do projeto

Mostre apenas o necessario para orientar:

```text
src/
|-- components/
|-- services/
|-- pages/
tests/
docs/
README.md
IA.md
```

Evite arvore gigante que fica desatualizada rapidamente.

## 9. Documentacao

Linke documentos importantes:

- `IA.md`;
- docs tecnicos;
- guias de deploy;
- contratos de API;
- decisoes de arquitetura;
- exemplos de uso.

## 10. Variaveis de ambiente

Nunca coloque segredo real.

Use tabela:

| Variavel | Obrigatoria | Exemplo | Uso |
|----------|-------------|---------|-----|
| `DATABASE_URL` | Sim | `postgres://...` | Conexao com banco. |
| `SECRET_KEY` | Sim | `change-me` | Chave da aplicacao. |

Mantenha `.env.example` atualizado.

## 11. Decisoes tecnicas

Inclua quando a decisao afeta manutencao:

```markdown
## Decisoes tecnicas

- SQLite em desenvolvimento para reduzir setup local.
- PostgreSQL em producao por concorrencia e volume esperado.
- Django REST Framework por produtividade em CRUD e autenticacao.
```

Decisoes longas devem ir para `IA.md` ou `docs/`.

## 12. Limitacoes e riscos

Se existe limite conhecido, documente.

Exemplos:

- "Nao suporta multi-tenant."
- "Importacao roda em modo manual."
- "Deploy ainda nao foi validado fora de ambiente local."

Isso evita falsa sensacao de pronto.

## 13. Linguagem

Regras:

- escreva para qualquer leitor;
- evite contexto privado;
- use placeholders genericos;
- nao exponha caminho local, usuario, token ou URL privada;
- prefira frases curtas;
- trate trabalho futuro como oportunidade aberta, nao como anotacao interna.

Prefira:

```text
Ideias para expansao
```

Evite:

```text
TODO que eu ainda preciso terminar
```

## 14. Checklist de README

Antes de considerar o README pronto:

- [ ] Explica o que o projeto faz.
- [ ] Explica como rodar.
- [ ] Explica como testar ou validar.
- [ ] Lista stack real.
- [ ] Aponta para documentos importantes.
- [ ] Nao contem segredo ou dado privado.
- [ ] Nao depende de contexto da conversa.
- [ ] Esta atualizado com a estrutura atual.
- [ ] Informa limitacoes relevantes.

## 15. Frase de controle

Um README bom e aquele que permite uma pessoa nova rodar, validar e entender o projeto sem pedir contexto adicional.
