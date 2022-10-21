import { Component, OnInit } from '@angular/core'
import { P5Service } from '@p5/p5.service'

import { P5Compendium } from '@p5/types/p5-compendium'

@Component({
	selector: 'app-p5-fusion-chain',
	template: ` <app-fusion-chain [compendium]="compendium">
	</app-fusion-chain>`,
	providers: [P5Service],
})
export class P5FusionChainComponent implements OnInit {
	compendium!: P5Compendium

	constructor(private service: P5Service) {}

	ngOnInit(): void {
		this.compendium = this.service.P5_COMPENDIUM
	}
}
