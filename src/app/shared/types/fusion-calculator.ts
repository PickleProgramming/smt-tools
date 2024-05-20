import { Compendium } from './compendium'
import { Fusion, Demon } from './smt-tools.types'

/**
 * Class to facilitate calculation of fusions and fissions
 *
 * @remarks
 *   In the scenario Demon A x Demon B = Demon C, where A and B are factors, and C
 *   is the product, Fusions calculate the factors and products of Demon A, and
 *   fissions calculate the factors of Demon C
 * @abstract
 * @class FusionCalculator
 * @typedef {FusionCalculator}
 * @export
 */
export abstract class FusionCalculator {
	/**
	 * The compundium this class uses to calculate fusions. usually the
	 * compendium from the same game the calculator is for
	 *
	 * @type {Compendium}
	 */
	compendium: Compendium

	/**
	 * Creates an instance of FusionCalculator.
	 *
	 * @class
	 * @param {Compendium} compendium
	 */
	constructor(compendium: Compendium) {
		this.compendium = compendium
	}

	/**
	 * Get list of different fusions that result in the passed demon
	 *
	 * @param {string} demonName: Name of the resultant demon
	 * @returns {Recipe[]} A list of recipes where the passed demon is the
	 *   resultant demon
	 */
	abstract getFissions(demonName: string): Fusion[]

	/**
	 * Returns a list of fusions that the specified demon is a factor of
	 *
	 * @param {string} demonName: Name of factor demon
	 * @returns {Recipe[]} A list of recipes where the passed demon is a factor
	 */
	abstract getFusions(demonName: string): Fusion[]

	/**
	 * Determine the recipe object given the 2 sources
	 *
	 * @param {string} nameA: Name of first demon to fuse
	 * @param {string} nameB: Name of second demon to fuse
	 * @returns {Recipe | null} : returns Recipe object if fusion was possible
	 *   or null otherwise
	 */
	protected abstract fuse(nameA: string, nameB: string): Fusion | null

	/**
	 * Returns all the demons in the compendium with the corresponding race
	 *
	 * @param {string} race: The target race
	 * @returns @returns {{ [name: string]: Demon }} a key-value pair of all the
	 *   demons with the desired race
	 */
	protected getDemonsByRace(race: string): { [name: string]: Demon } {
		let demons: { [name: string]: Demon } = {}
		for (let name in this.compendium.demons) {
			let demon = this.compendium.demons[name]
			if (demon.race == race) demons[name] = demon
		}
		return demons
	}

	/**
	 * Determines the race that a resultant demon will be. Some races cannot
	 * fuse, and this will return null in those cases
	 *
	 * @param {string} nameA: First demon to fuse
	 * @param {string} nameB: Second demon to fuse
	 * @returns {string} : the race that the resultant demon will be, null if
	 *   the two demons cannot fuse
	 */
	protected getResultantRace(nameA: string, nameB: string): string | null {
		let demonA = this.compendium.demons[nameA]
		let demonB = this.compendium.demons[nameB]
		let races = this.compendium.fusionTable.races
		let table = this.compendium.fusionTable.table
		let result =
			table[races.indexOf(demonA.race)][races.indexOf(demonB.race)]
		if (result == '-') return null
		return result
	}

	/**
	 * Determines if the demon given by name is in the result of one of the
	 * compendiums special fusions
	 *
	 * @param {string} name Name of demon to check
	 * @returns {boolean} True if specified demon is result of special fusion
	 */
	protected isSpecial(name: string): boolean {
		if (this.compendium.specialRecipes === undefined)
			throw new Error(
				'isSpecial() called on compendium with no special recipes'
			)
		for (let recipe in this.compendium.specialRecipes)
			if (name == recipe) return true
		return false
	}

	/**
	 * Determines if the demon given by name is in the compendiums elemental
	 * list
	 *
	 * @param {string} name Name of demon to check
	 * @returns {boolean} True if specified demon is an elemental.
	 */
	protected isElemental(name: string): boolean {
		if (this.compendium.elementTable === undefined)
			throw new Error(
				'isElemental() called on compendium with no elementals'
			)
		for (let element of this.compendium.elementTable.elems)
			if (name == element) return true
		return false
	}
}
