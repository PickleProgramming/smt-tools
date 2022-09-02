import { Component, HostListener } from '@angular/core'

@Component({
	selector: 'app-root',
	template: `
		<app-header></app-header>
		<app-game-wrapper></app-game-wrapper>
		<app-footer></app-footer>
	`,
})
export class AppComponent {
	title = 'smt-tools'

	constructor() {}

	ngOnInit() {}
}
