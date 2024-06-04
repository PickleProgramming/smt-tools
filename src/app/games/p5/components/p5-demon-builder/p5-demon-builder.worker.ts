import { P5_COMPENDIUM, P5_FUSION_CALCULATOR } from '@shared/constants'
import { DemonBuilder } from '@shared/types/demon-builder'
import { BuildMessage, UserInput } from '@shared/types/smt-tools.types'
import { Observable, ReplaySubject, Subscriber, from } from 'rxjs'
import { P5Compendium } from '@p5/types/p5-compendium'
import { P5FusionCalculator } from '@p5/types/p5-fusion-calculator'
import _, { values } from 'lodash'
import { runWorker } from 'observable-webworker'
import { delay, mergeMap } from 'rxjs/operators'
import { BuildRecipe } from '@shared/types/build-recipe'

/**
 * Description placeholder
 *
 * @class P5DemonBuilderWorker
 * @extends {DemonBuilder}
 * @typedef {P5DemonBuilderWorker}
 * @export
 */
export class P5DemonBuilderWorker extends DemonBuilder {
	/**
	 * @type {P5Compendium}
	 * @inheritdoc {DemonBuilder.compendium}
	 * @override
	 * @see DemonBuilder.compendium
	 */
	declare compendium: P5Compendium
	/**
	 * @inheritdoc {DemonBuilder.calculator}
	 * @see DemonBuilder.calculator
	 */
	declare calculator: P5FusionCalculator
	/**
	 * Description placeholder
	 *
	 * @type {number}
	 * @inheritdoc {DemonBuilder.targetLength}
	 * @override
	 * @see DemonBuilder.targetLength
	 */
	declare targetLength: number
	/**
	 * Creates an instance of P5DemonBuilderWorker.
	 *
	 * @class
	 */
	constructor() {
		super(P5_COMPENDIUM, P5_FUSION_CALCULATOR)
	}
	/**
	 * @inheritdoc {DemonBuilder.workUnit}
	 * @see DemonBuilder.workUnit
	 */
	workUnit(input: UserInput): Observable<BuildMessage> {
		return this.getBuildRecipes(input)
	}
	/**
	 * ---WRAPPER METHODS---
	 *
	 * These methods will call the corresponding methods in the DEMON-NAME or
	 * NO-NAME methods depending on if the user supplied a demonName or not.
	 */

	/**
	 * @{inheritdoc DemonBuilder.getBuildRecipes}
	 * @see DemonBuilder.getBuildRecipes
	 */
	protected getBuildRecipes(input: UserInput): Observable<BuildMessage> {
		if (input.maxLevel) this.maxLevel = input.maxLevel
		//check for any immediate problems with user input then begin recursive calls, either with a specified demon or without.
		this.isValid(input.targetSkills, input.demonName)
		if (input.demonName) {
			return this.demon_getBuildRecipes(
				input.targetSkills,
				input.demonName
			)
		}
		return this.noDemon_getBuildRecipes(input.targetSkills)
	}
	/**
	 * @{inheritdoc DemonBuilder.isValid}
	 * @see DemonBuilder.isValid
	 */
	protected isValid(
		targetSkills: string[],
		demonName?: string | null
	): boolean {
		if (this.maxLevel < 99) {
			for (let skillName of targetSkills) {
				let skillLevel = this.compendium.getSkillLevel(skillName)
				if (skillLevel > this.maxLevel) {
					throw new Error(
						this.getSkillLevelError(skillName, skillLevel)
					)
				}
			}
		}
		if (demonName) {
			return this.demon_isValid(targetSkills, demonName)
		}
		return this.noDemon_isValid(targetSkills)
	}

	/**
	 * @{inheritdoc DemonBuilder.isPossible}
	 * @see DemonBuilder.isPossible
	 */
	protected isPossible(targetSkills: string[], demonName?: string): boolean {
		if (!this.checkSkillLevels(targetSkills)) return false
		if (demonName) {
			return this.demon_isPossible(targetSkills, demonName)
		}
		return this.noDemon_isPossible(targetSkills)
	}

	/**
	 * @{inheritdoc DemonBuilder.canInheritOrLearn}
	 * @see DemonBuilder.canInheritOrLearn
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

	/**
	 * Overload of {@see DemonBuilder.getBuildRecipes} handling the operation
	 * when a demon name is specified
	 *
	 * @overload
	 */
	protected demon_getBuildRecipes(
		targetSkills: string[],
		demonName: string
	): Observable<BuildMessage> {
		return new Observable<BuildMessage>((sub) => {
			this.demon_getBuildRecipesShallow(targetSkills, demonName, sub)
			while (this.buildCount < this.targetLength) {
				this.demon_getBuildRecipesDeep(targetSkills, demonName, sub)
			}
			sub.complete()
		})
	}

