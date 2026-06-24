# Guia Backend CPF

## Quando usar

Use quando um backend, script ou fluxo de QA precisa gerar, normalizar ou validar CPF em ambiente de teste.

## Quando nao usar

Nao use este guia para coletar CPF real sem justificativa legal, consentimento, politica de retencao e cuidado com dados pessoais. Tambem nao use CPF gerado como identidade real de usuario.

## Resultado esperado

Uma camada pequena e testavel com:

- normalizacao de entrada;
- validacao de CPF;
- geracao de CPF sintetico valido;
- contrato de retorno previsivel;
- testes unitarios para casos validos e invalidos;
- guardrails para nao misturar dados reais e dados de teste.

## Modelo de contrato

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class CpfValidationResult:
    valid: bool
    normalized: str
    formatted: str | None = None
    reason: str | None = None
```

## Normalizacao

```python
def normalize_cpf(value: str) -> str:
    return "".join(ch for ch in value if ch.isdigit())
```

## Formatacao

```python
def format_cpf(value: str) -> str:
    digits = normalize_cpf(value)
    if len(digits) != 11:
        raise ValueError("CPF precisa ter 11 digitos")
    return f"{digits[:3]}.{digits[3:6]}.{digits[6:9]}-{digits[9:]}"
```

## Calculo dos digitos verificadores

```python
def calculate_digit(digits: str) -> str:
    weight = len(digits) + 1
    total = sum(int(digit) * (weight - index) for index, digit in enumerate(digits))
    rest = (total * 10) % 11
    return "0" if rest == 10 else str(rest)
```

## Validacao

```python
def validate_cpf(value: str) -> CpfValidationResult:
    digits = normalize_cpf(value)

    if len(digits) != 11:
        return CpfValidationResult(False, digits, reason="cpf_length")

    if len(set(digits)) == 1:
        return CpfValidationResult(False, digits, reason="cpf_repeated_digits")

    first_digit = calculate_digit(digits[:9])
    second_digit = calculate_digit(digits[:9] + first_digit)
    expected = digits[:9] + first_digit + second_digit

    if digits != expected:
        return CpfValidationResult(False, digits, reason="cpf_invalid_digits")

    return CpfValidationResult(True, digits, formatted=format_cpf(digits))
```

## Geracao sintetica

```python
import random


def generate_cpf() -> str:
    base = "".join(str(random.randint(0, 9)) for _ in range(9))
    first_digit = calculate_digit(base)
    second_digit = calculate_digit(base + first_digit)
    return format_cpf(base + first_digit + second_digit)
```

Para testes determiniscos, injete o gerador de numeros ou passe uma base fixa.

## Estrutura recomendada

```text
src/
  domain/
    cpf.py
  services/
    cpf_service.py
tests/
  test_cpf.py
```

## Uso em API

```python
def create_user(payload: dict):
    cpf_result = validate_cpf(payload.get("cpf", ""))
    if not cpf_result.valid:
        return {"error": "cpf_invalid", "reason": cpf_result.reason}, 400

    # Grave apenas se houver justificativa real para armazenar CPF.
    return {"cpf": cpf_result.formatted}, 201
```

## Testes minimos

```python
def test_validate_formatted_cpf():
    result = validate_cpf("529.982.247-25")
    assert result.valid is True
    assert result.normalized == "52998224725"


def test_reject_repeated_digits():
    result = validate_cpf("111.111.111-11")
    assert result.valid is False
    assert result.reason == "cpf_repeated_digits"


def test_generated_cpf_is_valid():
    result = validate_cpf(generate_cpf())
    assert result.valid is True
```

## Guardrails

- Trate CPF como dado pessoal.
- Nao registre CPF completo em log.
- Mascare em interfaces quando possivel.
- Separe dados sinteticos de dados reais.
- Nao use CPF gerado em servicos externos reais.
- Documente motivo de coleta, retencao e exclusao.

## Checklist

- [ ] Normalizacao remove mascara.
- [ ] Validacao rejeita tamanho incorreto.
- [ ] Validacao rejeita digitos repetidos.
- [ ] Digitos verificadores sao recalculados.
- [ ] Testes cobrem validos, invalidos e gerados.
- [ ] Logs e respostas nao vazam dado sensivel sem necessidade.
- [ ] Uso com dados reais foi revisado com privacidade em mente.

