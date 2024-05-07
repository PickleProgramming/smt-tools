import { Component, Input, OnInit, ViewChild } from '@angular/core'

import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'
import _ from 'lodash'
import { Skill } from '@shared/types/smt-tools.types'
import { TableConfig } from '@shared/types/table-config'

@Component({
	selector: 'app-skill-list',
	templateUrl: './skill-list.component.html',
	styleUrls: ['./skill-list.component.scss'],
})
export class SkillListComponent implements OnInit {
	@Input() skills!: { [name: string]: Skill }
	@Input() tableConfig!: TableConfig
	@ViewChild(MatSort) sort!: MatSort

	skillSource!: MatTableDataSource<SkillElem>

	constructor() {}

	ngOnInit(): void {
		if (!this.skills) {
			throw new Error('SkillListComponent was not given a Skills list.')
		}
		if (!this.tableConfig) {
			throw new Error('SkillListComponent was not given a TableConfig')
		}
		let skillArr: SkillElem[] = []
		for (let skillName in this.skills) {
			let skill = this.skills[skillName]
			skillArr.push(new SkillElem(skillName, skill))
		}
		this.skillSource = new MatTableDataSource(skillArr)
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.skillSource.filter = filterValue.trim().toLowerCase()
	}

	ngAfterViewInit(): void {
		this.skillSource.sort = this.sort
	}
}

/* Class used to facilitate angular material table sorting/filter
	MatTable requires an array to perform its sorting/filtering functions,
	since the demons list is a key/value pair, we need to convert it to
	a data model that can hold all the necessary info and still be used in
	MatTable*/
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
