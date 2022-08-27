import { Component, Input, OnInit } from '@angular/core'
import GAME_MODELS from 'src/assets/game-models.json'

//TODO: fade in/out of secondary navbar
@Component({
	selector: 'app-header',
	styleUrls: ['./header.component.scss'],
	template: `
		<ul class="smt-navbar">
			<li *ngFor="let tab of tabs" class={{tab.abbrv}}>
				<a routerLink={{tab.abbrv}} routerLinkActive="active" >
					<img src={{tab.logo}}>
				</a>
			</li>
		</ul>
		<router-outlet></router-outlet>
	`
})
export class HeaderComponent implements OnInit {
	tabs: any = []
	loading = false

	constructor() { }

	ngOnInit(): void {
		const logoLinks = GAME_MODELS
		for (let logoLink of logoLinks)
			this.tabs.push(logoLink)
	}
}