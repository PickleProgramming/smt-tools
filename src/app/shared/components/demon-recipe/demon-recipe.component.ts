import { Component, Input } from '@angular/core'
import { BuildRecipe } from '@shared/types/build-recipe'
import { Compendium } from '@shared/types/compendium'

@Component({
	selector: 'app-demon-recipe',
	templateUrl: './demon-recipe.component.html',
})
export class DemonRecipeComponent {
	@Input() declare build: BuildRecipe
	@Input() declare compendium: Compendium
	@Input() declare demonEntryPrefix: string

	constructor() {}
}
