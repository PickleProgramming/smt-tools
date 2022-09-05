import { trigger, state, style, transition, animate } from '@angular/animations'
import { Component, Input, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { ChainCalculator } from '@shared/models/chain-calculator'
import { Compendium } from '@shared/models/compendium'
import { FusionChain } from '@shared/models/fusionChain'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

@Component({
	selector: 'app-fusion-chain',
	templateUrl: './fusion-chain.component.html',
	styleUrls: ['./fusion-chain.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition(
				'expanded <=> collapsed',
				animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
			),
		]),
	],
})
export class FusionChainComponent implements OnInit {
	@Input() compendium?: Compendium
	@Input() chainCalc?: ChainCalculator
	skills?: string[]
	demons?: string[]
	chains: FusionChain[] = []
	demonControl = new FormControl('')
	levelControl = new FormControl('')
	skillControls: FormControl[] = []
	filteredDemons?: Observable<string[]>
	filteredSkills: Observable<string[]>[] = []

	columnsToDisplay = ['result', 'cost', 'level', 'steps']
	chainSource = new MatTableDataSource(this.chains)
	expandedChain!: FusionChain | null
	directions: string[][] = []
	deep: boolean = false

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
		try {
			if (!this.chainCalc) {
				throw new Error(
					'FusionChainComponent called without passing chain calculator'
				)
			}
			let inputSkills: string[] = []
			for (let skillControl of this.skillControls) {
				if (skillControl.value) inputSkills.push(skillControl.value)
			}
			let demon = this.demonControl.value

			if (this.levelControl.value) {
				let level: number = +this.levelControl.value
				this.chainCalc.maxLevel = level
			}
			let chains: FusionChain[] | null
			if (demon) {
				chains = this.chainCalc.getChains(inputSkills, this.deep, demon)
			} else {
				chains = this.chainCalc.getChains(inputSkills, this.deep)
			}
			if (!chains) {
				this.chains = []
			} else {
				this.chains = chains
			}
			this.chainCalc.maxLevel = 99
			this.chainSource = new MatTableDataSource(this.chains)
			console.log(this.chainSource)
		} catch (e) {
			console.error(e)
		}
	}

	//TODO: testing
	test(): void {
		if (!this.chainCalc) {
			throw new Error(
				'FusionChainComponent called without passing chain calculator'
			)
		}
		this.demonControl.setValue('')
		this.levelControl.setValue('')
		this.deep = true
		this.skillControls[0].setValue('Regenerate 3')
		this.skillControls[1].setValue('Invigorate 3')
		this.skillControls[2].setValue('Die For Me!')
		this.skillControls[3].setValue('')
	}

	log(): void {
		console.log(`demon: ${this.demonControl.value}`)
		console.log(`Level: ${this.levelControl.value}`)
		for (let i = 0; i < 8; i++) {
			console.log(`Skill ${i}: ${this.skillControls[i].value}`)
		}
	}
}
