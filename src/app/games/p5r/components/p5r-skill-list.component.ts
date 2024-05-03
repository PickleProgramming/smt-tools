import { Component, OnInit } from '@angular/core'

import { Skill } from '@shared/types/smt-tools.types'

import { P5R_COMPENDIUM, P5_TABLE_CONFIG } from '@shared/constants'

@Component({
	selector: 'app-p5r-skill-list',
	template: ` <app-skill-list [skills]="skills" [tableConfig]="tableConfig">
	</app-skill-list>`,
})
export class P5RSkillListComponent implements OnInit {
	skills: { [name: string]: Skill } = P5R_COMPENDIUM.skills
	tableConfig = P5_TABLE_CONFIG

	constructor() {}

	ngOnInit(): void {}
}