	/**
	 * Attempts to generate a recipe to bulid the specified demon while never
	 * exceeding a recursive depth of 1. This will mean only the easy
	 * calculations are attempted
	 *
	 * @param {string[]} targetSkills Skills to build to
	 * @param {string} demonName Name of the demon to build
	 * @param {Subscriber<BuildMessage>} sub
	 * @protected
	 */
	protected demon_getBuildRecipesShallow(
		targetSkills: string[],
		demonName: string,
		sub: Subscriber<BuildMessage>
	): void {
		let skills = _.cloneDeep(targetSkills)
		let demon = this.compendium.demons[demonName]
		//filter out skills the demon learns innately
		let innate = _.intersection(skills, Object.keys(demon.skills))
		if (innate.length > 0) _.pullAll(skills, innate)

		if (skills.length > 4) {
			this.special_demon_getBuildRecipes(skills, demonName, sub, innate)
		} else {
			this.normal_demon_getBuildRecipes(skills, demonName, sub, innate)
		}
	}

	/**
	 * Method to get recipes for a special fusion where a specified demon should
	 * inherit a number of skills that is greater than 4. Should be called after
	 * determining is the demon learns any skills innately, and after removing
	 * those skills from the targetSkills list.
	 *
	 * @param targetSkills List of the skills to be inheritted
	 * @param demonName The name of the demon to fuse to
	 * @param sub The subscriber object that sends messages to the component
	 * @param innate The skills found that the demon learns innately
	 */
	protected special_demon_getBuildRecipes(
		targetSkills: string[],
		demonName: string,
		sub: Subscriber<BuildMessage>,
		innate: string[]
	): void {
		if (targetSkills.length > 5) {
			throw Error(
				'Called special_getBuildRecipe with less than 5 skills, use the normal function for these cases.'
			)
		}
		//because only special fusions can inherit more than 4 skills, and special fusions only have one recipe, we know there is only one recipe for the demon specified in the arguments
		let fission = this.calculator.getFissions(demonName)[0]
		//check if fission have any desirable skills
		let found = this.checkFusionSkills(targetSkills, fission)
		//build a list of every combination of 4 of the skills
		let subArrays = this.getSubArrays(targetSkills)
		let combos: string[][] = []
		for (let subArray of subArrays) {
			if (subArray.length == 4) combos.push(subArray)
		}
		//build a recipe where a parent inherits 4 of the skills
		for (let combo of combos) {
			let lastSkill = _.difference(targetSkills, combo)
			for (let sourceA of fission.sources) {
				let result = this.getBuildRecipe(combo, 0, sourceA)
				//found a parent that can inherit 4 skills
				if (!result) continue
				let diff = fission.sources.filter((value) => value != sourceA)
				for (let sourceB of diff) {
					let recipe = this.getBuildRecipe(lastSkill, 0, sourceB)
					if (!recipe) continue
					//found another parent that can inherit the last skill
					result.addSpecialFusion(recipe)
					this.emitBuild(fission, found, innate, sub, result)
				}
			}
		}
	}

	/**
	 * Method to get recipes for a normal or special fusion where a specified
	 * demon should inherit a number of skills that is less than or equal to 4.
	 * Should be called after determining is the demon learns any skills
	 * innately, and after removing those skills from the targetSkills list.
	 *
	 * @param targetSkills List of the skills to be inheritted
	 * @param demonName The name of the demon to fuse to
	 * @param sub The subscriber object that sends messages to the component
	 * @param innate The skills found that the demon learns innately
	 */
	protected normal_demon_getBuildRecipes(
		targetSkills: string[],
		demonName: string,
		sub: Subscriber<BuildMessage>,
		innate: string[]
	): void {
		let fissions = this.calculator.getFissions(demonName)
		for (let fission of fissions) {
			this.incCount(sub)
			if (!this.validSources(targetSkills, fission)) continue
			//check if fissions have desirable skills
			let found = this.checkFusionSkills(targetSkills, fission)
			if (found.length > 0 || this.recurDepth > 0) {
				let diff = _.difference(targetSkills, found)
				//finish recipe if we have found all skills
				if (diff.length == 0) {
					this.emitBuild(fission, found, innate, sub)
					break
				}
				//check sources if we have more skills to find
				for (let sourceName of fission.sources) {
					let build: BuildRecipe | null
					build = this.getBuildRecipe(diff, 0, sourceName)
					this.incCount(sub)
					if (build) {
						//prettier-ignore
						this.emitBuild(fission, found, innate, sub, build)
					}
				}
			}
		}
		sub.next({
			build: null,
			fuseCount: this.fuseCount++,
		})
	}

