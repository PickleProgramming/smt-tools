import { Compendium, Recipe } from './compendium'
import { FusionCalculator } from './fusion-calculator'
import _ from 'lodash'
import { FusionChain } from './fusionChain'
import { Observable, Subject } from 'rxjs'

export abstract class ChainCalculator {
	protected compendium: Compendium
	protected calculator: FusionCalculator
	protected combo: number = 0
	protected chains: FusionChain[] = []
	protected comboSubject = new Subject<number>()
	protected chainSubject = new Subject<FusionChain[]>()

	maxLevel = 99
	deep: boolean = false
	//@setting the amount of times getChain is allowed to call itself
	recursiveDepth = 2
	//@setting the max size array getChains can return
	maxChainLength = 20
	comboObservable = this.comboSubject.asObservable()
	chainObservable = this.chainSubject.asObservable()

	constructor(compendium: Compendium, calculator: FusionCalculator) {
		this.compendium = compendium
		this.calculator = calculator
		console.log('Chain Calculator Created')
	}

	/*  @param targetSkills: a list of skills for the final demon
        @param deep: if true the function will search fissions even if they
            don't immediately have any desired skills. Vastly increases
            computational time
        @param demonName: the name of the demon to fuse to
        @returns a set of fusion chains configured by 
            ChainCalculator's properties*/
	abstract getChains(targetSkills: string[], demonName?: string): void

	/*  @param targetSkills: list of skills for the final demon to inherit
        @param recursiveDepth: an incremental number to keep track of the
            number of times the function has called itself. should be 0
            unless the function is calling itself
        @param demonName: name of the demon to fuse to
        @param deep: if true the function will search fissions even if they
            don't immediately have any desired skills. Vastly increases
            computational time*/
	protected abstract getChain(
		targetSkills: string[],
		recursiveDepth: number,
		demonName: string
	): FusionChain | null

	/* Determines if the passed persona is capable oflearning the skills passed
        determines if ANY persona is capable if no name or recipe is give. 
        Throws error if both a demonName and a recipe are provided.
        @param skills: a list of skills to check if possible to inherit
        @param demonName: a demon to check if they can inherit the skills
        @param recipe: a recipe to check if either source is incapable of
            inheritting. True if sourceA || sourceB can, false otherwise
        @returns {boolean}*/
	protected abstract isPossible(
		skills: string[],
		demonName?: string,
		recipe?: Recipe
	): boolean

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
			if (this.compendium.demons[sourceName].lvl > this.maxLevel)
				return true
		return false
	}

	protected newCombo(): void {
		this.comboSubject.next(this.combo++)
	}

	protected resetCombos(): void {
		this.comboSubject.next(0)
		this.combo = 0
	}

	protected abstract newChain(
		recipe: Recipe,
		skills: string[],
		innates: string[],
		chain?: FusionChain
	): void

	protected resetChains(): void {
		this.chainSubject.next([])
		this.chains = []
	}

	/* returns the level of the highest level demon in the provided chain */
	levelRequired(chain: FusionChain): number {
		let level = 0
		for (let recipe of chain.steps) {
			for (let demonName of recipe.sources)
				if (this.compendium.demons[demonName].lvl > level)
					level = this.compendium.demons[demonName].lvl
			if (this.compendium.demons[recipe.result].lvl > level)
				level = this.compendium.demons[recipe.result].lvl
		}
		return level
	}
}
