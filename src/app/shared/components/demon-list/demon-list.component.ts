import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatSort } from '@angular/material/sort'
import { CompendiumConfig, Demon } from '@shared//models/compendium'

@Component({
	selector: 'app-demon-list',
	templateUrl: './demon-list.component.html',
	styleUrls: ['./demon-list.component.scss'],
})
export class DemonListComponent implements OnInit {
	@Input() demons!: { [name: string]: Demon }
	@Input() config!: CompendiumConfig
	firstHeader: string[] = []
	colSpan: { [col: string]: number } = {}
	secondHeader: string[] = []
	displayedColumns: string[] = ['race', 'level', 'name', 'inherits']

	constructor() {}

	@ViewChild(MatSort) sort: MatSort = new MatSort()

	ngOnInit(): void {
		if (!this.config || !this.demons) {
			throw new Error('Config/Demon List cannot be undefined')
		}
		this.displayedColumns = this.displayedColumns.concat(
			this.config.statCols
		)
		this.displayedColumns = this.displayedColumns.concat(
			this.config.resistanceCols!
		)
	}
}
