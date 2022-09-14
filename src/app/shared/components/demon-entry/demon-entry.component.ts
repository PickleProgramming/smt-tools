import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
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

	fissionSource!: MatTableDataSource<Recipe>
	fusionSource!: MatTableDataSource<Recipe>
	displayedColumns = [
		'cost',
		'raceA',
		'levelA',
		'nameA',
		'raceB',
		'nameB',
		'levelB',
	]
	@ViewChild(MatSort) sort!: MatSort

	constructor(private router: Router) {}

	ngOnInit(): void {
		if (!this.compendium) {
			throw new Error('DemonEntryComponent must be passed a compendium')
		}
		if (!this.calculator) {
			throw new Error(
				'DemonEntryComponent must be passed a FusionCalculator'
			)
		}
		if (this.name.includes('%20')) this.name = this.name.replace('%20', ' ')
		this.demon = this.compendium.demons[this.name]
		this.inheritTypes = this.compendium.config.getInherits(
			this.demon.inherits!
		)
		this.fissions = this.calculator.getFissions(this.name)
		this.fissionSource = new MatTableDataSource(this.fissions)
		this.fusions = this.calculator.getFusions(this.name)
		this.fusionSource = new MatTableDataSource(this.fusions)
	}

	ngAfterViewInit(): void {
		this.fissionSource.sort = this.sort
	}
}
