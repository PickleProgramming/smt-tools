import { runWorker } from 'observable-webworker'
import { P5DemonBuilderWorker } from '@p5/components/p5-demon-builder/p5-demon-builder.worker'
import { BuildMessage, UserInput } from '@shared/types/smt-tools.types'
import { Observable, Subscriber } from 'rxjs'

/**
 * An extension of P5 Demon Builder to work with the new Trait feature in P5R.
 *
 * @class P5DemonBuilderWorker
 * @extends {DemonBuilder}
 * @typedef {P5DemonBuilderWorker}
 * @remark
 * Traits are treated as skills with an element of "trait" to distinguish them
 * from regular skills. So when checking for them I would just read through the
 * skills and find the only skill that had an element of "trait".
 *
 * @export
 */
export class P5RDemonBuilderWorker extends P5DemonBuilderWorker {
	/**
	 * ---WRAPPER METHODS---
	 *
	 * These methods will call the corresponding methods in the DEMON-NAME or
	 * NO-NAME methods depending on if the user supplied a demonName or not.
	 */
	protected getBuildRecipes(input: UserInput): Observable<BuildMessage> {
		return super.getBuildRecipes(input)
	}
	/**
	 * ---DEMON METHODS---
	 *
	 * These methods will be called when the user provides a demon name. All the
	 * methods do the same thing as stated in DemonBuilder, just with different
	 * arguments.
	 */
	protected demon_isValid(skills: string[], demonName: string): boolean {
		return super.demon_isValid(skills, demonName)
	}
	protected demon_getBuildRecipesShallow(
		targetSkills: string[],
		demonName: string,
		sub: Subscriber<BuildMessage>
	): void {}
	/**
	 * ---AGNOSTIC METHODS---
	 *
	 * These methods will work the same regardless of if the user provided demon
	 * name was provided or not.
	 */

	/**
	 * Returns the name of the specified demon's natural trait.
	 *
	 * @private
	 * @param {string} demonName The name of the demon to check
	 * @returns {string} Name of the trait
	 */
	private getTrait(demonName: string): string {
		let skills = this.compendium.demons[demonName].skills
		for (let skill of Object.keys(skills)) {
			if (this.compendium.skills[skill].element === 'trait') return skill
		}
		return ''
	}
}

runWorker(P5RDemonBuilderWorker)
