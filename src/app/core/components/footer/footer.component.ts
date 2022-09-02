import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { GameView } from '@shared/models/game-view'
import GAME_MODELS from 'src/assets/game-models.json'

@Component({
	selector: 'app-footer',
	styleUrls: ['./footer.component.scss'],
	template: `
		<div id="githsub-logo" class="github-div">
			<a
				id="github"
				href="https://github.com/PickleProgramming/smt-tools"
			>
				<img src="assets/img/github-logo.png" />
			</a>
		</div>
	`,
})
export class FooterComponent implements OnInit {
	game?: GameView
	abbrv = 'p5'
	subscription?: Subscription

	constructor(private router: Router) {}

	changeGame(abbrv: string): void {
		this.abbrv = abbrv
		this.game =
			GAME_MODELS[GAME_MODELS.findIndex((game) => game.abbrv === abbrv)]
		let element = document.getElementById('')
		element!.style.backgroundColor = this.game.colors.primary
		element!.style.fontFamily = this.game.font
	}

	ngOnInit(): void {}
}
