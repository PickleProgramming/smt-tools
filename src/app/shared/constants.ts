import { P5ChainCalculator } from '@p5/types/p5-chain-calculator'
import { P5Compendium } from '@p5/types/p5-compendium'
import { P5FusionCalculator } from '@p5/types/p5-fusion-calculator'
import { P5TableConfig } from '@p5/types/p5-table-config'

import { P5RChainCalculator } from '@p5r/types/p5r-chain-calculator'
import { P5RCompendium } from '@p5r/types/p5r-compendium'
import { P5RFusionCalculator } from '@p5r/types/p5r-fusion-calculator'
import { P5RTableConfig } from '@p5r/types/p5r-table-config'

export const P5_COMPENDIUM: P5Compendium = new P5Compendium()
export const P5_TABLE_CONFIG: P5TableConfig = new P5TableConfig()
export const P5_FUSION_CALCULATOR: P5FusionCalculator = new P5FusionCalculator()
export const P5_CHAIN_CALCULATOR: P5ChainCalculator = new P5ChainCalculator()

export const P5R_COMPENDIUM: P5RCompendium = new P5RCompendium()
export const P5R_TABLE_CONFIG: P5RTableConfig = new P5RTableConfig()
export const P5R_FUSION_CALCULATOR: P5RFusionCalculator =
	new P5RFusionCalculator()
export const P5R_CHAIN_CALCULATOR: P5RChainCalculator = new P5RChainCalculator()
