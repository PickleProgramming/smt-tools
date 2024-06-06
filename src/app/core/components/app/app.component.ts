import { Component } from '@angular/core'

@Component({
	selector: 'app-root',
	styleUrls: ['app.component.scss'],
	templateUrl: 'app.component.html',
})
export class AppComponent {
	title = 'smt-tools'
	links: { url: string; img: string; color: string }[] = []

	constructor() {}

	events: string[] = []
	opened: boolean = false

	/**
	 * Constructs information for the sidenav: routing path names, colors of the
	 * links, and the location of the logo images.
	 */
	buildGames() {
		let abbrvs: { abbrv: string; color: string }[] = [
			{ abbrv: 'p5', color: '#c10b0a' },
			{ abbrv: 'p5r', color: '#c10b0a' },
		]
		let logos = 'assets/img/game-logos/'
		for (let game of abbrvs) {
			this.links.push({
				url: game.abbrv,
				img: logos + game.abbrv + '.png',
				color: game.color,
			})
		}
	}

	ngOnInit() {
		this.buildGames()
	}
}
