//Parent class for the nav bar for each individual game, for most games has 
//the Demon/Skills/Fusion Table links
//As well as the component for the body of each tool below the nav bar

//TODO: I feel like I could optimize the speed of the site

import { DOCUMENT } from '@angular/common'
import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core'
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router'
import { GameView } from 'src/app/shared/models/game-view'
import GAME_MODELS from 'src/assets/game-models.json'

@Component({
	selector: 'app-game-wrapper',
	templateUrl: './game-wrapper.component.html',
	styleUrls: ['./game-wrapper.component.scss']
})

export class GameWrapperComponent implements OnInit {

	@Input() abbrv: string = 'p5'
	game: GameView = GAME_MODELS[
		GAME_MODELS.findIndex(game => game.abbrv === this.abbrv)
	]

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private renderer: Renderer2,
		private activatedRoute: ActivatedRoute
	) { }

	// Updates the sub-nav-bar and main view to reflect the game denoted by the passed string
	// @param abbrv: game to change to (p3p, p5r, etc)
	changeGame(abbrv: string): void {
		this.game = GAME_MODELS[
			GAME_MODELS.findIndex(game => game.abbrv === abbrv)
		]
		this.renderer.setAttribute(this.document?.body, 'class', '')
		this.renderer.addClass(this.document?.body, abbrv)
	}

	ngOnInit(): void {
		this.changeGame(this.abbrv)
		//this block will run everytime the user navigates to a new page
		this.router.events.subscribe(e => {
			if (e instanceof NavigationEnd)
				this.changeGame(this.router.url.split('/')[1])
		})
	}

	ngOnDestroy(): void { }
}
