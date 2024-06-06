import { Component } from '@angular/core'

import { Demon, TableConfig } from '@shared/types/smt-tools.types'

import { P5R_COMPENDIUM, P5_TABLE_CONFIG } from '@shared/constants'

/**
 * Demon list component for P5
 *
 * @class P5PersonaListComponent
 * @typedef {P5PersonaListComponent}
 * @export
 */
@Component({
	selector: 'p5r-persona-list',
	template: `<shared-demon-list [tableConfig]="tableConfig" [demons]="demons"
		>,
	</shared-demon-list>`,
	styleUrl: '../p5r.scss',
})
export class P5RPersonaListComponent {
	tableConfig: TableConfig = P5_TABLE_CONFIG
	/**
	 * The P5 demon data, but with the race names shortened to reflect the same
	 * way they are abbreviated in the compendium in the actual game
	 *
	 * @type {{ [name: string]: Demon }}
	 */
	demons: { [name: string]: Demon } = this.shortenRacesDemons(
		P5R_COMPENDIUM.demons
	)

	constructor() {}

	/**
	 * Copies the demon data replacing the longer race names with abbrieviated
	 * version
	 *
	 * @param {{ [name: string]: Demon }} demons List to be shortened
	 * @returns {{
	 * 	[name: string]: Demon
	 * }} Shortened listF
	 */
	shortenRacesDemons(demons: { [name: string]: Demon }): {
		[name: string]: Demon
	} {
		let ret = structuredClone(demons)

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
}
