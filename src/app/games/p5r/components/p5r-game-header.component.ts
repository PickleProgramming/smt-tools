import { Component, OnInit } from '@angular/core'

@Component({
	selector: 'app-p5r-game-header',
	template: ` <app-game-header [gameName]="gameName"></app-game-header>,
		<router-outlet></router-outlet>`,
})
export class P5RHeaderComponent implements OnInit {
	gameName: string = 'p5r'

	constructor() {}

	ngOnInit(): void {}
}
