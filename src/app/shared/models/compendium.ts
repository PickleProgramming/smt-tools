/* Object that stores the information necessary to populate Demon List tables
    and calculate fusions  */
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

/* Object that stores the info necessary to populate Skill List tables
    and calculate fusion chaines
   @learnedBy can only be calculated with a demon list */
export interface Skill {
  element: string
  effect: string
  learnedBy: { [demon: string]: number }
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

/* Object that keeps track of the demon races in a game as well as the table
    that dictates their fusion */
export interface FusionTable {
  races: string[]
  table: string[][]
}

/* Object that keeps track of the elemental races in a game as well as the table
    that dictates their fusions with demons */
export interface ElementTable {
  elems: string[]
  races: string[]
  table: number[][]
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
  elementTable?: ElementTable
  resistanceCols?: string[]
  affinityCols?: string[]

  constructor(fusionTable: FusionTable, elementTable?: ElementTable) {
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
    if(typeof this.elementTable !== undefined) {
      this.elementTable = {
        elems: elementTable!['elems'],
        races: elementTable!['races'],
        table: elementTable!['table']
      }
    }
  }
}

/* Root object used by a game view. Each game should have their own compendium
    object that implements this interface and contains all the objects defined
    above. */
export abstract class Compendium {
  config: CompendiumConfig
  demons: { [name: string]: Demon }
  skills: { [name: string]: Skill }
  specialRecipes?: { [name: string]: string[] }
  dlcDemons?: { [name: string]: Demon }

  constructor(
    config: CompendiumConfig, 
    demonData: Object, 
    skillData: Object,
    specialData: Object,
    dlcData?: Object) {
      this.config = config
      this.skills = this.parseSkills(skillData)
      this.demons = this.parseDemons(demonData)

      if(specialData)
        this.specialRecipes = this.parseSpecial!(specialData)
      if(dlcData)
        this.dlcDemons = this.parseDemons(dlcData)
    }

    protected abstract parseSkills(skillData: Object): { [name: string]: Skill }
    protected abstract parseDemons(demonData: Object): { [name: string]: Demon }
    protected abstract parseSpecial?(specialData: Object): { [name: string]: string[] }
}