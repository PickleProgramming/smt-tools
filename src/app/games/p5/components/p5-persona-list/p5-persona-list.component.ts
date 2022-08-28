import { Component, OnInit } from '@angular/core'
import { Demon } from 'src/app/shared/models/compendium'
import { P5CompendiumConfig } from '../../p5-compendium'
import { P5FusionService } from '../../p5-fusion.service'

@Component({
  selector: 'app-p5-persona-list',
  template: `
    <app-demon-list
      [config]=config
      [demons]=demons>
    </app-demon-list>`
})
export class P5PersonaListComponent implements OnInit {

  config: P5CompendiumConfig = this.compendium.getConfig()
  demons: { [name: string]: Demon } = this.compendium.getDemons()

  constructor(
    private compendium: P5FusionService
  ) { }

  ngOnInit(): void { }
}
