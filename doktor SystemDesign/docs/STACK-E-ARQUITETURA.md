# Stack e Arquitetura

Este documento registra a stack padrao do Doktor System-Design. Ela nao e uma regra cega: cada projeto pode desviar quando houver motivo tecnico claro, mas a decisao precisa ficar documentada.

Para padroes observados nos repositorios publicos do autor, incluindo a variante fullstack em JavaScript usada no `Contas.exe`, consulte [PADROES-OBSERVADOS-GITHUB.md](PADROES-OBSERVADOS-GITHUB.md).

## 1. Regra principal

Use a stack mais simples que resolva o problema com boa manutencao.

Evite escolher tecnologia por gosto abstrato. A stack deve ser justificada por:

- tamanho e complexidade do projeto;
- perfil de quem vai manter;
- necessidade de deploy;
- integracoes externas;
- requisitos de performance, seguranca e observabilidade;
- reaproveitamento de codigo existente.

## 2. Frontend

### Padrao para aplicacoes web

| Camada | Escolha padrao | Quando usar |
|--------|----------------|-------------|
| Linguagem | TypeScript | Interfaces com estado, regras de UI ou crescimento esperado. |
| Framework | React | Dashboards, apps internos, paineis, CRUDs, ferramentas e interfaces reutilizaveis. |
| Build | Vite | Projetos React leves, rapidos e com dev server simples. |
| Estilo | Tailwind CSS | Quando a interface precisa de consistencia visual e customizacao rapida. |

### Alternativas aceitas

| Alternativa | Quando usar |
|-------------|-------------|
| HTML/CSS/JavaScript puro | Paginas pequenas, demos, prototipos simples ou entregas sem estado complexo. |
| Bootstrap | Projetos legados, admin simples ou quando a velocidade importa mais que identidade visual propria. |
| CSS puro | Componentes pequenos, paginas estaticas e casos onde Tailwind seria excesso. |

### Regra de decisao

- Use React + TypeScript + Vite + Tailwind por padrao em apps.
- Use HTML/CSS/JS puro quando React seria exagero.
- Nao misture Bootstrap e Tailwind no mesmo projeto sem justificativa.

## 3. Backend

### Padrao para APIs e sistemas CRUD

| Camada | Escolha padrao | Quando usar |
|--------|----------------|-------------|
| Linguagem | Python | APIs, automacoes, integracoes, scripts e backends de produtividade alta. |
| Framework | Django | Sistemas CRUD, paineis administrativos, apps com usuarios, permissoes e banco relacional. |
| API | Django REST Framework | APIs REST com serializers, autenticacao e contratos estaveis. |
| Banco inicial | SQLite | Prototipos, MVPs locais e apps pequenos. |
| Banco em producao | PostgreSQL | Aplicacoes publicas, multiusuario ou com crescimento esperado. |
| Testes | pytest | Testes unitarios, integracao e regressao. |

### Alternativas aceitas

| Alternativa | Quando usar |
|-------------|-------------|
| FastAPI | APIs pequenas, alta enfase em tipagem/contrato ou servicos mais enxutos. |
| Node.js/TypeScript | Quando o projeto ja vive na stack JS, exige integracao forte com bibliotecas Node ou segue a variante autoral observada em produtos fullstack como `Contas.exe`. |
| C#/.NET | Contexto corporativo, legado, requisito explicito ou necessidade tecnica concreta. |

### Regra de decisao

- Use Django + DRF quando o problema for backend comum com banco, usuarios, CRUD e API.
- Use FastAPI quando o servico for pequeno, focado e sem necessidade do ecossistema Django.
- Use .NET somente quando houver motivo concreto.

## 4. Dados e persistencia

| Cenario | Escolha recomendada |
|---------|---------------------|
| Local, estudo, prototipo | SQLite |
| Producao relacional | PostgreSQL |
| Cache simples | Django cache framework |
| Cache compartilhado/producao | Redis |
| Arquivos locais | Storage local com caminho configuravel |
| Arquivos publicos/producao | Storage externo com URL publica e controle de acesso |

## 5. Deploy e operacao

| Cenario | Escolha recomendada |
|---------|---------------------|
| Backend pequeno ou medio | Railway |
| Frontend estatico | Vercel, Netlify ou GitHub Pages |
| Projeto fullstack simples | Railway ou plataforma equivalente com banco gerenciado |
| Necessidade corporativa | Infra definida pelo ambiente do cliente/time |

Railway continua como guia opcional porque reduz complexidade operacional para backends pequenos e medios. Nao deve ser tratado como obrigatorio quando o projeto tiver requisitos especificos de infraestrutura.

## 6. Scripts e automacao

| Uso | Escolha recomendada |
|-----|---------------------|
| Automacao cross-platform | Python |
| Windows/PowerShell | PowerShell |
| Linux/macOS/WSL | Bash/Zsh |
| Apps web locais | `start_app.py` na raiz |

Todo app web reutilizavel deve priorizar `python start_app.py` como comando de entrada.

## 7. Como registrar excecoes

Quando um projeto desviar da stack padrao, registre no `IA.md` do projeto:

- stack escolhida;
- alternativas consideradas;
- motivo da decisao;
- impacto em deploy, testes e manutencao;
- riscos assumidos.

Exemplo:

```text
DECISAO: usar FastAPI em vez de Django.
MOTIVO: API pequena, sem painel admin, com contrato OpenAPI como requisito central.
RISCO: menos recursos prontos de auth/admin; compensado por escopo menor.
```
