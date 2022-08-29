import { Component, Input, OnInit } from '@angular/core'
import { CompendiumConfig, Skill } from '../../models/compendium'

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})
export class SkillListComponent implements OnInit {

  @Input() config!: CompendiumConfig
  @Input() skills!: { [name: string]: Skill }
  firstHeader: string[] = []
  colSpan: { [col: string]: number } = {}
  secondHeader: string[] = []

  constructor() { }

  ngOnInit(): void {
    if (this.config == undefined ||
      this.skills == undefined) {
      console.error("Config/Skills cannot be undefined")
      return
    }

    this.firstHeader = [
      'Skills',
      'Acquisition'
    ]
    this.colSpan = {
      'Skills': this.config.skillCols.length,
      'Acquisition': this.config.acquisitionCols.length
    }

    this.config.skillCols.forEach(elem =>
      this.secondHeader.push(elem))
    this.config.acquisitionCols.forEach(elem =>
      this.secondHeader.push(elem))
  }

}
