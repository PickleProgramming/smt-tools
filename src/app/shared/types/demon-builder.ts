import { Compendium } from './compendium'
import { FusionCalculator } from './fusion-calculator'
import _ from 'lodash'
import { Observable, Subject } from 'rxjs'
import { ResultsMessage, FusionChain, Recipe } from './smt-tools.types'

export abstract class DemonBuilder {
	protected compendium: Compendium
	protected calculator: FusionCalculator
	protected chainMessageSubject = new Subject<ResultsMessage>()
	combo: number = 0
	chains: FusionChain[] = []
	chainMessageObservable = this.chainMessageSubject.asObservable()

	maxLevel = 99
	/* @setting deep: if true the functions will search fissions even if they
	don't immediately have any desired skills. Vastly increases computational
	time, but finds results with longer fusion chains */
	deep: boolean = false
	//@setting the amount of times getChain is allowed to call itself
	recursiveDepth = 2
	//@setting the max size array getChains can return
	maxChainLength = 20

	constructor(compendium: Compendium, calculator: FusionCalculator) {
		this.compendium = compendium
		this.calculator = calculator
	}

	/*  @param targetSkills: a list of skills for the final demon
        @param demonName: the name of the demon to fuse to
        @returns a stream of messages updated whenever a chain is added to 
			this.chains configured by ChainCalculator's properties*/
	abstract getChains(
		targetSkills: string[],
		demonName?: string
	): Observable<ResultsMessage>

	/*  @param targetSkills: list of skills for the final demon to inherit
        @param recursiveDepth: an incremental number to keep track of the
            number of times the function has called itself. should be 0
            unless the function is calling itself
        @param demonName: name of the demon to fuse to*/
	protected abstract getChain(
		targetSkills: string[],
		recursiveDepth: number,
		demonName: string
	): FusionChain | null

	/* Determines if the passed persona is capable of learning the skills passed
        determines if ANY persona is capable if no name or recipe is give. 
        Throws error if both a demonName and a recipe are provided.
        @param skills: a list of skills to check if possible to inherit
        @param demonName: a demon to check if they can inherit the skills
        @param recipe: a recipe to check if either source is incapable of
            inheritting. True if sourceA || sourceB can, false otherwise
        @returns {possible: boolean, reason: string} if possible, reason is 
		always null, if not possible, reason should contain feedback for user
		as to why this fusion is impossible.*/
	protected abstract isPossible(
		skills: string[],
		demonName?: string,
		recipe?: Recipe
	): { possible: boolean; reason: string }

	/*  @param recipe: recipe to be checked
        @returns the total number of skills the demon in the recipes result
            can inherit from its sources*/
	protected getMaxNumOfInherittedSkills(recipe: Recipe): number {
		if (recipe.sources.length == 2) return 4
		if (recipe.sources.length >= 4) return 6
		return 5
	}

	/* Returns every combination of subarrays from the passed array*/
	protected getSubArrays(arr: string[]): string[][] {
		if (arr === undefined)
			throw new Error('getSubArrays called with undefined argument')
		if (arr.length === 1) return [arr]
		else {
			let subarr = this.getSubArrays(arr.slice(1))
			return subarr.concat(
				subarr.map((e) => e.concat(arr[0])),
				[[arr[0]]]
			)
		}
	}

	/* false if none of the sources in the recipe exceed max level, 
        true otherwise */
	protected exceedsMaxLevel(recipe: Recipe): boolean {
		for (let sourceName of recipe.sources)
			if (this.compendium.demons[sourceName].level > this.maxLevel)
				return true
		return false
	}

	protected abstract finishChain(
		recipe: Recipe,
		skills: string[],
		innates: string[],
		chain?: FusionChain
	): void

	/* adds a step to the recipe by pushing the step too the recipe object and
	adding the skills to inherit in that step to the inherrittedSkills array
	@param chain: the chain to add the steps to
	@param recipe: the recipe to add the steps to
	@param inherittedSkills: the array of skills to inherit in that step */
	protected addStep(
		chain: FusionChain,
		recipe: Recipe,
		inherittedSkills: string[]
	) {
		chain.steps.push(recipe)
		chain.inherittedSkills.push(inherittedSkills)
	}

	/* gets the estimated cost of the fusion chain
	@param chain: the fusion chain to estimate the cost for
	@return number: the estimated cost */
	protected getCost(chain: FusionChain): number {
		let cost: number = 0
		for (let step of chain.steps) cost += step.cost!
		return cost
	}

	/* generates a string to be shown in the html instructing the user
	how to fuse the desired demon
	@param chain: the chain to get instructions for
	@return string[]: an array of lines to be displayed in the html*/
	protected getDirections(chain: FusionChain): string[] {
		let directions: string[] = []
		for (let i = 0; i < chain.steps.length; i++) {
			let step = chain.steps[i]
			let direction = `Step ${i + 1}: `
			if (step.sources.length > 2) {
				direction += `Use the Special Recipe to fuse ${step.result}.`
				direction += ` Have ${step.result} inherit `
			} else {
				direction +=
					`Fuse ${step.sources[0]} with ${step.sources[1]} to make ` +
					`${step.result}. Have ${step.result} inherit `
			}
			let skills = chain.inherittedSkills[i]
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
		if (chain.innates.length < 1) return directions
		let direction = ` ${chain.result} will learn `
		for (let j = 0; j <= chain.innates.length; j++) {
			if (chain.innates.length === 1) {
				direction += `${chain.innates[j]}`
				break
			}
			if (j === chain.innates.length - 1) {
				direction += ` and ${chain.innates[j]}`
				break
			}
			direction += `${chain.innates[j]}, `
		}
		direction += ` on their own.`
		directions.push(direction)
		return directions
	}

	/* returns the level of the highest level demon in the provided chain */
	levelRequired(chain: FusionChain): number {
		let level = 0
		for (let recipe of chain.steps) {
			for (let demonName of recipe.sources)
				if (this.compendium.demons[demonName].level > level)
					level = this.compendium.demons[demonName].level
			if (this.compendium.demons[recipe.result].level > level)
				level = this.compendium.demons[recipe.result].level
		}
		return level
	}
}
