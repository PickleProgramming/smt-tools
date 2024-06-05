import { P5FusionCalculator } from '@p5/types/p5-fusion-calculator'
import { P5R_COMPENDIUM } from '@shared/constants'

export class P5RFusionCalculator extends P5FusionCalculator {
	constructor(compendium = P5R_COMPENDIUM) {
		super(compendium)
	}
}
