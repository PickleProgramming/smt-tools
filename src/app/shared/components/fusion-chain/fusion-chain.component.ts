import { trigger, state, style, transition, animate } from '@angular/animations'
import { Component, Input, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { Compendium } from '@shared/types/compendium'
import { Observable, Subscription, of } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { fromWorker } from 'observable-webworker'
import _ from 'lodash'
import {
	FusionChain,
	ChainMessage,
	InputChainData,
} from '@shared/types/smt-tools.types'

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

	chainSource = new MatTableDataSource<FusionChain>()
	chainSub?: Subscription
	combo: number = 0
	deep: boolean = false
	calculating: boolean = false

	//TODO testing
	testing: number[] = [0, 1]
	testingControl = new FormControl('0')

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

	/* Calls an observable-webworker to do the potenitally intensive 
		calculation in the background. We format our data in the InputData 
		interface defined in ./fusion-chain-worker and send it over using the 
		from worker funcion, and read the data we recieved back with .subscribe()
		https://github.com/cloudnc/observable-webworker*/
	calculate() {
		this.calculating = true
		let inputSkills: string[] = []
		for (let skillControl of this.skillControls) {
			if (skillControl.value) inputSkills.push(skillControl.value)
		}
		_.reject('inputSkills', _.isEmpty)
		let level: number | null = null
		if (this.levelControl.value) level = +this.levelControl.value
		let data: InputChainData = {
			demonName: this.demonControl.value,
			level: level,
			inputSkills: inputSkills,
			deep: this.deep,
		}
		let input$ = of(data)
		this.chainSub = fromWorker<InputChainData, ChainMessage>(
			() =>
				new Worker(new URL('./fusion-chain.worker', import.meta.url), {
					type: 'module',
				}),
			input$
		).subscribe((data) => {
			this.chainSource.data = data.chains
			this.combo = data.combo
		})
	}

	stop() {
		this.chainSub?.unsubscribe()
		this.calculating = false
	}

	reset() {
		this.stop()
		this.demonControl.setValue('')
		this.levelControl.setValue('')
		for (let i of this.skillControls) i.setValue('')
		this.chainSource = new MatTableDataSource<FusionChain>()
		this.combo = 0
		this.deep = false
	}

	//TODO: testing
	test(): void {
		this.reset()
		if (!this.testingControl) return
		switch (+this.testingControl.value!) {
			case 1:
				this.skillControls[0].setValue('Regenerate 3')
				this.skillControls[1].setValue('Invigorate 3')
				this.skillControls[2].setValue('Die For Me!')
				this.skillControls[3].setValue('Spell Master')
				this.skillControls[4].setValue('Attack Master')
				return
			default:
				this.levelControl.setValue('37')
				this.skillControls[0].setValue('Miracle Punch')
				this.skillControls[1].setValue('Apt Pupil')
				this.skillControls[2].setValue('Attack Master')
				return
		}
	}
}
