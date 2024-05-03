import { Component, OnInit } from '@angular/core'

import { P5Compendium } from '@p5/types/p5-compendium'
import { Demon } from '@shared/types/smt-tools.types'

import { P5R_COMPENDIUM } from '@shared/constants'

@Component({
	selector: 'app-p5r-fusion-settings',
	template: ` <app-settings
		[dlcDemons]="dlcDemons!"
		[packsEnabled]="packsEnabled"
		[togglePack]="togglePack"
	>
	</app-settings>`,
})
export class P5RSettingsComponent implements OnInit {
	compendium: P5Compendium = P5R_COMPENDIUM
	dlcDemons?: { [name: string]: Demon } = this.compendium.dlcDemons

	//keeps track of which DLC packs have been enabled in the compendium
	packsEnabled: { [name: string]: boolean } = {}
	//array relating the DLC pack names, to the names of the demons they add
	packDemons: { [pack: string]: string[] } = {
		royalPersonaBundle: [
			'Izanagi-no-okami',
			'Izanagi-no-okami Picaro',
			'Female Orpheus',
			'Female Orpheus Picaro',
			'Athena',
			'Athena Picaro',
			'Persona Raoul',
		],
		legacyBundle: [
			'Izanagi',
			'Izanagi Picaro',
			'Orpheus',
			'Orpherus Picaro',
			'Ariadne',
			'Ariadne Picaro',
			'Asterius',
			'Asterius Picaro',
			'Thanatos',
			'Thanatos Picaro',
			'Kaguya',
			'Kaguya Picaro',
			'Magatsu-Izanagi',
			'Magatsu-Izanagi Picaro',
			'Tsukiyomi',
			'Tsukiyomi Picaro',
			'Messiah',
			'Messiah Picaro',
		],
	}

	constructor() {}

	ngOnInit(): void {
		if (!this.dlcDemons) {
			throw new Error('P5-settings-component couldnt find dlc demons')
		}
		/* enables/disables the packs in the view by checking if they are in 
		the demonlist */
		this.packsEnabled = {
			royalPersonaBundle:
				this.compendium.demons['Izanagi-no-okami'] !== undefined,
			legacyBundle: this.compendium.demons['Izanagi'] !== undefined,
		}
	}

	/* takes the name of the demon taken from the check event, adds it to the
		compendiums demon list, then adds all of the dlcSkills to the 
		compendiums skills, and populates their learned by list, or removes all
		this data if the pack was toggled off */
	togglePack = (event: any): void => {
		let pack: string = event.path[0].id
		let checked: boolean = event.srcElement.checked
		if (checked) {
			for (let demonName of this.packDemons[pack]) {
				let demon = this.compendium.dlcDemons![demonName]
				this.compendium.demons[demonName] = demon
				for (let skillName in demon.skills) {
					let skill = this.compendium.dlcSkills![skillName]
					if (!this.compendium.skills[skillName]) {
						this.compendium.skills[skillName] = skill
					}
					this.compendium.skills[skillName].learnedBy[demonName] =
						demon.skills[skillName]
				}
			}
		} else {
			for (let demonName of this.packDemons[pack]) {
				for (let skillName in this.compendium.dlcSkills) {
					let skill = this.compendium.dlcSkills[skillName]
					if (skill.unique === demonName) {
						delete this.compendium.skills[skillName]
					}
				}
				delete this.compendium.demons[demonName]
			}
		}
		this.packsEnabled[pack] = !this.packsEnabled[pack]
	}
}
