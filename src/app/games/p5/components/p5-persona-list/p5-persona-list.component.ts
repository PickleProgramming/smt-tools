import { Component, Input, OnInit } from '@angular/core'
import { P5_COMPENDIUM, P5_COMPENDIUM_CONFIG } from 'src/app/games/p5/p5-constants'
import { CompendiumConfig } from 'src/app/shared/models/compendiumModels'
import { P5Compendium } from '../../p5-data-models'

@Component({
  selector: 'app-p5-persona-list',
  template: `
    <app-demon-list
      [compendiumConfig]=P5_COMPENDIUM_CONFIG
      [compendium]=P5_COMPENDIUM>
    </app-demon-list>
`
})
export class P5PersonaListComponent implements OnInit {

  P5_COMPENDIUM: P5Compendium = P5_COMPENDIUM
  P5_COMPENDIUM_CONFIG: CompendiumConfig = P5_COMPENDIUM_CONFIG

  constructor() { }

  ngOnInit(): void { }

}
