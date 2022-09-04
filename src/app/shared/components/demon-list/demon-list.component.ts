import { Component, Input, OnInit } from '@angular/core'
import { CompendiumConfig, Demon } from '@shared//models/compendium'

@Component({
	selector: 'app-demon-list',
	templateUrl: './demon-list.component.html',
	styleUrls: ['./demon-list.component.scss'],
})
export class DemonListComponent implements OnInit {
	@Input() demons: { [name: string]: Demon } | undefined
	@Input() config: CompendiumConfig | undefined
	firstHeader: string[] = []
	colSpan: { [col: string]: number } = {}
	secondHeader: string[] = []
	displayedColumns: string[] = ['race', 'level']

	dtOptions: DataTables.Settings = {}

	constructor() {}

	ngOnInit(): void {
		if (!this.config || !this.demons) {
			throw new Error('Config/Demon List cannot be undefined')
		}

		this.dtOptions = {
			paging: false,
		}

		this.firstHeader = ['Demons', 'Stats']
		this.colSpan = {
			Demons: this.config.demonCols.length,
			Stats: this.config.statCols.length,
		}

		for (let elem of this.config.demonCols) this.secondHeader.push(elem)
		for (let elem of this.config.statCols) this.secondHeader.push(elem)

		if (this.config.resistanceCols) {
			this.firstHeader.push('Resistances')
			this.colSpan['Resistances'] = this.config.resistanceCols.length
			for (let column of this.config.resistanceCols)
				this.secondHeader.push(column)
		}
		if (this.config.affinityCols) {
			console.log('Trying to read affinities')
			this.firstHeader.push('Affinities')
			this.colSpan['Affinities'] = this.config.affinityCols.length
			for (let column of this.config.affinityCols)
				this.secondHeader.push(column)
		}
	}
}
