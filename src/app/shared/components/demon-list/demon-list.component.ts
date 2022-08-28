import { Component, Input, OnInit } from '@angular/core'
import { CompendiumConfig, Demon } from '../../models/compendium'
import { CompendiumService } from '../../services/compendium.service'

//TODO: make the elements images, add tooltop for which element is which
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
      console.error("Config/Demon List cannot be undefined")
      return
    }

    this.firstHeader = [
      'Demons',
      'Stats'
    ]
    this.colSpan = {
      'Demons': this.config.demonCols.length,
      'Stats': this.config.statCols.length,
    }

    this.config.demonCols.forEach(elem =>
      this.secondHeader.push(elem))
    this.config.statCols.forEach(elem =>
      this.secondHeader.push(elem))

    if (typeof this.config.resistanceCols !== undefined) {
      this.firstHeader.push('Resistances')
      this.colSpan['Resistances'] = this.config.resistanceCols!.length
      this.config.resistanceCols!.forEach(column =>
        this.secondHeader.push(column))
    }
    if (typeof this.config.affinityCols !== undefined) {
      console.log('Trying to read affinities')
      this.firstHeader.push('Affinities')
      this.colSpan['Affinities'] = this.config.affinityCols!.length
      this.config.affinityCols!.forEach(column =>
        this.secondHeader.push(column))
    }
  }
}
