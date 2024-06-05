import { Component } from '@angular/core'
import { Router } from '@angular/router'

import { DemonBuilderComponent } from '@shared/components/demon-builder/demon-builder.component'

import { P5R_COMPENDIUM } from '@shared/constants'

@Component({
	selector: 'app-p5r-demon-builder',
	templateUrl: './p5r-demon-builder.component.html',
	styleUrls: ['./p5r-demon-builder.component.scss', '../../p5r.scss'],
})
export class P5RDemonBuilderComponent extends DemonBuilderComponent {
	constructor(protected router: Router) {
		super(router)
		this.compendium = P5R_COMPENDIUM
		this.worker = 'p5r'
		this.loadingIcon = 'assets/img/games/p5/p5-loading.gif'
	}
}
