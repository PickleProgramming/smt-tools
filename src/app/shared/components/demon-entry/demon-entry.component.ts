import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Compendium, Demon } from '../../models/compendium';
import { FusionCalculator, Recipe } from '../../models/fusion-calculator';

@Component({
  selector: 'app-demon-entry',
  templateUrl: './demon-entry.component.html',
  styleUrls: ['./demon-entry.component.scss']
})
export class DemonEntryComponent implements OnInit {

  @Input() compendium!: Compendium
  @Input() calculator!: FusionCalculator
  
  name: string = this.router.url.split('/')[3]
  demon!: Demon
  inheritTypes!: boolean[]
  recipes!: Recipe[]

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit called for app-demon-entry: ' + this.name)
    if(this.compendium === undefined)
      throw new Error('DemonEntryComponent must be passed a compendium')
    if(this.calculator === undefined)
      throw new Error('DemonEntryComponent must be passed a FusionCalculator')
    this.demon = this.compendium.demons[this.name]
    this.inheritTypes = this.compendium.config.getInherits!(this.demon.inherits!)
    this.recipes = this.calculator.getFissions(this.name)
  }

}
