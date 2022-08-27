import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Compendium, CompendiumConfig } from '../../models/compendiumModels'

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})
export class SkillListComponent implements OnInit {

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
      'Skills',
      'Acquisition'
    ]
    this.colSpan = {
      'Skills': this.compendiumConfig.skillCols.length,
      'Acquisition': this.compendiumConfig.acquisitionCols.length
    }

    this.compendiumConfig.skillCols.forEach(elem =>
      this.secondHeader.push(elem))
    this.compendiumConfig.acquisitionCols.forEach(elem =>
      this.secondHeader.push(elem))
  }

}
