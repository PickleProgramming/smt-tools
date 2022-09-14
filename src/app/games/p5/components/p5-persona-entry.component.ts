import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { P5_COMPENDIUM, P5_FUSION_CALCULATOR } from '@shared/constants'
import { P5Compendium } from '@p5/types/p5-compendium'
import { P5FusionCalculator } from '@p5/types/p5-fusion-calculator'

@Component({
	selector: 'app-p5-persona-entry',
	template: ` <app-demon-entry
		[compendium]="compendium"
		[calculator]="calculator"
	>
	</app-demon-entry>`,
})
export class P5PersonaEntryComponent implements OnInit {
	name!: string
	compendium: P5Compendium = P5_COMPENDIUM
	calculator: P5FusionCalculator = P5_FUSION_CALCULATOR

	constructor(private router: Router) {}

	ngOnInit(): void {}
}
