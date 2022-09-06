import { trigger, state, style, transition, animate } from '@angular/animations'
import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { ChainCalculator, FusionChain } from '@shared/models/chain-calculator'
import { Compendium } from '@shared/models/compendium'
import { Observable, Subscription, of } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { fromWorker } from 'observable-webworker'
import _ from 'lodash'

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
	@Input() compendium!: Compendium
	skills?: string[]
	demons?: string[]
	demonControl = new FormControl('')
	levelControl = new FormControl('')
	skillControls: FormControl[] = []
	filteredDemons?: Observable<string[]>
	filteredSkills: Observable<string[]>[] = []

	columnsToDisplay = ['result', 'cost', 'level', 'steps']
	expandedChain!: FusionChain | null
	directions: string[][] = []

	chainSource?: MatTableDataSource<FusionChain>
	chainSub?: Subscription
	combo: number = 0
	comboSub?: Subscription

	deep: boolean = false

	constructor() {}

	ngOnInit(): void {
		if (!this.compendium) {
			throw new Error(
				'FusionChainComponent called without passing compendium'
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

	calculate() {
		let inputSkills: string[] = []
		for (let skillControl of this.skillControls) {
			if (skillControl.value) inputSkills.push(skillControl.value)
		}
		_.reject('inputSkills', _.isEmpty)
		let data = {
			demonName: this.demonControl.value,
			level: this.levelControl.value,
			inputSkills: inputSkills,
			deep: this.deep,
		}
		let input$ = of(JSON.stringify(data))
		fromWorker<string, string>(
			() =>
				new Worker(new URL('./fusion-chain.worker', import.meta.url), {
					type: 'module',
				}),
			input$
		).subscribe((data) => {
			let ret = JSON.parse(data)
			this.chainSource = new MatTableDataSource(ret.chains)
			this.combo = ret.combo
		})
	}

	//TODO: testing
	test(): void {
		/* this.demonControl.setValue('')
		this.levelControl.setValue('')
		this.skillControls[0].setValue('Regenerate 3')
		this.skillControls[1].setValue('Invigorate 3')
		this.skillControls[2].setValue('Die For Me!')
		this.skillControls[3].setValue('Spell Master')
		this.skillControls[4].setValue('Attack Master') */

		this.demonControl.setValue('')
		this.levelControl.setValue('37')
		this.skillControls[0].setValue('Miracle Punch')
		this.skillControls[1].setValue('Apt Pupil')
		this.skillControls[2].setValue('Attack Master')
	}
}
