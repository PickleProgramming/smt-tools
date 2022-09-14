import { Input, Component, OnInit } from '@angular/core'
import { Demon } from '@shared/types/smt-tools.types'

@Component({
	selector: 'app-settings',
	template: ` <div
		class="dlcSettings"
		*ngFor="let pack of packsEnabled | keyvalue"
	>
		<input
			type="checkbox"
			id="{{ pack.key }}"
			(change)="togglePack($event)"
			[checked]="pack.value"
		/>
		{{ pack.key }}
		<br />
	</div>`,
	styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
	@Input() dlcDemons: { [name: string]: Demon } | undefined
	@Input() packsEnabled: { [name: string]: boolean } | undefined
	@Input() togglePack!: (event: any) => void

	constructor() {}

	ngOnInit(): void {
		if (!this.dlcDemons)
			throw new Error('SettingsComponent requires a dlcDemons property')
		if (!this.packsEnabled)
			throw new Error('SettingsComponent requires a packs object.')
		if (!this.togglePack)
			throw new Error('SettingsComponent requires a togglePack function')
	}
}
