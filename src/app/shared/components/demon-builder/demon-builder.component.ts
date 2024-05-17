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
import { Observable, of } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { fromWorkerPool } from 'observable-webworker'
import _ from 'lodash'
import { BuildRecipe, InputChainData } from '@shared/types/smt-tools.types'
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
	@Input() declare workerLocation: string
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
	protected recurDepthControl = new FormControl('')
	protected filteredSkills: Observable<string[]>[] = []

	//Variables for results table display
	protected columnsToDisplay = ['result', 'cost', 'level', 'fusions']
	protected buildsSource = new MatTableDataSource<BuildRecipe>()

	//---Variables for demon-builder---
	//keeps track of amount of fusions attempted by demon-builder
	protected fusionCounter: number = 0
	/* how much depth the builder will go to even if there are no 
		immediate skills in sources */
	protected recurDepth = 0
	//when true, a progress spinner is rendered on the page
	protected calculating: boolean = false
	/*if the worker detects an error to display to the user, it will be in this 
	variable*/
	protected userError = ''
	/* variables that hold data regarding how long the webworker was running */
	protected startTime = 0
	protected endTime = 0
	protected deltaTime = 0

	constructor() {}
	ngOnInit(): void {
		if (!this.workerLocation) {
			throw new Error('No worker location provided')
		}
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
		this.clearResults()
		this.userError = ''
		this.calculating = true

		let input$ = of(this.getConfiguration())
		fromWorkerPool<InputChainData, BuildRecipe>(
			() =>
				new Worker(
					//TODO wwwwhyyyyyyy do I need this
					// if I use a variable, even if its the EXACT string
					// it still won't be able to find it
					// something to do with the second argument?
					new URL('./p5-demon-builder.worker', import.meta.url),
					{
						type: 'module',
					}
				),
			input$
		).subscribe({
			next: (data) => {
				if (!data) {
					if (this.userError == '') {
						this.userError =
							"There doesn't appear to be any simple recipes to create this persona, but it doesn't seem immediately impossible either. Try increasing the recursive depth and see if you find any results."
					}
				} else {
					this.userError = ''
					this.buildsSource.data.push(data)
				}
			},
			error: (error) => {},
			complete: () => {
				this.stopWebWorker()
			},
		})
	}

	/** Tells the webworker to stop */
	stopWebWorker() {
		this.stopTimer()
		this.calculating = false
	}

	/** Clears out input from form fields and stops the webworker */
	resetDemonBuilder() {
		this.stopWebWorker()
		this.clearResults()
		this.recurDepth = 1
		this.fusionCounter = 0
		this.demonControl.setValue('')
		this.levelControl.setValue('')
		for (let i of this.skillControls) i.setValue('')
		this.userError = ''
	}

	/** Clears output from the results table */
	clearResults() {
		this.buildsSource = new MatTableDataSource<BuildRecipe>()
		this.fusionCounter = 0
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
		if (!this.recurDepthControl.value) {
			this.recurDepth = 0
		} else {
			this.recurDepth = parseInt(this.recurDepthControl.value)
		}
		_.reject('inputSkills', _.isEmpty)
		let level: number | null = null
		if (this.levelControl.value) level = +this.levelControl.value
		let data: InputChainData = {
			demonName: this.demonControl.value,
			maxLevel: level,
			targetSkills: inputSkills,
			recurDepth: this.recurDepth,
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
		this.deltaTime = (this.endTime - this.startTime) / 1000
	}

	enterTestData(): void {
		this.test2Data()
	}
	private maraTestData(): void {
		this.demonControl.setValue('Mara')
		this.skillControls[0].setValue('Absorb Fire')
		this.skillControls[1].setValue('Regenerate 1')
		this.skillControls[2].setValue('Invigorate 1')
		this.skillControls[3].setValue('Growth 1')
		this.recurDepthControl.setValue('1')
	}
	private nekoTestData(): void {
		this.demonControl.setValue('Neko Shogun')
		this.skillControls[0].setValue('Dekaja')
	}
	private test1Data(): void {
		this.skillControls[0].setValue('Arms Master')
		this.skillControls[1].setValue('Life Aid')
		this.skillControls[2].setValue('Gigantomachia')
	}
	private test2Data(): void {
		this.demonControl.setValue('Mara')
		this.skillControls[0].setValue('Absorb Fire')
		this.skillControls[1].setValue('Mapsio')
		this.skillControls[2].setValue('Diarahan')
	}
}
