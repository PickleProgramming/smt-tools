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
	 * A series of plain enghish steps to display to the user
	 *
	 * @type {string[]}
	 */
	directions: string[] = []

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
		this.addDirections()
	}

	/**
	 * Creates a series of steps in plain english to display to the user and
	 * adds it as a property to this object
	 *
	 * @private
	 */
	private addDirections(): void {
		let directions: string[] = []
		for (let i = 0; i < this.fusions.length; i++) {
			let step = this.fusions[i]
			let direction = `Step ${i + 1}: `
			if (step.sources.length > 2) {
				direction += `Use the Special Recipe to fuse ${step.result}.`
				direction += ` Have ${step.result} inherit `
			} else {
				direction +=
					`Fuse ${step.sources[0]} with ${step.sources[1]} to make ` +
					`${step.result}. Have ${step.result} inherit `
			}
			let skills = this.inherittedSkills[i]
			for (let j = 0; j <= skills.length; j++) {
				if (skills.length === 1) {
					direction += `${skills[j]}.`
					break
				}
				if (j === skills.length - 1) {
					direction += `and ${skills[j]}.`
					break
				}
				direction += `${skills[j]}, `
			}
			directions.push(direction)
		}
		if (this.innates.length < 1) {
			this.directions = directions
			return
		}
		let direction = ` ${this.result} will learn `
		for (let j = 0; j <= this.innates.length; j++) {
			if (this.innates.length === 1) {
				direction += `${this.innates[j]}`
				break
			}
			if (j === this.innates.length - 1) {
				direction += ` and ${this.innates[j]}`
				break
			}
			direction += `${this.innates[j]}, `
		}
		direction += ` on their own.`
		directions.push(direction)
		this.directions = directions
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
