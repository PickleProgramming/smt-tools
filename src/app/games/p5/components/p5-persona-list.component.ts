import { Component, OnInit } from '@angular/core'
import { P5_COMPENDIUM } from '@shared/constants'
import { Demon } from '@shared/models/compendium'
import { P5CompendiumConfig } from '@p5/models/p5-compendium'

@Component({
  selector: 'app-p5-persona-list',
  template: `
    <app-demon-list
      [config]=config
      [demons]=demons>
    </app-demon-list>`
})
export class P5PersonaListComponent implements OnInit {

  config: P5CompendiumConfig = P5_COMPENDIUM.config
  demons: { [name: string]: Demon } = P5_COMPENDIUM.demons

  constructor(
  ) { }

  ngOnInit(): void { }
}
