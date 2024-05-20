import _ from 'lodash'
import {
	Demon,
	Skill,
	FusionTable,
	Fusion,
	ElementTable,
} from './smt-tools.types'

/**
 * Root object used by a game view. Each game should have their own compendium
 * object that extends this class.
 *
 * @abstract
 * @class Compendium
 * @typedef {Compendium}
 * @export
 */
export abstract class Compendium {
	/**
	 * A Key/value pair relating a demon's name to it's object
	 *
	 * @type {{ [name: string]: Demon }}
	 */
	demons: { [name: string]: Demon } = {}
	/**
	 * A key/value pair relating a skill's name to it's object
	 *
	 * @type {{ [name: string]: Skill }}
	 */
	declare skills: { [name: string]: Skill }
	/**
	 * The fusion table used by the the specifc game
	 *
	 * @type {FusionTable}
	 */
	declare fusionTable: FusionTable
	/**
	 * A key/value pair similar to demons, but only for special fusions
	 *
	 * @type {?{ [name: string]: string[] }}
	 */
	declare specialRecipes?: { [name: string]: string[] }
	/**
	 * A key/value similar to demons, but only for dlc demons
	 *
	 * @type {?{ [name: string]: Demon }}
	 */
	declare dlcDemons?: { [name: string]: Demon }
	/**
	 * A key/value similar to skills, but only for skills that are unique to dlc
	 * demons
	 *
	 * @type {?{ [name: string]: Skill }}
	 */
	declare dlcSkills?: { [name: string]: Skill }
	/**
	 * The table detailing fusions with elemental demons for the specific game
	 *
	 * @type {ElementTable | null}
	 */
	declare elementTable?: ElementTable

	/**
	 * Creates an instance of Compendium.
	 *
	 * @class
	 * @param {Object} demonData JSON object to read demon data from
	 * @param {Object} skillData JSON object to read skill data from
	 * @param {FusionTable} fusionTable Fusion table to assign to member
	 * @param {Object} specialData JSON object to read special recipes from
	 * @param {Object | null} [dlcData] JSON object to read dlc demons from
	 * @param {ElementTable | null} [elementTable] Element table to assign to
	 *   member
	 */
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
	 * @abstract
	 * @param {Object} skillData JSON file to be read
	 * @returns {{
	 * 	[name: string]: Skill
	 * }} A key/value pair relating a skill's
	 *   name to it's object
	 * @protected
	 */
	protected abstract parseSkills(skillData: Object): {
		[name: string]: Skill
	}

	/**
	 * Reads the demons from the JSON files into the specified list
	 *
	 * @param {Object} demonData JSON data to parse
	 * @param {{ [name: string]: Demon }} demonList Demon list to be updated
	 * @param {?{ [name: string]: Skill }} [skillList] Skill list to be updated
	 * @protected
	 * @sealed
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
	 * @abstract
	 * @param {Object} specialData JSON file to be read
	 * @returns {{
	 * 	[name: string]: string[]
	 * }} A key/value pair similar to
	 *   demons, but only for special fusions
	 * @protected
	 */
	protected abstract parseSpecial?(specialData: Object): {
		[name: string]: string[]
	}

	/**
	 * Calculate the approximate cost of the given recipe cost is impossible to
	 * determine exactly as it varies on in game factors that are simply not
	 * feasible to account for.
	 *
	 * @abstract
	 * @param {Fusion} fusion Fusion to be calculated
	 * @returns {number} Estimated cost of the fusion
	 */
	abstract getCost(fusion: Fusion): number

	/**
	 * Returns an array of boolean that correspond to which type of skills the
	 * passed element can inherit. Should be parallel to the array of elems and
	 * inherits located within the data/inhertiance-types.json in each game
	 * {@link https://gamefaqs.gamespot.com/boards/835628-persona-5/75476187}
	 *
	 * @abstract
	 * @param {string} element The element to check the inheritance types of
	 * @returns {boolean[]} An array of boolean parallel to the inheritance-types
	 *   array that should be specified in each games data directory
	 */
	abstract getInherits(element: string): boolean[]

	/**
	 * Checks if the specified demon is the result of a special fusion
	 *
	 * @param {string} demonName The demon to check
	 * @returns {boolean} True if the demon is the result of a special fusion
	 * @public
	 * @sealed
	 */
	public isSpecial(demonName: string): boolean {
		if (this.specialRecipes == undefined)
			throw new Error('called isSpecial on a compendium with no specialRecipes')
		let specialNames = Object.keys(this.specialRecipes)
		if (_.intersection(specialNames, [demonName]).length > 0) return true
		return false
	}

	/**
	 * Creates a Fusion object for a special fusion
	 *
	 * @param {string} name Name of demon to fuse
	 * @returns {Fusion} Fusion object of the specified demon
	 * @public
	 * @sealed
	 */
	public buildSpecialFusion(name: string): Fusion {
		if (this.specialRecipes == undefined)
			throw new Error(
				'called buildSpecialRecipe on a compendium with no specialRecipes'
			)
		let recipe: Fusion = {
			sources: [],
			result: name,
		}
		for (let demonName of this.specialRecipes![name])
			recipe.sources.push(demonName)
		recipe.cost = this.getCost(recipe)
		return recipe
	}

	/**
	 * Gets the level of the lowest level demon that can learn the specified skill
	 *
	 * @param {string} skillName Name of skill to find
	 * @returns {number} The level of the lowest level demon that learns the given
	 *   skill
	 * @public
	 * @sealed
	 */
	public getSkillLevel(skillName: string): number {
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
	 * @param {string} demonName Name of demon to check
	 * @returns {boolean} True if the demon provided is an elemental, false
	 *   otherwise
	 * @public
	 * @sealed
	 */
	public isElemental(demonName: string): boolean {
		if (this.elementTable == undefined)
			throw new Error('isElemental called on a comp that has no elementals')
		let intersect = _.intersection(this.elementTable.elems, [demonName])
		if (intersect.length > 0) return true
		return false
	}
}
