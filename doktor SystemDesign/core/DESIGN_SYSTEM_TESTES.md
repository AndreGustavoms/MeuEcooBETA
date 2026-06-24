# Design System - Testes

> **O que e**: Padrao obrigatorio de testes para projetos Doktor. Define o que testar, como nomear, cobertura minima, tipos de teste e o que nao vale a pena testar.
>
> **Quando usar**: Em qualquer projeto com codigo executavel. Teste nao e fase final  - e parte da entrega.

---

## 1. Principio central

**Teste que nao quebra quando o comportamento muda nao esta testando nada.**

O objetivo do teste nao e cobertura percentual  - e confianca para mudar o codigo sem medo. Um teste bem escrito documenta o comportamento esperado e avisa quando algo quebra. Um teste mal escrito e ruido.

---

## 2. Tipos de teste

### Unitario

Testa uma unica funcao ou classe em isolamento. Sem banco, sem rede, sem sistema de arquivos.

- **O que testar**: `services/`, `utils/`, logica de negocio pura.
- **Velocidade**: milissegundos. Deve rodar centenas por segundo.
- **Dependencias externas**: substituidas por mocks ou fakes apenas quando necessario.

### Integracao

Testa a interacao entre camadas reais: servico + banco, rota + autenticacao, fila + worker.

- **O que testar**: fluxos completos que envolvem mais de uma camada.
- **Banco**: use banco real (SQLite em memoria ou instancia de teste). Evite mock de banco  - [ja causou incidentes em producao](../docs/GIT-POLITICA-DE-VERSIONAMENTO.md).
- **Velocidade**: segundos. Roda menos vezes, mas cobre o que unitario nao cobre.

### End-to-end (E2E)

Testa o sistema pelo ponto de vista do usuario: abre o browser, clica, preenche, verifica.

- **O que testar**: fluxos criticos de negocio (login, cadastro, checkout, fluxo principal).
- **Quando usar**: com moderacao. E2E e lento, fragil e caro de manter. Cubra so o que importa.
- **Ferramentas**: Playwright (recomendado), Cypress.

---

## 3. Piramide de testes

```
        /\
       /E2E\        poucos, so fluxos criticos
      /------\
     /Integracao\   medio volume, fluxos por camada
    /------------\
   /   Unitario   \  maioria dos testes, rapidos e isolados
  /-----------------\
```

Se a base da piramide for pequena e o topo for grande, os testes serao lentos, frageis e dificeis de manter.

---

## 4. Nomenclatura

O nome do teste e documentacao. Leia o nome e entenda o que o sistema deve fazer.

### Padrao

```
deve <resultado esperado> quando <condicao>
should <expected result> when <condition>
```

### Exemplos

```python
# Python (pytest)
def test_deve_retornar_erro_quando_cpf_invalido():
def test_deve_criar_usuario_com_dados_validos():
def test_nao_deve_permitir_email_duplicado():
def test_deve_retornar_404_quando_usuario_nao_existe():
```

```typescript
// TypeScript (Jest / Vitest)
it('deve retornar erro quando CPF invalido')
it('deve criar usuario com dados validos')
it('nao deve permitir email duplicado')
it('deve retornar 404 quando usuario nao existe')
```

**Nunca nomeie pelo metodo:**

```python
# Errado - nao diz o que o sistema deve fazer
def test_validate_cpf():
def test_create_user():
```

---

## 5. Estrutura de um bom teste

Todo teste segue o padrao **AAA: Arrange, Act, Assert**.

```python
def test_deve_calcular_total_com_desconto():
    # Arrange - prepara o estado necessario
    produto = Produto(preco=100.0)
    desconto = 0.10

    # Act - executa a acao a ser testada
    total = calcular_total(produto, desconto)

    # Assert - verifica o resultado
    assert total == 90.0
```

```typescript
it('deve calcular total com desconto', () => {
    // Arrange
    const produto = { preco: 100 };
    const desconto = 0.10;

    // Act
    const total = calcularTotal(produto, desconto);

    // Assert
    expect(total).toBe(90);
});
```

Regras:
- Um teste, um comportamento. Se o `assert` testa duas coisas, separe em dois testes.
- Sem logica condicional no teste (`if`, `for`). Teste que tem `if` esta testando dois cenarios.
- Sem dependencia entre testes. A ordem de execucao nao deve importar.

---

## 6. O que testar

### Sempre testar

