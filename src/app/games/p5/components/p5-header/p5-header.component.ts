import { Component } from '@angular/core'

@Component({
	selector: 'app-p5-header',
	templateUrl: './p5-header.component.html',
	styleUrls: ['./p5-header.component.scss'],
})
export class P5HeaderComponent {
	private ASSETS = 'assets/img/games/p5/bookmarks/'
	links: { title: string; url: string; img: string }[] = [
		{
			title: 'Persona List',
			url: 'personas',
			img: this.ASSETS + 'p5-persona-link.svg',
		},
		{
			title: 'Skill List',
			url: 'skills',
			img: this.ASSETS + 'p5-skills-link.svg',
		},
		{
			title: 'Fusion Table',
			url: 'fusion-table',
			img: this.ASSETS + 'p5-table-link.svg',
		},
		{
			title: 'Chain Calculator',
			url: 'fusion-chain',
			img: this.ASSETS + 'p5-builder-link.svg',
		},
		{
			title: 'DLC Settings',
			url: 'settings',
			img: this.ASSETS + 'p5-config-link.svg',
		},
	]
}
