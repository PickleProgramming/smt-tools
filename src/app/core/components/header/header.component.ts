import { Component, Input, OnInit } from '@angular/core'

@Component({
	selector: 'app-header',
	styleUrls: ['./header.component.scss'],
	templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
	constructor() {}

	events: string[] = []
	opened: boolean = false

	ngOnInit(): void {}
}
