import { Component } from '@angular/core'

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
})
export class AppComponent {
	title = 'smt-tools'

	constructor() {}

	events: string[] = []
	opened: boolean = false

	ngOnInit() {}
}
