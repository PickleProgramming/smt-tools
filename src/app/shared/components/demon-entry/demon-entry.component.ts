import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router'
import { Compendium } from '@shared/types/compendium'
import { FusionCalculator } from '@shared/types/fusion-calculator'
import { Demon, Fusion } from '@shared/types/smt-tools.types'

@Component({
	selector: 'app-demon-entry',
	templateUrl: './demon-entry.component.html',
	styleUrls: ['./demon-entry.component.scss'],
})
export class DemonEntryComponent implements OnInit {
	@Input() declare compendium: Compendium
	@Input() declare calculator: FusionCalculator
	@ViewChild(MatSort) declare sort: MatSort

	declare name: string
	declare demon: Demon
	declare inheritTypes: boolean[]
	declare fissions: Fusion[]
	declare fissionSource: MatTableDataSource<Fusion>
	declare fusions: Fusion[]
	declare fusionSource: MatTableDataSource<Fusion>

	displayedFissionColumns = [
		'raceA',
		'levelA',
		'nameA',
		'raceB',
		'nameB',
		'levelB',
		'cost',
	]
	displayedFusionColumns = [
		'raceB',
		'levelB',
		'nameB',
		'raceResult',
		'nameResult',
		'levelResult',
		'cost',
	]

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.name = this.router.url.split('/')[3]
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

	applyFilterFissions(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.fissionSource.filter = filterValue.trim().toLowerCase()
	}

	applyFilterFusions(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.fusionSource.filter = filterValue.trim().toLowerCase()
	}
}
