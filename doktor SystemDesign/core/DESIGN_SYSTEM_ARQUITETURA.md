# Design System - Arquitetura de Codigo

> **O que e**: Padrao obrigatorio de organizacao, responsabilidade e estrutura de codigo para projetos Doktor.
>
> **Quando usar**: Em qualquer projeto novo ou em refatoracao. Vale para frontend, backend e scripts.

---

## 1. Principio central

**Cada arquivo, funcao e pasta tem uma unica responsabilidade.**

Se voce precisa usar "e" para descrever o que uma funcao faz, ela faz coisas demais.

---

## 2. Estrutura de pastas

Organize por **responsabilidade**, nao por tipo de arquivo.

### Backend (Python/Django)

```text
src/
|-- api/              # Rotas e controllers - so recebe requisicao e delega
|-- services/         # Regras de negocio - logica pura, sem HTTP
|-- repositories/     # Acesso a dados - queries e persistencia
|-- models/           # Modelos e entidades
|-- schemas/          # Validacao e serializacao (Pydantic, DRF serializers)
|-- utils/            # Funcoes puras reutilizaveis, sem efeito colateral
|-- config/           # Configuracoes e variaveis de ambiente
tests/
|-- unit/             # Testa funcoes isoladas (services, utils)
|-- integration/      # Testa fluxos completos com banco real
```

### Frontend (React/TypeScript)

```text
src/
|-- pages/            # Uma pasta por pagina - so composicao, sem logica
|-- components/       # Componentes reutilizaveis, sem regra de negocio
|-- hooks/            # Logica de estado e efeitos encapsulada
|-- services/         # Chamadas a API - nada mais
|-- utils/            # Funcoes puras reutilizaveis
|-- types/            # Tipos e interfaces TypeScript
|-- constants/        # Valores fixos e enums
```

---

## 3. Regras de responsabilidade

### Funcoes

- **Uma funcao, uma tarefa.** Se o nome tem "and" ou "e", separe.
- Maximo de 20-30 linhas. Se passar, provavelmente e duas funcoes.
- Nome no imperativo e especifico: `getUserById`, nao `getData`.
- Sem efeitos colaterais ocultos: uma funcao que busca dados nao deve tambem salvar logs.

### Arquivos

- Um arquivo por conceito: `userService.ts`, nao `helpers.ts` com tudo misturado.
- Se um arquivo passa de 200-300 linhas, avalie se tem mais de uma responsabilidade.
- Nome do arquivo = o que ele contem, sem ambiguidade.

### Pastas

- Nao crie pasta `utils/` como lixeira. Cada utilitario deve ter nome descritivo.
- Nao misture camadas: `services/` nao importa de `api/`, `api/` nao acessa banco direto.

---

## 4. Camadas e dependencias

As camadas so podem depender das camadas abaixo, nunca das de cima:

```
api / controllers
      |
   services
      |
  repositories
      |
    models
```

- `api` chama `services`, nunca acessa banco direto.
- `services` contem a regra de negocio, nunca sabe que existe HTTP.
- `repositories` isola queries - `services` nao escreve SQL.

---

## 5. Nomenclatura

| Contexto | Padrao | Exemplo |
|----------|--------|---------|
| Funcoes e metodos | camelCase, verbo + substantivo | `createUser`, `fetchOrders` |
| Classes e componentes | PascalCase | `UserService`, `ButtonGroup` |
| Variaveis | camelCase, descritivo | `isLoading`, `userList` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |
| Arquivos (JS/TS) | camelCase ou PascalCase conforme conteudo | `userService.ts`, `UserCard.tsx` |
| Arquivos (Python) | snake_case | `user_service.py`, `order_repository.py` |
| Pastas | kebab-case ou snake_case | `user-profile/`, `order_management/` |

Nomes ruins sao divida tecnica. `data`, `info`, `manager`, `handler` sozinhos nao dizem nada.

---

## 6. Testes

- Teste deve ter o mesmo nivel de cuidado que o codigo de producao.
- Nome do teste descreve o comportamento, nao o metodo: `deve retornar erro quando CPF invalido`.
- Um teste, um cenario. Nao teste dois comportamentos no mesmo `it` ou `def test_`.
- Testes unitarios cobrem `services/` e `utils/`. Testes de integracao cobrem fluxos completos.

---

## 7. O que evitar

| Antipadrao | Por que e ruim | O que fazer |
|------------|----------------|-------------|
| God object / God function | Impossivel testar e manter | Separar em responsabilidades menores |
| Comentario explicando o que o codigo faz | O codigo deve ser autoexplicativo | Renomear variaveis e funcoes |
| `utils.py` com 500 linhas | Vira lixeira sem estrutura | Arquivos por dominio: `date_utils.py`, `string_utils.py` |
| Logica de negocio no controller | Impossivel reutilizar e testar | Mover para `services/` |
| Numeros e strings magicas no codigo | Sem contexto, propenso a erro | Extrair para constante nomeada |
| Importacao circular | Indica camadas mal definidas | Revisar separacao de responsabilidades |

---

## 8. Checklist de entrega

Antes de considerar uma implementacao pronta:

- [ ] Cada funcao faz uma unica coisa.
- [ ] Nenhuma camada acessa o que nao deveria (ex: controller no banco).
- [ ] Nomes descrevem o que o codigo faz sem precisar de comentario.
- [ ] Arquivos com mais de 300 linhas foram revisados.
- [ ] Testes cobrem os casos principais de `services/` e `utils/`.
- [ ] Nenhuma logica duplicada entre arquivos.
- [ ] A estrutura de pastas reflete responsabilidades, nao tipos de arquivo.
