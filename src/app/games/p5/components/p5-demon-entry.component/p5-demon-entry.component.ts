import { Component } from '@angular/core'
import { Router } from '@angular/router'

import { P5Compendium } from '@p5/types/p5-compendium'
import { P5FusionCalculator } from '@p5/types/p5-fusion-calculator'

import {
	P5_COMPENDIUM,
	P5_FUSION_CALCULATOR,
	P5_TABLE_CONFIG,
} from '@shared/constants'
import { TableConfig } from '@shared/types/smt-tools.types'

@Component({
	selector: 'app-p5-demon-entry',
	template: ` <app-demon-entry
		[compendium]="compendium"
		[calculator]="calculator"
		[tableConfig]="tableConfig"
	>
	</app-demon-entry>`,
	styleUrl: './p5-demon-entry.component.scss',
})
export class P5DemonEntryComponent {
	declare name: string
	compendium: P5Compendium = P5_COMPENDIUM
	calculator: P5FusionCalculator = P5_FUSION_CALCULATOR
	tableConfig: TableConfig = P5_TABLE_CONFIG

	constructor(private router: Router) {}
}
