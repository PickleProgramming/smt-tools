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
	filteredSkills: Observable<string[]>[] = []
	panelOpenState = false

	constructor() {}

	ngOnInit(): void {
		if (!this.compendium) {
			throw new Error(
				'FusionChainComponent called without passing compendium'
			)
		}
		if (!this.chainCalc) {
			throw new Error(
				'FusionChainComponent called without passing chain calculator'
			)
		}
		this.skills = Object.keys(this.compendium.skills)
		this.demons = Object.keys(this.compendium.demons)

		this.filteredDemons = this.demonControl.valueChanges.pipe(
			startWith(''),
			map((value) => this._filter(value || '', this.demons!))
		)
		for (let i = 0; i < 8; i++) {
			this.skillControls.push(new FormControl(''))
			this.filteredSkills.push(
				this.skillControls[i].valueChanges.pipe(
					startWith(''),
					map((value) => this._filter(value || '', this.skills!))
				)
			)
		}
	}

	private _filter(value: string, list: string[]): string[] {
		let filterValue = value.toLocaleLowerCase()
		return list.filter((option) =>
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
			if (skillControl.value) inputSkills.push(skillControl.value)
		}
		console.log(inputSkills)
		let demon = this.demonControl.value

		if (this.levelControl.value) {
			let level: number = +this.levelControl.value
			this.chainCalc.maxLevel = level
		}
		if (demon) {
			this.chains = this.chainCalc.getChains(inputSkills, false, demon)
			return
		}
		this.chains = this.chainCalc?.getChains(inputSkills, false)
		this.chainCalc.maxLevel = 99
	}

	test(): void {
		if (!this.chainCalc) {
			throw new Error(
				'FusionChainComponent called without passing chain calculator'
			)
		}
		this.demonControl.setValue('')
		this.levelControl.setValue('80')
		this.skillControls[0].setValue('Regenerate 3')
		this.skillControls[1].setValue('Invigorate 3')
		this.skillControls[2].setValue('Miracle Punch')
		this.skillControls[3].setValue('Apt Pupil')
	}

	log(): void {
		console.log(`demon: ${this.demonControl.value}`)
		console.log(`Level: ${this.levelControl.value}`)
		for (let i = 0; i < 8; i++) {
			console.log(`Skill ${i}: ${this.skillControls[i].value}`)
		}
	}
}
