import { Component, OnInit } from '@angular/core'
import { Demon } from 'src/app/shared/models/compendium'
import { P5FusionService } from '../../p5-fusion.service'

@Component({
  selector: 'app-p5-fusion-settings',
  template: `
  <app-fusion-settings
    [dlcDemons]=dlcDemons!
    [packs] = packs
    [togglePack] = togglePack>
  </app-fusion-settings>`,
  providers: [
    { provide: 'game', useValue: 'p5' }
  ]
})
export class P5FusionSettingsComponent implements OnInit {

  dlcDemons?: { [name: string]: Demon } = this.compendium.getDlcDemons()

  packs: string[] = [
    'Izanagi',
    'Orpheus',
    'Ariadne',
    'Asterius',
    'Thanatos',
    'Kaguya',
    'Magatsu-Izanagi',
    'Tsukiyomi',
    'Messiah'
  ]
  packDemons: { [pack: string]: string[] } = {
    'Izanagi': ['Izanagi', 'Izanagi Picaro'],
    'Orpheus': ['Orpheus', 'Orpherus Picaro'],
    'Ariadne': ['Ariadne', 'Ariadne Picaro'],
    'Asterius': ['Asterius', 'Asterius Picaro'],
    'Thanatos': ['Thanatos', 'Thanatos Picaro'],
    'Kaguya': ['Kaguya', 'Kaguya Picaro'],
    'Magatsu-Izanagi': ['Magatsu-Izanagi', 'Magatsu-Izanagi Picaro'],
    'Tsukiyomi': ['Tsukiyomi', 'Tsukiyomi Picaro'],
    'Messiah': ['Messiah', 'Messiah Picaro']
  }

  togglePack = (event: any): void => {
    let pack: string = event.path[0].id
    let checked: boolean = event.srcElement.checked
    if (checked) {
      this.packDemons[pack].forEach(element =>
        this.compendium.getDemons()[pack] = this.compendium.getDlcDemons()![pack])
    } else {
      this.packDemons[pack].forEach(element =>
        delete this.compendium.getDemons()[pack])
    }
  }

  constructor(
    private compendium: P5FusionService
  ) { }

  ngOnInit(): void { }
}
