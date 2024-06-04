import { Component } from '@angular/core'

import { P5R_COMPENDIUM } from '@shared/constants'
import { P5RCompendium } from '@p5r/types/p5r-compendium'

@Component({
	selector: 'app-p5-fusion-settings',
	template: ` <app-settings [compendium]="compendium"> </app-settings>`,
})
export class P5RSettingsComponent {
	compendium: P5RCompendium = P5R_COMPENDIUM

	constructor() {}
}
