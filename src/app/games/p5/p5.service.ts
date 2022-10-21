import { Injectable } from '@angular/core'
import { P5ChainCalculator } from './types/p5-chain-calculator'
import { P5Compendium } from './types/p5-compendium'
import { P5FusionCalculator } from './types/p5-fusion-calculator'
import { P5TableConfig } from './types/p5-table-config'

@Injectable()
export class P5Service {
	P5_COMPENDIUM: P5Compendium
	P5_TABLE_CONFIG: P5TableConfig
	P5_FUSION_CALCULATOR: P5FusionCalculator
	P5_CHAIN_CALCULATOR: P5ChainCalculator

	constructor() {
		this.P5_COMPENDIUM = new P5Compendium()
		this.P5_TABLE_CONFIG = new P5TableConfig()
		this.P5_FUSION_CALCULATOR = new P5FusionCalculator()
		this.P5_CHAIN_CALCULATOR = new P5ChainCalculator()
	}
}
