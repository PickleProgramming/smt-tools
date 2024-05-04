import { Component, Input, OnInit } from '@angular/core'
import { GameView } from '@shared/types/smt-tools.types'

import GAME_MODELS from 'src/assets/game-models.json'

@Component({
	selector: 'app-header',
	styleUrls: ['./header.component.scss'],
	templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
	gameViews: { [game: string]: GameView } = GAME_MODELS

	constructor() {}

	ngOnInit(): void {}
}
