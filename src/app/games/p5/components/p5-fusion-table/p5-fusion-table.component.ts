import { Component, OnInit } from '@angular/core'
import { CompendiumConfig } from 'src/app/shared/models/compendiumModels'
import { P5_COMPENDIUM_CONFIG } from '../../p5-constants'

@Component({
  selector: 'app-p5-fusion-table',
  template: `
  <app-normal-fusion-table
    [compendiumConfig]=P5_COMPENDIUM_CONFIG
  ></app-normal-fusion-table>
  `
})
export class P5FusionTableComponent implements OnInit {

  P5_COMPENDIUM_CONFIG: CompendiumConfig = P5_COMPENDIUM_CONFIG

  constructor() { }

  ngOnInit(): void {
  }

}
