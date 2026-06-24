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

export const featured: Featured = {
  name: 'O próximo nível é seu.',
  tagline: 'Comece hoje. Sinta a diferença amanhã.',
  background: '/backgorund%20image.png',
};

const cursos: Row[] = [
  {
    category: 'Em alta agora',
    titles: [
      { id: 1001, name: 'Foco Extremo', image: '/images/films/drama/fight-club/small.jpg' },
      { id: 1002, name: 'Disciplina na Prática', image: '/images/films/drama/the-revenant/small.jpg' },
      { id: 1003, name: 'Hábitos que Transformam', image: '/images/series/feel-good/good-will-hunting/small.jpg' },
      { id: 1004, name: 'Mentalidade de Crescimento', image: '/images/films/drama/the-prestige/small.jpg' },
      { id: 1005, name: 'Produtividade Real', image: '/images/films/drama/the-social-network/small.jpg' },
    ],
  },
  {
    category: 'Desenvolvimento pessoal',
    titles: [
      { id: 1011, name: 'Inteligência Emocional', image: '/images/series/feel-good/forrest-gump/small.jpg' },
      { id: 1012, name: 'Comunicação de Impacto', image: '/images/series/feel-good/juno/small.jpg' },
      { id: 1013, name: 'Liderança Consciente', image: '/images/series/feel-good/midnight-in-paris/small.jpg' },
      { id: 1014, name: 'Autoconhecimento Profundo', image: '/images/series/feel-good/school-of-rock/small.jpg' },
      { id: 1015, name: 'Resiliência na Adversidade', image: '/images/films/drama/kings-speech/small.jpg' },
    ],
  },
  {
    category: 'Saúde & Bem-estar',
    titles: [
      { id: 1021, name: 'Sono de Qualidade', image: '/images/series/documentaries/citizenfour/small.jpg' },
      { id: 1022, name: 'Mindfulness na Rotina', image: '/images/series/documentaries/man-on-wire/small.jpg' },
      { id: 1023, name: 'Nutrição Inteligente', image: '/images/series/documentaries/super-size-me/small.jpg' },
      { id: 1024, name: 'Movimento e Energia', image: '/images/series/documentaries/amanda-knox/small.jpg' },
      { id: 1025, name: 'Equilíbrio Mental', image: '/images/series/documentaries/tiger-king/small.jpg' },
    ],
  },
  {
    category: 'Finanças & Carreira',
    titles: [
      { id: 1031, name: 'Finanças do Zero', image: '/images/films/romance/la-la-land/small.jpg' },
      { id: 1032, name: 'Investindo com Propósito', image: '/images/films/romance/a-star-is-born/small.jpg' },
      { id: 1033, name: 'Carreira com Estratégia', image: '/images/films/romance/titanic/small.jpg' },
      { id: 1034, name: 'Empreendedorismo Real', image: '/images/films/romance/the-notebook/small.jpg' },
      { id: 1035, name: 'Networking que Funciona', image: '/images/films/romance/blue-valentine/small.jpg' },
    ],
  },
  {
    category: 'Para iniciantes',
    titles: [
      { id: 1041, name: 'Primeiros Passos', image: '/images/series/children/arthur/small.jpg' },
      { id: 1042, name: 'Rotina Poderosa', image: '/images/series/children/dora-the-explorer/small.jpg' },
      { id: 1043, name: 'Metas que Funcionam', image: '/images/series/children/paw-patrol/small.jpg' },
      { id: 1044, name: 'Mindset Inicial', image: '/images/series/children/peppa-pig/small.jpg' },
      { id: 1045, name: 'Como Estudar Melhor', image: '/images/series/children/spongebob/small.jpg' },
    ],
  },
];

const miniapps: Row[] = [
  {
    category: 'Foco & Produtividade',
    titles: [
      { id: 2001, name: 'Timer Pomodoro', image: '/images/films/thriller/a-quiet-place/small.jpg' },
      { id: 2002, name: 'Bloqueador de Distrações', image: '/images/films/thriller/black-swan/small.jpg' },
      { id: 2003, name: 'Lista de Prioridades', image: '/images/films/thriller/nightcrawler/small.jpg' },
      { id: 2004, name: 'Modo Deep Work', image: '/images/films/thriller/the-silence-of-the-lambs/small.jpg' },
      { id: 2005, name: 'Revisão Diária', image: '/images/films/thriller/joker/small.jpg' },
    ],
  },
  {
    category: 'Hábitos & Rotina',
    titles: [
      { id: 2011, name: 'Rastreador de Hábitos', image: '/images/series/comedies/arrested-development/small.jpg' },
      { id: 2012, name: 'Ritual Matinal', image: '/images/series/comedies/curb-your-enthusiasm/small.jpg' },
      { id: 2013, name: 'Diário de Intenções', image: '/images/series/comedies/family-guy/small.jpg' },
      { id: 2014, name: 'Streak de Consistência', image: '/images/series/comedies/south-park/small.jpg' },
      { id: 2015, name: 'Check-in Noturno', image: '/images/series/comedies/the-office/small.jpg' },
    ],
  },
  {
    category: 'Bem-estar mental',
    titles: [
      { id: 2021, name: 'Meditação Guiada', image: '/images/films/suspense/gone-girl/small.jpg' },
      { id: 2022, name: 'Respiração Consciente', image: '/images/films/suspense/prisoners/small.jpg' },
      { id: 2023, name: 'Diário de Gratidão', image: '/images/films/suspense/seven/small.jpg' },
      { id: 2024, name: 'Modo Ansiedade Zero', image: '/images/films/suspense/shutter-island/small.jpg' },
      { id: 2025, name: 'Afirmações Diárias', image: '/images/films/suspense/zodiac/small.jpg' },
    ],
  },
  {
    category: 'Finanças pessoais',
    titles: [
      { id: 2031, name: 'Controle de Gastos', image: '/images/series/crime/long-shot/small.jpg' },
      { id: 2032, name: 'Cofre de Metas', image: '/images/series/crime/making-a-murderer/small.jpg' },
      { id: 2033, name: 'Calculadora de Liberdade', image: '/images/series/crime/the-confession-killer/small.jpg' },
      { id: 2034, name: 'Planejador Mensal', image: '/images/series/crime/the-innocent-man/small.jpg' },
      { id: 2035, name: 'Score de Saúde Financeira', image: '/images/series/crime/the-staircase/small.jpg' },
    ],
  },
  {
    category: 'Social & Comunidade',
    titles: [
      { id: 2041, name: 'Feed de Evolução', image: '/images/films/children/despicable-me/small.jpg' },
      { id: 2042, name: 'Desafio em Grupo', image: '/images/films/children/frozen/small.jpg' },
      { id: 2043, name: 'Ranking Semanal', image: '/images/films/children/hotel-transylvania/small.jpg' },
      { id: 2044, name: 'Mentor Connect', image: '/images/films/children/spirited-away/small.jpg' },
      { id: 2045, name: 'Live de Foco', image: '/images/films/children/up/small.jpg' },
    ],
  },
];

export type Category = 'cursos' | 'miniapps';

export const catalog: Record<Category, Row[]> = { cursos, miniapps };
