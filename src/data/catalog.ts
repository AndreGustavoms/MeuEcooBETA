export type Title = {
  id: number;
  name: string;
  image: string;
};

export type Row = {
  category: string;
  titles: Title[];
};

export type Featured = {
  name: string;
  tagline: string;
  background: string;
};

const visuals = {
  cursos: '/images/flash/flash-cursos.svg',
  miniapps: '/images/flash/flash-miniapps.svg',
  rotina: '/images/flash/flash-rotina.svg',
  foco: '/images/flash/flash-foco.svg',
  comunidade: '/images/flash/flash-comunidade.svg',
  beneficios: '/images/flash/flash-beneficios.svg',
  catalogo: '/images/flash/flash-catalogo.svg',
  painel: '/images/flash/flash-dashboard.svg',
} as const;

export const featured: Featured = {
  name: 'O próximo nível é seu.',
  tagline: 'Comece hoje. Sinta a diferença amanhã.',
  background: visuals.painel,
};

const cursos: Row[] = [
  {
    category: 'Em alta agora',
    titles: [
      { id: 1001, name: 'Foco Extremo', image: visuals.foco },
      { id: 1002, name: 'Disciplina na Prática', image: visuals.rotina },
      { id: 1003, name: 'Hábitos que Transformam', image: visuals.rotina },
      { id: 1004, name: 'Mentalidade de Crescimento', image: visuals.painel },
      { id: 1005, name: 'Produtividade Real', image: visuals.foco },
    ],
  },
  {
    category: 'Desenvolvimento pessoal',
    titles: [
      { id: 1011, name: 'Inteligência Emocional', image: visuals.painel },
      { id: 1012, name: 'Comunicação de Impacto', image: visuals.cursos },
      { id: 1013, name: 'Liderança Consciente', image: visuals.catalogo },
      { id: 1014, name: 'Autoconhecimento Profundo', image: visuals.cursos },
      { id: 1015, name: 'Resiliência na Adversidade', image: visuals.rotina },
    ],
  },
  {
    category: 'Saúde & Bem-estar',
    titles: [
      { id: 1021, name: 'Sono de Qualidade', image: visuals.rotina },
      { id: 1022, name: 'Mindfulness na Rotina', image: visuals.foco },
      { id: 1023, name: 'Nutrição Inteligente', image: visuals.beneficios },
      { id: 1024, name: 'Movimento e Energia', image: visuals.comunidade },
      { id: 1025, name: 'Equilíbrio Mental', image: visuals.painel },
    ],
  },
  {
    category: 'Finanças & Carreira',
    titles: [
      { id: 1031, name: 'Finanças do Zero', image: visuals.painel },
      { id: 1032, name: 'Investindo com Propósito', image: visuals.beneficios },
      { id: 1033, name: 'Carreira com Estratégia', image: visuals.catalogo },
      { id: 1034, name: 'Empreendedorismo Real', image: visuals.cursos },
      { id: 1035, name: 'Networking que Funciona', image: visuals.comunidade },
    ],
  },
  {
    category: 'Para iniciantes',
    titles: [
      { id: 1041, name: 'Primeiros Passos', image: visuals.cursos },
      { id: 1042, name: 'Rotina Poderosa', image: visuals.rotina },
      { id: 1043, name: 'Metas que Funcionam', image: visuals.foco },
      { id: 1044, name: 'Mindset Inicial', image: visuals.painel },
      { id: 1045, name: 'Como Estudar Melhor', image: visuals.catalogo },
    ],
  },
];

const miniapps: Row[] = [
  {
    category: 'Foco & Produtividade',
    titles: [
      { id: 2001, name: 'Timer Pomodoro', image: visuals.foco },
      { id: 2002, name: 'Bloqueador de Distrações', image: visuals.painel },
      { id: 2003, name: 'Lista de Prioridades', image: visuals.rotina },
      { id: 2004, name: 'Modo Deep Work', image: visuals.foco },
      { id: 2005, name: 'Revisão Diária', image: visuals.catalogo },
    ],
  },
  {
    category: 'Hábitos & Rotina',
    titles: [
      { id: 2011, name: 'Rastreador de Hábitos', image: visuals.rotina },
      { id: 2012, name: 'Ritual Matinal', image: visuals.painel },
      { id: 2013, name: 'Diário de Intenções', image: visuals.catalogo },
      { id: 2014, name: 'Streak de Consistência', image: visuals.comunidade },
      { id: 2015, name: 'Check-in Noturno', image: visuals.rotina },
    ],
  },
  {
    category: 'Bem-estar mental',
    titles: [
      { id: 2021, name: 'Meditação Guiada', image: visuals.foco },
      { id: 2022, name: 'Respiração Consciente', image: visuals.rotina },
      { id: 2023, name: 'Diário de Gratidão', image: visuals.painel },
      { id: 2024, name: 'Modo Ansiedade Zero', image: visuals.foco },
      { id: 2025, name: 'Afirmações Diárias', image: visuals.cursos },
    ],
  },
  {
    category: 'Finanças pessoais',
    titles: [
      { id: 2031, name: 'Controle de Gastos', image: visuals.painel },
      { id: 2032, name: 'Cofre de Metas', image: visuals.beneficios },
      { id: 2033, name: 'Calculadora de Liberdade', image: visuals.catalogo },
      { id: 2034, name: 'Planejador Mensal', image: visuals.rotina },
      { id: 2035, name: 'Score de Saúde Financeira', image: visuals.painel },
    ],
  },
  {
    category: 'Social & Comunidade',
    titles: [
      { id: 2041, name: 'Feed de Evolução', image: visuals.comunidade },
      { id: 2042, name: 'Desafio em Grupo', image: visuals.comunidade },
      { id: 2043, name: 'Ranking Semanal', image: visuals.painel },
      { id: 2044, name: 'Mentor Connect', image: visuals.beneficios },
      { id: 2045, name: 'Live de Foco', image: visuals.foco },
    ],
  },
];

export type Category = 'cursos' | 'miniapps' | 'home';

const home: Row[] = [];

export const catalog: Record<Category, Row[]> = { home, cursos, miniapps };
