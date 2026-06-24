# Identidade Doktor

Este documento define a identidade propria do Doktor System-Design: uma mistura entre a direcao autoral observada nos projetos de AndreGustavoms e a heranca tecnica/visual do material MIT usado como base.

## Principio central

O Doktor deve parecer uma ferramenta de engenharia viva: direta, reutilizavel, bem documentada e pronta para virar base de projeto real.

Em uma frase:

```text
Operacional no uso, tecnico na estrutura, limpo no visual e honesto na origem.
```

## Mistura de influencias

| Fonte | O que entra | O que nao entra |
|-------|-------------|-----------------|
| AndreGustavoms | autoria, nome Doktor, direcao operacional, stack pragmatica, acento verde/ciano, apps funcionais | depender de uma unica stack para todo problema |
| Base Felixo/Felipe | ideia de system design reutilizavel, guias como biblioteca, documentacao forte, padroes transferiveis, cuidado com setup e qualidade | assinatura pessoal, autoria ativa, identidade civil no corpo dos guias |
| Doktor novo | fusao dos dois: manual tecnico com cara de produto, pronto para IA e para projeto real | copia literal de marca, texto ou estilo pessoal de terceiros |

## Personalidade visual

Quando nao houver identidade de produto mais especifica, use:

- fundo claro frio;
- superficies brancas ou neutras;
- borda sutil;
- radius moderado;
- acento verde/ciano para foco, sucesso e acao primaria;
- texto compacto;
- cards apenas para agrupar informacao real;
- icones Lucide;
- breadcrumbs tecnicos, botoes de copiar e barras de metadata quando a tela lidar com arquivos, caminhos ou estruturas;
- estados visuais claros para loading, vazio, erro e sucesso;
- tema escuro opcional, nao obrigatorio.

Para materiais mais editoriais ou guias, pode haver um toque mais "handbook": secoes bem nomeadas, checklists, tabelas e exemplos copiavies.

## Personalidade tecnica

O Doktor deve favorecer:

- projetos que rodam localmente sem ritual complexo;
- scripts de start e instalacao simples;
- README util antes de README bonito;
- `IA.md` como memoria operacional;
- decisoes documentadas;
- componentes proprios pequenos antes de dependencia visual pesada;
- seguranca e privacidade desde o desenho;
- guias opcionais por dominio, nao regras universais.

## Tom de escrita

Use tom direto e tecnico:

- diga quando usar;
- diga quando nao usar;
- mostre o resultado esperado;
- mostre codigo ou checklist quando ajudar;
- evite frase decorativa;
- evite vender demais;
- registre limites e riscos.

Padrao de abertura recomendado:

```text
# Nome do Padrao

## Quando usar

## Quando nao usar

## Resultado esperado
```

## Paleta de referencia

Use como ponto de partida, nao como obrigacao:

| Token | Direcao |
|-------|---------|
| `background` | cinza frio claro |
| `surface` | branco |
| `text` | slate/preto frio |
| `muted` | cinza azulado |
| `border` | cinza claro frio |
| `primary` | emerald/cyan |
| `success` | emerald |
| `warning` | amber |
| `danger` | red |
| `info` | sky/cyan |

Evite interfaces dominadas por roxo, azul escuro ou glow pesado. Use esses recursos so quando o dominio do projeto pedir.

## Regra de autoria

O README e os projetos derivados usam autoria de Andre Gustavo Melo da Silva / AndreGustavoms.

A influencia Felixo/Felipe deve aparecer como origem preservada em `NOTICE.md`, `LICENSE` e neste documento de identidade. Nos guias tecnicos, prefira linguagem neutra e reaproveitavel.

## Frase de controle

Se uma pessoa olha para um projeto Doktor, ela deve perceber que e uma ferramenta seria, documentada e reutilizavel, com identidade propria, sem precisar conhecer os projetos que inspiraram a base.
