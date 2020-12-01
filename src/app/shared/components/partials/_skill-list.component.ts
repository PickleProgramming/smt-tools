import { Input, OnInit, AfterViewChecked } from '@angular/core';
import { SortedTableComponent } from './sorted-table.component';
import { Skill } from 'src/app/shared/models/compendiumModels';

export abstract class SkillListComponent<TSkill extends Skill> extends SortedTableComponent<TSkill> implements OnInit, AfterViewChecked {
  @Input() elemOrder?: { [elem: string]: number };
  @Input() inheritOrder?: { [elem: string]: number };
  protected sortSkils: ((a: TSkill, b: TSkill) => number)[] = [];

  ngOnInit() {
      this.nextSortSkils();
  }

  ngAfterViewChecked() {
    this.matchColWidths();
  }

  nextSortSkils() {
    this.sortSkils = [
        (a, b) => (this.elemOrder![a.element] - this.elemOrder![b.element]) * 10000 + a.rank - b.rank,
        (a, b) => (this.elemOrder![a.element] - this.elemOrder![b.element]) * 10000 + a.rank - b.rank,
        (a, b) => a.name.localeCompare(b.name),
        (a, b) => b.cost - a.cost,
        (a, b) => a.rank - b.rank
    ];

    if (this.inheritOrder) {
      this.sortSkils.push(
        (a, b) => (this.inheritOrder![a.inherit!] - this.inheritOrder![b.inherit!]),
      );
    }
  }

  getSortSkil(sortSkilIndex: number): (a: TSkill, b: TSkill) => number {
    return this.sortSkils[sortSkilIndex];
  }
}