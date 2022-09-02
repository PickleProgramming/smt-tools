import _ from "lodash"

/* Object that stores the information necessary to populate Demon List tables
    and calculate fusions  */
export interface Demon {
  race: string
  lvl: number
  stats: number[]
  resistances: string
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

export interface Recipe {
  sources: string[]
  result: string
  cost?: number
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
  inheritTypes?: string[][]
  inheritCols?: string[]

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
    if (typeof this.elementTable !== undefined) {
      this.elementTable = {
        elems: elementTable!['elems'],
        races: elementTable!['races'],
        table: elementTable!['table']
      }
    }
  }
  /* Returns an array of boolean that correspon to which 
    type of skills the passed element can inherit
    read more: https://gamefaqs.gamespot.com/boards/835628-persona-5/75476187
    @param element: what element the returned array will evaluate*/
  abstract getInherits(element: string): boolean[]
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

    if (specialData)
      this.specialRecipes = this.parseSpecial!(specialData)
  }

  protected abstract parseSkills(skillData: Object): { [name: string]: Skill }
  protected abstract parseDemons(demonData: Object): { [name: string]: Demon }
  protected abstract parseSpecial?(specialData: Object): { [name: string]: string[] }

  /* calculate the approximate cost of the given recipe cost is impossible
      to determine exactly as it varies on in game factors that are simply
      not feasible to account for. */
  abstract getCost(recipe: Recipe): number

  isElemental(demonName: string): boolean {
    if (this.config.elementTable == undefined)
      throw new Error('isElemental called on a comp that has no elementals')
    let intersect = _.intersection(this.config.elementTable.elems, [demonName])
    if (intersect.length > 0)
      return true
    return false
  }

  isSpecial(demonName: string): boolean {
    if (this.specialRecipes == undefined)
      throw new Error('called isSpecial on a compendium with no specialRecipes')
    let specialNames = Object.keys(this.specialRecipes)
    if (_.intersection(specialNames, [demonName]).length > 0)
      return true
    return false
  }

  buildSpecialRecipe(targetName: string): Recipe {
    if (this.specialRecipes == undefined)
      throw new Error('called buildSpecialRecipe on a compendium with ' +
      ' no specialRecipes')
    let recipe: Recipe = {
      sources: [],
      result: targetName
    }
    for (let demonName of this.specialRecipes![targetName])
      recipe.sources.push(demonName)
    recipe.cost = this.getCost(recipe)
    return recipe
  }

  /* returns the lowest level demon that learns the given skill */
  getSkillLevel(skillName: string) {
    let level: number = 99
    for (let demonName in this.skills[skillName].learnedBy) {
      let demon = this.demons[demonName]
      if (demon.lvl < level)
        level = demon.lvl
    }
    return level
  }
}