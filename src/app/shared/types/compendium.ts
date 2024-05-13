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

	/**
	 * Reads the skills from the JSON files into respective objects and lists
	 *
	 * @param skillData JSON to be read
	 */
	protected abstract parseSkills(skillData: Object): {
		[name: string]: Skill
	}

	/**
	 * Reads the demons from the JSON files into respective objects
	 *
	 * @param demonData JSON data to parse
	 * @param demonList Object to parse demon data into
	 * @param skillList Object to parse skill data into
	 */
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
	/**
	 * Reads the specialRecipes from the JSON files into respective objects
	 *
	 * @param specialData JSON data to be read
	 */
	protected abstract parseSpecial?(specialData: Object): {
		[name: string]: string[]
	}

	/**
	 * Calculate the approximate cost of the given recipe cost is impossible to
	 * determine exactly as it varies on in game factors that are simply not
	 * feasible to account for.
	 *
	 * @param fusion Fusion to be calculated
	 */
	abstract getCost(fusion: Fusion): number

	/**
	 * Returns an array of boolean that correspon to which type of skills the
	 * passed element can inherit read more:
	 * https://gamefaqs.gamespot.com/boards/835628-persona-5/75476187
	 *
	 * @param element: What element the returned array will evaluate
	 * @param element
	 */
	abstract getInherits(element: string): boolean[]

	/**
	 * Checks if the specified demon is the result of a special fusion
	 *
	 * @param demonName Name of demon to check
	 * @returns True if the demon provided is a special recipe, false otherwise
	 */
	isSpecial(demonName: string): boolean {
		if (this.specialRecipes == undefined)
			throw new Error(
				'called isSpecial on a compendium with no specialRecipes'
			)
		let specialNames = Object.keys(this.specialRecipes)
		if (_.intersection(specialNames, [demonName]).length > 0) return true
		return false
	}

	/**
	 * Creates a Fusion object for a special fusion
	 *
	 * @param targetName Name of demon to fuse to
	 * @returns: a recipe interface for the provided specialFusion result
	 */
	buildSpecialFusion(targetName: string): Fusion {
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

	/**
	 * Gets the level of the lowest level demon that can learn the specified
	 * skill
	 *
	 * @param skillName Name of skill to find
	 * @returns The level of the lowest level demon that learns the given skill
	 */
	getSkillLevel(skillName: string): number {
		let level: number = 99
		for (let demonName in this.skills[skillName].learnedBy) {
			let demon = this.demons[demonName]
			if (demon.level < level) level = demon.level
		}
		return level
	}

	/**
	 * Checks if the demon specified is an Elemental demon or not
	 *
	 * @param demonName Name of demon to check
	 * @returns True if the demon provided is an elemental, false otherwise
	 */
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