	/**
	 * Attempts to generate a recipe to bulid the specified demon. There is no
	 * limit on the recursive depth this algorithm will go, it will only stop
	 * once it has fount enough build recipes to equal this.targetLength
	 *
	 * @param {string[]} targetSkills Skills to build to
	 * @param {string} demonName Name of the demon to build
	 * @param {Subscriber<BuildMessage>} sub
	 * @protected
	 */
	protected demon_getBuildRecipesDeep(
		targetSkills: string[],
		demonName: string,
		sub: Subscriber<BuildMessage>
	): void {
		//each loop will increment recurDepth, keep going until we have the configured amount of build recipes
		while (this.buildCount < this.targetLength) {
			this.recurDepth++
			this.demon_getBuildRecipesShallow(targetSkills, demonName, sub)
		}
	}
	/**
	 * Overload of {@see DemonBuilder.isValid} handling the operation when a
	 * demon name is specified
	 *
	 * @overload
	 */
	protected demon_isValid(skills: string[], demonName: string): boolean {
		let demon = this.compendium.demons[demonName]
		if (demon.level > this.maxLevel) {
			throw new Error(this.getLowLevelError(demonName))
		}
		let innates = Object.keys(demon.skills)
		if (_.intersection(skills, innates).length === skills.length) {
			let level = 0
			for (let skill of skills) {
				if (demon.skills[skill] > level) level = demon.skills[skill]
			}
			throw new Error(this.getAlreadyLearnsError(demonName, level))
		}
		if (this.compendium.isElemental(demonName)) {
			throw new Error(Errors.Treasure)
		}
		for (let skillName of skills) {
			let skill = this.compendium.skills[skillName]
			if (skill.unique && skill.unique !== demonName) {
				throw new Error(this.getUniqueError(skill.unique, demonName))
			}
			if (!this.compendium.isInheritable(demonName, skillName)) {
				throw new Error(this.getInheritTypeError(demonName, skillName))
			}
		}
		if (!this.canInheritOrLearn(skills, demonName)) {
			throw new Error(Errors.MaxSkills)
		}
		return true
	}
	/**
	 * Overload of {@see DemonBuilder.isPossible} handling the operation when a
	 * demon name is specified
	 *
	 * @overload
	 */
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
	/**
	 * Overload of {@see DemonBuilder.canInheritOrLearn} handling the operation
	 * when a demon name is specified
	 *
	 * @overload
	 */
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