- Regras de negocio em `services/`  - sao o nucleo do sistema.
- Validacoes e casos de erro  - o caminho feliz funciona; o que quebra o sistema sao os casos de borda.
- Calculos, transformacoes e algoritmos.
- Integracao com banco de dados via repositorios.
- Rotas de API: status code, formato de resposta, autenticacao.

### Casos de borda obrigatorios

Para qualquer funcao que recebe input externo, teste:

- Valor valido (caminho feliz).
- Valor invalido ou mal formado.
- Valor vazio ou nulo.
- Valor no limite (minimo e maximo permitido).

---

## 7. O que NAO testar

Testar tudo e desperdicio. Evite:

| O que | Por que nao testar |
|-------|-------------------|
| Getters e setters triviais | Nao ha logica, nao ha o que verificar |
| Configuracao de framework | Django, React, etc. ja sao testados pelos seus mantenedores |
| Migrations de banco | Teste o comportamento, nao a estrutura da tabela |
| Constantes e enums | Sem logica condicional, sem teste |
| Codigo gerado automaticamente | Nao e seu codigo |
| Detalhes de implementacao | Teste o contrato (entrada/saida), nao como e feito internamente |

Testar detalhes de implementacao torna a suite fragil: qualquer refatoracao quebra os testes mesmo sem mudar o comportamento.

---

## 8. Mocks e fakes

Use mock so quando necessario. Mock em excesso e sinal de design ruim.

### Quando usar mock

- Dependencias externas com efeito colateral: email, SMS, pagamento, servico terceiro.
- Chamadas de rede em testes unitarios.
- Relogio (`datetime.now()`) quando o teste depende do momento atual.

### Quando NAO usar mock

- Banco de dados em testes de integracao. Use banco real em memoria.
- Servicos internos da propria aplicacao  - se voce mocka seu proprio codigo, nao esta testando integracao.

```python
# Errado - mocka o banco, nao testa a query real
def test_busca_usuario(mock_db):
    mock_db.query.return_value = [{"id": 1}]
    resultado = buscar_usuario(1)
    assert resultado["id"] == 1

# Certo - banco real em memoria
def test_busca_usuario(db_session):
    usuario = Usuario(id=1, nome="Andre")
    db_session.add(usuario)
    db_session.commit()
    resultado = buscar_usuario(1)
    assert resultado.nome == "Andre"
```

---

## 9. Cobertura

Cobertura e metrica, nao objetivo. 100% de cobertura com testes ruins nao garante nada.

### Referencias por tipo de projeto

| Tipo de projeto | Cobertura minima recomendada |
|-----------------|------------------------------|
| API com regras de negocio | 80% em `services/` e `repositories/` |
| Utilitarios e bibliotecas | 90%+ |
| Scripts e automacoes | 60%+ nos casos criticos |
| Frontend (logica em hooks/utils) | 70%+ |

### O que a cobertura nao diz

- Que os testes verificam o comportamento correto.
- Que os casos de borda foram cobertos.
- Que o sistema funciona de ponta a ponta.

Use cobertura para **encontrar codigo nao testado**, nao para declarar qualidade.

---

## 10. Organizacao dos testes

```text
tests/
|-- unit/
|   |-- test_user_service.py
|   |-- test_order_service.py
|   `-- test_cpf_utils.py
|-- integration/
|   |-- test_user_api.py
|   `-- test_order_flow.py
`-- e2e/
    `-- test_checkout_flow.py
```

- Um arquivo de teste por arquivo de producao em testes unitarios.
- Nome do arquivo: `test_` + nome do modulo testado.
- Fixtures e factories compartilhadas em `conftest.py` (pytest) ou `setup` dedicado.

---

## 11. Ferramentas recomendadas

| Contexto | Ferramenta |
|----------|------------|
| Python | pytest + pytest-cov |
| Django | pytest-django |
| TypeScript/Node | Vitest (recomendado) ou Jest |
| React (componentes) | Testing Library + Vitest |
| E2E | Playwright |
| Cobertura | pytest-cov, c8 (Vitest) |

---

## 12. Checklist de testes por entrega

- [ ] Regras de negocio em `services/` cobertas por testes unitarios.
- [ ] Casos de borda testados: valido, invalido, vazio, limite.
- [ ] Testes de integracao cobrem os fluxos principais com banco real.
- [ ] Nomes dos testes descrevem o comportamento esperado.
- [ ] Cada teste verifica uma unica coisa.
- [ ] Sem dependencia de ordem entre testes.
- [ ] Mocks usados apenas para dependencias externas com efeito colateral.
- [ ] Suite roda sem erro antes de qualquer commit.
- [ ] Cobertura de `services/` acima do minimo definido para o projeto.
