import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { P5Compendium } from '@p5/types/p5-compendium'
import { P5FusionCalculator } from '@p5/types/p5-fusion-calculator'

import {
	P5_COMPENDIUM,
	P5_FUSION_CALCULATOR,
	P5_TABLE_CONFIG,
} from '@shared/constants'
import { Demon, TableConfig } from '@shared/types/smt-tools.types'

@Component({
	selector: 'app-p5-demon-entry',
	templateUrl: './p5-demon-entry.component.html',
	styleUrl: './p5-demon-entry.component.scss',
})
export class P5DemonEntryComponent implements OnInit {
	compendium: P5Compendium = P5_COMPENDIUM
	calculator: P5FusionCalculator = P5_FUSION_CALCULATOR
	tableConfig: TableConfig = P5_TABLE_CONFIG

	/**
	 * The name of the demon the entry is about
	 *
	 * @type {string}
	 */
	declare demonName: string
	/**
	 * The object of the demon the entry is about
	 *
	 * @type {Demon}
	 */
	declare demon: Demon

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.demonName = this.router.url.split('/')[3]
		if (this.demonName.includes('%20'))
			this.demonName = this.demonName.replace('%20', ' ')
		this.demon = this.compendium.demons[this.demonName]
	}
}
