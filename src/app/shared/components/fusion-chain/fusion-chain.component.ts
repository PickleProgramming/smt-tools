import { Component, Input, OnInit } from '@angular/core';
import { Compendium } from '@shared/models/compendium';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-fusion-chain',
  templateUrl: './fusion-chain.component.html',
  styleUrls: ['./fusion-chain.component.scss']
})
export class FusionChainComponent implements OnInit {

  @Input() compendium!: Compendium
  skills?: string[]
  demons?: string[]
  skill: string[] = []
  demon: string = ''

  constructor() { }

  ngOnInit(): void {
    if (this.compendium === undefined)
      throw new Error('FusionChainComponent called without passing compendium')
    this.skills = Object.keys(this.compendium.skills)
    this.demons = Object.keys(this.compendium.demons)
  }

  searchSkills: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.skills!.filter(v =>
          v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  searchDemons: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.demons!.filter(v =>
          v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

}
