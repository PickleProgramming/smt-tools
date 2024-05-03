import { P5ChainCalculator } from '@p5/types/p5-chain-calculator'
import { P5Compendium } from '@p5/types/p5-compendium'
import { P5FusionCalculator } from '@p5/types/p5-fusion-calculator'
import { P5TableConfig } from '@p5/types/p5-table-config'

import PERSONA_DATA from '@p5/data/persona-data.json'
import SKILL_DATA from '@p5/data/skill-data.json'
import SPECIAL_RECIPES from '@p5/data/special-recipes.json'
import DLC_DATA from '@p5/data/dlc-data.json'
import INHERIT_DATA from '@p5/data/inheritance-types.json'
import FUSION_TABLE from '@p5/data/fusion-table.json'
import ELEMENT_TABLE from '@p5/data/element-table.json'

export const P5_COMPENDIUM: P5Compendium = new P5Compendium(
	PERSONA_DATA,
	SKILL_DATA,
	FUSION_TABLE,
	SPECIAL_RECIPES,
	DLC_DATA,
	ELEMENT_TABLE,
	INHERIT_DATA
)
export const P5_TABLE_CONFIG: P5TableConfig = new P5TableConfig()
export const P5_FUSION_CALCULATOR: P5FusionCalculator = new P5FusionCalculator()
export const P5_CHAIN_CALCULATOR: P5ChainCalculator = new P5ChainCalculator()
