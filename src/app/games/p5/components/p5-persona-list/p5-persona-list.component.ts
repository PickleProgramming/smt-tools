import { Component, Input, OnInit } from '@angular/core'
import { P5Compendium, P5_COMPENDIUM, P5_COMPENDIUM_CONFIG } from 'src/app/games/p5/models/p5-compendium'
import { CompendiumConfig } from 'src/app/shared/models/compendiumModels'

@Component({
  selector: 'app-p5-persona-list',
  template: `
    <app-demon-list
      [compendiumConfig]=p5CompendiumConfig
      [compendium]=p5Compendium>
    </app-demon-list>
`,
  styleUrls: ['./p5-persona-list.component.scss']
})
export class P5PersonaListComponent implements OnInit {

  p5Compendium: P5Compendium = P5_COMPENDIUM
  p5CompendiumConfig: CompendiumConfig = P5_COMPENDIUM_CONFIG

  constructor() {
    this.p5Compendium = new P5Compendium
  }

  ngOnInit(): void { }

}
