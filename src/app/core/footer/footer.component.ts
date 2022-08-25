import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameModels } from 'src/app/shared/models/gameModels'
import { GameModelService } from 'src/app/shared/services/game-model.service';
import GAME_MODELS from 'src/assets/game-models.json';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <div id="github-logo" class="github-div">
      <a id="github" href="https://github.com/PickleProgramming/smt-tools">
		  	<img src="assets/img/github-logo.png">
	  	</a>
    </div>
  `
})
export class FooterComponent implements OnInit, OnDestroy {

  game?: GameModels
  abbrv = 'p5r'
  subscription?: Subscription

  constructor(private router: Router, private gameModelService: GameModelService) { }

  changeGame(abbrv: string): void {
    this.abbrv = abbrv
    this.game = GAME_MODELS[
      GAME_MODELS.findIndex(game => game.abbrv === abbrv)
    ]
    let element = document.getElementById('')
    element!.style.backgroundColor = this.game.colors.primary
    element!.style.fontFamily = this.game.font
  }

  ngOnInit(): void {
    this.subscription = this.gameModelService.currentGame.subscribe(abbrv => {
      if (abbrv != this.abbrv) {
        this.abbrv = abbrv

      }
    })
  }

  ngOnDestroy(): void {
    this.subscription!.unsubscribe()
  }
}
