import { Component, Input, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { CompendiumConfig } from '@shared//models/compendium'

@Component({
	selector: 'app-normal-fusion-table',
	templateUrl: './normal-fusion-table.component.html',
	styleUrls: ['./normal-fusion-table.component.scss'],
})
export class NormalFusionTableComponent implements OnInit {
	@Input() config: CompendiumConfig | undefined
	table!: string[][]
	races!: string[]

	displayedColumns: string[] = []
	raceSource!: MatTableDataSource<string[]>

	constructor() {}

	ngOnInit(): void {
		if (typeof this.config === undefined) {
			throw new Error('Normal Fusion Table must be called with a game')
		}
		this.races = this.config!.fusionTable.races
		this.table = this.config!.fusionTable.table
		this.displayedColumns = ['raceA'].concat(this.config!.fusionTable.races)

		this.raceSource = new MatTableDataSource(this.config!.fusionTable.table)
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.raceSource.filter = filterValue.trim().toLowerCase()
	}
}
