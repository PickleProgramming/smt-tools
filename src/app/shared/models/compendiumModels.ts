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

export interface FusionTable {
  races: string[]
  table: string[][]
}

export interface ElementTable {
  elems: string[]
  races: string[]
  table: number[][]
}

export interface Compendium {
  demons: { [name: string]: Demon }
  skills: { [name: string]: Skill }
  fusionTable: string[][]
  specialRecipes?: { [name: string]: string[] }
  dlcDemons?: Demon[]
}

/* Holds all the variables that are used to create each game view, except for the 
demon and skill data
@param fusionTable
  The games internal table of demon races, used in fusion calculation among a number of
  other things. normally found in [game]/data/fustion-table.json */
export abstract class CompendiumConfig {
  demonCols: string[]
  statCols: string[]
  skillCols: string[]
  acquisitionCols: string[]
  fusionTable: FusionTable
  elemTable?: ElementTable
  resistanceCols?: string[]
  affinityCols?: string[]

  constructor(fusionTable: FusionTable, elemTable?: ElementTable) {
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

    this.fusionTable = {
      races: fusionTable['races'],
      table: fusionTable['table']
    }
    if(this.elemTable) {

    }
  }
}