//Parent class for the nav bar for each individual game, for most games has 
//the Demon/Skills/Fusion Chart links
//As well as the component for the body of each tool below the nav bar

import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GameModels, Link, Colors } from 'src/app/shared/models/gameModels'
import GAME_MODELS from 'src/assets/game-models.json';

@Component({
	selector: 'app-game-tools-header',
	templateUrl: './game-tools-header.component.html',
	styleUrls: ['./game-tools-header.component.scss']
})

export class GameToolsHeaderComponent implements OnInit {

	@Input() mainList = ''
	@Input() hasSettings = true
	@Input() otherLinks: Link[] = []
	@Input() fontColor: string = ''
	gameModels?: GameModels
	gameName: string = ''

	constructor(private router: Router) {
		//this block will run everytime the user navigates to a new page
		router.events.subscribe(e => {
			if (e instanceof NavigationEnd)
				this.changeGame(this.router.url.split('/')[1])
		})
	}

	// Updates the sub-nav-bar and main view to reflect the game denoted by the passed string
	//@param abbrv: game to change to (p3p, p5r, etc)
	changeGame(abbrv: string): void {
		this.gameName = abbrv
		this.gameModels = GAME_MODELS[
			GAME_MODELS.findIndex(game => game.abbrv === abbrv)
		]
		this.mainList = this.gameModels.mainList
		this.hasSettings = this.gameModels.hasSettings
		this.otherLinks = this.gameModels.otherLinks
		let element = document.getElementById('navRow')
		element!.style.backgroundColor = this.gameModels.colors.primary
		element!.style.fontFamily = this.gameModels.font
		this.fontColor = this.gameModels.colors.text
	}

	ngOnInit(): void {
		this.router.navigateByUrl('/p5r')
	}
}
