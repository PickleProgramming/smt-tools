import { Fusion } from './smt-tools.types'

/**
 * Description placeholder
 *
 * @class BuildRecipe
 * @typedef {BuildRecipe}
 * @export
 */
export class BuildRecipe {
	/**
	 * Each step in the recipe with 0 being the last step
	 *
	 * @type {Fusion[]}
	 */
	fusions: Fusion[] = []
	/**
	 * The estimated cost of all the fusions in the recipe
	 *
	 * @type {number}
	 */
	cost: number = 0
	/**
	 * What skills are inheritted at each step. Parallel with fusions
	 *
	 * @type {string[][]}
	 */
	inherittedSkills: string[][] = []
	/**
	 * The skills that will be learned by the final demon by leveling up
	 *
	 * @type {string[]}
	 */
	innates: string[] = []
	/**
	 * The level of the highest level demon in the recipe
	 *
	 * @type {number}
	 */
	level: number = 0
	/**
	 * The name of the resultant demon
	 *
	 * @type {string}
	 */
	result: string = ''

	/**
	 * The number of steps in the recipe. Equal to the length of the fusions
	 * property. Used to facilitate sorting recipes by number of steps in the
	 * demon-builer results view
	 *
	 * @type {number}
	 */
	steps: number = 0

	/**
	 * Creates an instance of BuildRecipe.
	 *
	 * @class
	 */
	constructor() {}

	/**
	 * Adds a step to the top of the recipe
	 *
	 * @param {Fusion} recipe The fusion that will take place
	 * @param {string[]} inherittedSkills The skills that will be inheritted at
	 *   that step
	 * @public
	 */
	public addStep(recipe: Fusion, inherittedSkills: string[]) {
		this.fusions.push(recipe)
		this.inherittedSkills.push(inherittedSkills)
	}

	/**
	 * Adds the properites to this object that can only be calculated once all
	 * the steps to the recipe have been added. Should be called just before
	 * emitting the recipe to the user
	 *
	 * @param {string[]} innates The skills that will be learned by the final
	 *   demon by leveling up
	 * @param {number} level The level of the highest level demon in the recipe
	 * @public
	 */
	public finishBuild(innates: string[], level: number): void {
		this.addCost()
		this.level = level
		// create list that tells the user what skills should be inheritted at each step
		this.innates = innates
		this.result = this.fusions[this.fusions.length - 1].result
		if (this.fusions.length > 1) {
			for (let i = 1; i < this.fusions.length; i++) {
				this.inherittedSkills[i] = this.inherittedSkills[i].concat(
					this.inherittedSkills[i - 1]
				)
			}
		}
		this.steps = this.fusions.length
	}

	/**
	 * Calculates an estimated cost for this recipe and adds it as a property to
	 * this object
	 *
	 * @private
	 */
	private addCost(): void {
		let cost: number = 0
		for (let step of this.fusions) cost += step.cost!
		this.cost = cost
	}
}
