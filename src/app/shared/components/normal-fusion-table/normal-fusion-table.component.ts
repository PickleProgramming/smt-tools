import { Component, Input, OnInit } from '@angular/core'
import { CompendiumConfig } from '../../models/compendium'

@Component({
  selector: 'app-normal-fusion-table',
  templateUrl: './normal-fusion-table.component.html',
  styleUrls: ['./normal-fusion-table.component.scss']
})
export class NormalFusionTableComponent implements OnInit {

  @Input() config!: CompendiumConfig

  constructor() { }

  ngOnInit(): void {
    if (typeof this.config === undefined) {
      console.log('Normal Fusion Table must be called with a game')
      return
    }
  }

}
