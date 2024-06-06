import { Component } from '@angular/core'

@Component({
	selector: 'p5r-wrapper',
	template: `<div class="wrapper">
		<p5r-header></p5r-header>
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
