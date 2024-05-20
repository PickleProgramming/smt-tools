import { Component, OnInit } from '@angular/core'

import { P5_TABLE_CONFIG } from '@shared/constants'
import { TableConfig } from '@shared/types/smt-tools.types'

@Component({
	selector: 'app-p5-fusion-table',
	template: ` <app-normal-fusion-table [tableConfig]="tableConfig">
		</app-normal-fusion-table>
		<app-element-fusion-table [tableConfig]="tableConfig">
		</app-element-fusion-table>`,
	styleUrl: './p5-tables.component.scss',
})
export class P5TablesComponent implements OnInit {
	tableConfig: TableConfig = P5_TABLE_CONFIG

	constructor() {}

	ngOnInit(): void {}
}
