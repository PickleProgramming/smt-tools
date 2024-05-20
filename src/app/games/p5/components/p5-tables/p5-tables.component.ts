import { Component } from '@angular/core'

import { TableConfig } from '@shared/types/smt-tools.types'

import { P5_TABLE_CONFIG } from '@shared/constants'

/**
 * Component to display both normal and element fusion tables for Persona 5 }
 *
 * @class P5TablesComponent
 * @typedef {P5TablesComponent}
 * @export
 */
@Component({
	selector: 'app-p5-fusion-table',
	template: ` <app-normal-fusion-table [tableConfig]="tableConfig">
		</app-normal-fusion-table>
		<app-element-fusion-table [tableConfig]="tableConfig">
		</app-element-fusion-table>`,
	styleUrl: './p5-tables.component.scss',
})
export class P5TablesComponent {
	tableConfig: TableConfig = P5_TABLE_CONFIG

	constructor() {}
}
