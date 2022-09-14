import { Component, Input, OnInit } from '@angular/core'
import { TableConfig } from '@shared/types/table-config'

@Component({
	selector: 'app-element-fusion-table',
	templateUrl: './element-fusion-table.component.html',
	styleUrls: ['./element-fusion-table.component.scss'],
})
export class ElementFusionTableComponent implements OnInit {
	@Input() tableConfig: TableConfig | undefined

	constructor() {}

	ngOnInit(): void {
		if (!this.tableConfig)
			throw new Error('ElementFusionTable must be called with a game')
		if (!this.tableConfig.elementTable) {
			throw new Error(
				'app-element-fusion-table needs a config with a ' +
					' defined elementTable'
			)
		}
	}
}
