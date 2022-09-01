import { Component, OnInit } from '@angular/core'
import { P5ChainCalculator } from '@p5/models/p5-chain-calculator'
import { P5Compendium } from '@p5/models/p5-compendium'
import { P5_CHAIN_CALCULATOR, P5_COMPENDIUM } from '@shared/constants'

@Component({
  selector: 'app-p5-fusion-chain',
  template: `
    <app-fusion-chain
      [compendium]=compendium
      [chain]=chain>
    </app-fusion-chain>`
})
export class P5FusionChainComponent implements OnInit {

  compendium: P5Compendium = P5_COMPENDIUM
  chain: P5ChainCalculator = P5_CHAIN_CALCULATOR

  constructor() { }

  ngOnInit(): void {
  }

}
