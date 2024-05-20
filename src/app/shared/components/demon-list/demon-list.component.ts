import {
	AfterViewInit,
	Component,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core'

import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'

import { Demon, TableConfig } from '@shared/types/smt-tools.types'

/**
 * Component used to display the demon information for a given game
 *
 * @class DemonListComponent
 * @typedef {DemonListComponent}
 * @export
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component({
	selector: 'app-demon-list',
	templateUrl: './demon-list.component.html',
	styleUrls: ['./demon-list.component.scss'],
})
export class DemonListComponent implements OnInit, AfterViewInit {
	/**
	 * List of key-value pair relating skill names to their object. Should be
	 * passed from the {game}-skill-list component and imported from that games
	 * constants.
	 *
	 * @type {{ [name: string]: Demon }}
	 */
	@Input() declare demons: { [name: string]: Demon }

	/**
	 * TableConfig from the game detailing specifics of what to put in the
	 * table. Should be passed from the {game}-skill-list component and imported
	 * from that games constants. *
	 *
	 * @type {TableConfig}
	 */
	@Input() declare tableConfig: TableConfig

	/**
	 * The sorting function for the Angular Material Table taken from the child
	 * component
	 *
	 * @type {MatSort}
	 */
	@ViewChild(MatSort) declare sort: MatSort

	/**
	 * The data to display in the table in the form of a MatTableDataSource
	 *
	 * @type {MatTableDataSource<DemonElem>}
	 */
	declare demonSource: MatTableDataSource<DemonElem>

	/**
	 * Contains a list of columns to display in the table. A concatenation of a
	 * TableConfigs demonCols, statCols, and resistanceCols, if they exist
	 *
	 * @type {string[]}
	 */
	declare displayCols: string[]

	constructor() {}

	ngOnInit(): void {
		this.displayCols = this.tableConfig.demonCols
		if (this.tableConfig.statCols) {
			this.displayCols = this.displayCols.concat(
				this.tableConfig.statCols
			)
		}
		if (this.tableConfig.resistanceCols) {
			this.displayCols = this.displayCols.concat(
				this.tableConfig.resistanceCols
			)
		}
		let demonArr: DemonElem[] = []
		for (let demonName in this.demons) {
			let demon = this.demons[demonName]
			demonArr.push(new DemonElem(demonName, demon))
		}
		this.demonSource = new MatTableDataSource(demonArr)
	}

	/**
	 * Run whenever the user types into the filter
	 *
	 * @param event
	 */
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.demonSource.filter = filterValue.trim().toLowerCase()
	}

	ngAfterViewInit(): void {
		this.demonSource.sort = this.sort
		this.demonSource.sortingDataAccessor = (data, sortHeadId) => {
			let index = this.tableConfig.statCols.indexOf(sortHeadId)
			if (index > -1) return data.stats[index]
			if (this.tableConfig.resistanceCols) {
				index = this.tableConfig.resistanceCols.indexOf(sortHeadId)
				if (index > -1) return data.resistances[index]
			}
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
}

/**
 * Class used to facilitate angular material table sorting/filter MatTable
 * requires an array to perform its sorting/filtering functions, since the
 * demons list is a key/value pair, we need to convert it to a data model that
 * can hold all the necessary info and still be used in MatTable
 */
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