	/**
	 * Overload of {@see DemonBuilder.getBuildRecipes} handling the operation
	 * when NO demon name is specified
	 *
	 * @overload
	 */
	protected noDemon_getBuildRecipes(
		targetSkills: string[]
	): Observable<BuildMessage> {
		// if there are any unique skills, we know we will be building to a specific demon. Switch to other method.
		let unique = this.hasUniqueSkills(targetSkills)
		if (unique) {
			return this.demon_getBuildRecipes(targetSkills, unique)
		}
		//get a list of possible demons with desirable skills
		let demons = this.getDemonsWithSkills(targetSkills)
		for (let demonName of demons) {
			if (!this.isPossible(targetSkills, demonName)) {
				demons = demons.filter((demon) => demon != demonName)
			}
		}
		return new Observable((sub) => {
			while (this.buildCount < this.targetLength) {
				for (let demonName of demons) {
					this.demon_getBuildRecipesShallow(
						targetSkills,
						demonName,
						sub
					)
				}
			}
			sub.complete()
		})
	}
	/**
	 * Overload of {@see DemonBuilder.isValid} handling the operation when NO
	 * demon name is specified
	 *
	 * @overload
	 */
	noDemon_isValid(skills: string[]): boolean {
		let demons = this.getDemonsWithSkills(skills)
		for (let demon of demons) {
			let inter = _.intersection(
				skills,
				Object.keys(this.compendium.demons[demon].skills)
			)
			if (inter.length === skills.length) {
				let level = 0
				for (let skill of skills) {
					let demonSkill = this.compendium.demons[demon].skills[skill]
					if (demonSkill > level) level = demonSkill
				}
				throw new Error(this.getAlreadyLearnsError(demon, level))
			}
		}
		if (!this.canInheritOrLearn(skills)) {
			throw new Error(Errors.MaxSkills)
		}
		return true
	}
	/**
	 * Overload of {@see DemonBuilder.isPossible} handling the operation when NO
	 * demon name is specified
	 *
	 * @overload
	 */
	protected noDemon_isPossible(targetSkills: string[]): boolean {
		//check if the skill is unique, if it is, fuse for that demon
		let unique = this.hasUniqueSkills(targetSkills)
		if (unique) return this.demon_isPossible(targetSkills, unique)

		if (targetSkills.length > 5) {
			return this.canInheritOrLearn(targetSkills)
		}
		return true
	}
	/**
	 * Overload of {@see DemonBuilder.canInheritOrLearn} handling the operation
	 * when NO demon name is specified
	 *
	 * @overload
	 */
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
	/**
	 * @{inheritdoc DemonBuilder.getBuildRecipe}
	 * @see DemonBuilder.getBuildRecipe
	 */
	protected getBuildRecipe(
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
				let recipe = new BuildRecipe()
				recipe.addStep(fission, targetSkills)
				return recipe
			}
			if (foundSkills.length > 0 && depth < this.recurDepth) {
				for (let sourceName of fission.sources) {
					let diff = _.difference(targetSkills, foundSkills)
					let recipe = this.getBuildRecipe(
						diff,
						depth + 1,
						sourceName
					)
					if (recipe != null) {
						recipe.addStep(fission, foundSkills)
						return recipe
					}
				}
			}
		}
		return null
	}

	/**
	 * Makes sure all the skills passed are less than the max level
	 *
	 * @private
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
	 * @private
	 * @param targetSkills Skills to look for
	 * @returns {string[]} List of demon names with those skills
	 */
	private getDemonsWithSkills(targetSkills: string[]): string[] {
		let result: string[] = []
		for (let demonName in this.compendium.demons) {
			let demon = this.compendium.demons[demonName]
			let innates = _.intersection(
				targetSkills,
				Object.keys(demon.skills)
			)
			if (innates.length > 0) {
				result.push(demonName)
			}
		}
		return result
	}

	/**
	 * Checks if there are any skills in the list are unique
	 *
	 * @private
	 * @param targetSkills Skills to check
	 * @returns {string} The name of the demon that learns the skill if it is
	 *   unique, if it is not unique returns an empty string
	 */
	private hasUniqueSkills(targetSkills: string[]): string {
		for (let skillName of targetSkills) {
			let skill = this.compendium.skills[skillName]
			if (skill.unique) return skill.unique
		}
		return ''
	}

	private getUniqueError(uniqueDemon: string, inputDemon: string): string {
		return `You entered a skill that is unique to ${uniqueDemon}. But you specified the demon name ${inputDemon}.`
	}
	private getInheritTypeError(skill: string, demon: string): string {
		return `Every Persona has an inheritance type that bars them from learning certain skills. For example persona with inheritance type of Fire cannot inherit Ice skills. In this case ${demon} cannot inherit ${skill}.`
	}
	private getLowLevelError(demon: string): string {
		return `The name of the demon you entered has a minimum level greater than the level you specified. The minimum level for ${demon} is ${this.compendium.demons[demon].level}.`
	}
	private getSkillLevelError(skill: string, level: number): string {
		return `You have specified a level that is lower than ${level}, which is the minimum required level to fuse a persona that can learn ${skill}.`
	}
	private getAlreadyLearnsError(demon: string, level: number): string {
		return `${demon} already learns all the skills you specified by level ${level}.`
	}
}

/**
 * Enumeration to keep errors short within methods
 *
 * @enum {number}
 */
enum Errors {
	Treasure = 'The name of the demon you entered is a treasure demon, and cannot be fused.',
	MaxSkills = 'In Persona 5, a normal demon can only inherit a maximum of 4 skills (special demons can inherit 5). Since you specificed more than that, your specified demon must be able to learn at least one of the other specificed skills on their own. Unfortunately, they cannot.',
}

//we need this line to tell the worker to actually start. See observable-worker docmuentaiton for more details
runWorker(P5DemonBuilderWorker)
