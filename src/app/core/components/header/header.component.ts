import { Component, Input, OnInit } from '@angular/core'
import { GameView } from '@shared/types/smt-tools.types'

import GAME_MODELS from 'src/assets/game-models.json'

@Component({
	selector: 'app-header',
	styleUrls: ['./header.component.scss'],
	template: `
		<ul class="smt-navbar">
			<li
				*ngFor="let game of gameViews | keyvalue"
				class="{{ game.key }}"
			>
				<a routerLink="{{ game.key }}" routerLinkActive="active">
					<img src="{{ game.value.logo }}" />
				</a>
			</li>
		</ul>
		<router-outlet></router-outlet>
	`,
})
export class HeaderComponent implements OnInit {
	gameViews: { [game: string]: GameView } = GAME_MODELS

	constructor() {}

	ngOnInit(): void {}
}
