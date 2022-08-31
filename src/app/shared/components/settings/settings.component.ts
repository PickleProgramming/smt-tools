import { Input, Component, OnInit } from '@angular/core'
import { Demon } from '../../models/compendium'

@Component({
  selector: 'app-settings',
  template: `
    <div class='dlcSettings' *ngFor='let pack of packs | keyvalue'>
      <input type='checkbox' id='{{ pack.key }}' 
        (change)='togglePack($event)'
        [checked]='pack.value'/>
      {{ pack.key }}
      <br>
    </div>`,
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @Input() dlcDemons!: { [name: string]: Demon }
  @Input() packs!: { [name: string]: boolean }
  @Input() togglePack!: (event: any) => void

  constructor() { }

  ngOnInit(): void {
    if (typeof this.dlcDemons === undefined) {
      console.error("SettingsComponent requires a compendium with a dlcDemons property")
      return
    }
    if (typeof this.packs === undefined) {
      console.error("SettingsComponent requires a 'packs' object.")
      return
    }
    if (typeof this.togglePack === undefined) {
      console.error("SettingsComponent requires a togglePack function")
      return
    }
  }
}
