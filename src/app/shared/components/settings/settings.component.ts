import { Input, Component } from '@angular/core'
import { Compendium } from '@shared/types/compendium'

@Component({
	selector: 'app-settings',
	template: ` <div class="dlcSettings">
		@for (pack of compendium.dlcPacks | keyvalue; track $index) {
			<input
				type="checkbox"
				id="{{ pack.key }}"
				[attr.data-cy]="pack.key.split(' ')[0]"
				(change)="togglePack($event)"
				[checked]="pack.value.enabled"
			/>
			{{ pack.key }}
			<br />
		}
	</div>`,
	styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
	@Input() declare compendium: Compendium

	constructor() {}

	/**
	 * Runs when the user toggles a checkbox. If the box is checked, adds the
	 * demons in the pack to the compendium along with their skills. If the box
	 * is unchecked, removes the demons and their skills from the compendium
	 *
	 * @param event
	 */
	togglePack = (event: any): void => {
		let pack: string = event.currentTarget.id
		let checked: boolean = event.srcElement.checked
		if (checked) this.compendium.enablePack(pack)
		else this.compendium.disablePack(pack)
		this.compendium.dlcPacks![pack].enabled =
			!this.compendium.dlcPacks![pack].enabled
	}
}
