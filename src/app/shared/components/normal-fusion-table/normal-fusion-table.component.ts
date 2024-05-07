import { Component, Input, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { TableConfig } from '@shared/types/table-config'

@Component({
	selector: 'app-normal-fusion-table',
	templateUrl: './normal-fusion-table.component.html',
	styleUrls: ['./normal-fusion-table.component.scss'],
})
export class NormalFusionTableComponent implements OnInit {
	@Input() tableConfig!: TableConfig
	table!: string[][]
	races!: string[]
	displayedColumns!: string[]
	raceSource!: MatTableDataSource<string[]>

	constructor() {}

	ngOnInit(): void {
		if (typeof this.tableConfig === undefined) {
			throw new Error(
				'NormalFusionTableComponent was not given a TableConfig',
			)
		}
		this.races = this.tableConfig.fusionTable.races
		this.table = this.tableConfig.fusionTable.table
		this.displayedColumns = ['raceA'].concat(
			this.tableConfig!.fusionTable.races,
		)

		this.raceSource = new MatTableDataSource(
			this.tableConfig!.fusionTable.table,
		)
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.raceSource.filter = filterValue.trim().toLowerCase()
	}
}
