export interface Demon {
  race: string;
  lvl: number;
  name: string;
  price: number;
  inherit?: string;
  inherits?: boolean[];
  stats: number[];
  resists: number[];
  fusion: string;
  skills: { [skill: string]: number; };
  prereq?: string;
  affinities?: number[];
  estats?: number[];
  area?: string;
  drop?: string;
  isEnemy?: boolean;
  align?: string;
}

export interface NamePair {
  name1: string;
  name2: string;
}

export interface Skill {
  element: string;
  rank: number;
  name: string;
  cost: number;
  effect: string;
  level: number;
  damage?: string;
  requires?: string;
  inherit?: string;
  unique?: boolean;
  learnedBy: { demon: string, level: number }[];
}

export interface Compendium {
  dlcDemons: { [name: string]: boolean };
  allDemons: Demon[];
  allSkills: Skill[];
  specialDemons: Demon[];

  getDemon(name: string): Demon;
  getSkill(name: string): Skill;
  getIngredientDemonLvls(race: string): number[];
  getResultDemonLvls(race: string): number[];
  getSpecialNameEntries(name: string): string[];
  getSpecialNamePairs(name: string): NamePair[];

  reverseLookupSpecial(ingredient: string): { result: string, recipe: string }[];
  reverseLookupDemon(race: string, lvl: number): string;
  isElementDemon(name: string): boolean;
}

export interface CompendiumConfig {
  appTitle: string;
  raceOrder: { [race: string]: number };
}