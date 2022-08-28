import { Input, Component, OnInit } from '@angular/core'
import { Demon } from '../../models/compendium'

@Component({
  selector: 'app-fusion-settings',
  template: `
    <div class="dlcSettings" *ngFor='let pack of packs'>
      <input type="checkbox" id='{{ pack }}' (change)='togglePack($event)'/>
      {{ pack }}
      <br>
  </div>`,
  styleUrls: ['./fusion-settings.component.scss']
})
export class FusionSettingsComponent implements OnInit {

  @Input() dlcDemons!: { [name: string]: Demon }
  @Input() packs!: string[]
  @Input() togglePack!: (event: any) => void

  constructor() { }

  ngOnInit(): void {
    if (typeof this.dlcDemons === undefined) {
      console.error("FusionSettingsComponent requires a compendium with a dlcDemons property")
      return
    }
    if (typeof this.packs === undefined) {
      console.error("FusionSettingsComponent requires a 'packs' object.")
      return
    }
    if (typeof this.togglePack === undefined) {
      console.error("FusionSettingsComponent requires a togglePack function")
      return
    }
  }
}
