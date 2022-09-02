import { Component, Input, OnInit } from '@angular/core'
import { CompendiumConfig, Skill } from '@shared/models/compendium'

@Component({
	selector: 'app-skill-list',
	templateUrl: './skill-list.component.html',
	styleUrls: ['./skill-list.component.scss'],
})
export class SkillListComponent implements OnInit {
	@Input() config: CompendiumConfig | undefined
	@Input() skills: { [name: string]: Skill } | undefined
	firstHeader: string[] = []
	colSpan: { [col: string]: number } = {}
	secondHeader: string[] = []

	constructor() {}

	ngOnInit(): void {
		if (this.config == undefined || this.skills == undefined)
			throw new Error(
				'called SkillListComponent without passing config or skills variable'
			)

		this.firstHeader = ['Skills', 'Acquisition']
		this.colSpan = {
			Skills: this.config.skillCols.length,
			Acquisition: this.config.acquisitionCols.length,
		}

		for (let elem of this.config.skillCols) this.secondHeader.push(elem)
		for (let elem of this.config.acquisitionCols)
			this.secondHeader.push(elem)
	}
}
