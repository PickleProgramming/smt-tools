import _ from 'lodash'
import { Observable } from 'rxjs'

import {
	ChainMessage,
	FusionChain,
	Recipe,
} from '@shared/types/smt-tools.types'
import { ChainCalculator } from '@shared/types/chain-calculator'
import { P5RCompendium } from './p5r-compendium'
import { P5RFusionCalculator } from './p5r-fusion-calculator'

import { P5R_COMPENDIUM, P5R_FUSION_CALCULATOR } from '@shared/constants'

export class P5RChainCalculator extends ChainCalculator {
	compendium!: P5RCompendium
	calculator!: P5RFusionCalculator

	constructor() {
		super(P5R_COMPENDIUM, P5R_FUSION_CALCULATOR)
	}

	getChains(
		targetSkills: string[],
		demonName?: string
	): Observable<ChainMessage> {
		if (demonName) {
			this.getChains_targetSkills_demonName(targetSkills, demonName)
		} else this.getChains_targetSkills(targetSkills)
		this.chainMessageSubject.next({ chains: null, combo: null })
		return this.chainMessageObservable
	}
	private getChains_targetSkills(targetSkills: string[]): void {
		for (let skillName of targetSkills) {
			let unique = this.compendium.skills[skillName].unique
			if (unique) {
				this.getChains_targetSkills_demonName(targetSkills, unique)
			}
		}
		let chains: FusionChain[] = []
		for (let demonName in this.compendium.demons) {
			this.combo++
			if (chains.length >= this.maxChainLength) return
			if (!this.isPossible(targetSkills, demonName)) continue
			let newChains: FusionChain[] = []
			let demon = this.compendium.demons[demonName]
			let intersects = _.intersection(
				targetSkills,
				Object.keys(demon.skills)
			)
			if (intersects.length > 0 || this.deep) {
				this.getChains_targetSkills_demonName(targetSkills, demonName)
			}
			if (newChains.length > 0) chains = chains.concat(newChains)
		}
	}
	private getChains_targetSkills_demonName(
		skills: string[],
		demonName: string
	): void {
		let chains: FusionChain[] = []
		let targetSkills = _.cloneDeep(skills)
		if (!this.isPossible(targetSkills, demonName)) return
		let demon = this.compendium.demons[demonName]
		let innates = _.intersection(targetSkills, Object.keys(demon.skills))
		if (innates.length > 0) {
			if (innates.length == targetSkills.length) return
			let diff = _.difference(targetSkills, innates)
			if (diff.length > 4) return
			_.pullAll(targetSkills, innates)
		}
		let fissions = this.calculator.getFissions(demonName)
		for (let fission of fissions) {
			this.combo++
			if (chains.length >= this.maxChainLength) return
			if (!this.isPossible(targetSkills, undefined, fission)) continue
			let foundSkills = this.checkRecipeSkills(targetSkills, fission)
			if (foundSkills.length > 0 || this.deep) {
				for (let sourceName of fission.sources) {
					let diff = _.difference(targetSkills, foundSkills)
					if (diff.length == 0) {
						this.finishChain(fission, foundSkills, innates)
						break
					}
					let chain = this.getChain(diff, 0, sourceName)
					if (chain != null) {
						this.finishChain(fission, foundSkills, innates, chain)
					}
				}
			}
		}
	}

	protected getChain(
		targetSkills: string[],
		recursiveDepth: number,
		demonName: string
	): FusionChain | null {
		this.combo++
		if (targetSkills.length == 0) {
			throw new Error(
				'getChain was called with an empty targetSkills arg'
			)
		}
		if (recursiveDepth > this.recursiveDepth) return null
		if (!this.isPossible(targetSkills, demonName)) return null
		let fissions = this.calculator.getFissions(demonName)
		for (let fission of fissions) {
			this.combo++
			if (!this.isPossible(targetSkills, undefined, fission)) continue
			let foundSkills = this.checkRecipeSkills(targetSkills, fission)
			if (foundSkills.length == targetSkills.length) {
				let chain = this.getEmptyChain()
				this.addStep(chain, fission, targetSkills)
				return chain
			}
			if (foundSkills.length > 0 || this.deep) {
				for (let sourceName of fission.sources) {
					let diff = _.difference(targetSkills, foundSkills)
					let chain = this.getChain(
						diff,
						recursiveDepth + 1,
						sourceName
					)
					if (chain != null) {
						this.addStep(chain, fission, foundSkills)
						return chain
					}
				}
			}
		}
		return null
	}

	/* @returns a list of skils that intersects @param targetSkills
		and all the skills in @param recipe sources */
	private checkRecipeSkills(
		targetSkills: string[],
		recipe: Recipe
	): string[] {
		let foundSkills: string[] = []
		for (let sourceName of recipe.sources) {
			let intersects = _.intersection(
				targetSkills,
				Object.keys(this.compendium.demons[sourceName].skills)
			)
			if (intersects.length > 0) {
				foundSkills = foundSkills.concat(intersects)
				foundSkills = _.uniq(foundSkills)
			}
		}
		return foundSkills
	}

