//Parent class for the nav bar for each individual game, for most games has
//the Demon/Skills/Fusion Table links
//As well as the component for the body of each tool below the nav bar
import { DOCUMENT } from '@angular/common'
import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core'
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router'
import { GameView } from '@shared/types/smt-tools.types'

import GAME_MODELS from 'src/assets/game-models.json'

@Component({
	selector: 'app-game-wrapper',
	templateUrl: './game-wrapper.component.html',
	styleUrls: ['./game-wrapper.component.scss'],
})
export class GameWrapperComponent implements OnInit {
	@Input() gameName: string = 'p5'
	gameViews: { [game: string]: GameView } = GAME_MODELS
	gameView: GameView = this.gameViews[this.gameName]

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private renderer: Renderer2,
		private activatedRoute: ActivatedRoute
	) {
		//this block will run everytime the user navigates to a new page
		this.router.events.subscribe((e) => {
			if (e instanceof NavigationEnd) {
				this.changeGame(e.urlAfterRedirects.split('/')[1])
				//console.log(e.urlAfterRedirects.split('/')[1])
			}
		})
	}

	/* Updates the sub-nav-bar and main view to reflect the game denoted by the 
		passed string
	@param game: game to change to (p3p, p5r, etc) */
	changeGame(gameName: string): void {
		if (gameName == '') throw new Error('must gamme changeGame with abbrv')
		this.gameView = this.gameViews[gameName]
		this.renderer.setAttribute(this.document?.body, 'class', '')
		this.renderer.addClass(this.document?.body, gameName)
	}

	ngOnInit(): void {
		this.changeGame(this.gameName)
	}

	ngOnDestroy(): void {}
}
