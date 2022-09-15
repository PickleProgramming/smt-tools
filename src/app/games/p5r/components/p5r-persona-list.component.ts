import { Component, OnInit } from '@angular/core'

import { P5RTableConfig } from '@p5r/types/p5r-table-config'
import { Demon } from '@shared/types/smt-tools.types'

import { P5R_COMPENDIUM, P5R_TABLE_CONFIG } from '@shared/constants'

@Component({
	selector: 'app-p5r-persona-list',
	template: ` <app-demon-list [tableConfig]="tableConfig" [demons]="demons">
	</app-demon-list>`,
})
export class P5RPersonaListComponent implements OnInit {
	tableConfig: P5RTableConfig = P5R_TABLE_CONFIG
	demons: { [name: string]: Demon } = P5R_COMPENDIUM.demons

	constructor() {}

	ngOnInit(): void {}
}
