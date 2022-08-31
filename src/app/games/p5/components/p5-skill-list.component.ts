import { Component, OnInit } from '@angular/core'
import { P5_COMPENDIUM } from '@shared/constants'
import { Skill } from '@shared/models/compendium'
import { P5CompendiumConfig } from '@p5/models/p5-compendium'

@Component({
  selector: 'app-p5-skill-list',
  template: `
    <app-skill-list
      [config]=config
      [skills]=skills>
    </app-skill-list>`
})
export class P5SkillListComponent implements OnInit {

  config: P5CompendiumConfig = P5_COMPENDIUM.config
  skills: { [name: string]: Skill } = P5_COMPENDIUM.skills

  constructor() { }

  ngOnInit(): void {
  }

}
