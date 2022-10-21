import { Component, OnInit } from '@angular/core'

import { P5TableConfig } from '@p5/types/p5-table-config'
import { Demon } from '@shared/types/smt-tools.types'

import { P5Service } from '@p5/p5.service'

@Component({
	selector: 'app-p5-persona-list',
	template: ` <app-demon-list [tableConfig]="tableConfig" [demons]="demons">
	</app-demon-list>`,
})
export class P5PersonaListComponent implements OnInit {
	tableConfig!: P5TableConfig
	demons!: { [name: string]: Demon }

	constructor(private service: P5Service) {}

	ngOnInit(): void {
		this.tableConfig = this.service.P5_TABLE_CONFIG
		this.demons = this.service.P5_COMPENDIUM.demons
	}
}
