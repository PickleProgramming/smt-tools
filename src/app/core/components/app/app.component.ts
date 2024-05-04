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

	buildGames() {
		let abbrvs: { abbrv: string; color: string }[] = [
			{ abbrv: 'p5', color: '#000000' },
			{ abbrv: 'p5r', color: '#000000' },
			{ abbrv: 'p4g', color: '#000000' },
			{ abbrv: 'smt4', color: '#000000' },
			{ abbrv: 'smt3hd', color: '#000000' },
			{ abbrv: 'smtsjr', color: '#000000' },
			{ abbrv: 'pq2', color: '#000000' },
			{ abbrv: 'p3p', color: '#000000' },
		]
		let logos = 'assets/img/game-logos/'
		for (let game of abbrvs) {
			this.links.push({
				url: game.abbrv,
				img: logos + game.abbrv + '.png',
				color: '#000000',
			})
		}
	}

	ngOnInit() {
		this.buildGames()
	}
}
