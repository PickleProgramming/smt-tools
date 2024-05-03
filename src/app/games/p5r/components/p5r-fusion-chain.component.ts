import { Component, OnInit } from '@angular/core'

import { P5Compendium } from '@p5/types/p5-compendium'

import { P5R_COMPENDIUM } from '@shared/constants'

@Component({
	selector: 'app-p5-fusion-chain',
	template: ` <app-fusion-chain [compendium]="compendium">
	</app-fusion-chain>`,
})
export class P5RFusionChainComponent implements OnInit {
	compendium: P5Compendium = P5R_COMPENDIUM

	constructor() {}

	ngOnInit(): void {}
}
