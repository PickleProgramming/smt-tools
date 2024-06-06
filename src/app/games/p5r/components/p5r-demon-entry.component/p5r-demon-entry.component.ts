import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { MatTableDataSource } from '@angular/material/table'

import { P5RCompendium } from '@p5r/types/p5r-compendium'
import { P5FusionCalculator } from '@p5/types/p5-fusion-calculator'

import {
	P5R_COMPENDIUM,
	P5_FUSION_CALCULATOR,
	P5R_TABLE_CONFIG,
} from '@shared/constants'
import { Demon, Skill, TableConfig } from '@shared/types/smt-tools.types'

@Component({
	selector: 'p5r-demon-entry',
	templateUrl: './p5r-demon-entry.component.html',
	styleUrl: '../../p5r.scss',
})
export class P5RDemonEntryComponent implements OnInit {
	compendium: P5RCompendium = P5R_COMPENDIUM
	calculator: P5FusionCalculator = P5_FUSION_CALCULATOR
	tableConfig: TableConfig = P5R_TABLE_CONFIG

	/**
	 * The name of the demon the entry is about
	 *
	 * @type {string}
	 */
	declare demonName: string
	/**
	 * The object of the demon the entry is about
	 *
	 * @type {Demon}
	 */
	declare demon: Demon
	declare skillSource: MatTableDataSource<SkillElem>
	skillCols: string[] = ['Element', 'Name', 'Cost', 'Effect', 'level']

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.demonName = this.router.url.split('/')[3]
		if (this.demonName.includes('%20'))
			this.demonName = this.demonName.replace('%20', ' ')
		this.demon = this.compendium.demons[this.demonName]

		// get skills from compendium and populate skills source
		this.skillSource = new MatTableDataSource<SkillElem>([])
		let skills: SkillElem[] = []
		for (let skill in this.demon.skills) {
			skills.push(
				new SkillElem(
					skill,
					this.compendium.skills[skill],
					this.demon.skills[skill]
				)
			)
		}
		this.skillSource.data = skills
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
	constructor(skillName: string, skill: Skill, level: number) {
		this.element = skill.element
		this.name = skillName
		this.cost = skill.cost
		this.effect = skill.effect
		this.level = level
	}
	name: string
	element: string
	effect: string
	cost: string
	level: number
}
