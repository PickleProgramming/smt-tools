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
import { Observable, Subject, of } from 'rxjs'
import { delay, map, repeat, startWith, takeUntil } from 'rxjs/operators'
import { fromWorkerPool } from 'observable-webworker'
import _ from 'lodash'
import {
	BuildMessage,
	BuildRecipe,
	InputChainData,
} from '@shared/types/smt-tools.types'
import { MatSort } from '@angular/material/sort'
import { p5StartWebWorker } from './demon-builder.constansts'

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
	protected recurDepthControl = new FormControl('')
	protected filteredSkills: Observable<string[]>[] = []

	//Variables for results table display
	protected columnsToDisplay = ['result', 'cost', 'level', 'fusions']
	protected buildsSource = new MatTableDataSource<BuildRecipe>()

	//---Variables for demon-builder---
	//observable that will tell the webworker to stop by emitting anything
	protected notify = new Subject<null>()
	//keeps track of amount of fusions attempted by demon-builder
	protected fusionCounter: number = 0
	//how much depth the builder will go to even if there are no immediate skills in sources
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

	//TODO: supposed to faciliate table sorting, but I haven't got it to work yet with the expandable table
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
		p5StartWebWorker(input$)
			.pipe(takeUntil(this.notify))
			.subscribe({
				next: (data) => {
					this.subNext(data)
				},
				error: (error) => {
					this.subError(error)
				},
				complete: () => {
					this.subComplete()
				},
			})
	}

	subNext(data: BuildMessage) {
		if (data.fusionCounter - this.fusionCounter >= 1000) {
			this.fusionCounter = data.fusionCounter
		}
		if (data.build) {
			this.buildsSource.data.push(data.build)
			//forces table to rerender
			this.buildsSource.data = this.buildsSource.data
		}
	}

	subError(error: Error) {
		this.userError = error.message.replace('Uncaught Error: ', '')
		this.stopWebWorker()
	}

	subComplete() {
		this.stopWebWorker()
		if (this.buildsSource.data.length == 0 && this.userError == '') {
			this.userError =
				"There doesn't appear to be any simple recipes to create this persona, but it doesn't seem immediately impossible either. Try increasing the recursive depth and see if you find any results."
		}
	}

	/** Tells the webworker to stop */
	stopWebWorker() {
		this.stopTimer()
		this.calculating = false
		this.notify.next()
	}

	/** Clears out input from form fields and stops the webworker */
	resetDemonBuilder() {
		this.stopWebWorker()
		this.clearResults()
		this.recurDepth = 0
		this.fusionCounter = 0
		this.demonControl.setValue('')
		this.levelControl.setValue('')
		this.recurDepthControl.setValue('')
		for (let i of this.skillControls) i.setValue('')
		this.userError = ''
	}

	/** Clears output from the results table */
	clearResults() {
		this.buildsSource = new MatTableDataSource<BuildRecipe>()
		this.fusionCounter = 0
		this.recurDepth = 0
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
}
