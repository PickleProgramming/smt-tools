import { Component, OnInit } from '@angular/core';
import LOGO_LINKS from './logo-links.json';

@Component({
	selector: 'app-header',
	styleUrls: ['./header.component.scss'],
	template: `
		<ul class="smt-navbar">
			<li *ngFor="let tab of tabs" class={{tab.abbrv}}>
				<a routerLink={{tab.component}} routerLinkActive="active">
					<img src={{tab.logo}}>
				</a>
			</li>
		</ul>
	`
})
export class HeaderComponent implements OnInit {

	constructor() { }

	tabs: any = []
	activeGame: string = "p5r"

	ngOnInit(): void {
		const logoLinks = LOGO_LINKS
		for (let logoLink of logoLinks)
			this.tabs.push(logoLink)
	}

	setActiveGame(activeGame: string) {
		this.activeGame = activeGame
	}
}
