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
	styleUrls: ['./settings.component.sass'],
})
export class SettingsComponent implements OnInit {
	@Input() declare dlcDemons: { [name: string]: Demon }
	@Input() declare packsEnabled: { [name: string]: boolean }
	@Input() declare togglePack: (event: any) => void

	constructor() {}

	ngOnInit(): void {}
}
