import { Component } from '@angular/core'

import { P5R_COMPENDIUM } from '@shared/constants'
import { P5RCompendium } from '@p5r/types/p5r-compendium'

@Component({
	selector: 'p5-fusion-settings',
	template: ` <shared-settings [compendium]="compendium"> </shared-settings>`,
})
export class P5RSettingsComponent {
	compendium: P5RCompendium = P5R_COMPENDIUM

	constructor() {}
}