	protected getEmptyChain(): FusionChain {
		return {
			steps: [],
			cost: 0,
			inherittedSkills: [],
			innates: [],
			level: 0,
			result: '',
			directions: [],
		}
	}

	/* formats/creates a chain and adds the information from @param reicpe and 
	@param skills and adds it to the @param fusionChain */
	protected finishChain(
		recipe: Recipe,
		skills: string[],
		innates: string[],
		chain?: FusionChain
	): void {
		if (!chain) chain = this.getEmptyChain()
		this.addStep(chain, recipe, skills)
		chain.cost = this.getCost(chain)
		chain.level = this.levelRequired(chain)
		chain.innates = innates
		chain.result = chain.steps[chain.steps.length - 1].result
		if (chain.steps.length > 1) {
			for (let i = 1; i < chain.steps.length; i++) {
				chain.inherittedSkills[i] = chain.inherittedSkills[i].concat(
					chain.inherittedSkills[i - 1]
				)
			}
		}
		chain.directions = this.getDirections(chain)
		this.chains.push(chain)
		this.chainMessageSubject.next({
			chains: this.chains,
			combo: this.combo,
		})
	}

	protected isPossible(
		targetSkills: string[],
		demonName?: string,
		recipe?: Recipe
	): boolean {
		if (recipe !== undefined && demonName !== undefined) {
			throw new Error(
				'isPossible() cannot accept both a demon ' + 'name and a recipe'
			)
		}
		if (recipe) {
			return this.isPossible_targetSkills_recipe(targetSkills, recipe)
		}
		if (demonName) {
			return this.isPossible_targetSkills_demonName(
				targetSkills,
				demonName
			)
		}
		return this.isPossible_targetSkills(targetSkills)
	}
	private isPossible_targetSkills(targetSkills: string[]): boolean {
		//check the demon necessary for a given unique skill
		for (let skillName of targetSkills) {
			let skill = this.compendium.skills[skillName]
			if (skill.unique) {
				return this.isPossible_targetSkills_demonName(
					targetSkills,
					skill.unique
				)
			}
		}
		//only 4 skills can be inheritted, the others will need to be learned
		// either through hangings or innate skills
		if (targetSkills.length > 4) {
			let numberNeeded: number = targetSkills.length - 4
			//build every combination of skills with length numberNeeded
			let innates = this.getSubArrays(targetSkills)
			for (let i = 0; i < innates.length; i++)
				if (innates[i].length != numberNeeded) delete innates[i]
			innates = _.compact(innates)
			//see if there are any demons with innates skills as such
			for (let name in this.compendium.demons) {
				let skills = Object.keys(this.compendium.demons[name].skills)
				for (let innate of innates)
					if (_.intersection(innate, skills).length == numberNeeded)
						return true
			}
			return false
		}
		return true
	}
	private isPossible_targetSkills_recipe(
		targetSkills: string[],
		recipe: Recipe
	): boolean {
		for (let sourceName of recipe.sources) {
			if (
				!this.isPossible_targetSkills_demonName(
					targetSkills,
					sourceName
				)
			)
				return false
		}
		return true
	}
	private isPossible_targetSkills_demonName(
		targetSkills: string[],
		demonName: string
	): boolean {
		if (this.compendium.demons[demonName].level > this.maxLevel)
			return false
		if (this.compendium.isElemental(demonName)) return false
		for (let skillName of targetSkills) {
			let skill = this.compendium.skills[skillName]
			if (skill.unique && skill.unique !== demonName) return false
			if (!this.compendium.isInheritable(demonName, skillName)) {
				return false
			}
			if (this.compendium.getSkillLevel(skillName) > this.maxLevel) {
				return false
			}
		}
		let inheritNum: number
		if (this.compendium.isSpecial(demonName)) {
			let specialRecipe = this.compendium.buildSpecialRecipe(demonName)
			inheritNum = this.getMaxNumOfInherittedSkills(specialRecipe)
		} else inheritNum = 4
		if (targetSkills.length > inheritNum) {
			let numberNeeded: number = targetSkills.length - inheritNum
			//build every combination of skills with length numberNeeded
			let innates = this.getSubArrays(targetSkills)
			for (let i = 0; i < innates.length; i++) {
				if (innates[i].length != numberNeeded) delete innates[i]
			}
			innates = _.compact(innates)
			let skills = Object.keys(this.compendium.demons[demonName].skills)
			for (let innate of innates) {
				if (_.intersection(innate, skills).length == numberNeeded) {
					return true
				}
			}
			return false
		}
		return true
	}
}
