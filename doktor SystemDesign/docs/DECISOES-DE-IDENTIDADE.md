# Decisoes de Identidade

Este arquivo separa o que e padrao tecnico reutilizavel do que representa identidade pessoal, autoria, marca ou preferencia individual.

## 1. Nome publico do repositorio

Decisao atual: **Doktor System-Design**.

Outras opcoes:

| Opcao | Quando usar |
|-------|-------------|
| Doktor System-Design | Se a ideia e manter um repositorio de padroes tecnicos amplo. |
| Doktor Engineering Handbook | Se quiser soar mais como manual de engenharia. |
| Doktor Quality Standards | Se o foco principal for qualidade, checklist e revisao. |
| Meu System Design | Se a intencao for portfolio pessoal, menos institucional. |

## 2. Autor publico

Decisao atual:

- Nome publico: **Andre Gustavo Melo da Silva**
- GitHub: [@AndreGustavoms](https://github.com/AndreGustavoms)
- Exposicao no README: sim

Outras opcoes:

| Opcao | Impacto |
|-------|---------|
| Nome pessoal | Bom para portfolio, mas expoe identidade diretamente. |
| Usuario do GitHub | Menos formal que nome civil, ainda identifica autoria. |
| Organizacao/time | Melhor se o repositorio representar o Doktor ou um grupo. |
| Sem secao de autor | Mais neutro; a autoria fica no historico Git. |

Status: resolvido. O nome foi mantido em ASCII para seguir o padrao atual dos arquivos normalizados.

## 3. Comando global

Decisao atual: usar o comando global **`doktor`**, em minusculo, para sincronizar estes padroes em outros projetos.

Opcoes:

| Opcao | Impacto |
|-------|---------|
| `doktor` | Escolha atual. Curto, facil de lembrar, ligado ao nome do repo. |
| `doktor-system` | Mais explicito, menor risco de conflito com outro comando. |
| Sem comando global | Menos manutencao; usar apenas `git clone`, ZIP ou sparse checkout. |

Status: resolvido por enquanto. Os scripts foram simplificados para nao depender de submodulos.

## 4. Stack tecnica

Decisao atual: a stack deixa de ser apenas uma preferencia herdada e passa a ser uma baseline tecnica documentada em [STACK-E-ARQUITETURA.md](STACK-E-ARQUITETURA.md).

Opcoes:

| Opcao | Impacto |
|-------|---------|
| Manter baseline por contexto | Escolha atual. Evita tratar uma stack unica como resposta para tudo. |
| Trocar pela sua stack real | Melhor para portfolio se voce quiser explicitar preferencia pessoal. |
| Remover stack do README | Evita assumir tecnologia antes do escopo do projeto, mas reduz utilidade operacional. |

Status: resolvido. A stack representa a baseline tecnica do repositorio, nao uma declaracao de preferencia pessoal publica.

## 5. Origem dos guias

Os guias vieram de projetos reais citados no material original. Para evitar identidade pessoal herdada, as referencias foram removidas do corpo dos guias ou movidas para atribuicao geral.

Opcoes:

| Opcao | Impacto |
|-------|---------|
| Manter referencias neutras | Bom para evitar exposicao pessoal desnecessaria. |
| Citar origem especifica em cada guia | Mais transparente, mas traz nomes/projetos de terceiros para todos os arquivos. |
| Citar tudo apenas em NOTICE.md | Equilibrio recomendado: atribuicao legal sem poluir os guias. |

Status atualizado: alem da atribuicao legal, o repositorio agora tem [IDENTIDADE-DOKTOR.md](IDENTIDADE-DOKTOR.md) para registrar a influencia estetica/metodologica da origem sem transformar Felipe/Felixo em autoria ativa do projeto atual.

## 6. Licenca e atribuicao

O material importado tem licenca MIT. A atribuicao original deve continuar preservada em [../NOTICE.md](../NOTICE.md) e [../LICENSE](../LICENSE).

Decisao atual: manter `NOTICE.md` e registrar as modificacoes locais sob **Andre Gustavo Melo da Silva** / **AndreGustavoms**, preservando a atribuicao MIT original separadamente.

## 7. Mistura de identidade

Decisao atual: criar uma identidade nova, combinando:

- autoria, nome e direcao operacional de AndreGustavoms;
- heranca de system design, guias reutilizaveis e documentacao forte da base Felixo/Felipe;
- linguagem propria Doktor, com foco em ferramenta real, clareza e reaproveitamento.

Limite: nao copiar assinatura pessoal, apresentacao civil ou autoria de terceiros para o README principal, prompts ou guias tecnicos.
