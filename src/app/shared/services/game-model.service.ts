import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameModels, Link, Colors } from 'src/app/shared/models/gameModels'

@Injectable({
  providedIn: 'root'
})
export class GameModelService {

  private gameSource = new BehaviorSubject('p5r')
  currentGame = this.gameSource.asObservable()

  constructor() { }

  changeGame(game: string) {
    this.gameSource.next(game)
  }
}


