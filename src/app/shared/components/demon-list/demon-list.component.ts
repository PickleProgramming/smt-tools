import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Compendium, CompendiumConfig } from 'src/app/shared/models/compendiumModels';

//TODO: make the elements images, add tooltop for which element is which
@Component({
  selector: 'app-demon-list',
  templateUrl: './demon-list.component.html',
  styleUrls: ['./demon-list.component.scss']
})
export class DemonListComponent implements OnInit {

  @Input() compendiumConfig!: CompendiumConfig
  @Input() compendium!: Compendium
  firstHeader: string[] = []
  colSpan: { [col: string]: number } = {}
  secondHeader: string[] = []
  abbrv = ""

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.abbrv = this.router.url.split('/')[1]

    if (this.compendiumConfig == undefined ||
      this.compendium == undefined) {
      console.error("compendiumConfig/compendium cannot be undefined")
      return
    }
    
    this.firstHeader = [
      'Demons',
      'Stats'
    ]
    this.colSpan = {
      'Demons': this.compendiumConfig.demonCols.length,
      'Stats': this.compendiumConfig.statCols.length,
    }

    this.compendiumConfig.demonCols.forEach(elem =>
      this.secondHeader.push(elem))
    this.compendiumConfig.statCols.forEach(elem =>
      this.secondHeader.push(elem))

    if (this.compendiumConfig.resistanceCols) {
      this.firstHeader.push('Resistances')
      this.colSpan['Resistances'] = this.compendiumConfig.resistanceCols.length
      this.compendiumConfig.resistanceCols.forEach(column =>
        this.secondHeader.push(column))
    }
    if (this.compendiumConfig.affinityCols) {
      this.firstHeader.push('Affinities')
      this.colSpan['Affinities'] = this.compendiumConfig.affinityCols.length
      this.compendiumConfig.affinityCols.forEach(column =>
        this.secondHeader.push(column))
    }
  }
}
