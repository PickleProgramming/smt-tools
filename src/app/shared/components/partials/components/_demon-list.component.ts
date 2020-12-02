import { Input, OnInit, AfterViewChecked } from '@angular/core';
import { SortedTableComponent } from './_sorted-table.component';
import { Demon } from 'src/app/shared/models/compendiumModels';

export abstract class _DemonListComponent<TDemon extends Demon> extends SortedTableComponent<TDemon> implements OnInit, AfterViewChecked {
  @Input() raceOrder?: { [race: string]: number };
  @Input() inheritOrder?: { [elem: string]: number };
  @Input() statHeaders?: string[];
  @Input() resistHeaders?: string[];
  @Input() affinityHeaders?: string[];
  protected sortDemons: ((a: TDemon, b: TDemon) => number)[] = [];

  ngOnInit() {
      this.nextSortDemons();
  }

  ngAfterViewChecked() {
    this.matchColWidths();
  }

  nextSortDemons() {
    this.sortDemons = [];

    if (this.raceOrder) {
      this.sortDemons.push(
        (a, b) => (this.raceOrder![a.race] - this.raceOrder![b.race]) * 200 + b.lvl - a.lvl,
        (a, b) => (this.raceOrder![a.race] - this.raceOrder![b.race]) * 200 + b.lvl - a.lvl,
        (a, b) => b.lvl - a.lvl,
        (a, b) => a.name.localeCompare(b.name)
      );
    }

    if (this.inheritOrder) {
      this.sortDemons.push(
        (a, b) => (this.inheritOrder![a.inherit!] - this.inheritOrder![b.inherit!]),
      );
    }

    if (this.statHeaders) {
      this.sortDemons = this.sortDemons.concat(
        this.statHeaders.map((stat, index) => (a, b) => b.stats[index] - a.stats[index])
      );
    }

    if (this.resistHeaders) {
      this.sortDemons = this.sortDemons.concat(
        this.resistHeaders.map((elem, index) => (a, b) => a.resists[index] - b.resists[index])
      );
    }

    if (this.affinityHeaders) {
      this.sortDemons = this.sortDemons.concat(
        this.affinityHeaders.map((stat, index) => (a, b) => b.affinities![index] - a.affinities![index])
      );
    }
  }

  getSortFun(sortDemonIndex: number): (a: TDemon, b: TDemon) => number {
    return this.sortDemons[sortDemonIndex];
  }
}