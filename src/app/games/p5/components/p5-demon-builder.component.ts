import { Component } from '@angular/core'

import { P5Compendium } from '@p5/types/p5-compendium'

import { P5_COMPENDIUM } from '@shared/constants'

@Component({
	selector: 'app-p5-demon-builder',
	template: `<app-demon-builder [compendium]="compendium" [worker]="worker">
	</app-demon-builder>`,
})
export class P5DemonBuilderComponent {
	compendium: P5Compendium = P5_COMPENDIUM
	worker: string = 'p5'

	constructor() {}
}
