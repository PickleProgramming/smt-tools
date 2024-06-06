import { Component, Input, OnInit } from '@angular/core'

import { MatTableDataSource } from '@angular/material/table'

import { TableConfig } from '@shared/types/smt-tools.types'

/**
 * Component to display the fusion table for a game
 *
 * @class NormalFusionTableComponent
 * @typedef {NormalFusionTableComponent}
 * @export
 * @implements {OnInit}
 */
@Component({
	selector: 'shared-normal-fusion-table',
	templateUrl: './normal-fusion-table.component.html',
	styleUrls: ['./normal-fusion-table.component.scss'],
})
export class NormalFusionTableComponent implements OnInit {
	@Input() declare tableConfig: TableConfig
	declare table: string[][]
	declare races: string[]
	declare displayedColumns: string[]
	declare raceSource: MatTableDataSource<string[]>

	constructor() {}

	ngOnInit(): void {
		this.races = this.tableConfig.fusionTable.races
		this.table = this.tableConfig.fusionTable.table
		this.displayedColumns = ['raceA'].concat(
			this.tableConfig.fusionTable.races
		)

		this.raceSource = new MatTableDataSource(
			this.tableConfig.fusionTable.table
		)
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.raceSource.filter = filterValue.trim().toLowerCase()
	}
}
