# Padroes Observados no GitHub

Este documento registra padroes recorrentes observados nos repositorios publicos de [AndreGustavoms](https://github.com/AndreGustavoms), sem transformar uma amostra pequena em regra absoluta.

## Escopo da leitura

Leitura feita em 2026-06-22, considerando apenas informacao publica:

| Fonte | Papel na leitura |
|---|---|
| [AndreGustavoms](https://github.com/AndreGustavoms) | Perfil publico e lista de repositorios publicos. |
| [AndreGustavoms/Contas.exe](https://github.com/AndreGustavoms/Contas.exe) | Principal repositorio autoral publico analisado. |
| [AndreGustavoms/Doktor-SystemDesign](https://github.com/AndreGustavoms/Doktor-SystemDesign) | Fork/base de system design; usado como contexto, nao como prova estetica autoral. |

Limite importante: havia poucos repositorios publicos. As conclusoes abaixo devem orientar a direcao inicial, mas cada projeto ainda precisa decidir conforme dominio, publico e restricoes.

## Perfil geral observado

O padrao mais forte e:

- produto operacional, nao landing page;
- frontend rico;
- backend pragmatico;
- seguranca tratada como parte da arquitetura;
- documentacao operacional versionada;
- deploy simples;
- componentes proprios em vez de biblioteca visual pesada;
- interface densa, clara e controlada.

Em uma frase:

> Priorizar ferramenta funcional, segura e bem documentada, com visual limpo, moderno e discreto.

## Padrao estetico observado

### Linguagem visual

O estilo publico mais claro e um app operacional com:

- superficie clara por padrao;
- suporte a tema escuro;
- cards limpos com borda sutil;
- sombras leves;
- cantos moderadamente arredondados;
- acento verde/ciano para acao, sucesso e foco;
- badges pequenos para status;
- icones Lucide em acoes;
- textos compactos;
- hierarquia visual por espacamento, peso e cor, nao por decoracao pesada.

### Paleta

Padrao observado:

| Uso | Direcao |
|---|---|
| Fundo claro | cinza claro frio, proximo de `#e9edf3` |
| Superficie | branco ou branco translucido |
| Texto | azul/preto frio, proximo de slate |
| Muted | slate/cinza azulado |
| Acento principal | verde/emerald |
| Acento secundario | ciano/sky |
| Estados | verde, amarelo, vermelho, neutro |

Aplicacao recomendada:

- use verde como acento funcional, nao como banho de cor;
- use ciano/azul apenas como apoio tecnologico;
- preserve bastante neutro para ferramentas de leitura e gestao;
- evite gradientes dominando a UI.

### Componentes

Componentes recorrentes:

- `Button` com variantes `default`, `outline`, `ghost`, `secondary`, `danger`;
- `Card`, `CardHeader`, `CardContent`, `CardFooter`;
- `Badge` por status;
- inputs com altura minima mobile de 44px;
- botoes com alvo de toque de 44px;
- theme toggle claro/escuro;
- icones `lucide-react`;
- classes utilitarias com tokens CSS (`--accent`, `--panel`, `--border`, `--muted`).

Regra pratica:

- comece com primitives proprias pequenas;
- use biblioteca externa para icones, nao para dominar a identidade visual;
- mantenha controles previsiveis e escaneaveis;
- em app operacional, cards devem agrupar informacao real, nao decorar a pagina.

### Layout

Padroes observados:

- app shell com navegacao compacta;
- dashboards e paineis administrativos;
- listas com busca, filtro, status e acoes;
- conteudo denso, mas dividido por superficies;
- mobile tratado como requisito real;
- estados e acoes criticas destacados.

## Padrao arquitetural observado

O repositorio autoral publico analisado aponta para:

| Camada | Padrao observado |
|---|---|
| Frontend | React + TypeScript + Vite |
| UI | Tailwind CSS + componentes proprios |
| Icones | Lucide React |
| Backend | Node.js pragmatico |
| Banco | PostgreSQL como persistencia real |
| Deploy | servico unico no inicio |
| Operacao local | script de start local |
| Documentacao | README, IA, arquitetura, deploy, seguranca |
| Seguranca | sessao server-side, reauth, auditoria, rate limit, 2FA quando faz sentido |

Isso nao substitui a baseline de [STACK-E-ARQUITETURA.md](STACK-E-ARQUITETURA.md). A leitura sugere uma variante pessoal forte para produtos fullstack em JavaScript:

```text
React + TypeScript + Vite + Tailwind
Node.js
PostgreSQL
deploy simples em um servico
documentacao operacional versionada
```

## Padrao de documentacao observado

Fortes sinais positivos:

- README com badges, stack, arquitetura, estrutura e comandos;
- `IA.md` como contexto operacional;
- docs separadas para arquitetura, deploy, seguranca e privacidade;
- checklist de seguranca;
- script de varredura de segredos;
- decisao arquitetural documentada no repositorio.

Recomendacao para projetos Doktor:

1. Todo app serio deve ter `IA.md`.
2. Todo app com deploy deve ter `docs/DEPLOY.md`.
3. Todo app com usuario, conta, token ou segredo deve ter `SECURITY.md`.
4. Todo app com dados pessoais deve ter guia de privacidade/LGPD.
5. README deve explicar o produto e como rodar, nao so listar tecnologias.

## O que levar para o Doktor System-Design

Use como direcao inicial quando o projeto nao trouxer identidade propria:

- ferramenta antes de marketing;
- interface operacional, clara e compacta;
- tema claro forte com dark mode opcional;
- verde/ciano como acento, com neutros frios;
- cards e badges para organizar dados;
- componentes proprios pequenos;
- Lucide para iconografia;
- documentacao viva no repo;
- seguranca desde o primeiro desenho.

## O que nao deve virar regra cega

- Node.js nao deve substituir Django/Python em todos os backends.
- Radius mais arredondado nao deve ser usado em toda UI densa sem criterio.
- Tema verde/ciano nao deve ser forcado em projetos com outra marca.
- Um servico unico nao deve impedir separacao quando houver jobs, filas ou escala real.
- Publicacao de repositorios privados nao foi analisada; nao inferir padroes deles.

## Checklist rapido para um novo projeto com identidade Doktor

- [ ] A primeira tela entrega uma ferramenta real, nao uma landing page vazia.
- [ ] A UI usa superficies neutras e acento funcional.
- [ ] Existem estados de loading, vazio, erro e sucesso.
- [ ] Componentes base estao em `components/ui`.
- [ ] Icones vem de Lucide quando houver equivalente.
- [ ] `IA.md` existe desde o inicio.
- [ ] README explica produto, stack, estrutura e comandos.
- [ ] Segredos e dados sensiveis foram pensados antes do deploy.
- [ ] Deploy inicial e simples, mas nao bloqueia evolucao futura.

