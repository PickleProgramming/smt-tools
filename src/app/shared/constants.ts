import { P5ChainCalculator } from '@p5/types/p5-demon-builder'
import { P5Compendium } from '@p5/types/p5-compendium'
import { P5FusionCalculator } from '@p5/types/p5-fusion-calculator'
import { P5TableConfig } from '@p5/types/p5-table-config'

import P5_DEMON_Data from '@p5/data/demon-data.json'
import P5_SKILL_DATA from '@p5/data/skill-data.json'
import P5_SPECIAL_RECIPES from '@p5/data/special-recipes.json'
import P5_DLC_DATA from '@p5/data/dlc-data.json'
import P5_INHERIT_DATA from '@p5/data/inheritance-types.json'
import P5_FUSION_TABLE from '@p5/data/fusion-table.json'
import P5_ELEMENT_TABLE from '@p5/data/element-table.json'

// import { P5RTableConfig } from '@p5r/types/p5r-table-config'

// import P5R_PERSONA_DATA from '@p5r/data/persona-data.json'
// import P5R_SKILL_DATA from '@p5r/data/skill-data.json'
// import P5R_SPECIAL_RECIPES from '@p5r/data/special-recipes.json'
// import P5R_DLC_DATA from '@p5r/data/dlc-data.json'
// import P5R_FUSION_TABLE from '@p5r/data/fusion-table.json'
// import P5R_ELEMENT_TABLE from '@p5r/data/element-table.json'

export const P5_COMPENDIUM: P5Compendium = new P5Compendium(
	P5_DEMON_Data,
	P5_SKILL_DATA,
	P5_FUSION_TABLE,
	P5_SPECIAL_RECIPES,
	P5_DLC_DATA,
	P5_ELEMENT_TABLE,
	P5_INHERIT_DATA
)
export const P5_TABLE_CONFIG: P5TableConfig = new P5TableConfig()
export const P5_FUSION_CALCULATOR: P5FusionCalculator = new P5FusionCalculator()
export const P5_DEMON_BUILDER: P5ChainCalculator = new P5ChainCalculator()

// export const P5R_COMPENDIUM: P5Compendium = new P5Compendium(
// 	P5R_PERSONA_DATA,
// 	P5R_SKILL_DATA,
// 	P5R_FUSION_TABLE,
// 	P5R_SPECIAL_RECIPES,
// 	P5R_DLC_DATA,
// 	P5R_ELEMENT_TABLE,
// 	P5_INHERIT_DATA
// )
// export const P5R_TABLE_CONFIG: P5RTableConfig = new P5RTableConfig()
