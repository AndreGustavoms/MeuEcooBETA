# Guia Criptografia Cifra de Cesar

## Quando usar

Use para projetos educacionais, demos de criptografia classica, jogos simples, ferramentas internas de encode/decode e exercicios de transformacao de texto.

## Quando nao usar

Nao use Cifra de Cesar para proteger dado real. Ela e uma cifra historica simples e quebravel por forca bruta ou analise de frequencia.

## Resultado esperado

Um modulo pequeno com:

- normalizacao opcional de texto;
- deslocamento de alfabeto;
- cifrar e decifrar texto;
- variante numerica, se o produto pedir;
- testes para chaves positivas, negativas e maiores que o alfabeto;
- aviso claro de uso educacional.

## Contratos

```python
def shift_alphabet(offset: int) -> str: ...
def encrypt(message: str, offset: int) -> str: ...
def decrypt(message: str, offset: int) -> str: ...
def normalize_text(message: str) -> str: ...
```

## Implementacao base

```python
import string
import unicodedata


ALPHABET = string.ascii_lowercase


def normalize_text(message: str) -> str:
    normalized = unicodedata.normalize("NFD", message)
    without_marks = "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")
    return without_marks.lower()


def shift_alphabet(offset: int) -> str:
    normalized_offset = offset % len(ALPHABET)
    return ALPHABET[normalized_offset:] + ALPHABET[:normalized_offset]


def _translate(message: str, source: str, target: str) -> str:
    table = str.maketrans(source, target)
    return message.translate(table)


def encrypt(message: str, offset: int, normalize: bool = True) -> str:
    value = normalize_text(message) if normalize else message
    return _translate(value, ALPHABET, shift_alphabet(offset))


def decrypt(message: str, offset: int, normalize: bool = True) -> str:
    value = normalize_text(message) if normalize else message
    return _translate(value, shift_alphabet(offset), ALPHABET)
```

## Exemplo

```python
cipher = encrypt("Ataque ao amanhecer", 3)
plain = decrypt(cipher, 3)

assert cipher == "dwdtxh dr dpdqkhfhu"
assert plain == "ataque ao amanhecer"
```

## Variante numerica

Use quando a interface precisa mostrar a posicao de cada letra.

```python
def encode_numbers(message: str, offset: int = 0) -> list[int | str]:
    shifted = shift_alphabet(offset)
    index = {letter: number + 1 for number, letter in enumerate(shifted)}
    value = normalize_text(message)
    return [index[ch] if ch in index else ch for ch in value]


def decode_numbers(values: list[int | str], offset: int = 0) -> str:
    shifted = shift_alphabet(offset)
    index = {number + 1: letter for number, letter in enumerate(shifted)}
    return "".join(index[item] if isinstance(item, int) else str(item) for item in values)
```

## Estrutura recomendada

```text
src/
  crypto/
    caesar.py
  api/
    routes.py
tests/
  test_caesar.py
```

## Uso em API

```python
def encode_payload(payload: dict):
    message = payload.get("message", "")
    offset = int(payload.get("offset", 3))
    return {"encoded": encrypt(message, offset)}
```

Valide tamanho maximo de mensagem antes de processar entrada externa.

## Testes minimos

```python
def test_encrypt_and_decrypt():
    encoded = encrypt("abc xyz", 3)
    assert encoded == "def abc"
    assert decrypt(encoded, 3) == "abc xyz"


def test_offset_wraps():
    assert encrypt("abc", 29) == "def"


def test_negative_offset():
    assert encrypt("abc", -1) == "zab"


def test_normalizes_accents():
    assert encrypt("acao", 0) == "acao"
```

## Guardrails

- Declare que nao e criptografia segura.
- Nao aplique em senha, token, documento ou dado pessoal.
- Limite tamanho de mensagem em APIs publicas.
- Registre apenas metricas, nao conteudo sensivel.
- Se precisar de seguranca real, use bibliotecas modernas e algoritmos reconhecidos.

## Checklist

- [ ] Offset funciona com valores negativos e maiores que 26.
- [ ] Pontuacao e espacos sao preservados.
- [ ] Normalizacao e opcional ou documentada.
- [ ] Testes cobrem cifrar e decifrar.
- [ ] Interface deixa claro que o uso e educacional.
- [ ] Nenhum dado sensivel depende dessa cifra.

