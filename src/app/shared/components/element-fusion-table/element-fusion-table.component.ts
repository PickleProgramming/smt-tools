import { Component, Input, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { TableConfig } from '@shared/types/table-config'

@Component({
	selector: 'app-element-fusion-table',
	templateUrl: './element-fusion-table.component.html',
	styleUrls: ['./element-fusion-table.component.scss'],
})
export class ElementFusionTableComponent implements OnInit {
	@Input() declare tableConfig: TableConfig
	declare table: number[][]
	declare races: string[]
	declare elementals: string[]
	declare displayedColumns: string[]
	declare elemsSource: MatTableDataSource<number[]>

	constructor() {}

	ngOnInit(): void {
		if (!this.tableConfig.elementTable) {
			throw Error(
				'called app-element-fusion-table with undefinded elementTable in arguments.'
			)
		}
		this.races = this.tableConfig.elementTable.races
		this.table = this.tableConfig.elementTable.table
		this.elementals = this.tableConfig.elementTable.elems
		this.displayedColumns = ['elementals'].concat(
			this.tableConfig.elementTable.races
		)

		this.elemsSource = new MatTableDataSource(
			this.tableConfig.elementTable.table
		)
	}
}
