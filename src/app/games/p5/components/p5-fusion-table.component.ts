import { Component, OnInit } from '@angular/core'
import { P5_COMPENDIUM } from '@shared/constants'
import { P5CompendiumConfig } from '@p5/models/p5-compendium'

@Component({
  selector: 'app-p5-fusion-table',
  template: `
    <app-normal-fusion-table
      [config]=config>
    </app-normal-fusion-table>
    <app-element-fusion-table
      [config]=config>
    <app-element-fusion-table>`
})
export class P5FusionTableComponent implements OnInit {

  config: P5CompendiumConfig = P5_COMPENDIUM.config

  constructor() { }

  ngOnInit(): void {
  }

}
