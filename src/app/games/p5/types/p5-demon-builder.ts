import { P5_COMPENDIUM, P5_FUSION_CALCULATOR } from '@shared/constants'
import { DemonBuilder } from '@shared/types/demon-builder'
import { ResultsMessage, BuildRecipe } from '@shared/types/smt-tools.types'
import { Observable } from 'rxjs'
import { P5Compendium } from './p5-compendium'
import { P5FusionCalculator } from './p5-fusion-calculator'
import _, { max } from 'lodash'

export class P5FusionChaainCalculator extends DemonBuilder {
	declare compendium: P5Compendium
	declare calculator: P5FusionCalculator

	constructor() {
		super(P5_COMPENDIUM, P5_FUSION_CALCULATOR)
	}

	/**
	 * ---WRAPPER METHODS---
	 *
	 * These methods will call the corresponding methods in the DEMON-NAME or
	 * NO-NAME methods depending on if the user supplied a demonName or not.
	 */
	getFusionChains(
		targetSkills: string[],
		demonName?: string | undefined
	): Observable<ResultsMessage> {
		/* check for any immediate problems with user input then begin recursive
			 calls, either with a specified demon or without.*/
		if (demonName) {
			this.validateInput(targetSkills, demonName)
			this.demon_getFusionChains(targetSkills, demonName)
		} else {
			this.validateInput(targetSkills)
			this.noDemon_getFusionChains(targetSkills)
		}
		/* emitting null data tells listeners the messages are finished, and 
			they can stop listening */
		this.resultMessageSubject.next({
			results: null,
			combo: null,
			error: null,
		})
		return this.resultMessageObservable
	}
	protected validateInput(
		targetSkills: string[],
		demonName?: string | undefined
	): void {
		if (demonName) {
			this.demon_validateInput(targetSkills, demonName)
		} else {
			this.noDemon_validateInput(targetSkills)
		}
	}
	protected isPossible(
		targetSkills: string[],
		demonName?: string
	): { possible: boolean; reason: string } {
		//check if any of the skills are too high level
		for (let skillName of targetSkills) {
			if (this.compendium.getSkillLevel(skillName) > this.maxLevel) {
				return {
					possible: false,
					reason: `You have specified a level that is lower than the minimum required level to learn ${skillName}.`,
				}
			}
		}
		if (demonName) {
			return this.demon_isPossible(targetSkills, demonName)
		}
		return this.noDemon_isPossible(targetSkills)
	}
	/**
	 * Checks if a demon can learn the number of skills in target skills. In P5,
	 * normal demons can only inherit a maximum of 4 skills. Special demons can
	 * inherit up to 5 under the right conditions. If the user specifies more
	 * skills than a demon can inherit, the resultant demon will need to learn
	 * the rest of the skills on their own.
	 *
	 * @param targetSkills List of skills for the resultant to learn
	 * @param demonName Name of the resultant demon
	 * @returns {possible: boolean, reason: string} If possible, reason is
	 *   always null, if not possible, reason contains feedback for user about
	 *   max inheritance.
	 */
	private canInheritOrLearn(
		targetSkills: string[],
		demonName?: string
	): { possible: boolean; reason: string } {
		if (demonName) {
			return this.demon_canInheritOrLearn(targetSkills, demonName)
		}
		return this.noDemon_canInheritOrLearn(targetSkills)
	}
	/**
	 * ---DEMON METHODS---
	 *
	 * These methods will be called when the user provides a demon name. All the
	 * methods do the same thing as stated in DemonBuilder, just with different
	 * arguments.
	 */
	protected demon_getFusionChains(
		targetSkills: string[],
		demonName: string
	): void {
		let chains: BuildRecipe[] = []
		let skills = _.cloneDeep(targetSkills)
		let demon = this.compendium.demons[demonName]
		//filter out skills the demon learns innately
		let innates = _.intersection(skills, Object.keys(demon.skills))
		if (innates.length > 0) _.pullAll(skills, innates)
		let fissions = this.calculator.getFissions(demonName)
		for (let fission of fissions) {
			this.combo++
			if (chains.length >= this.maxChainLength) return
			//check if fissions have desirable skills
			if (!this.canSourcesInherit(skills, fission)) continue
			let foundSkills = this.checkFusionSkills(skills, fission)
			if (foundSkills.length > 0 || this.deep) {
				for (let sourceName of fission.sources) {
					let diff = _.difference(skills, foundSkills)
					//finish chain if we have found all skills
					if (diff.length == 0) {
						let chain = this.getEmptyFusionChain()
						this.addStep(chain, fission, foundSkills)
						this.emitFusionChain(chain, innates)
						break
					}
					//check the fissions heritage for more skills
					let chain = this.getFusionChain(diff, 0, sourceName)
					if (chain != null) {
						this.addStep(chain, fission, foundSkills)
						this.emitFusionChain(chain, innates)
					}
				}
			}
		}
	}
	protected demon_validateInput(
		targetSkills: string[],
		demonName: string | undefined
	): void {
		let possibility = this.isPossible(targetSkills, demonName)
		if (!possibility.possible) {
			this.resultMessageSubject.next({
				results: null,
				combo: null,
				error: possibility.reason,
			})
		}
	}
	protected demon_isPossible(
		targetSkills: string[],
		demonName: string
	): { possible: boolean; reason: string } {
		if (this.compendium.demons[demonName].level > this.maxLevel) {
			return { possible: false, reason: Errors.LowLevel }
		}
		if (this.compendium.isElemental(demonName)) {
			return { possible: false, reason: Errors.Treasure }
		}
		for (let skillName of targetSkills) {
			let skill = this.compendium.skills[skillName]
			if (skill.unique && skill.unique !== demonName) {
				return {
					possible: false,
					reason: `You entered a skill that is unique to ${skill.unique}. But you specified the demon name ${demonName}.`,
				}
			}
			if (!this.compendium.isInheritable(demonName, skillName)) {
				return { possible: false, reason: Errors.Inherit }
			}
		}
		return this.canInheritOrLearn(targetSkills, demonName)
	}
	private demon_canInheritOrLearn(
		targetSkills: string[],
		demonName: string
	): { possible: boolean; reason: string } {
		let maxInherit: number
		if (this.compendium.isSpecial(demonName)) {
			let specialRecipe = this.compendium.buildSpecialFusion(demonName)
			maxInherit = this.getMaxNumOfInherittedSkills(specialRecipe)
		} else maxInherit = 4
		//number of skills needed to be learned after inheritance
		let numberNeeded: number = targetSkills.length - maxInherit
		if (numberNeeded < 1) return { possible: true, reason: '' }
		//build every combination of skills with length numberNeeded
		let innates = this.getSubArrays(targetSkills)
		for (let i = 0; i < innates.length; i++) {
			if (innates[i].length != numberNeeded) delete innates[i]
		}
		innates = _.compact(innates)
		let skills = Object.keys(this.compendium.demons[demonName].skills)
		for (let innate of innates) {
			if (_.intersection(innate, skills).length == numberNeeded) {
				return { possible: true, reason: '' }
			}
		}
		return { possible: false, reason: Errors.MaxSkills }
	}
	/**
	 * ---NO-DEMON METHODS---
	 *
	 * These methods will be called with the user does not provide a demon name.
	 * All the methods do the same thing as stated in DemonBuilder, just with
	 * different arguments.
	 */
	protected noDemon_getFusionChains(targetSkills: string[]): void {
		/* if there are any unique skills, we know we will be building to a 
			specific demon. Switch to other method.*/
		for (let skillName of targetSkills) {
			let unique = this.compendium.skills[skillName].unique
			if (unique) {
				this.demon_getFusionChains(targetSkills, unique)
			}
		}

		let chains: BuildRecipe[] = []

		/* Loop through every demon in the compendium checking if they are 
			possible fusions and if they have specified skills */
		for (let demonName in this.compendium.demons) {
			this.combo++
			if (chains.length >= this.maxChainLength) return
			let possibility = this.isPossible(targetSkills, demonName)
			if (!possibility.possible) continue
			let newChains: BuildRecipe[] = []
			let demon = this.compendium.demons[demonName]

			//check if the demon has any skills we need
			let intersects = _.intersection(
				targetSkills,
				Object.keys(demon.skills)
			)
			if (intersects.length > 0 || this.deep) {
				this.demon_getFusionChains(targetSkills, demonName)
			}

			if (newChains.length > 0) chains = chains.concat(newChains)
		}
	}
	protected noDemon_validateInput(targetSkills: string[]): void {
		let possibility = this.isPossible(targetSkills)
		if (!possibility.possible) {
			this.resultMessageSubject.next({
				results: null,
				combo: null,
				error: possibility.reason,
			})
		}
	}
	protected noDemon_isPossible(targetSkills: string[]): {
		possible: boolean
		reason: string
	} {
		//check is the skill is unique, if it is, fuse for that demon
		for (let skillName of targetSkills) {
			let skill = this.compendium.skills[skillName]
			if (skill.unique) {
				return this.demon_isPossible(targetSkills, skill.unique)
			}
		}
		if (targetSkills.length > 5) {
			return this.canInheritOrLearn(targetSkills)
		}
		return { possible: true, reason: '' }
	}
	private noDemon_canInheritOrLearn(targetSkills: string[]): {
		possible: boolean
		reason: string
	} {
		//see if there are any demons with innates skills as such
		for (let name in this.compendium.demons) {
			if (this.compendium.isElemental(name)) continue
			if (this.demon_canInheritOrLearn(targetSkills, name).possible) {
				return { possible: true, reason: '' }
			}
		}
		return { possible: false, reason: Errors.MaxSkills }
	}
	/**
	 * ---AGNOSTIC METHODS---
	 *
	 * These methods will work the same regardless of if the user provided demon
	 * name was provided or not.
	 */
	protected getFusionChain(
		targetSkills: string[],
		depth: number,
		demonName: string
	): BuildRecipe | null {
		this.combo++
		if (depth > this.recursiveDepth) return null
		let possibility = this.isPossible(targetSkills, demonName)
		if (!possibility.possible) return null
		let fissions = this.calculator.getFissions(demonName)
		for (let fission of fissions) {
			this.combo++
			if (!this.canSourcesInherit(targetSkills, fission)) continue
			let foundSkills = this.checkFusionSkills(targetSkills, fission)
			if (foundSkills.length == targetSkills.length) {
				let chain = this.getEmptyFusionChain()
				this.addStep(chain, fission, targetSkills)
				return chain
			}
			if (foundSkills.length > 0 || this.deep) {
				for (let sourceName of fission.sources) {
					let diff = _.difference(targetSkills, foundSkills)
					let chain = this.getFusionChain(diff, depth + 1, sourceName)
					if (chain != null) {
						this.addStep(chain, fission, foundSkills)
						return chain
					}
				}
			}
		}
		return null
	}
}

//enumeration to keep errors short within methods
enum Errors {
	LowLevel = 'The name of the demon you entered has a minimum level greater than the level you specified.',
	Treasure = 'The name of the demon you entered is a treasure demon, and cannot be fused.',
	Inherit = 'Every Persona has an inheritance type that bars them from learning certain skills. For example persona with inheritance type of Fire cannot inherit Ice skills. You have specified a Persona with an inheritance type that forbids them from learning a skill you have specified.',
	MaxSkills = 'In Persona 5, a normal demon can only inherit a maximum of 4 skills (special demons can inherit 5). Since you specificed more than that, your specified demon must be able to learn at least one of the other specificed skills on their own. Unfortunately, they cannot.',
}
