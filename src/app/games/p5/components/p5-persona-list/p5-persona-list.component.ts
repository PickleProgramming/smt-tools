import { Component, OnInit } from '@angular/core'

import { P5TableConfig } from '@p5/types/p5-table-config'
import { Demon } from '@shared/types/smt-tools.types'

import { P5_COMPENDIUM, P5_TABLE_CONFIG } from '@shared/constants'

@Component({
	selector: 'app-p5-persona-list',
	template: `<app-demon-list [tableConfig]="tableConfig" [demons]="demons"
		>,
	</app-demon-list>`,
	styleUrl: './p5-persona-list.component.scss',
})
export class P5PersonaListComponent implements OnInit {
	tableConfig: P5TableConfig = P5_TABLE_CONFIG
	demons: { [name: string]: Demon } = P5_COMPENDIUM.demons

	constructor() {}

	ngOnInit(): void {}
}
