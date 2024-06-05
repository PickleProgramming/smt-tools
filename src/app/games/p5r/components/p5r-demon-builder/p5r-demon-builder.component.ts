import { Component } from '@angular/core'

import { P5RCompendium } from '@p5r/types/p5r-compendium'

import { P5R_COMPENDIUM } from '@shared/constants'

@Component({
	selector: 'app-p5r-demon-builder',
	template: `<app-demon-builder
		[compendium]="compendium"
		[worker]="worker"
		[loadingIcon]="loadingIcon"
	>
	</app-demon-builder>`,
	styleUrl: '../../p5r.scss',
})
export class P5RDemonBuilderComponent {
	compendium: P5RCompendium = P5R_COMPENDIUM
	worker: string = 'p5'
	loadingIcon: string = 'assets/img/games/p5/p5-loading.gif'

	constructor() {}
}
