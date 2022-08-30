import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Compendium, Demon } from '../../models/compendium';

@Component({
  selector: 'app-demon-entry',
  templateUrl: './demon-entry.component.html',
  styleUrls: ['./demon-entry.component.scss']
})
export class DemonEntryComponent implements OnInit {

  @Input() compendium!: Compendium
  demon!: Demon

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.compendium === undefined)
      console.error('DemonEntryComponent must be passed a compendium')
    this.demon = this.compendium.demons[this.router.url.split('/')[3]]
    console.log(this.compendium.config.getInherits!(this.demon.inherits!))
  }

}
