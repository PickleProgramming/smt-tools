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
import _, { round } from 'lodash'
import {
	BuildRecipe,
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
	@Input() declare compendium: Compendium
	@ViewChild(MatSort) declare sort: MatSort

	protected declare skills: string[]
	protected declare demons: string[]
	protected declare filteredDemons: Observable<string[]>
	protected declare expandedChain: BuildRecipe
	protected declare directions: string[][]

	//Variables for user form and typeahead
	protected demonControl = new FormControl('')
	protected levelControl = new FormControl('')
	protected skillControls: FormControl[] = []
	protected filteredSkills: Observable<string[]>[] = []

	//Variables for results table display
	protected columnsToDisplay = ['result', 'cost', 'level', 'fusions']
	protected buildsSource = new MatTableDataSource<BuildRecipe>()

	//Variables for demon-builder
	//keeps track of amount of fusions attempted by demon-builder
	protected combo: number = 0
	//configuration variable for demon-builder
	protected deep: boolean = false
	//when true, a progress spinner is rendered on the page
	protected calculating: boolean = false
	/* The web worker runs until the notifier subject emits any event,
	 letting us stop the web worker whenever with notifier.next() */
	protected notifier = new Subject()
	/*if the worker detects an error to display to the user, it will be in this 
	variable*/
	protected userError = ''
	/* variables that hold data regarding how long the webworker was running */
	protected startTime = 0
	protected endTime = 0
	protected deltaTime = 0

	constructor() {}
	ngOnInit(): void {
		//Facilitates type-ahead in the left form
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

	/**
	 * Supposed to faciliate table sorting, but I haven't got it to work yet
	 * with the expandable table
	 */
	ngAfterViewInit(): void {
		this.buildsSource.sort = this.sort
	}

	/**
	 * Calls an observable-webworker to do the potenitally intensive calculation
	 * in the background. We format our data in the InputData interface and send
	 * it over using the from worker funcion, and read the data we recieved back
	 * with .subscribe(). https://github.com/cloudnc/observable-webworker
	 */
	startWebWorker(): void {
		this.startTimer()
		this.userError = ''
		this.calculating = true

		let input$ = of(this.getConfiguration())
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
				}
				if (data.combo == null || data.results == null) {
					this.stopWebWorker()
					if (this.buildsSource.data.length == 0) {
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
				this.buildsSource.data = data.results
			})
	}

	/** Tells the webworker to stop */
	stopWebWorker() {
		this.stopTimer
		this.notifier.next()
		this.calculating = false
	}

	/** Clears out input from form fields and stops the webworker */
	resetDemonBuilder() {
		this.stopWebWorker()
		this.deep = false
		this.buildsSource = new MatTableDataSource<BuildRecipe>()
		this.combo = 0
		this.demonControl.setValue('')
		this.levelControl.setValue('')
		for (let i of this.skillControls) i.setValue('')
		this.userError = ''
	}

	/**
	 * Reads user data from form and builds InputChainData object accordingly
	 *
	 * @returns InputChainData built based on form to pass to webworker
	 */
	getConfiguration(): InputChainData {
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
		return data
	}

	/** Resets and starts the performance timer */
	startTimer(): void {
		this.startTime = performance.now()
		this.endTime = 0
		this.deltaTime = 0
	}
	/** Stops the performance time and updates variables with recorded time */
	stopTimer(): void {
		this.endTime = performance.now()
		this.deltaTime = round((this.endTime - this.startTime) / 1000, 3)
	}

	//TODO testing
	testing: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	testingControl = new FormControl('0')
	test(): void {
		this.resetDemonBuilder()
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
				this.skillControls[1].setValue('Mabufula')
				this.skillControls[2].setValue('Attack Master')
				return
		}
	}
}
