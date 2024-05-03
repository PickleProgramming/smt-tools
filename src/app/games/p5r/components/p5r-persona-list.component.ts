import { Component, OnInit } from '@angular/core'

import { P5TableConfig } from '@p5/types/p5-table-config'
import { Demon } from '@shared/types/smt-tools.types'

import { P5_TABLE_CONFIG, P5R_COMPENDIUM } from '@shared/constants'

@Component({
	selector: 'app-p5r-persona-list',
	template: ` <app-demon-list [tableConfig]="tableConfig" [demons]="demons">
	</app-demon-list>`,
})
export class P5RPersonaListComponent implements OnInit {
	tableConfig: P5TableConfig = P5_TABLE_CONFIG
	demons: { [name: string]: Demon } = P5R_COMPENDIUM.demons

	constructor() {}

	ngOnInit(): void {}
}
