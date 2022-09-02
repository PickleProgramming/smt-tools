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
	constructor(private router: Router) {}

	ngOnInit(): void {}
}
