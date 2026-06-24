# Design System - Seguranca

> **O que e**: Padrao obrigatorio de seguranca para projetos Doktor. Define o que nunca commitar, como proteger secrets, praticas minimas de codigo seguro e checklist de entrega.
>
> **Quando usar**: Em qualquer projeto, desde o primeiro commit. Seguranca nao e fase final  - e requisito desde o inicio.

---

## 1. Principio central

**Seguranca e responsabilidade de quem escreve o codigo, nao do time de operacoes.**

Uma vulnerabilidade descoberta em producao custa muito mais do que um dia de desenvolvimento seguro. Trate dado sensivel, autenticacao e validacao de entrada como partes nao negociaveis de qualquer entrega.

---

## 2. O que NUNCA commitar

Esta e a regra mais critica. Uma vez que um secret vai para o historico do Git, considere-o comprometido  - mesmo que voce delete o arquivo depois, o historico preserva o dado.

**Nunca commitar:**

| O que | Exemplo |
|-------|---------|
| Chaves de API | `sk-...`, `AIza...`, tokens de servico |
| Senhas e credentials | senhas de banco, painel admin, SMTP |
| Tokens de acesso | GitHub tokens, AWS keys, JWT secrets |
| Certificados e chaves privadas | `.pem`, `.key`, `.p12` |
| Arquivos `.env` com valores reais | `.env`, `.env.local`, `.env.production` |
| Strings de conexao com credencial | `postgres://user:senha@host/db` |
| Dados pessoais reais | CPF, email, telefone de pessoas reais em fixtures |

### Como evitar

1. Sempre use `.env` para secrets locais e adicione ao `.gitignore` **antes do primeiro commit**.
2. Mantenha `.env.example` com as variaveis necessarias mas sem valores reais.
3. Use um gerenciador de secrets em producao (Railway, Render, Vercel, AWS Secrets Manager).

```bash
# .gitignore obrigatorio em todo projeto
.env
.env.local
.env.*.local
*.pem
*.key
*.p12
secrets/
```

### E se commitar por acidente?

1. Revogue o secret imediatamente no servico de origem (GitHub, AWS, etc.).
2. Remova do historico com `git filter-repo` ou `BFG Repo Cleaner`.
3. Force-push apos limpeza.
4. Notifique o time.

Nao basta deletar o arquivo e fazer um novo commit. O dado ainda estara no historico.

---

## 3. Variaveis de ambiente

Toda configuracao que muda entre ambientes (dev, staging, producao) deve vir de variavel de ambiente, nunca hardcoded.

### Padrao

```python
# Errado - nunca faca isso
DATABASE_URL = "postgres://admin:senha123@localhost/mydb"
SECRET_KEY = "minha-chave-super-secreta"

# Certo
import os
DATABASE_URL = os.environ["DATABASE_URL"]
SECRET_KEY = os.environ["SECRET_KEY"]
```

```typescript
// Errado
const apiUrl = "https://api.meuservico.com/v1";
const apiKey = "sk-abc123";

// Certo
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiKey = process.env.API_KEY;
```

### Documentacao obrigatoria

Todo projeto deve ter `.env.example` atualizado. Sem ele, ninguem consegue rodar o projeto sem pedir contexto.

```bash
# .env.example
DATABASE_URL=postgres://user:password@localhost:5432/dbname
SECRET_KEY=troque-por-uma-chave-segura
API_KEY=sua-chave-de-api-aqui
DEBUG=False
```

---

## 4. Autenticacao e autorizacao

### Autenticacao

- Nunca implemente autenticacao do zero sem necessidade. Use bibliotecas estabelecidas (Django Auth, NextAuth, JWT com biblioteca validada).
- Senhas devem ser armazenadas com hash forte: **bcrypt**, **argon2** ou **PBKDF2**. Nunca MD5 ou SHA1 para senhas.
- Tokens JWT devem ter expiracao curta (15-60 min para access token). Refresh tokens com rotacao.
- HTTPS obrigatorio em producao. Nunca trafegue credencial em HTTP.

### Autorizacao

- Verifique permissao em **toda** rota protegida, nao so no frontend.
- Principio do menor privilegio: cada usuario ou servico acessa apenas o que precisa.
- Nunca confie no ID ou papel (role) que vem do cliente. Valide sempre no servidor.

```python
# Errado - confia no frontend
def get_user_data(request):
    user_id = request.data.get("user_id")  # cliente manda o ID que quiser
    return User.objects.get(id=user_id)

# Certo - usa o usuario autenticado da sessao
def get_user_data(request):
    return request.user  # autenticado pelo middleware
```

---

## 5. Validacao de entrada

**Nunca confie em dado que vem de fora do sistema.** Todo input de usuario, parametro de URL, header ou payload de webhook e potencialmente malicioso.

