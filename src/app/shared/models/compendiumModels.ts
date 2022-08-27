export interface Demon {
  race: string
  lvl: number
  stats: number[]
  resists: string
  skills: { [skill: string]: number }
  price?: number
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
  effect: string
  learnedBy: { [demon: string]: number }
  //negative cost indicates a passive skill
  cost: string
  target?: string
  requires?: string
  inherit?: string
  unique?: string
  skillCard?: string
  inheritFrom?: string[]
  dSource?: string
  transferable?: string
  rank?: number
}

export interface Compendium {
  demons: { [name: string]: Demon }
  skills: { [name: string]: Skill }
  raceOrder: string[]
  fusionChart: string[][]
  specialRecipes?: { [name: string]: string[] }
  dlcDemons?: Demon[]
}

export abstract class CompendiumConfig {
  demonCols: string[]
  statCols: string[]
  skillCols: string[]
  acquisitionCols: string[]
  resistanceCols?: string[]
  affinityCols?: string[]

  constructor() {
    this.demonCols = [
      'Race',
      'Level',
      'Name'
    ]
    this.statCols = [
      'St',
      'Ma',
      'Ag',
      'Lu'
    ]
    this.skillCols = [
      'Element',
      'Name',
      'Cost',
      'Effect'
    ]
    this.acquisitionCols = [
      'Learned By'
    ]
  }
}