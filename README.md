# MeuEcooBETA — Landing page Ecoo

Landing page **autoral** no estilo de serviços de streaming, criada como requisição de trabalho.
A marca, a identidade visual e todo o texto são originais (**Ecoo** — *"histórias que ecoam em você"*);
o projeto se inspira apenas na **estrutura de seções** comum a esse tipo de página, sem copiar código
ou conteúdo de terceiros.

## Stack

Segue a stack padrão do [Doktor System Design](./doktor%20SystemDesign/docs/STACK-E-ARQUITETURA.md):

- **React 19** + **TypeScript**
- **Vite** (build e dev server)
- **Tailwind CSS v4** (tema `ecoo`/`ink` em `src/index.css`)

## Estrutura

```
src/
  components/   Hero, FeatureRow, FaqAccordion, Footer, EmailCTA, Logo
  data/         content.ts  (textos das seções e FAQ, conteúdo autoral)
  App.tsx       composição da página
  index.css     tema e estilos base
```

A página é composta por: **Hero** (navbar + chamada + captação de e-mail), faixas de
**destaque alternadas**, **FAQ em accordion** e **rodapé**. O formulário de e-mail é
apenas front-end (valida o formato e confirma localmente) — não há backend.

## Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # build de produção em dist/
npm run preview  # serve o build localmente
```

## Aviso

Projeto de demonstração, sem afiliação a nenhum serviço de streaming real.
