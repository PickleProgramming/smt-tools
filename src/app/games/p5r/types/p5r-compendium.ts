import _ from 'lodash'

import { ElementTable, FusionTable, Skill } from '@shared/types/smt-tools.types'
import { P5InheritanceType } from '@p5/types/p5-inheritance-types'
import { P5Compendium } from '@p5/types/p5-compendium'

export class P5RCompendium extends P5Compendium {
	/**
	 * Key/value pair of all the skill in the compendium with the type "trait"
	 * represents all the traits a demon can possess in the game
	 *
	 * @type {{ [name: string]: Skill }}
	 */
	public declare traits: { [name: string]: Skill }
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
		// populate traits
		for (let skillName of Object.keys(this.skills)) {
			let skill = this.skills[skillName]
			if (skill.element == 'trait') this.traits[skillName] = skill
		}
	}
}
