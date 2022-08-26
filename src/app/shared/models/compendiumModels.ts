export interface Demon {
  race: string
  lvl: number
  stats: number[]
  resists: string
  price?: number
  skills: { [skill: string]: number }
  inherits?: string
  affinities?: number[]
  estats?: number[]
  area?: string
  drop?: string
  isEnemy?: boolean
  align?: string
}

export interface Skill {
  element: string
  cost: number
  effect: string
  learnedBy: { demon: string, level: number }[]
  damage?: string
  requires?: string
  inherit?: string
  unique?: boolean

  populateLearnedBy(compendium: Compendium): void
}

export interface Compendium {
  demons: { [name: string]: Demon}
  skills: { [name: string]: Skill}
  raceOrder: { [race: string]: number }
  specialDemons?: Demon[]
  dlcDemons?: Demon[]

  getDemon(name: string): Demon
  getSkill(name: string): Skill
}

export interface CompendiumConfig {
  demonCols: string[]
  statCols: string[]
  resistanceCols?: string[]
  affinityCols?: string[]
}