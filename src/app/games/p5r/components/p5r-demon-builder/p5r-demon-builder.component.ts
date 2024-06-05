import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { P5RCompendium } from '@p5r/types/p5r-compendium'

import { DemonBuilderComponent } from '@shared/components/demon-builder/demon-builder.component'

import { P5R_COMPENDIUM } from '@shared/constants'
import { Skill, UserInput } from '@shared/types/smt-tools.types'
import _ from 'lodash'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

@Component({
	selector: 'app-p5r-demon-builder',
	templateUrl: './p5r-demon-builder.component.html',
	styleUrls: ['./p5r-demon-builder.component.scss', '../../p5r.scss'],
})
export class P5RDemonBuilderComponent extends DemonBuilderComponent {
	compendium: P5RCompendium

	protected declare traits: string[]
	/**
	 * Trait form entry
	 *
	 * @private
	 * @type {any}
	 */
	protected traitControl = new FormControl('')
	protected declare filteredTraits: Observable<string[]>

	constructor(protected router: Router) {
		super(router)
		this.compendium = P5R_COMPENDIUM
		this.worker = 'p5r'
		this.loadingIcon = 'assets/img/games/p5/p5-loading.gif'
	}
	ngOnInit(): void {
		super.ngOnInit()
		this.traits = Object.keys(this.compendium.traits)
		this.filteredTraits = this.traitControl.valueChanges.pipe(
			startWith(''),
			map((value) => this._filter(value || '', this.traits))
		)
	}
	/**
	 * Overrirde to add user specified trait as another skill in the UserInput
	 * object
	 *
	 * @inheritdoc {DemonBuilderComponent.getConfiguration}
	 * @see DemonBuilderComponent.getConfiguration
	 */
	getConfiguration(): UserInput {
		let inputSkills: string[] = []
		for (let skillControl of this.skillControls) {
			if (skillControl.value) inputSkills.push(skillControl.value)
		}
		// add trait as another skill
		if (this.traitControl.value) inputSkills.push(this.traitControl.value)
		_.reject('inputSkills', _.isEmpty)
		let level: number | null = null
		if (this.levelControl.value) level = +this.levelControl.value
		let data: UserInput = {
			demonName: this.demonControl.value,
			maxLevel: level,
			targetSkills: inputSkills,
		}
		return data
	}
}
