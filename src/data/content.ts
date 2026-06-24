/**
 * Conteúdo da landing page Ecoo.
 * Texto autoral — estrutura inspirada em landings de streaming, sem copiar copy de terceiros.
 */

export type FeatureBlock = {
  id: number;
  title: string;
  subtitle: string;
  /** Emoji usado como arte leve, evita dependência de imagens externas. */
  art: string;
  reverse?: boolean;
};

export const features: FeatureBlock[] = [
  {
    id: 1,
    title: 'Sua sala vira cinema.',
    subtitle:
      'Assista na smart TV, no console, no projetor ou no navegador — em até 4K, com o som ocupando o ambiente inteiro.',
    art: '📺',
  },
  {
    id: 2,
    title: 'Leve o Ecoo no bolso.',
    subtitle:
      'Baixe episódios e filmes para ver offline no avião, no metrô ou onde a internet não chega. Seus dados ficam intactos.',
    art: '📱',
    reverse: true,
  },
  {
    id: 3,
    title: 'Continue de onde parou.',
    subtitle:
      'Comece no celular e termine na TV. O Ecoo sincroniza o ponto exato em todos os seus aparelhos, sem cobrar a mais por isso.',
    art: '💻',
  },
  {
    id: 4,
    title: 'Um perfil para cada história.',
    subtitle:
      'Até cinco perfis, com recomendações que aprendem o gosto de cada pessoa da casa — e um modo infantil de verdade.',
    art: '👥',
    reverse: true,
  },
];

export type Faq = {
  id: number;
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    id: 1,
    question: 'O que é o Ecoo?',
    answer:
      'O Ecoo é um serviço de streaming com filmes, séries, documentários e produções originais. Você assiste quanto quiser, quando quiser, sem anúncios e por um preço mensal único. Toda semana entra conteúdo novo no catálogo.',
  },
  {
    id: 2,
    question: 'Quanto custa o Ecoo?',
    answer:
      'Os planos começam em R$ 18,90 por mês. Sem fidelidade e sem taxas escondidas — você escolhe a qualidade de imagem e o número de telas simultâneas que combinam com você.',
  },
  {
    id: 3,
    question: 'Onde posso assistir?',
    answer:
      'Em qualquer lugar e a qualquer hora, num número ilimitado de aparelhos. Entre com a sua conta para assistir pelo site, no app de celulares e tablets, em smart TVs, consoles e media players.',
  },
  {
    id: 4,
    question: 'Como cancelo?',
    answer:
      'Sem complicação. Não há contrato nem multa: você cancela online em dois cliques e pode voltar quando quiser. Começa e para a sua assinatura na hora que decidir.',
  },
  {
    id: 5,
    question: 'O Ecoo é bom para crianças?',
    answer:
      'Sim. O perfil infantil mostra apenas títulos adequados à idade e permite que os responsáveis bloqueiem conteúdos por classificação. As crianças assistem com segurança e tranquilidade.',
  },
];
