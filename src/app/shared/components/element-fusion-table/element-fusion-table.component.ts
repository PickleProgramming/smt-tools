import { Component, Input, OnInit } from '@angular/core'
import { TableConfig } from '@shared/types/table-config'

@Component({
	selector: 'app-element-fusion-table',
	templateUrl: './element-fusion-table.component.html',
	styleUrls: ['./element-fusion-table.component.scss'],
})
export class ElementFusionTableComponent implements OnInit {
	@Input() tableConfig!: TableConfig

	constructor() {}

	ngOnInit(): void {
		if (!this.tableConfig)
			throw new Error(
				'ElementFusionTableComponent was not passed a TableConfig',
			)
		if (!this.tableConfig.elementTable) {
			throw new Error(
				'ElementFusionTableComponent was passed a TableConfig with ' +
					'no elementTable property.',
			)
		}
	}
}
