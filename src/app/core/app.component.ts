import { Component, HostListener } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<app-header></app-header>
		<app-game-tools-header></app-game-tools-header>
		<app-footer></app-footer>
	`
})
export class AppComponent {
	title = 'smt-tools'


	constructor() { }

	ngOnInit() {
	}


}
