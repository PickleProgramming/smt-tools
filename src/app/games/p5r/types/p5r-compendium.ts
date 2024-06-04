import _ from 'lodash'

import { ElementTable, FusionTable } from '@shared/types/smt-tools.types'
import { P5InheritanceType } from '@p5/types/p5-inheritance-types'
import { P5Compendium } from '@p5/types/p5-compendium'

export class P5RCompendium extends P5Compendium {
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
	}
}
