import { Component } from '@angular/core'

import { TableConfig } from '@shared/types/smt-tools.types'

import { P5R_TABLE_CONFIG } from '@shared/constants'

/**
 * Component to display both normal and element fusion tables for Persona 5 }
 *
 * @class P5TablesComponent
 * @typedef {P5RTablesComponent}
 * @export
 */
@Component({
	selector: 'app-p5r-fusion-table',
	template: ` <app-normal-fusion-table [tableConfig]="tableConfig">
		</app-normal-fusion-table>
		<app-element-fusion-table [tableConfig]="tableConfig">
		</app-element-fusion-table>`,
	styleUrl: '../p5r.scss',
})
export class P5RTablesComponent {
	tableConfig: TableConfig = P5R_TABLE_CONFIG

	constructor() {}
}
