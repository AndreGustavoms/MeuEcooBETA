# Prompt Base Frontend

Use este modelo para pedir a uma IA ou pessoa desenvolvedora que implemente, revise ou planeje um frontend seguindo o Doktor System-Design.

Antes de usar, consulte:

- [GUIA_MINIMO_QUALIDADE.md](GUIA_MINIMO_QUALIDADE.md)
- [DESIGN_SYSTEM_FRONTEND.md](DESIGN_SYSTEM_FRONTEND.md)
- [../docs/STACK-E-ARQUITETURA.md](../docs/STACK-E-ARQUITETURA.md)

## 1. Prompt curto

```text
Voce vai atuar como engenheiro frontend neste projeto.

Siga:
- core/GUIA_MINIMO_QUALIDADE.md
- core/DESIGN_SYSTEM_FRONTEND.md
- docs/STACK-E-ARQUITETURA.md

Objetivo:
[descreva a tela, fluxo ou componente]

Contexto:
[stack atual, identidade visual, dados, API, restricoes]

Requisitos:
- [requisito 1]
- [requisito 2]
- [requisito 3]

Obrigatorio:
- pensar em mobile e desktop;
- criar estados de loading, vazio e erro;
- separar UI, services e utilidades;
- validar textos para nao estourarem containers;
- manter acessibilidade basica;
- atualizar README/IA.md/docs se comportamento ou comandos mudarem;
- informar como foi validado.
```

## 2. Prompt completo

```text
Voce vai trabalhar no frontend deste projeto com foco em clareza, responsividade, acessibilidade e manutencao.

Leia e siga estes documentos:
- core/GUIA_MINIMO_QUALIDADE.md
- core/DESIGN_SYSTEM_FRONTEND.md
- docs/STACK-E-ARQUITETURA.md
- IA.md, se existir

Objetivo da tarefa:
[explique a entrega esperada]

Estado atual:
- framework/build:
- estilo:
- componentes existentes:
- rotas/telas:
- API/dados:
- comando para rodar:

Publico e uso:
- quem usa:
- tarefa principal:
- contexto de uso:

Requisitos de UI:
- layout:
- componentes:
- estados:
- responsividade:
- acessibilidade:
- textos:

Restricoes:
- nao usar:
- nao alterar:
- manter compatibilidade com:

Arquitetura esperada:
- componentes base em `components/ui`;
- layout em `components/layout`;
- componentes de dominio separados;
- services/hooks fora da camada visual;
- tokens ou constantes visuais reutilizaveis;
- estados de loading, vazio, erro e sucesso.

Validacao esperada:
- rodar build/lint/test quando existir;
- validar visualmente mobile e desktop;
- registrar verificacao manual quando nao houver teste automatico;
- apontar risco residual.

Entrega:
- implementar ou revisar a solucao;
- atualizar documentacao afetada;
- explicar o que mudou, por que mudou, como foi validado e qual risco sobrou.
```

## 3. Escolha de stack

Use a baseline:

| Cenario | Stack sugerida |
|---------|----------------|
| App web com estado/componentes | React + TypeScript + Vite + Tailwind CSS |
| Pagina simples/prototipo pequeno | HTML + CSS + JavaScript |
| Admin/legado rapido | Bootstrap quando ja fizer sentido |

Quando a stack fugir da baseline, registre:

```text
DECISAO:
ALTERNATIVAS:
MOTIVO:
RISCO:
VALIDACAO:
```

## 4. Checklist para a resposta

A resposta ou entrega deve cobrir:

- [ ] stack escolhida ou mantida;
- [ ] componentes reutilizaveis;
- [ ] responsividade;
- [ ] estados de loading/vazio/erro;
- [ ] acessibilidade basica;
- [ ] separacao entre UI e acesso a dados;
- [ ] textos sem overflow;
- [ ] validacao visual ou automatizada;
- [ ] documentacao atualizada.

## 5. Anti-padroes

Evite pedir ou aceitar:

- landing page quando o pedido e app/ferramenta;
- componentes gigantes com regra de API embutida;
- botao sem estado disabled/loading;
- formulario sem erro por campo;
- tabela que quebra no mobile sem alternativa;
- texto decorativo explicando como usar a propria interface;
- UI dependente de uma unica cor sem hierarquia;
- animacao constante competindo com conteudo;
- mudanca sem atualizacao de README/IA.md quando comandos ou comportamento mudam.
