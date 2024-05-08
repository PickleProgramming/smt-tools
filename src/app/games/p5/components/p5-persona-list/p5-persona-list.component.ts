import { Component, OnInit } from '@angular/core'

import _ from 'lodash'

import { P5TableConfig } from '@p5/types/p5-table-config'
import { Demon } from '@shared/types/smt-tools.types'

import { P5_COMPENDIUM, P5_TABLE_CONFIG } from '@shared/constants'

@Component({
	selector: 'app-p5-persona-list',
	template: `<app-demon-list [tableConfig]="tableConfig" [demons]="demons"
		>,
	</app-demon-list>`,
	styleUrl: './p5-persona-list.component.scss',
})
export class P5PersonaListComponent implements OnInit {
	tableConfig: P5TableConfig = P5_TABLE_CONFIG
	demons: { [name: string]: Demon } = this.shortenRacesDemons(
		P5_COMPENDIUM.demons
	)

	constructor() {}

	/* copies the compendium's demons, recreates the list, and shortens the 
		race string for any demon of the race Judgement, Hieorphant, or 
		Temperance. This is done to reflect the race column in the compendium
		in the actual P5 game
	 */
	shortenRacesDemons(demons: { [name: string]: Demon }): {
		[name: string]: Demon
	} {
		let ret = _.cloneDeep(demons)

		for (let demonName in ret) {
			let demon = ret[demonName]
			if (demon.race == 'Judgement') {
				demon.race = 'Judge.'
			}
			if (demon.race == 'Hierophant') {
				demon.race = 'Hiero.'
			}
			if (demon.race == 'Temperance') {
				demon.race = 'Temper.'
			}
		}

		return ret
	}

	ngOnInit(): void {}
}
