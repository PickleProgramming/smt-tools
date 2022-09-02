import { Component, Input, OnInit } from '@angular/core'
import { CompendiumConfig, Demon } from '@shared//models/compendium'

@Component({
  selector: 'app-demon-list',
  templateUrl: './demon-list.component.html',
  styleUrls: ['./demon-list.component.scss']
})
export class DemonListComponent implements OnInit {

  @Input() demons!: { [name: string]: Demon }
  @Input() config!: CompendiumConfig
  firstHeader: string[] = []
  colSpan: { [col: string]: number } = {}
  secondHeader: string[] = []

  constructor() { }

  ngOnInit(): void {
    if (typeof this.config === undefined
      || typeof this.demons === undefined) {
      throw new Error('Config/Demon List cannot be undefined')
    }

    this.firstHeader = [
      'Demons',
      'Stats'
    ]
    this.colSpan = {
      'Demons': this.config.demonCols.length,
      'Stats': this.config.statCols.length,
    }

    for (let elem of this.config.demonCols)
      this.secondHeader.push(elem)
    for (let elem of this.config.statCols)
      this.secondHeader.push(elem)

    if (this.config.resistanceCols) {
      this.firstHeader.push('Resistances')
      this.colSpan['Resistances'] = this.config.resistanceCols.length
      for (let column of this.config.resistanceCols)
        this.secondHeader.push(column)
    }
    if (this.config.affinityCols) {
      console.log('Trying to read affinities')
      this.firstHeader.push('Affinities')
      this.colSpan['Affinities'] = this.config.affinityCols.length
      for (let column of this.config.affinityCols)
        this.secondHeader.push(column)
    }
  }
}
