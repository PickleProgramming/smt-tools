import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Compendium, Demon, Recipe } from '@shared//models/compendium'
import { FusionCalculator } from '@shared//models/fusion-calculator'

@Component({
	selector: 'app-demon-entry',
	templateUrl: './demon-entry.component.html',
	styleUrls: ['./demon-entry.component.scss'],
})
export class DemonEntryComponent implements OnInit {
	@Input() compendium: Compendium | undefined
	@Input() calculator: FusionCalculator | undefined
	name: string = this.router.url.split('/')[3]
	demon: Demon | undefined
	inheritTypes!: boolean[]
	fissions!: Recipe[]
	fusions!: Recipe[]

	constructor(private router: Router) {}

	ngOnInit(): void {
		if (!this.compendium)
			throw new Error('DemonEntryComponent must be passed a compendium')
		if (!this.calculator)
			throw new Error(
				'DemonEntryComponent must be passed a FusionCalculator'
			)
		this.demon = this.compendium.demons[this.name]
		this.inheritTypes = this.compendium.config.getInherits(
			this.demon.inherits!
		)
		this.fissions = this.calculator.getFissions(this.name)
		this.fusions = this.calculator.getFusions(this.name)
	}
}
