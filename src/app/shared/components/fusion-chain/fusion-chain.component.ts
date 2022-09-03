import { Component, Input, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ChainCalculator, FusionChain } from '@shared/models/chain-calculator'
import { Compendium } from '@shared/models/compendium'
import { Observable } from 'rxjs'
import {
	debounceTime,
	distinctUntilChanged,
	map,
	startWith,
} from 'rxjs/operators'

@Component({
	selector: 'app-fusion-chain',
	templateUrl: './fusion-chain.component.html',
	styleUrls: ['./fusion-chain.component.scss'],
})
export class FusionChainComponent implements OnInit {
	@Input() compendium?: Compendium
	@Input() chainCalc?: ChainCalculator
	skills?: string[]
	demons?: string[]
	chains: FusionChain[] | null = null
	demonControl = new FormControl('')
	levelControl = new FormControl('')
	skillControls: FormControl[] = []
	filteredDemons?: Observable<string[]>
	filteredSkills?: Observable<string[]>
	panelOpenState = false

	constructor() {}

	ngOnInit(): void {
		if (!this.compendium) {
			throw new Error(
				'FusionChainComponent called without passing ' + ' compendium'
			)
		}
		if (!this.chainCalc) {
			throw new Error(
				'FusionChainComponent called without passing ' +
					'chain calculator'
			)
		}
		this.skills = Object.keys(this.compendium.skills)
		this.demons = Object.keys(this.compendium.demons)

		this.filteredDemons = this.demonControl.valueChanges.pipe(
			startWith(''),
			map((value) => this._filterDemons(value || ''))
		)
		for (let i = 0; i < 8; i++) {
			this.skillControls.push(new FormControl(''))
			this.filteredSkills = this.skillControls[i].valueChanges.pipe(
				startWith(''),
				map((value) => this._filterSkills(value || ''))
			)
		}
	}

	private _filterDemons(value: string): string[] {
		let filterValue = value.toLocaleLowerCase()
		return this.demons!.filter((option) =>
			option.toLowerCase().includes(filterValue)
		)
	}
	private _filterSkills(value: string): string[] {
		const filterValue = value.toLowerCase()
		return this.skills!.filter((option) =>
			option.toLowerCase().includes(filterValue)
		)
	}

	calculate(): void {
		if (!this.chainCalc) {
			throw new Error(
				'FusionChainComponent called without passing chain calculator'
			)
		}
		let inputSkills: string[] = []
		for (let skillControl of this.skillControls) {
			inputSkills.push(skillControl.value)
		}
		let demon = this.demonControl.value
		if (demon) {
			this.chains = this.chainCalc.getChains(inputSkills, false, demon)
		} else {
			this.chains = this.chainCalc?.getChains(inputSkills, false)
		}
	}

	test(): void {
		if (!this.chainCalc) {
			throw new Error(
				'FusionChainComponent called without passing chain calculator'
			)
		}
		this.demonControl.setValue('Ara Mitama')
		this.skillControls[0].setValue('Miracle Punch')
		this.skillControls[1].setValue('Apt Pupil')
		this.skillControls[2].setValue('Attack Master')
	}

	log(): void {
		console.log('demonControl: ' + this.demonControl.value)
		for (let i = 0; i < 8; i++) {
			console.log(`Skill ${i}: ${this.skillControls[i].value}`)
		}
	}
}
