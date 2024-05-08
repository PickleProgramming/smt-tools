import { Component, OnInit } from '@angular/core'

import { P5TableConfig } from '@p5/types/p5-table-config'

import { P5_TABLE_CONFIG } from '@shared/constants'

@Component({
	selector: 'app-p5-fusion-table',
	template: ` <app-normal-fusion-table [tableConfig]="tableConfig">
		</app-normal-fusion-table>
		<app-element-fusion-table [tableConfig]="tableConfig">
		</app-element-fusion-table>`,
	styleUrl: './p5-fusion-table.component.scss',
})
export class P5FusionTableComponent implements OnInit {
	tableConfig: P5TableConfig = P5_TABLE_CONFIG

	constructor() {}

	ngOnInit(): void {}
}
