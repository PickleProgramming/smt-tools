import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { P5_COMPENDIUM } from 'src/app/shared/constants'
import { P5Compendium } from '../../p5-compendium'

@Component({
  selector: 'app-p5-persona-entry',
  template: `
    <app-demon-entry
      [compendium]=compendium>
    </app-demon-entry>`
})
export class P5PersonaEntryComponent implements OnInit {

  name!: string
  compendium: P5Compendium = P5_COMPENDIUM

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void { }

}
