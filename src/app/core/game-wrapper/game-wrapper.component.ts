//Parent class for the nav bar for each individual game, for most games has 
//the Demon/Skills/Fusion Chart links
//As well as the component for the body of each tool below the nav bar

import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { GameModels, Link, Colors } from 'src/app/shared/models/gameModels';
import { GameModelService } from 'src/app/shared/services/game-model.service';
import GAME_MODELS from 'src/assets/game-models.json';

@Component({
	selector: 'app-game-wrapper',
	templateUrl: './game-wrapper.component.html',
	styleUrls: ['./game-wrapper.component.scss']
})

export class GameWrapperComponent implements OnInit {

	@Input() mainList = ''
	@Input() hasSettings = true
	@Input() otherLinks: Link[] = []
	@Input() fontColor: string = ''
	@Input() abbrv: string = ''
	game?: GameModels
	gameName: string = 'p5r'

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router, 
		private gameModelService: GameModelService, 
		private renderer: Renderer2,
		private activatedRoute: ActivatedRoute) {	}

	// Updates the sub-nav-bar and main view to reflect the game denoted by the passed string
	// @param abbrv: game to change to (p3p, p5r, etc)
	changeGame(abbrv: string): void {
		this.abbrv = abbrv
		this.gameName = abbrv
		this.game = GAME_MODELS[
			GAME_MODELS.findIndex(game => game.abbrv === abbrv)
		]
		this.mainList = this.game.mainList
		this.hasSettings = this.game.hasSettings
		this.otherLinks = this.game.otherLinks
		this.renderer.setAttribute(this.document?.body, 'class', '')
		if(abbrv) {
			this.renderer.addClass(this.document?.body, abbrv)
		}
		this.fontColor = this.game.colors.text
	}

	ngOnInit(): void {
		this.router.navigateByUrl('/p5r')
		
		//this block will run everytime the user navigates to a new page
		this.router.events.subscribe(e => {
			if (e instanceof NavigationEnd)
				this.changeGame(this.router.url.split('/')[1])
		})
	}

	private updateBodyClass(customBodyClass?: string) {

	}
}
