/** Avatares disponíveis (ilustrações SVG animadas). */
export type IconKey = 'sprout' | 'compass' | 'rocket' | 'target';

/** Métricas de evolução exibidas ao focar uma jornada. */
export type JourneyStats = {
  level: number;
  levelName: string;
  /** Progresso até o próximo nível, 0–100. */
  progress: number;
  /** Dias de sequência ativa. */
  streak: number;
  lastActivity: string;
  nextGoal: string;
};

export type Profile = {
  id: number;
  name: string;
  tagline: string;
  /** Emoji de fallback usado na navbar e no loading do browse. */
  emoji: string;
  /** Ilustração SVG da jornada. */
  icon: IconKey;
  /** Cor de acento (hex) — azul (início) evolui para dourado (maestria). */
  accent: string;
  stats: JourneyStats;
};

/**
 * As quatro jornadas, ordenadas como uma evolução: do azul (começo)
 * ao dourado (maestria). A cor conta a história do progresso.
 */
export const profiles: Profile[] = [
  {
    id: 2,
    name: 'Iniciante',
    tagline: 'O começo de tudo',
    emoji: '🌱',
    icon: 'sprout',
    accent: '#4f9dff',
    stats: {
      level: 1,
      levelName: 'Primeira Semente',
      progress: 24,
      streak: 3,
      lastActivity: 'Ontem',
      nextGoal: 'Completar sua primeira trilha',
    },
  },
  {
    id: 4,
    name: 'Explorador',
    tagline: 'Curioso por natureza',
    emoji: '🧭',
    icon: 'compass',
    accent: '#38bdf8',
    stats: {
      level: 4,
      levelName: 'Desbravador',
      progress: 41,
      streak: 9,
      lastActivity: 'Há 3 dias',
      nextGoal: 'Experimentar 5 mini apps',
    },
  },
  {
    id: 3,
    name: 'Evolução',
    tagline: 'Em plena ascensão',
    emoji: '🚀',
    icon: 'rocket',
    accent: '#e9b75e',
    stats: {
      level: 7,
      levelName: 'Em Ascensão',
      progress: 56,
      streak: 21,
      lastActivity: 'Hoje',
      nextGoal: 'Desbloquear o nível 8',
    },
  },
  {
    id: 1,
    name: 'Propósito',
    tagline: 'Sua versão mais focada',
    emoji: '🎯',
    icon: 'target',
    accent: '#f5c861',
    stats: {
      level: 12,
      levelName: 'Mestre da Constância',
      progress: 78,
      streak: 47,
      lastActivity: 'Há 2 horas',
      nextGoal: 'Concluir a trilha de Foco Extremo',
    },
  },
];
