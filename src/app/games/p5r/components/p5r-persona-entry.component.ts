import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { P5RCompendium } from '@p5r/types/p5r-compendium'
import { P5RFusionCalculator } from '@p5r/types/p5r-fusion-calculator'

import { P5R_COMPENDIUM, P5R_FUSION_CALCULATOR } from '@shared/constants'

@Component({
	selector: 'app-p5r-persona-entry',
	template: ` <app-demon-entry
		[compendium]="compendium"
		[calculator]="calculator"
	>
	</app-demon-entry>`,
})
export class P5RPersonaEntryComponent implements OnInit {
	name!: string
	compendium: P5RCompendium = P5R_COMPENDIUM
	calculator: P5RFusionCalculator = P5R_FUSION_CALCULATOR

	constructor(private router: Router) {}

	ngOnInit(): void {}
}
