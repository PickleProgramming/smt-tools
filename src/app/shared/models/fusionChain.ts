import { Recipe } from './compendium'

export class FusionChain {
	steps: Recipe[] = []
	cost: number = 0
	inherittedSkills: string[][] = []
	innates: string[] = []
	level: number = 0
	result: string = ''
	directions: string[] = []

	constructor() {}

	addStep(recipe: Recipe, inherittedSkills: string[]) {
		this.steps.push(recipe)
		this.inherittedSkills.push(inherittedSkills)
	}

	getCost(): number {
		let cost: number = 0
		for (let step of this.steps) cost += step.cost!
		return cost
	}

	getDirections(): string[] {
		let directions: string[] = []
		for (let i = 0; i < this.steps.length; i++) {
			let step = this.steps[i]
			let direction = `Step ${i + 1}: `
			if (step.sources.length > 2) {
				direction += `Use the Special Recipe to fuse ${step.result}.`
				continue
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
		return directions
	}
}
