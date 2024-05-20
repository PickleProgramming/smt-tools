import { Component, Input, OnInit, ViewChild } from '@angular/core'

import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'

import { Skill, TableConfig } from '@shared/types/smt-tools.types'

/**
 * Table component designed to display the games skill information
 *
 * @class SkillListComponent
 * @typedef {SkillListComponent}
 * @export
 * @implements {OnInit}
 */
@Component({
	selector: 'app-skill-list',
	templateUrl: './skill-list.component.html',
	styleUrls: ['./skill-list.component.scss'],
})
export class SkillListComponent implements OnInit {
	/**
	 * List of key-value pair relating skill names to their object. Should be
	 * passed from the {game}-skill-list component and imported from that games
	 * constants.
	 *
	 * @type {{ [name: string]: Skill }}
	 */
	@Input() declare skills: { [name: string]: Skill }
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
	 * @type {MatTableDataSource<SkillElem>}
	 */
	declare skillSource: MatTableDataSource<SkillElem>

	constructor() {}

	ngOnInit(): void {
		//insert data passed from game into table
		let skillArr: SkillElem[] = []
		for (let skillName in this.skills) {
			let skill = this.skills[skillName]
			skillArr.push(new SkillElem(skillName, skill))
		}
		this.skillSource = new MatTableDataSource(skillArr)
	}

	/**
	 * Run whenever the filter form changes
	 *
	 * @param {Event} event
	 */
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.skillSource.filter = filterValue.trim().toLowerCase()
	}

	/** Description placeholder */
	ngAfterViewInit(): void {
		this.skillSource.sort = this.sort
	}
}

/**
 * Class used to facilitate angular material table sorting/filter MatTable
 * requires an array to perform its sorting/filtering functions, since the
 * demons list is a key/value pair, we need to convert it to a data model that
 * can hold all the necessary info and still be used in MatTable
 *
 * @class SkillElem
 * @typedef {SkillElem}
 */
class SkillElem {
	constructor(skillName: string, skill: Skill) {
		this.name = skillName
		this.element = skill.element
		this.effect = skill.effect
		this.cost = skill.cost
		this.learnedBy = skill.learnedBy
		if (skill.card) this.card = skill.card
	}
	name: string
	element: string
	effect: string
	cost: string
	learnedBy: { [demonName: string]: number }
	card?: string
}
