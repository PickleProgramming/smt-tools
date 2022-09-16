import { Component, OnInit } from '@angular/core'

@Component({
	selector: 'app-p5-game-header',
	template: ` <app-game-header [gameName]="gameName"></app-game-header>,
		<router-outlet></router-outlet>`,
})
export class P5HeaderComponent implements OnInit {
	gameName: string = 'p5'

	constructor() {}

	ngOnInit(): void {
		console.log('foo')
	}
}
