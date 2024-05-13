import _ from 'lodash'
import {
	Demon,
	Skill,
	FusionTable,
	Fusion,
	ElementTable,
} from './smt-tools.types'

/* Root object used by a game view. Each game should have their own compendium
    object that implements this interface and contains all the objects defined
    above. */
export abstract class Compendium {
	demons: { [name: string]: Demon } = {}
	skills: { [name: string]: Skill }
	fusionTable: FusionTable
	specialRecipes?: { [name: string]: string[] }
	dlcDemons?: { [name: string]: Demon }
	dlcSkills?: { [name: string]: Skill }
	elementTable?: ElementTable

	constructor(
		demonData: Object,
		skillData: Object,
		fusionTable: FusionTable,
		specialData: Object,
		dlcData?: Object,
		elementTable?: ElementTable
	) {
		this.skills = this.parseSkills(skillData)
		this.parseDemons(demonData, this.demons, this.skills)
		this.fusionTable = fusionTable

		if (specialData) this.specialRecipes = this.parseSpecial!(specialData)
		if (dlcData) {
			this.dlcDemons = {}
			this.parseDemons(dlcData, this.dlcDemons)
		}
		if (elementTable) this.elementTable = elementTable
	}

	/* reads the skills from the JSON files into respective objects and lists*/
	protected abstract parseSkills(skillData: Object): {
		[name: string]: Skill
	}

	/* reads the demons from the JSON files into respective objects */
	protected parseDemons(
		demonData: Object,
		demonList: { [name: string]: Demon },
		skillList?: { [name: string]: Skill }
	): void {
		Object.entries(demonData).forEach(([demon, data]) => {
			demonList[demon] = {
				race: data.race,
				level: data.level,
				stats: data.stats,
				resistances: data.resists,
				skills: data.skills,
				inherits: data.inherits,
				drop: data.item,
			}
		})
		if (!skillList) return
		for (let demonName in demonList) {
			for (let skillName in demonList[demonName].skills) {
				let level = demonList[demonName].skills[skillName]
				skillList[skillName].learnedBy[demonName] = level
			}
		}
	}
	/* reads the specialRecipes from the JSON files into respective objects */
	protected abstract parseSpecial?(specialData: Object): {
		[name: string]: string[]
	}

	/* calculate the approximate cost of the given recipe cost is impossible
      to determine exactly as it varies on in game factors that are simply
      not feasible to account for. */
	abstract getCost(recipe: Fusion): number

	/* Returns an array of boolean that correspon to which 
    type of skills the passed element can inherit
    read more: https://gamefaqs.gamespot.com/boards/835628-persona-5/75476187
    @param element: what element the returned array will evaluate*/
	abstract getInherits(element: string): boolean[]

	/* @returns: true if the demon provided is a special recipe, false otherwise */
	isSpecial(demonName: string): boolean {
		if (this.specialRecipes == undefined)
			throw new Error(
				'called isSpecial on a compendium with no specialRecipes'
			)
		let specialNames = Object.keys(this.specialRecipes)
		if (_.intersection(specialNames, [demonName]).length > 0) return true
		return false
	}

	/* @returns: a recipe interface for the provided specialFusion result */
	buildSpecialRecipe(targetName: string): Fusion {
		if (this.specialRecipes == undefined)
			throw new Error(
				'called buildSpecialRecipe on a compendium with ' +
					' no specialRecipes'
			)
		let recipe: Fusion = {
			sources: [],
			result: targetName,
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
			if (demon.level < level) level = demon.level
		}
		return level
	}

	/* @returns: true if the demon provided is an elemental, false otherwise */
	isElemental(demonName: string): boolean {
		if (this.elementTable == undefined)
			throw new Error(
				'isElemental called on a comp that has no elementals'
			)
		let intersect = _.intersection(this.elementTable.elems, [demonName])
		if (intersect.length > 0) return true
		return false
	}
}
