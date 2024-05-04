import { Component, OnInit } from '@angular/core'

@Component({
	selector: 'app-sidenav-button',
	styleUrls: ['./sidenav-button.component.scss'],
	templateUrl: 'sidenav-button.component.html',
})
export class SidenavButtonComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}

	toggleSidenav() {
		console.log('test')
	}
}
