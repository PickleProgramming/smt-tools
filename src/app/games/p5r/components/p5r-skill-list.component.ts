import { Component } from '@angular/core'

import { Skill, TableConfig } from '@shared/types/smt-tools.types'

import { P5R_COMPENDIUM, P5R_TABLE_CONFIG } from '@shared/constants'

@Component({
	selector: 'p5r-skill-list',
	template: ` <shared-skill-list
		[skills]="skills"
		[tableConfig]="tableConfig"
	>
	</shared-skill-list>`,
	styleUrl: '../p5r.scss',
})
export class P5RSkillListComponent {
	skills: { [name: string]: Skill } = P5R_COMPENDIUM.skills
	tableConfig: TableConfig = P5R_TABLE_CONFIG

	constructor() {}
}
