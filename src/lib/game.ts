export type CharacterClass = "warrior" | "mage" | "archer";

export const TOTAL_POINTS = 30;
export const MIN_STAT = 1;
export const MAX_STAT = 20;

export interface Stats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
}

export interface ClassDef {
  id: CharacterClass;
  name: string;
  tagline: string;
  description: string;
  base: Stats;
  color: string; // tailwind class color token
  emoji: string;
}

export const CLASSES: ClassDef[] = [
  {
    id: "warrior",
    name: "Guerreiro",
    tagline: "Força bruta na linha de frente",
    description: "Mestre das armas pesadas. Recebe e causa muito dano.",
    base: { strength: 10, agility: 5, intelligence: 3, vitality: 8 },
    color: "warrior",
    emoji: "⚔️",
  },
  {
    id: "mage",
    name: "Mago",
    tagline: "Magia arcana devastadora",
    description: "Conjura feitiços poderosos. Frágil, mas mortal à distância.",
    base: { strength: 3, agility: 5, intelligence: 12, vitality: 4 },
    color: "mage",
    emoji: "🔮",
  },
  {
    id: "archer",
    name: "Arqueiro",
    tagline: "Precisão e velocidade",
    description: "Ataca de longe com flechas certeiras. Ágil e versátil.",
    base: { strength: 6, agility: 11, intelligence: 4, vitality: 5 },
    color: "archer",
    emoji: "🏹",
  },
];

export const STAT_LABELS: Record<keyof Stats, { label: string; short: string; color: string; icon: string }> = {
  strength: { label: "Força", short: "FOR", color: "strength", icon: "💪" },
  agility: { label: "Agilidade", short: "AGI", color: "agility", icon: "🏃" },
  intelligence: { label: "Inteligência", short: "INT", color: "intelligence", icon: "🧠" },
  vitality: { label: "Vitalidade", short: "VIT", color: "vitality", icon: "❤️" },
};

export function getClass(id: string): ClassDef | undefined {
  return CLASSES.find((c) => c.id === id);
}

export function totalSpent(stats: Stats): number {
  return stats.strength + stats.agility + stats.intelligence + stats.vitality;
}
