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

import { MatSort } from '@angular/material/sort'

import { Observable, Subject, of } from 'rxjs'
import { map, startWith, takeUntil } from 'rxjs/operators'
import _ from 'lodash'

import { BuildMessage, UserInput } from '@shared/types/smt-tools.types'
import { p5StartWebWorker } from './demon-builder.constansts'
import { BuildRecipe } from '@shared/types/build-recipe'

/**
 * Component that will display the user form for the demon-builder as well as
 * the results. Also creates the webworker that will be performing the
 * calculations
 *
 * @class DemonBuilderComponent
 * @typedef {DemonBuilderComponent}
 * @export
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
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
	/**
	 * The compendium from the game that should be used
	 *
	 * @type {Compendium}
	 */
	@Input() declare compendium: Compendium
	/**
	 * A string specifying the worker that should be used. Should be the
	 * abbreviation of the appropriate game, such as P5, P5R, P4, etc.
	 *
	 * @type {string}
	 */
	@Input() declare worker: string
	/**
	 * Angular material table sorting/filter
	 *
	 * @type {MatSort}
	 */
	@ViewChild(MatSort) declare sort: MatSort

	/**
	 * TODO: What?
	 *
	 * @type {string[]}
	 * @protected
	 */
	protected declare skills: string[]
	/**
	 * TODO: What?
	 *
	 * @type {string[]}
	 * @protected
	 */
	protected declare demons: string[]
	/**
	 * Obversable to facilitate filtering within the results table
	 *
	 * @type {Observable<string[]>}
	 * @protected
	 */
	protected declare filteredDemons: Observable<string[]>
	/**
	 * TODO: What?
	 *
	 * @type {BuildRecipe}
	 * @protected
	 */
	protected declare expandedRecipe: BuildRecipe
	/**
	 * TODO: What?
	 *
	 * @type {string[][]}
	 * @protected
	 */
	protected declare directions: string[][]

	//Variables for user form and typeahead
	/**
	 * Demon name form entry
	 *
	 * @type {any}
	 * @protected
	 */
	protected demonControl = new FormControl('')
	/**
	 * Level form entry
	 *
	 * @type {any}
	 * @protected
	 */
	protected levelControl = new FormControl('')
	/**
	 * List of the skill form entries
	 *
	 * @type {FormControl[]}
	 * @protected
	 */
	protected skillControls: FormControl[] = []
	/**
	 * Recursive depth form entry
	 *
	 * @type {any}
	 * @protected
	 */
	protected recurDepthControl = new FormControl('')
	/**
	 * Used for type ahead. observable that emits a list of filtered skills
	 * based on what the user has already typed.
	 *
	 * @type {Observable<string[]>[]}
	 * @protected
	 */
	protected filteredSkills: Observable<string[]>[] = []

	//Variables for results table display
	/**
	 * List of the columns that are displayed in a results entry
	 *
	 * @type {{}}
	 * @protected
	 */
	protected columnsToDisplay = ['result', 'cost', 'level', 'fusions']
	/**
	 * Angular material data source for the results table
	 *
	 * @type {any}
	 * @protected
	 */
	protected buildsSource = new MatTableDataSource<BuildRecipe>()

	//---Variables for demon-builder---
	/**
	 * Subject that will tell the webworker to stop when it emits anything
	 *
	 * @type {any}
	 * @protected
	 */
	protected notify = new Subject<null>()
	//keeps track of amount of fusions attempted by demon-builder
	/**
	 * The number of fusions that have been attempted by the web worker
	 *
	 * @type {number}
	 * @protected
	 */
	protected fuseCount: number = 0
	/**
	 * Specifies the depth the builder will go to even if there are no immediate
	 * skills in sources
	 *
	 * @type {number}
	 * @protected
	 */
	protected recurDepth = 0
	/**
	 * When true, a progress spinner is rendered on the page
	 *
	 * @type {boolean}
	 * @protected
	 */
	protected calculating: boolean = false
	/**
	 * If the worker detects an error to display to the user, it will be in this
	 * variable
	 *
	 * @type {string}
	 * @protected
	 */
	protected userError = ''
	/**
	 * Variables that hold data regarding how long the webworker was running
	 *
	 * @type {number}
	 * @protected
	 */
	protected startTime = 0
	protected endTime = 0
	protected deltaTime = 0

	/**
	 * Creates an instance of DemonBuilderComponent.
	 *
	 * @class
	 */
	constructor() {}
	/** Description placeholder */
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
	/**
	 * Description placeholder
	 *
	 * @private
	 * @param {string} value
	 * @param {string[]} list
	 * @returns {string[]}
	 */
	private _filter(value: string, list: string[]): string[] {
		let filterValue = value.toLocaleLowerCase()
		return list.filter((option) =>
			option.toLowerCase().includes(filterValue)
		)
	}

	//TODO: supposed to faciliate table sorting, but I haven't got it to work yet with the expandable table
	/** Description placeholder */
	ngAfterViewInit(): void {
		this.buildsSource.sort = this.sort
	}

	/**
	 * Calls an observable-webworker to do the potenitally intensive calculation
	 * in the background. We format our data in the InputData interface and send
	 * it over using the from worker funcion, and read the data we recieved back
	 * with .subscribe().
	 *
	 * @see {@link https://github.com/cloudnc/observable-webworker}
	 */
	startWebWorker(): void {
		this.startTimer()
		this.clearResults()
		this.userError = ''
		this.calculating = true
		let input$ = of(this.getConfiguration())
		this.getWebWorkerFunc(this.worker, input$)
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

	/**
	 * Called when the webworker uses next()
	 *
	 * @param {BuildMessage} data
	 */
	subNext(data: BuildMessage): void {
		if (data.fuseCount - this.fuseCount >= 1000) {
			this.fuseCount = data.fuseCount
		}
		if (data.build) {
			this.buildsSource.data.push(data.build)
			//forces table to rerender
			this.buildsSource.data = this.buildsSource.data
		}
	}

	/**
	 * - Called when the webworker uses throws an error
	 *
	 * @param {Error} error
	 */
	subError(error: Error): void {
		this.userError = error.message.replace('Uncaught Error: ', '')
		this.stopWebWorker()
	}

	/** Called when the webworker uses complete() */
	subComplete(): void {
		this.stopWebWorker()
		if (this.buildsSource.data.length == 0 && this.userError == '') {
			this.userError =
				"There doesn't appear to be any simple recipes to create this persona, but it doesn't seem immediately impossible either. Try increasing the recursive depth and see if you find any results."
		}
	}

	/**
	 * Retrieves the function that calls the webworker using the appropriate
	 * game.
	 *
	 * @remarks
	 *   Because of how webpack creates webworkers, it is impossible to create a
	 *   webworker using a variable. We MUST pass the path to the webworker as
	 *   an explicit string within the argument. Thus, instead of one function
	 *   that can call any webworker, we need one function for each game
	 *   individually. This is a wrapper function that calls one of these
	 *   functions, defined in ./demon-builder.constants.ts, based on the games
	 *   abbreviation.
	 * @param {string} game
	 * @param {Observable<UserInput>} input$
	 * @returns {Observable<BuildMessage>}
	 */
	getWebWorkerFunc(
		game: string,
		input$: Observable<UserInput>
	): Observable<BuildMessage> {
		switch (game) {
			case 'p5':
				return p5StartWebWorker(input$)
			default:
				throw new Error(
					'Game ${game} does not have a webworker function implemented in demon-builder.constants.ts'
				)
		}
	}

	/** Tells the webworker to stop */
	stopWebWorker(): void {
		this.stopTimer()
		this.calculating = false
		this.notify.next()
	}

	/** Clears out input from form fields and stops the webworker */
	resetDemonBuilder(): void {
		this.stopWebWorker()
		this.clearResults()
		this.recurDepth = 0
		this.fuseCount = 0
		this.demonControl.setValue('')
		this.levelControl.setValue('')
		this.recurDepthControl.setValue('')
		for (let i of this.skillControls) i.setValue('')
		this.userError = ''
	}

	/** Clears output from the results table */
	clearResults(): void {
		this.buildsSource = new MatTableDataSource<BuildRecipe>()
		this.fuseCount = 0
		this.recurDepth = 0
	}

	/**
	 * Reads user data from form and builds UserInput object accordingly
	 *
	 * @returns {UserInput} Built based on form to pass to webworker
	 */
	getConfiguration(): UserInput {
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
		let data: UserInput = {
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
