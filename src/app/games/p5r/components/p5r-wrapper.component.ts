import { Component } from '@angular/core'

@Component({
	selector: 'app-p5r-wrapper',
	template: `<div class="wrapper">
		<app-p5r-header></app-p5r-header>
		<router-outlet></router-outlet>
	</div> `,
	styles: [
		`
			.wrapper {
				background-color: #6e0a03;
			}
		`,
	],
})
export class P5RWrapperComponent {}
