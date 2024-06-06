import { Component } from '@angular/core'

import { P5Compendium } from '@p5/types/p5-compendium'
import { DLCPack, Demon } from '@shared/types/smt-tools.types'

import { P5_COMPENDIUM } from '@shared/constants'

@Component({
	selector: 'p5-fusion-settings',
	template: ` <shared-settings [compendium]="compendium"> </shared-settings>`,
})
export class P5SettingsComponent {
	compendium: P5Compendium = P5_COMPENDIUM

	constructor() {}
}
