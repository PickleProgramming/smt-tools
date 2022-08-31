// import { Component, OnInit } from '@angular/core'
// import { P5_COMPENDIUM } from '@p5/@p5/p5r-constants'
// import { P5Compendium } from '@p5/@shared/p5r-data-models'

// @Component({
//   selector: 'app-p5r-fusion-settings',
//   template: `
//   <app-settings 
//     [compendium] = compendium
//     [packs] = packs
//     [togglePack] = togglePack>
//   </app-settings>
//   `
// })
// export class P5SettingsComponent implements OnInit {

//   compendium: P5Compendium = P5_COMPENDIUM
//   packs: string[] = [
//     'Izanagi',
//     'Orpheus',
//     'Ariadne',
//     'Asterius',
//     'Thanatos',
//     'Kaguya',
//     'Magatsu-Izanagi',
//     'Tsukiyomi',
//     'Messiah',
//     'Orpheus F',
//     'Athena',
//     'Izanagi-no-Okami',
//     'Raoul'
//   ]
//   packDemons: { [pack: string]: string[] } = {
//     'Izanagi': ['Izanagi', 'Izanagi Picaro'],
//     'Orpheus': ['Orpheus', 'Orpherus Picaro'],
//     'Ariadne': ['Ariadne', 'Ariadne Picaro'],
//     'Asterius': ['Asterius', 'Asterius Picaro'],
//     'Thanatos': ['Thanatos', 'Thanatos Picaro'],
//     'Kaguya': ['Kaguya', 'Kaguya Picaro'],
//     'Magatsu-Izanagi': ['Magatsu-Izanagi', 'Magatsu-Izanagi Picaro'],
//     'Tsukiyomi': ['Tsukiyomi', 'Tsukiyomi Picaro'],
//     'Messiah': ['Messiah', 'Messiah Picaro'],
//     'Orpheus F': ['Orpheus F', 'Orpheus Picaro F'],
//     'Athena': ['Athena', 'Athena Picaro'],
//     'Izanagi-no-Okami': ['Izanagi-no-Okamki', 'Izanagi-no-Okami Picaro'],
//     'Raol': ['Raol']
//   }

//   togglePack = (event: any): void => {
//     let checked: boolean = event.srcElement.checked
//     if(checked) {

//     } else {

//     }
//   }

//   constructor() { }

//   ngOnInit(): void {  }
// }
