import { Component, OnInit } from '@angular/core'
import { P5CompendiumConfig } from '../../p5-compendium'
import { P5FusionService } from '../../p5-fusion.service'

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

  config: P5CompendiumConfig = this.compendium.getConfig()

  constructor(
    private compendium: P5FusionService
  ) { }

  ngOnInit(): void {
  }

}
