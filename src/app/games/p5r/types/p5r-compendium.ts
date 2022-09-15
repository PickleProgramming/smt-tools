import _ from 'lodash'

import { Compendium } from '@shared/types/compendium'
import { Skill, Recipe } from '@shared/types/smt-tools.types'

import PERSONA_DATA from '@p5r/data/persona-data.json'
import SKILL_DATA from '@p5r/data/skill-data.json'
import SPECIAL_RECIPES from '@p5r/data/special-recipes.json'
import DLC_DATA from '@p5r/data/dlc-data.json'
import INHERIT_DATA from '@p5/data/inheritance-types.json'
import FUSION_TABLE from '@p5r/data/fusion-table.json'
import ELEMENT_TABLE from '@p5r/data/element-table.json'

export class P5RCompendium extends Compendium {
	constructor() {
		super(
			PERSONA_DATA,
			SKILL_DATA,
			SPECIAL_RECIPES,
			FUSION_TABLE,
			DLC_DATA,
			ELEMENT_TABLE
		)
		//move dlc demon skills to anothe list
		this.dlcSkills = {}
		for (let skillName in this.skills) {
			if (Object.keys(this.skills[skillName].learnedBy).length == 0) {
				for (let demonName in this.dlcDemons) {
					let demonSkills: string[] = Object.keys(
						this.dlcDemons[demonName].skills
					)
					if (_.indexOf(demonSkills, skillName) != -1) {
						this.dlcSkills[skillName] = this.skills[skillName]
					}
				}
				delete this.skills[skillName]
			}
		}
		//remove any skills that are only used by party members
		for (let skill in this.skills) {
		}
	}

	protected parseSkills(skillData: Object): { [name: string]: Skill } {
		let skills: { [name: string]: Skill } = {}
		Object.entries(skillData).forEach(([skillName, data]) => {
			skills[skillName] = {
				effect: data.effect,
				element: data.element,
				learnedBy: {},
				cost: '',
			}
			let newCost: string
			if ('cost' in data) {
				if (data['cost'] > 1000) newCost = data['cost'] - 1000 + ' MP'
				else newCost = data['cost'] + '% HP'
			} else newCost = '-'
			skills[skillName].cost = newCost
			if ('unique' in data) skills[skillName].unique = data['unique']
			if ('card' in data) skills[skillName].card = data['card']
		})
		return skills
	}

	protected parseSpecial(specialData: Object): {
		[demonName: string]: string[]
	} {
		let specialRecipes: { [demonName: string]: string[] } = {}
		Object.entries(specialData).forEach(
			([demon, recipe]) => (specialRecipes[demon] = recipe)
		)
		return specialRecipes
	}

	/*  Determines if the demon with the given name can inherit the skill
        with the given name
        @param demonName: name of demon to check
        @param skillName: name of skill to check
        @returns {boolean}: returns true if the demon can inherit this skill
        false othewise 
    */
	isInheritable(demonName: string, skillName: string): boolean {
		let skillElem = this.skills[skillName].element
		if (
			skillElem === 'support' ||
			skillElem === 'almighty' ||
			skillElem === 'passive'
		)
			return true
		let demonElem = this.demons[demonName].inherits
		let ratios =
			INHERIT_DATA.ratios[INHERIT_DATA.inherits.indexOf(demonElem!)]
		if (ratios.charAt(INHERIT_DATA.elems.indexOf(skillElem)) == 'O')
			return true
		return false
	}

	/* returns the approximate cost of the supplied recipe */
	getCost(recipe: Recipe): number {
		let cost = 0
		for (let source of recipe.sources) {
			let level = this.demons[source].level
			cost += 27 * level * level + 126 * level + 2147
		}
		return cost
	}

	/*  @param: the element to check the inheritance capabilites of
        returns: an array of the inheritance capabilites of the demon
            see https://megamitensei.fandom.com/wiki/Skill_Inheritance */
	getInherits(element: string): boolean[] {
		let ret: boolean[] = []
		let inherits =
			INHERIT_DATA.ratios[INHERIT_DATA.inherits.indexOf(element)].split(
				''
			)
		for (let elem of inherits) {
			if (elem === 'O') ret.push(true)
			else ret.push(false)
		}
		return ret
	}
}
