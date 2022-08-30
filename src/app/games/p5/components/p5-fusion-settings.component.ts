import { Component, OnInit } from '@angular/core'
import { P5_COMPENDIUM } from 'src/app/shared/constants'
import { Demon } from 'src/app/shared/models/compendium'
import { P5Compendium } from '../p5-compendium'

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

  compendium: P5Compendium = P5_COMPENDIUM
  dlcDemons?: { [name: string]: Demon } = this.compendium.dlcDemons

  packs: { [name: string]: boolean } = {}
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

  constructor() { }

  ngOnInit(): void { 
    this.packs = {
      'Izanagi': (this.compendium.demons['Izanagi'] !== undefined),
      'Orpheus': (this.compendium.demons['Orpheus'] !== undefined),
      'Ariadne': (this.compendium.demons['Ariadne'] !== undefined),
      'Asterius': (this.compendium.demons['Aterius'] !== undefined),
      'Thanatos': (this.compendium.demons['Thanatos'] !== undefined),
      'Kaguya': (this.compendium.demons['Kaguya'] !== undefined),
      'Magatsu-Izanagi': (this.compendium.demons['Magatsu-Izanagi'] !== undefined),
      'Tsukiyomi': (this.compendium.demons['Tuskiyomi'] !== undefined),
      'Messiah': (this.compendium.demons['Messiah'] !== undefined)
    }
    console.log(this.compendium.demons['Izanagi'])
  }

  togglePack = (event: any): void => {
    let pack: string = event.path[0].id
    let checked: boolean = event.srcElement.checked
    if (checked) {
      this.packDemons[pack].forEach(element =>
        this.compendium.demons[pack] = this.compendium.dlcDemons![pack])
    } else {
      this.packDemons[pack].forEach(element =>
        delete this.compendium.demons[pack])
    }
    this.packs[pack] = !this.packs[pack]

    
  }
}
