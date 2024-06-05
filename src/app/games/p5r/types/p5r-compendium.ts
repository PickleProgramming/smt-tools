import _ from 'lodash'

import {
	Demon,
	ElementTable,
	FusionTable,
	Skill,
} from '@shared/types/smt-tools.types'
import { P5InheritanceType } from '@p5/types/p5-inheritance-types'
import { P5Compendium } from '@p5/types/p5-compendium'

export class P5RCompendium extends P5Compendium {
	/**
	 * Key/value pair of all the skill in the compendium with the type "trait"
	 * represents all the traits a demon can possess in the game
	 *
	 * @type {{ [name: string]: Skill }}
	 */
	public traits: { [name: string]: Skill } = {}
	constructor(
		personaData: Object,
		skillData: Object,
		fusionTable: FusionTable,
		specialRecipes: Object,
		dlcData: Object,
		elementTable: ElementTable,
		inheritData: P5InheritanceType
	) {
		super(
			personaData,
			skillData,
			fusionTable,
			specialRecipes,
			dlcData,
			elementTable,
			inheritData
		)
		let skillNames = Object.keys(this.skills)
		let test: string[] = []
		for (let skillName in this.skills) {
			test.push(skillName)
		}
		// populate traits
		for (let skillName of skillNames) {
			let skill = this.skills[skillName]
			if (skill.element == 'trait') this.traits[skillName] = skill
		}
	}
	/**
	 * Override to account for traits feature added in P5R
	 *
	 * @inheritdoc {Compendium.parseDemons}
	 * @see Compendium.parseDemons
	 */
	protected parseDemons(
		demonData: Object,
		demonList: { [name: string]: Demon },
		skillList?: { [name: string]: Skill }
	): void {
		Object.entries(demonData).forEach(([demon, data]) => {
			demonList[demon] = {
				race: data.race,
				level: data.level,
				stats: data.stats,
				resistances: data.resists,
				skills: data.skills,
				inherits: data.inherits,
				drop: data.item,
			}
			// add the demon's trait as a skill that the demon knows innately
			demonList[demon].skills[data.trait] = 0
		})
		if (!skillList) return
		for (let demonName in demonList) {
			for (let skillName in demonList[demonName].skills) {
				let level = demonList[demonName].skills[skillName]
				skillList[skillName].learnedBy[demonName] = level
			}
		}
	}
}
