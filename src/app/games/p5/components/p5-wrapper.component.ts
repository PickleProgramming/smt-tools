import { Component } from '@angular/core'

@Component({
	selector: 'p5-wrapper',
	template: `<div class="wrapper">
		<p5-header></p5-header>
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
export class P5WrapperComponent {}
