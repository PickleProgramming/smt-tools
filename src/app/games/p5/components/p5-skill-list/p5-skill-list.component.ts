import { Component, OnInit } from '@angular/core'

import { Skill } from '@shared/types/smt-tools.types'

import { P5_COMPENDIUM, P5_TABLE_CONFIG } from '@shared/constants'

@Component({
	selector: 'app-p5-skill-list',
	template: ` <app-skill-list [skills]="skills" [tableConfig]="tableConfig">
	</app-skill-list>`,
	styleUrl: './p5-skill-list.component.scss',
})
export class P5SkillListComponent implements OnInit {
	skills: { [name: string]: Skill } = P5_COMPENDIUM.skills
	tableConfig = P5_TABLE_CONFIG

	constructor() {}

	ngOnInit(): void {}
}
