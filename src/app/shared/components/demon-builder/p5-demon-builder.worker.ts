import { P5_COMPENDIUM, P5_FUSION_CALCULATOR } from '@shared/constants'
import { DemonBuilder } from '@shared/types/demon-builder'
import {
	BuildMessage,
	BuildRecipe,
	InputChainData,
} from '@shared/types/smt-tools.types'
import {
	Observable,
	ReplaySubject,
	Subject,
	Subscriber,
	from,
	interval,
	of,
} from 'rxjs'
import { P5Compendium } from '@p5/types/p5-compendium'
import { P5FusionCalculator } from '@p5/types/p5-fusion-calculator'
import _ from 'lodash'
import { runWorker } from 'observable-webworker'
import {
	delay,
	merge,
	mergeMap,
	repeat,
	switchMap,
	take,
	takeUntil,
} from 'rxjs/operators'
import { ComplexOuterSubscriber } from 'rxjs/internal/innerSubscribe'

export class P5DemonBuilderWorker extends DemonBuilder {
	declare compendium: P5Compendium
	declare calculator: P5FusionCalculator

	constructor() {
		super(P5_COMPENDIUM, P5_FUSION_CALCULATOR)
	}
	workUnit(input: InputChainData): Observable<BuildMessage> {
		return this.getFusionChains(input)
	}
	/**
	 * ---WRAPPER METHODS---
	 *
	 * These methods will call the corresponding methods in the DEMON-NAME or
	 * NO-NAME methods depending on if the user supplied a demonName or not.
	 */
	protected getFusionChains(input: InputChainData): Observable<BuildMessage> {
		if (input.maxLevel) this.maxLevel = input.maxLevel
		if (input.recurDepth) this.recurDepth = input.recurDepth
		/* check for any immediate problems with user input then begin recursive
			 calls, either with a specified demon or without.*/
		this.isValid(input.targetSkills, input.demonName)
		if (input.demonName) {
			return this.demon_getFusionChains(input.targetSkills, input.demonName)
		}
		return this.noDemon_getFusionChains(input.targetSkills)
	}
	protected isValid(
		targetSkills: string[],
		demonName?: string | null
	): boolean {
		if (this.maxLevel < 99) {
			for (let skillName of targetSkills) {
				if (this.compendium.getSkillLevel(skillName) > this.maxLevel) {
					throw new Error(
						`You have specified a level that is lower than the minimum required level to learn ${skillName}.`
					)
				}
			}
		}
		if (demonName) {
			return this.demon_isValidInput(targetSkills, demonName)
		}
		return this.noDemon_isValidInput(targetSkills)
	}
	protected isPossible(targetSkills: string[], demonName?: string): boolean {
		if (!this.checkSkillLevels(targetSkills)) return false
		if (demonName) {
			return this.demon_isPossible(targetSkills, demonName)
		}
		return this.noDemon_isPossible(targetSkills)
	}
	/**
	 * Checks if a demon can learn the number of skills in target skills. In P5,
	 * normal demons can only inherit a maximum of 4 skills. Special demons can
	 * inherit up to 5 under the right conditions. If the user specifies more
	 * skills than a demon can inherit, the resultant demon will need to learn the
	 * rest of the skills on their own.
	 *
	 * @param targetSkills List of skills for the resultant to learn
	 * @param demonName Name of the resultant demon
	 * @returns {possible: boolean, reason: string} If possible, reason is always
	 *   null, if not possible, reason contains feedback for user about max
	 *   inheritance.
	 */
	private canInheritOrLearn(
		targetSkills: string[],
		demonName?: string
	): boolean {
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
	): Observable<BuildMessage> {
		let skills = _.cloneDeep(targetSkills)
		let demon = this.compendium.demons[demonName]
		//filter out skills the demon learns innately
		let innate = _.intersection(skills, Object.keys(demon.skills))
		if (innate.length > 0) _.pullAll(skills, innate)
		let fissions = this.calculator.getFissions(demonName)

		return new Observable<BuildMessage>((sub) => {
			for (let fission of fissions) {
				this.incCount(sub)
				if (!this.validSources(skills, fission)) continue
				//check if fissions have desirable skills
				let found = this.checkFusionSkills(skills, fission)
				if (found.length > 0 || this.recurDepth > 0) {
					let diff = _.difference(skills, found)
					//finish chain if we have found all skills
					if (diff.length == 0) {
						this.emitBuild(fission, found, innate, sub)
						break
					}
					//check sources if we have more skills to find
					for (let sourceName of fission.sources) {
						let build = this.getFusionChain(diff, 0, sourceName)
						this.incCount(sub)
						if (build != null) {
							this.emitBuild(fission, found, innate, sub, build)
						}
					}
				}
			}
			sub.next({
				build: null,
				fusionCounter: this.fuseCount++,
			})
			sub.complete()
		})
	}
	protected demon_isValidInput(
		targetSkills: string[],
		demonName: string
	): boolean {
		if (this.compendium.demons[demonName].level > this.maxLevel) {
			throw new Error(Errors.LowLevel)
		}
		if (this.compendium.isElemental(demonName)) {
			throw new Error(Errors.Treasure)
		}
		for (let skillName of targetSkills) {
			let skill = this.compendium.skills[skillName]
			if (skill.unique && skill.unique !== demonName) {
				throw new Error(
					`You entered a skill that is unique to ${skill.unique}. But you specified the demon name ${demonName}.`
				)
			}
			if (!this.compendium.isInheritable(demonName, skillName)) {
				throw new Error(Errors.Inherit)
			}
		}
		if (!this.canInheritOrLearn(targetSkills, demonName)) {
			throw new Error(Errors.MaxSkills)
		}
		return true
	}
	protected demon_isPossible(
		targetSkills: string[],
		demonName: string
	): boolean {
		if (this.compendium.demons[demonName].level > this.maxLevel) {
			return false
		}
		if (this.compendium.isElemental(demonName)) return false
		for (let skillName of targetSkills) {
			let skill = this.compendium.skills[skillName]
			if (skill.unique && skill.unique !== demonName) return false
			if (!this.compendium.isInheritable(demonName, skillName)) {
				return false
			}
		}
		return this.canInheritOrLearn(targetSkills, demonName)
	}
	private demon_canInheritOrLearn(
		targetSkills: string[],
		demonName: string
	): boolean {
		let maxInherit: number
		if (this.compendium.isSpecial(demonName)) {
			let specialRecipe = this.compendium.buildSpecialFusion(demonName)
			maxInherit = this.getMaxNumOfInherittedSkills(specialRecipe)
		} else maxInherit = 4
		//number of skills needed to be learned after inheritance
		let numberNeeded: number = targetSkills.length - maxInherit
		if (numberNeeded < 1) return true
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
	/**
	 * ---NO-DEMON METHODS---
	 *
	 * These methods will be called with the user does not provide a demon name.
	 * All the methods do the same thing as stated in DemonBuilder, just with
	 * different arguments.
	 */
	protected noDemon_getFusionChains(
		targetSkills: string[]
	): Observable<BuildMessage> {
		/* if there are any unique skills, we know we will be building to a 
			specific demon. Switch to other method.*/
		let unique = this.hasUniqueSkills(targetSkills)
		if (unique) {
			return this.demon_getFusionChains(targetSkills, unique)
		}
		//get a list of possible demons with desirable skills
		let demons = this.getDemonsWithSkills(targetSkills)
		for (let demonName of demons) {
			if (!this.isPossible(targetSkills, demonName)) {
				demons = demons.filter((demon) => demon != demonName)
			}
		}
		//run all possible demons through getFusionChains and flatten the output into a single observable stream
		let result = new ReplaySubject<BuildMessage>(Infinity)
		from(demons)
			.pipe(
				//delay to make sure this function has finished before callingdemon_getFusionChains
				delay(100),
				mergeMap((demonName) =>
					this.demon_getFusionChains(targetSkills, demonName)
				)
			)
			.subscribe(result)
		return result
	}
	noDemon_isValidInput(targetSkills: string[]): boolean {
		if (!this.canInheritOrLearn(targetSkills)) {
			throw new Error(Errors.MaxSkills)
		}
		return true
	}
	protected noDemon_isPossible(targetSkills: string[]): boolean {
		//check if the skill is unique, if it is, fuse for that demon
		let unique = this.hasUniqueSkills(targetSkills)
		if (unique) return this.demon_isPossible(targetSkills, unique)

		if (targetSkills.length > 5) {
			return this.canInheritOrLearn(targetSkills)
		}
		return true
	}
	private noDemon_canInheritOrLearn(targetSkills: string[]): boolean {
		//see if there are any demons with innates skills as such
		for (let name in this.compendium.demons) {
			if (this.compendium.isElemental(name)) continue
			if (this.demon_canInheritOrLearn(targetSkills, name)) {
				return true
			}
		}
		return false
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
		this.fuseCount++
		if (depth > this.recurDepth) return null
		if (!this.isPossible(targetSkills, demonName)) return null
		let fissions = this.calculator.getFissions(demonName)
		for (let fission of fissions) {
			this.fuseCount++
			if (!this.validSources(targetSkills, fission)) continue
			let foundSkills = this.checkFusionSkills(targetSkills, fission)
			if (foundSkills.length == targetSkills.length) {
				let chain = this.getEmptyBuildRecipe()
				this.addStep(chain, fission, targetSkills)
				return chain
			}
			if (foundSkills.length > 0 && depth < this.recurDepth) {
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

	/**
	 * Makes sure all the skills passed are less than the max level
	 *
	 * @param targetSkills Skills to check
	 * @returns {possible: boolean, reason: string} True if all skills are less
	 *   than the max level. If not, returns false and gives a reason
	 */
	private checkSkillLevels(targetSkills: string[]): boolean {
		if (this.maxLevel < 99) {
			for (let skillName of targetSkills) {
				if (this.compendium.getSkillLevel(skillName) > this.maxLevel) {
					return false
				}
			}
		}
		return true
	}

	/**
	 * Gets a list of demons that have the skills specified
	 *
	 * @param targetSkills Skills to look for
	 * @returns List of demon names with those skills
	 */
	private getDemonsWithSkills(targetSkills: string[]): string[] {
		let result: string[] = []
		for (let demonName in this.compendium.demons) {
			let demon = this.compendium.demons[demonName]
			let innates = _.intersection(targetSkills, Object.keys(demon.skills))
			if (innates.length > 0) {
				result.push(demonName)
			}
		}
		return result
	}

	/**
	 * Checks if there are any skills in the list are unique
	 *
	 * @param targetSkills Skills to check
	 * @returns The name of the demon that learns the skill if it is unique, if it
	 *   is not unique returns an empty string
	 */
	private hasUniqueSkills(targetSkills: string[]): string {
		for (let skillName of targetSkills) {
			let skill = this.compendium.skills[skillName]
			if (skill.unique) return skill.unique
		}
		return ''
	}
}

//enumeration to keep errors short within methods
enum Errors {
	LowLevel = 'The name of the demon you entered has a minimum level greater than the level you specified.',
	Treasure = 'The name of the demon you entered is a treasure demon, and cannot be fused.',
	Inherit = 'Every Persona has an inheritance type that bars them from learning certain skills. For example persona with inheritance type of Fire cannot inherit Ice skills. You have specified a Persona with an inheritance type that forbids them from learning a skill you have specified.',
	MaxSkills = 'In Persona 5, a normal demon can only inherit a maximum of 4 skills (special demons can inherit 5). Since you specificed more than that, your specified demon must be able to learn at least one of the other specificed skills on their own. Unfortunately, they cannot.',
}

/* we need this line to tell the worker to actually start. See observable-worker docmuentaiton for more details */
runWorker(P5DemonBuilderWorker)
