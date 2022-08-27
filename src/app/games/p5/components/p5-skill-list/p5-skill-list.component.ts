import { Component, OnInit } from '@angular/core'
import { CompendiumConfig } from 'src/app/shared/models/compendiumModels'
import { P5_COMPENDIUM, P5_COMPENDIUM_CONFIG } from '../../p5-constants'
import { P5Compendium } from '../../p5-data-models'

@Component({
  selector: 'app-p5-skill-list',
  template: `
    <app-skill-list
      [compendiumConfig]=p5CompendiumConfig
      [compendium]=p5Compendium>
    </app-skill-list>
  `
})
export class P5SkillListComponent implements OnInit {

  p5Compendium: P5Compendium = P5_COMPENDIUM
  p5CompendiumConfig: CompendiumConfig = P5_COMPENDIUM_CONFIG

  constructor() { }

  ngOnInit(): void {
  }

}
