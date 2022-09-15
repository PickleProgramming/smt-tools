import { Component, OnInit } from '@angular/core'

import { P5RCompendium } from '@p5r/types/p5r-compendium'

import { P5R_COMPENDIUM } from '@shared/constants'

@Component({
	selector: 'app-p5r-fusion-chain',
	template: ` <app-fusion-chain [compendium]="compendium">
	</app-fusion-chain>`,
})
export class P5RFusionChainComponent implements OnInit {
	compendium: P5RCompendium = P5R_COMPENDIUM

	constructor() {}

	ngOnInit(): void {}
}
