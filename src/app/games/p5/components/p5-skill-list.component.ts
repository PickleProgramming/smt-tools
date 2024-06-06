import { Component } from '@angular/core'

import { Skill, TableConfig } from '@shared/types/smt-tools.types'

import { P5_COMPENDIUM, P5_TABLE_CONFIG } from '@shared/constants'

@Component({
	selector: 'p5-skill-list',
	template: ` <shared-skill-list
		[skills]="skills"
		[tableConfig]="tableConfig"
	>
	</shared-skill-list>`,
	styleUrl: '../p5.scss',
})
export class P5SkillListComponent {
	skills: { [name: string]: Skill } = P5_COMPENDIUM.skills
	tableConfig: TableConfig = P5_TABLE_CONFIG

	constructor() {}
}
