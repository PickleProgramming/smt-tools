import { Component } from '@angular/core'

@Component({
	selector: 'app-p5-header',
	template: `<mat-card
		class="card"
		style="background-image: url(assets/img/games/p5/p5-header-background.png)"
	>
		<img src="assets/img/games/p5/p5-header.svg" class="p5-logo" />
		@for (link of links; track $index) {
			<a routerLink="{{ link.url }}">
				<img class="link" src="{{ link.img }}" alt="{{ link.title }}" />
			</a>
		} @empty {
			<div>No links found...</div>
		}
	</mat-card>`,
	styles: [
		`
			@use '@angular/material' as mat;

			.card {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				align-items: flex-end;

				background-size: cover;
				background-position: center center;

				@include mat.elevation(12);
				border-radius: 0;

				min-height: 10vh;
			}

			.p5-logo {
				height: 15vh;
				margin: 2vh;
			}

			.link {
				width: 8vw;
				margin-bottom: 0vh;
				padding-bottom: 0vh;
			}
		`,
	],
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
			title: 'Demon Builder',
			url: 'demon-builder',
			img: this.ASSETS + 'p5-builder-link.svg',
		},
		{
			title: 'DLC Settings',
			url: 'settings',
			img: this.ASSETS + 'p5-config-link.svg',
		},
	]
}
