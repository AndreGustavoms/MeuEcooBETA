# Design System Frontend

Este documento define o padrao de qualidade para frontends no Doktor System-Design. Use-o para criar ou revisar interfaces com consistencia visual, responsividade, acessibilidade, manutencao e boa arquitetura de componentes.

Para escolher stack, consulte tambem [../docs/STACK-E-ARQUITETURA.md](../docs/STACK-E-ARQUITETURA.md). Para identidade visual e tecnica do Doktor, consulte [../docs/IDENTIDADE-DOKTOR.md](../docs/IDENTIDADE-DOKTOR.md). Para direcao estetica observada nos repositorios publicos do autor, consulte [../docs/PADROES-OBSERVADOS-GITHUB.md](../docs/PADROES-OBSERVADOS-GITHUB.md).

## 1. Papel deste documento

Use este guia para responder:

- A interface e clara, consistente e responsiva?
- Os componentes sao reutilizaveis e bem nomeados?
- A identidade visual esta documentada?
- Estados de loading, erro, vazio e sucesso foram considerados?
- A UI funciona em mobile e desktop?
- A implementacao evita acoplamento visual e logico desnecessario?

Este arquivo nao substitui um briefing de produto. Ele define padroes de qualidade.

## 2. Stack padrao

Resumo da baseline:

| Cenario | Padrao |
|---------|--------|
| App web com estado e componentes | React + TypeScript + Vite + Tailwind CSS |
| Pagina simples ou prototipo pequeno | HTML + CSS + JavaScript |
| Projeto legado/admin rapido | Bootstrap quando ja fizer sentido |

Regra pratica:

- Use React + TypeScript + Vite + Tailwind para apps.
- Use HTML/CSS/JS puro quando React for excesso.
- Nao misture Bootstrap e Tailwind sem justificativa.
- Documente desvios no `IA.md` do projeto.

## 3. Principios visuais

### Direcao Doktor observada

Quando o projeto nao trouxer identidade propria, comece pela direcao definida em `IDENTIDADE-DOKTOR.md`: ferramenta operacional clara, superficies neutras, acento verde/ciano, cards compactos, badges de status, icones Lucide, documentacao forte e tema claro com dark mode opcional.

Essa direcao nao e obrigatoria para toda marca. Ela serve como ponto de partida para produtos Doktor quando nao houver briefing visual mais especifico.

### Heranca de system design

A base original trouxe uma ideia importante: transformar solucoes recorrentes em guias reaproveitaveis. No Doktor, essa heranca vira uma linguagem propria: cada padrao deve ser aplicavel sem conhecer o projeto original, mas ainda carregar o cuidado de manual tecnico, checklist e exemplo pratico.

### Clareza antes de decoracao

- A tela deve comunicar prioridade, estado e proxima acao rapidamente.
- Efeitos visuais nao podem competir com conteudo ou controles.
- Texto deve ser curto, direto e escaneavel.

### Consistencia

- Use uma escala previsivel de espacamento.
- Reaproveite tokens de cor, radius, sombra e tipografia.
- Componentes com o mesmo papel devem ter o mesmo comportamento.

### Responsividade

- Projete mobile-first.
- Evite layouts que dependem de largura fixa.
- Componentes devem funcionar em telas pequenas sem sobreposicao.
- Tabelas grandes precisam de estrategia: scroll horizontal, cards responsivos ou colunas priorizadas.

### Acessibilidade

- Todo controle interativo precisa ser acessivel por teclado.
- Use contraste suficiente.
- Inputs precisam de label visivel ou associada.
- Estados de foco devem ser perceptiveis.
- Icones sem texto precisam de `aria-label` ou tooltip adequado.

## 4. Tokens de design

Cada projeto deve declarar seus tokens principais.

### Cores

Defina no minimo:

- cor de fundo;
- cor de superficie;
- texto principal;
- texto secundario;
- borda;
- destaque/acao primaria;
- sucesso;
- alerta;
- erro;
- informacao.

Evite que a interface inteira dependa de uma unica familia de cor. Use contraste e hierarquia visual.

### Tipografia

Defina:

- fonte base;
- escala de titulos;
- tamanho padrao de corpo;
- peso para enfase;
- altura de linha;
- regra para textos longos.

Nao use fonte hero em cards, tabelas, sidebars ou paineis densos.

### Espacamento

Use escala consistente, por exemplo:

```text
4, 8, 12, 16, 24, 32, 48, 64
```

Evite ajustes aleatorios por componente.

### Radius e borda

