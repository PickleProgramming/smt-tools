import _ from 'lodash'

import { Compendium } from '@shared/types/compendium'
import {
	Skill,
	Recipe,
	ElementTable,
	FusionTable,
} from '@shared/types/smt-tools.types'
import { P5InheritanceType } from './p5-inheritance-types'

export class P5Compendium extends Compendium {
	inheritance: P5InheritanceType
	constructor(
		personaData: Object,
		skillData: Object,
		fusionTable: FusionTable,
		specialRecipes: Object,
		dlcData: Object,
		elementTable: ElementTable,
		inheritData: P5InheritanceType,
	) {
		super(
			personaData,
			skillData,
			fusionTable,
			specialRecipes,
			dlcData,
			elementTable,
		)

		this.inheritance = inheritData

		//move dlc demon skills to another list
		this.dlcSkills = {}
		for (let skillName in this.skills) {
			if (Object.keys(this.skills[skillName].learnedBy).length == 0) {
				for (let demonName in this.dlcDemons) {
					let demonSkills: string[] = Object.keys(
						this.dlcDemons[demonName].skills,
					)
					if (_.indexOf(demonSkills, skillName) != -1) {
						this.dlcSkills[skillName] = this.skills[skillName]
					}
				}
				delete this.skills[skillName]
			}
		}

		console.log('P5 Compendium Created')

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
			([demon, recipe]) => (specialRecipes[demon] = recipe),
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
			this.inheritance.ratios[
				this.inheritance.inherits.indexOf(demonElem!)
			]
		if (ratios.charAt(this.inheritance.elems.indexOf(skillElem)) == 'O')
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
			this.inheritance.ratios[
				this.inheritance.inherits.indexOf(element)
			].split('')
		for (let elem of inherits) {
			if (elem === 'O') ret.push(true)
			else ret.push(false)
		}
		return ret
	}
}
