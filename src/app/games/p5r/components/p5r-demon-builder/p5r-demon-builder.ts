import { runWorker } from 'observable-webworker'
import { P5DemonBuilderWorker } from '@p5/components/p5-demon-builder/p5-demon-builder'
import { BuildMessage } from '@shared/types/smt-tools.types'
import { Subscriber } from 'rxjs'
import _ from 'lodash'
import { P5RCompendium } from '@p5r/types/p5r-compendium'
import { BuildRecipe } from '@shared/types/build-recipe'
import { P5R_COMPENDIUM, P5R_FUSION_CALCULATOR } from '@shared/constants'

/**
 * An extension of P5 Demon Builder to work with the new Trait feature in P5R.
 *
 * @class P5DemonBuilderWorker
 * @extends {DemonBuilder}
 * @typedef {P5DemonBuilderWorker}
 * @remark
 * Traits are treated as skills with an element of "trait" to distinguish them
 * from regular skills. So when checking for them I would just read through the
 * skills and find the only skill that had an element of "trait".
 *
 * @export
 */
export class P5RDemonBuilderWorker extends P5DemonBuilderWorker {
	/**
	 * @type {P5RCompendium}
	 * @inheritdoc {DemonBuilder.compendium}
	 * @override
	 * @see DemonBuilder.compendium
	 */
	declare compendium: P5RCompendium
	constructor(
		compendium = P5R_COMPENDIUM,
		calculator = P5R_FUSION_CALCULATOR
	) {
		super(compendium, calculator)
	}
	/**
	 * ---WRAPPER METHODS---
	 *
	 * These methods will call the corresponding methods in the DEMON-NAME or
	 * NO-NAME methods depending on if the user supplied a demonName or not.
	 */
	/**
	 * ---DEMON METHODS---
	 *
	 * These methods will be called when the user provides a demon name. All the
	 * methods do the same thing as stated in DemonBuilder, just with different
	 * arguments.
	 */
	protected demon_isValid(skills: string[], demonName: string): boolean {
		return super.demon_isValid(skills, demonName)
	}
	/**
	 * @inheritdoc {DemonBuilder.demon_getBuildRecipesShallow}
	 * @see {DemonBuilder.demon_getBuildRecipesShallow}
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

		if (this.removeTraits(skills).length > 4) {
			this.special_demon_getBuildRecipes(skills, demonName, sub, innate)
		} else {
			this.normal_demon_getBuildRecipes(skills, demonName, sub, innate)
		}
	}
	/**
	 * @inheritdoc {DemonBuilder.special_demon_getBuildRecipes}
	 * @see {DemonBuilder.special_demon_getBuildRecipes}
	 */
	protected special_demon_getBuildRecipes(
		targetSkills: string[],
		demonName: string,
		sub: Subscriber<BuildMessage>,
		innate: string[]
	): void {
		if (this.removeTraits(targetSkills).length < 5) {
			throw Error(
				'Called special_getBuildRecipe with less than 5 skills, use the normal function for these cases.'
			)
		}
		//because only special fusions can inherit more than 4 skills, and special fusions only have one recipe, we know there is only one recipe for the demon specified in the arguments
		let fission = this.calculator.getFissions(demonName)[0]
		//check if fission have any desirable skills
		let found = this.checkFusionSkills(targetSkills, fission)
		//build a list of every combination of 4 of the skills
		let subArrays = this.getSubArrays(this.removeTraits(targetSkills))
		let combos: string[][] = []
		for (let subArray of subArrays) {
			if (subArray.length == 4) {
				let trait = targetSkills.filter(
					(value) => this.compendium.skills[value].element == 'trait'
				)
				if (trait.length > 0) subArray.push(trait[0])
				combos.push(subArray)
			}
		}
		//build a recipe where a parent inherits 4 of the skills
		for (let combo of combos) {
			let lastSkill = _.difference(this.removeTraits(targetSkills), combo)
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
	 * @inheritdoc {DemonBuilder.demon_getBuildRecipes}
	 * @see {DemonBuilder.demon_getBuildRecipes}
	 */
	protected demon_canInheritOrLearn(
		userSkills: string[],
		demonName: string
	): boolean {
		let maxInherit: number
		// remove any traits from the passed list of skills
		let targetSkills = this.removeTraits(userSkills)
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
	 * ---AGNOSTIC METHODS---
	 *
	 * These methods will work the same regardless of if the user provided demon
	 * name was provided or not.
	 */
	/**
	 * Reads a list of skills and returns a new list with no traits.
	 *
	 * @private
	 * @param {string[]} targetSkills The list of skills that may contain a
	 *   trait
	 * @returns {string[]} List of skills with any traits removed
	 * @remark
	 * Since I treat the the user specified trait as another skill, I need to tell the algorithm not to count it when considering how many skills a demon can inherit.
	 */
	private removeTraits(targetSkills: string[]): string[] {
		let result = structuredClone(targetSkills)
		for (let skillName of result) {
			if (this.compendium.skills[skillName].element === 'trait') {
				_.pull(result, skillName)
			}
		}
		return result
	}
	/**
	 * Returns the name of the specified demon's natural trait.
	 *
	 * @private
	 * @param {string} demonName The name of the demon to check
	 * @returns {string} Name of the trait
	 */
	private getTrait(demonName: string): string {
		let skills = this.compendium.demons[demonName].skills
		for (let skill of Object.keys(skills)) {
			if (this.compendium.skills[skill].element === 'trait') return skill
		}
		return ''
	}
	/** @param recipe */
	private findTrait(recipe: BuildRecipe): void {}
}
