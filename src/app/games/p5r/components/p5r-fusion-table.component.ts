import { Component, OnInit } from '@angular/core'

import { P5RTableConfig } from '@p5r/types/p5r-table-config'

import { P5R_TABLE_CONFIG } from '@shared/constants'

@Component({
	selector: 'app-p5r-fusion-table',
	template: ` <app-normal-fusion-table [tableConfig]="tableConfig">
		</app-normal-fusion-table>
		<app-element-fusion-table [tableConfig]="tableConfig">
		</app-element-fusion-table>`,
})
export class P5RFusionTableComponent implements OnInit {
	tableConfig: P5RTableConfig = P5R_TABLE_CONFIG

	constructor() {}

	ngOnInit(): void {}
}
