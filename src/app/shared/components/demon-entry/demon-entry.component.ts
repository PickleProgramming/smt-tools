import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router'
import { Compendium } from '@shared/types/compendium'
import { FusionCalculator } from '@shared/types/fusion-calculator'
import { Demon, Recipe } from '@shared/types/smt-tools.types'

@Component({
	selector: 'app-demon-entry',
	templateUrl: './demon-entry.component.html',
	styleUrls: ['./demon-entry.component.scss'],
})
export class DemonEntryComponent implements OnInit {
	@Input() compendium!: Compendium
	@Input() calculator!: FusionCalculator
	@ViewChild(MatSort) sort!: MatSort

	demon!: Demon
	inheritTypes!: boolean[]
	fissions!: Recipe[]
	fissionSource!: MatTableDataSource<Recipe>
	fusions!: Recipe[]
	fusionSource!: MatTableDataSource<Recipe>

	name: string = this.router.url.split('/')[3]
	displayedFissionColumns = [
		'cost',
		'raceA',
		'levelA',
		'nameA',
		'raceB',
		'nameB',
		'levelB',
	]
	displayedFusionColumns = [
		'cost',
		'raceB',
		'levelB',
		'nameB',
		'raceResult',
		'nameResult',
		'levelResult',
	]

	constructor(private router: Router) {}

	ngOnInit(): void {
		if (!this.compendium) {
			throw new Error('DemonEntryComponent was not passed a Compendium')
		}
		if (!this.calculator) {
			throw new Error(
				'DemonEntryComponent was not passed a FusionCalculator',
			)
		}
		if (this.name.includes('%20')) this.name = this.name.replace('%20', ' ')
		this.demon = this.compendium.demons[this.name]
		this.inheritTypes = this.compendium.getInherits(this.demon.inherits!)
		this.fissions = this.calculator.getFissions(this.name)
		this.fissionSource = new MatTableDataSource(this.fissions)
		this.fusions = this.calculator.getFusions(this.name)
		this.fusionSource = new MatTableDataSource(this.fusions)
	}

	ngAfterViewInit(): void {
		this.fissionSource.sort = this.sort
	}
}
