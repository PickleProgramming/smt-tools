import { Component, OnInit } from '@angular/core'
import { P5_COMPENDIUM } from 'src/app/shared/constants'
import { P5CompendiumConfig } from '../../p5-compendium'

@Component({
  selector: 'app-p5-fusion-table',
  template: `
    <app-normal-fusion-table
      [config]=config>
    </app-normal-fusion-table>`,
  providers: [
    { provide: 'game', useValue: 'p5' }
  ]
})
export class P5FusionTableComponent implements OnInit {

  config: P5CompendiumConfig = P5_COMPENDIUM.config

  constructor() { }

  ngOnInit(): void {
  }

}