### Regras

- Valide tipo, formato e tamanho de todo campo antes de processar.
- Use serializers ou schemas de validacao (Pydantic, DRF Serializers, Zod, Yup).
- Rejeite o que nao e esperado  - nao tente "consertar" input invalido silenciosamente.
- Sanitize HTML quando exibir conteudo gerado por usuario (evita XSS).

### SQL Injection

Nunca construa queries com concatenacao de string:

```python
# Errado - vulneravel a SQL injection
query = f"SELECT * FROM users WHERE email = '{email}'"
cursor.execute(query)

# Certo - parametros sempre separados
cursor.execute("SELECT * FROM users WHERE email = %s", [email])

# Ou use o ORM
User.objects.filter(email=email)
```

### XSS (Cross-Site Scripting)

```typescript
// Errado - injeta HTML diretamente
element.innerHTML = userInput;

// Certo - escapa o conteudo
element.textContent = userInput;

// Ou com React (automatico na maioria dos casos)
return <div>{userInput}</div>  // React escapa por padrao
```

---

## 6. Exposicao de dados

- Nunca retorne mais dados do que o necessario. Se a rota e publica, nao inclua campos internos.
- Nunca exponha stack trace ou mensagem de erro interna ao cliente em producao.
- Logs nao devem conter senha, token ou dado pessoal.

```python
# Errado - expoe detalhes internos
except Exception as e:
    return Response({"error": str(e)}, status=500)

# Certo - mensagem generica para o cliente, log interno
except Exception as e:
    logger.error(f"Erro inesperado: {e}", exc_info=True)
    return Response({"error": "Erro interno. Tente novamente."}, status=500)
```

---

## 7. Dependencias

- Mantenha dependencias atualizadas. Vulnerabilidades em bibliotecas desatualizadas sao a causa mais comum de incidentes.
- Use `pip audit`, `npm audit` ou `dependabot` para monitorar.
- Nao adicione dependencia sem avaliar: tamanho, manutencao ativa, historico de CVEs.
- Fixe versoes em producao (`==` no pip, `lockfile` no npm) para evitar surpresas em deploy.

---

## 8. Headers de seguranca (HTTP)

Em qualquer aplicacao web, configure os headers basicos:

| Header | Valor recomendado | Para que serve |
|--------|-------------------|----------------|
| `X-Content-Type-Options` | `nosniff` | Evita MIME sniffing |
| `X-Frame-Options` | `DENY` | Evita clickjacking |
| `Strict-Transport-Security` | `max-age=31536000` | Forca HTTPS |
| `Content-Security-Policy` | configurar por projeto | Restringe origens de scripts |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controla dados no Referer |

Django: use `django-csp` e as configuracoes de `SECURE_*` no `settings.py`.
Next.js: configure em `next.config.js` via `headers()`.

---

## 9. OWASP Top 10  - referencia rapida

As vulnerabilidades mais comuns. Conheca para nao reproduzir:

| # | Vulnerabilidade | Como evitar |
|---|-----------------|-------------|
| 1 | Broken Access Control | Verificar autorizacao no servidor em toda rota |
| 2 | Cryptographic Failures | Usar HTTPS, hash forte para senhas, nao expor secrets |
| 3 | Injection (SQL, XSS) | Parametrizar queries, escapar output, validar input |
| 4 | Insecure Design | Modelar ameacas antes de implementar |
| 5 | Security Misconfiguration | Remover defaults, desativar debug em producao |
| 6 | Vulnerable Components | Manter dependencias atualizadas, usar `audit` |
| 7 | Auth Failures | Usar bibliotecas estabelecidas, tokens com expiracao |
| 8 | Data Integrity Failures | Verificar integridade de dados e pipelines CI/CD |
| 9 | Logging Failures | Logar eventos de seguranca, nao logar dados sensiveis |
| 10 | SSRF | Validar e restringir URLs em requisicoes server-side |

---

## 10. Checklist de seguranca por entrega

Antes de considerar qualquer funcionalidade pronta:

- [ ] Nenhum secret, senha ou token no codigo ou no historico Git.
- [ ] `.env.example` atualizado com todas as variaveis necessarias.
- [ ] `.env` no `.gitignore`.
- [ ] Todo input de usuario e validado antes de processar.
- [ ] Autorizacao verificada no servidor, nao so no frontend.
- [ ] Mensagens de erro genericas para o cliente; detalhes apenas no log interno.
- [ ] Dependencias sem vulnerabilidades conhecidas (`pip audit` / `npm audit`).
- [ ] HTTPS configurado em producao.
- [ ] Dados pessoais reais ausentes em fixtures, seeds e testes.
- [ ] Logs nao contem senha, token ou dado pessoal.
