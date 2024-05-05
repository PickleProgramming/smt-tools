import {
	AfterViewInit,
	Component,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'
import _ from 'lodash'
import { Demon } from '@shared/types/smt-tools.types'
import { TableConfig } from '@shared/types/table-config'

@Component({
	selector: 'app-demon-list',
	templateUrl: './demon-list.component.html',
	styleUrls: ['./demon-list.component.sass'],
})
export class DemonListComponent implements OnInit, AfterViewInit {
	@Input() demons!: { [name: string]: Demon }
	@Input() tableConfig!: TableConfig
	@ViewChild(MatSort) sort!: MatSort
	demonSource!: MatTableDataSource<DemonElem>

	constructor() {}

	ngOnInit(): void {
		if (!this.tableConfig) {
			throw new Error('DemonListComponent was not passed a TableConfig')
		}
		if (!this.demons) {
			throw new Error('DemonListComponent was not passed a Demon list')
		}
		let demonArr: DemonElem[] = []
		for (let demonName in this.demons) {
			let demon = this.demons[demonName]
			demonArr.push(new DemonElem(demonName, demon))
		}
		this.demonSource = new MatTableDataSource(demonArr)
	}

	ngAfterViewInit(): void {
		this.demonSource.sort = this.sort
		this.demonSource.sortingDataAccessor = (data, sortHeadId) => {
			let index = _.indexOf(this.tableConfig.statCols, sortHeadId)
			if (index > -1) return data.stats[index]
			index = _.indexOf(this.tableConfig.resistanceCols, sortHeadId)
			if (index > -1) return data.resistances[index]
			switch (sortHeadId) {
				case 'race':
					return data.race
				case 'name':
					return data.name
				case 'level':
					return data.level
				case 'inherits':
					return data.inherits
				default:
					return 0
			}
		}
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.demonSource.filter = filterValue.trim().toLowerCase()
	}
}

/* Class used to facilitate angular material table sorting/filter
	MatTable requires an array to perform its sorting/filtering functions,
	since the demons list is a key/value pair, we need to convert it to
	a data model that can hold all the necessary info and still be used in
	MatTable*/
class DemonElem {
	constructor(demonName: string, demon: Demon) {
		this.name = demonName
		this.race = demon.race
		this.level = demon.level
		this.stats = demon.stats
		this.resistances = demon.resistances
		if (demon.inherits) this.inherits = demon.inherits
	}
	name: string
	race: string
	level: number
	stats: number[]
	resistances: string
	inherits: string = ''
	affinities: number[] = []
	estats: number[] = []
	align: string = ''
}
