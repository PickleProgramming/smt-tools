import { Component, HostListener } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<app-header></app-header>
		<router-outlet></router-outlet>
		<app-footer></app-footer>
	`
})
export class AppComponent {
	title = 'smt-tools'
	ngOnInit() { }
}