- Cards e paineis: ate 8px por padrao.
- Botoes e inputs: consistentes entre si.
- Use borda para separar superfices quando sombra for excesso.

## 5. Arquitetura de componentes

Organizacao recomendada:

```text
src/
|-- components/
|   |-- ui/          # Button, Card, Input, Modal, Badge
|   |-- layout/      # Header, Sidebar, Shell
|   `-- feature/     # Componentes especificos de dominio
|-- pages/
|-- hooks/
|-- services/
|-- utils/
|-- styles/
`-- main.tsx
```

### Componentes base

Todo projeto com UI reutilizavel deve ter, quando aplicavel:

- `Button`
- `Input`
- `Select`
- `Checkbox`
- `Textarea`
- `Card`
- `Badge`
- `Modal/Dialog`
- `Toast/Alert`
- `Tabs`
- `Table` ou lista estruturada
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `PathBreadcrumb`
- `CopyPathButton`
- `MetadataBar`

Para cabecalhos tecnicos com caminho, copiar e ultima atividade, use [../guias/frontend/GUIA-BREADCRUMB-E-METADATA-BAR.md](../guias/frontend/GUIA-BREADCRUMB-E-METADATA-BAR.md).

### Variantes

Prefira variantes explicitas por props:

```text
variant: primary | secondary | ghost | danger
size: sm | md | lg
state: default | loading | disabled
```

Evite duplicar componentes quando uma variante clara resolve.

## 6. Estados obrigatorios

Toda tela relevante deve considerar:

- carregando;
- vazio;
- erro;
- sucesso;
- permissao negada;
- dado parcial;
- item selecionado;
- estado desabilitado;
- interacao em andamento.

Uma tela sem estado vazio ou erro ainda nao esta pronta.

## 7. Formularios

Padroes:

- label claro;
- placeholder apenas como apoio, nao como label;
- mensagem de erro por campo;
- validacao antes de enviar;
- feedback de envio;
- bloqueio contra duplo submit;
- foco no primeiro erro quando possivel.

Erros devem explicar como corrigir.

## 8. Navegacao

Escolha o padrao conforme o produto:

| Cenario | Navegacao recomendada |
|---------|-----------------------|
| App operacional | Sidebar ou topbar compacta |
| Dashboard | Sidebar + breadcrumbs quando houver profundidade |
| Site simples | Header responsivo |
| Fluxo guiado | Steps/progresso |

Evite landing page quando o pedido for construir ferramenta, app ou dashboard. A primeira tela deve ser a experiencia util.

## 9. Animacoes

Use animacao para orientar, nao para distrair.

Permitido:

- hover sutil;
- transicao de abertura/fechamento;
- feedback de loading;
- entrada de item em lista;
- realce temporario apos acao.

Evite:

- efeitos constantes competindo com conteudo;
- animacoes longas em ferramentas operacionais;
- decoracao pesada sem funcao;
- dependencia de animacao para entender a UI.

Respeite `prefers-reduced-motion` quando houver animacoes relevantes.

## 10. Dados e listas

Para tabelas, listas e dashboards:

- defina ordenacao padrao;
- mostre filtros quando houver muitos itens;
- preserve estado de busca/filtro quando fizer sentido;
- exiba contagem;
- trate lista vazia;
- diferencie loading inicial de atualizacao;
- evite truncar informacao critica sem tooltip ou detalhe.

## 11. Integracao com backend

Servicos de API devem ficar fora de componentes visuais.

Organizacao recomendada:

```text
services/
|-- apiClient.ts
|-- usersService.ts
`-- projectsService.ts
```

Componentes devem consumir hooks ou services, nao montar URLs e regras HTTP diretamente.

## 12. Checklist frontend

Antes de considerar uma entrega pronta:

- [ ] A stack escolhida esta documentada ou segue a baseline.
- [ ] Layout funciona em mobile e desktop.
- [ ] Componentes base foram reutilizados.
- [ ] Estados de loading, vazio e erro existem.
- [ ] Formularios validam entrada e mostram erro claro.
- [ ] Textos nao estouram containers.
- [ ] Cores e contraste sao adequados.
- [ ] Interacoes por teclado e foco foram consideradas.
- [ ] API/services estao separados da UI.
- [ ] README, `IA.md` ou docs afetados foram atualizados.

## 13. Frase de controle

Uma interface boa para o Doktor System-Design e aquela que uma pessoa consegue usar, manter e adaptar sem precisar entender o projeto original que inspirou seus componentes.
