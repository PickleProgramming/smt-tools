import { Component, OnInit } from '@angular/core'
import { Skill } from 'src/app/shared/models/compendium'
import { P5CompendiumConfig } from '../../p5-compendium'
import { P5FusionService } from '../../p5-fusion.service'

@Component({
  selector: 'app-p5-skill-list',
  template: `
    <app-skill-list
      [config]=config
      [skills]=skills>
    </app-skill-list>`
})
export class P5SkillListComponent implements OnInit {

  config: P5CompendiumConfig = this.compendium.getConfig()
  skills: { [name: string]: Skill } = this.compendium.getSkills()

  constructor(
    private compendium: P5FusionService
  ) { }

  ngOnInit(): void {
  }

}
