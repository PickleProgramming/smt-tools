import { Component, OnInit } from '@angular/core';
import { P5Compendium } from '@p5/p5-compendium';
import { P5_COMPENDIUM } from '@shared/constants';

@Component({
  selector: 'app-p5-fusion-chain',
  template: `
    <app-fusion-chain
      [compendium]=compendium>
    </app-fusion-chain>`
})
export class P5FusionChainComponent implements OnInit {

  compendium: P5Compendium = P5_COMPENDIUM

  constructor() { }

  ngOnInit(): void {
  }

}
