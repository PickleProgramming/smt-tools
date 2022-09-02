import { Component, Input, OnInit } from '@angular/core'
import { CompendiumConfig } from '@shared/models/compendium'

@Component({
	selector: 'app-element-fusion-table',
	templateUrl: './element-fusion-table.component.html',
	styleUrls: ['./element-fusion-table.component.scss'],
})
export class ElementFusionTableComponent implements OnInit {
	@Input() config!: CompendiumConfig

	constructor() {}

	ngOnInit(): void {
		if (typeof this.config === undefined)
			throw new Error('ElementFusionTable must be called with a game')
	}
}
