import { Fusion } from './smt-tools.types'

export class BuildRecipe {
	fusions: Fusion[] = []
	cost: number = 0
	inherittedSkills: string[][] = []
	innates: string[] = []
	level: number = 0
	result: string = ''
	directions: string[] = []

	constructor() {}

	/**
	 * Description placeholder
	 *
	 * @param {BuildRecipe} build
	 * @param {Fusion} recipe
	 * @param {string[]} inherittedSkills
	 * @protected
	 */
	public addStep(recipe: Fusion, inherittedSkills: string[]) {
		this.fusions.push(recipe)
		this.inherittedSkills.push(inherittedSkills)
	}

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
	 * Description placeholder
	 *
	 * @private
	 * @param {BuildRecipe} chain
	 * @returns {number}
	 */
	private addCost(): void {
		let cost: number = 0
		for (let step of this.fusions) cost += step.cost!
		this.cost = cost
	}
}
