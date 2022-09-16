import { Component, Input, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { GameView } from '@shared/types/smt-tools.types'

import GAME_MODELS from 'src/assets/game-models.json'

@Component({
	selector: 'app-game-header',
	templateUrl: './game-header.component.html',
	styleUrls: ['./game-header.component.scss'],
})
export class GameHeaderComponent implements OnInit {
	@Input() gameName!: string

	gameView!: GameView

	gameViews: { [game: string]: GameView } = GAME_MODELS

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		if (!this.gameName) {
			throw new Error('GameHeaderComponent not given a string.')
		}
		this.gameView = this.gameViews[this.gameName]
	}

	ngOnDestroy(): void {}
}
