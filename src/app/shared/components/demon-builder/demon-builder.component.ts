import { trigger, state, style, transition, animate } from '@angular/animations'
import {
	Component,
	Input,
	OnInit,
	AfterViewInit,
	ViewChild,
} from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { Compendium } from '@shared/types/compendium'
import { Observable, of, Subject } from 'rxjs'
import { map, startWith, takeUntil } from 'rxjs/operators'
import { fromWorker } from 'observable-webworker'
import _ from 'lodash'
import {
	FusionChain,
	ResultsMessage,
	InputChainData,
} from '@shared/types/smt-tools.types'
import { MatSort } from '@angular/material/sort'

@Component({
	selector: 'app-demon-builder',
	templateUrl: './demon-builder.component.html',
	styleUrls: ['./demon-builder.component.scss'],
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
export class DemonBuilderComponent implements OnInit, AfterViewInit {
	@Input() compendium!: Compendium
	@ViewChild(MatSort) sort!: MatSort

	declare skills: string[]
	declare demons: string[]
	declare filteredDemons: Observable<string[]>
	declare expandedChain: FusionChain
	declare directions: string[][]

	demonControl = new FormControl('')
	levelControl = new FormControl('')
	skillControls: FormControl[] = []
	filteredSkills: Observable<string[]>[] = []
	columnsToDisplay = ['result', 'cost', 'level', 'steps']
	chainSource = new MatTableDataSource<FusionChain>()
	combo: number = 0
	deep: boolean = false
	//when true, a progress spinner is rendered on the page
	calculating: boolean = false
	/* The web worker runs until the notifier subject emits any event,
	 letting us stop it whenever with notifier.next() */
	notifier = new Subject()
	/*if the worker detects an error to display to the user, it will be in this 
	variable*/
	userError = ''

	//TODO testing
	testing: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	testingControl = new FormControl('0')

	constructor() {}

	ngOnInit(): void {
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

	ngAfterViewInit(): void {
		this.chainSource.sort = this.sort
	}

	private _filter(value: string, list: string[]): string[] {
		let filterValue = value.toLocaleLowerCase()
		return list.filter((option) =>
			option.toLowerCase().includes(filterValue)
		)
	}

	/* Calls an observable-webworker to do the potenitally intensive 
		calculation in the background. We format our data in the InputData 
		interface and send it over using the from worker funcion,
		and read the data we recieved back with .subscribe().
		https://github.com/cloudnc/observable-webworker*/
	calculate() {
		this.userError = ''
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
		fromWorker<InputChainData, ResultsMessage>(
			() =>
				new Worker(new URL('./demon-builder.worker', import.meta.url), {
					type: 'module',
				}),
			input$
		)
			.pipe(takeUntil(this.notifier))
			.subscribe((data) => {
				if (data.error) {
					this.userError = data.error
				} else {
					if (data.combo == null || data.results == null) {
						this.calculating = false
						this.notifier.next()
						if (this.chainSource.data.length == 0) {
							if (this.userError == '') {
								this.userError =
									"There doesn't appear to be any simple recipes to create this persona, but it doesn't seem immediately impossible either. Try increasing the recursive depth and see if you find any results."
							}
						} else {
							this.userError = ''
						}
						return
					}
					this.combo = data.combo
					this.chainSource.data = data.results
				}
			})
	}

	stop() {
		this.notifier.next()
		this.calculating = false
	}

	reset() {
		this.stop()
		this.deep = false
		this.chainSource = new MatTableDataSource<FusionChain>()
		this.combo = 0
		this.demonControl.setValue('')
		this.levelControl.setValue('')
		for (let i of this.skillControls) i.setValue('')
		this.userError = ''
	}

	//TODO: testing
	test(): void {
		this.reset()
		if (!this.testingControl) return
		switch (+this.testingControl.value!) {
			//Special Fusion that requires recursive enabled
			case 1:
				this.skillControls[0].setValue('Regenerate 3')
				this.skillControls[1].setValue('Invigorate 3')
				this.skillControls[2].setValue('Die For Me!')
				this.skillControls[3].setValue('Spell Master')
				this.skillControls[4].setValue('Attack Master')
				return
			//Special fusion with easy solution
			case 2:
				this.demonControl.setValue('Neko Shogun')
				this.skillControls[0].setValue('Dekaja')
				return
			//Difficult high level fusion that doesn't require recursive
			case 3:
				this.skillControls[0].setValue('Life Aid')
				this.skillControls[1].setValue('Gigantomachia')
				this.skillControls[2].setValue('Arms Master')
				this.skillControls[3].setValue('Auto-Mataru')
				this.skillControls[4].setValue('Angelic Grace')
				return
			//Level specified possible fusion
			case 4:
				this.demonControl.setValue('Sandman')
				this.levelControl.setValue('26')
				this.skillControls[0].setValue('Pulinpa')
				this.skillControls[1].setValue('Confuse Boost')
				this.skillControls[2].setValue('Dodge Phys')
				this.skillControls[3].setValue('Sharp Student')
				return
			//fusion is impossible because level is too low
			case 5:
				this.levelControl.setValue('17')
				this.skillControls[0].setValue('Die For Me!')
				return
			//fusion is impossible because persona cant learn unique skill
			case 6:
				this.demonControl.setValue('Agathion')
				this.skillControls[0].setValue('Die For Me!')
				return
			//fusion is impossible becasue persona cant inherit type
			case 7:
				this.demonControl.setValue('Agathion')
				this.skillControls[0].setValue('Garu')
				return
			//fusion is impossible because persona cant inherit more than 4 skills
			case 8:
				this.demonControl.setValue('Sandman')
				this.levelControl.setValue('26')
				this.skillControls[0].setValue('Pulinpa')
				this.skillControls[1].setValue('Confuse Boost')
				this.skillControls[2].setValue('Dodge Phys')
				this.skillControls[3].setValue('Sharp Student')
				this.skillControls[4].setValue('Bufu')
				this.skillControls[5].setValue('Magaru')
				this.skillControls[6].setValue('Agi')
				this.skillControls[7].setValue('Garu')
				return
			//fusion is impossibe because persona is treasure demon
			case 9:
				this.demonControl.setValue('Hope Diamond')
				return
			//fusion is impossible because level is lower than skill level
			case 10:
				this.demonControl.setValue('Jack Frost')
				this.skillControls[0].setValue('Mabufula')
				return
			//easy mid level fusion
			default:
				this.levelControl.setValue('37')
				this.skillControls[0].setValue('Miracle Punch')
				this.skillControls[1].setValue('Mabufalu')
				this.skillControls[2].setValue('Attack Master')
				return
		}
	}
}
