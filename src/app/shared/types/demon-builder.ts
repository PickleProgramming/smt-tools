import { Compendium } from './compendium'
import { FusionCalculator } from './fusion-calculator'
import _ from 'lodash'
import { Observable, Subscriber } from 'rxjs'
import { BuildMessage, Fusion, UserInput as UserInput } from './smt-tools.types'
import { DoWorkUnit } from 'observable-webworker'
import { BuildRecipe } from './build-recipe'

/**
 * Parent class for each game's demon builder implementation. The demon builder
 * is a feauture that will use a webworker to calculte a recipe of fusions that
 * will lead to a demon with properties specified by the use.
 *
 * @abstract
 * @class DemonBuilder
 * @typedef {DemonBuilder}
 * @export
 * @implements {DoWorkUnit<UserInput, BuildMessage>}
 */
export abstract class DemonBuilder
	implements DoWorkUnit<UserInput, BuildMessage>
{
	/**
	 * The compendium used by the demon builder. When extending this class, the
	 * compendium is usually from the same game the demon builder is for. But
	 * there may be exceptions for games like P4 and P4G and other such
	 * rereleases
	 *
	 * @type {Compendium}
	 * @protected
	 */
	protected compendium: Compendium
	/**
	 * The fusion calculator used by the demon builder. When extending this
	 * class, the fusion calculator is usually from the same game the demon
	 * builder is for. But there may be exceptions for games like P4 and P4G and
	 * other such rereleases
	 *
	 * @type {FusionCalculator}
	 * @protected
	 */
	protected calculator: FusionCalculator
	/**
	 * The max level of the demon as specified by the user.
	 *
	 * @type {number}
	 * @public
	 */
	public maxLevel = 99
	/**
	 * The depth the builder will go to checking for skills even if immediate
	 * sources don't have desired skills
	 *
	 * @type {number}
	 * @public
	 */
	public recurDepth = 1
	/**
	 * The maximum number of steps in a BuildRecipe
	 *
	 * @type {number}
	 * @public
	 */
	public maxBuildSteps = 20
	/**
	 * Keeps track of how many fusions have been attempted
	 *
	 * @type {number}
	 * @protected
	 */
	protected fuseCount = 0

	/**
	 * Creates an instance of DemonBuilder.
	 *
	 * @class
	 * @param {Compendium} compendium
	 * @param {FusionCalculator} calculator
	 */
	constructor(compendium: Compendium, calculator: FusionCalculator) {
		this.compendium = compendium
		this.calculator = calculator
	}

	/**
	 * The code to be run on the web worker. Emits a BuildMessage whenever it
	 * either calculates a succesful fusion, or attempts a fusion it determines
	 * is invalid.
	 *
	 * @abstract
	 * @param {UserInput} input User input specifying desired demon
	 * @returns {Observable<BuildMessage>} A stream of BuildMessages. If a
	 *   successful fusion was found the build message will have a new
	 *   BuildRecipe and a current fuseCount, other wise it will only have the
	 *   current fuseCount
	 * @throws {Error} If the user input is invalid
	 * @public
	 */
	public abstract workUnit(input: UserInput): Observable<BuildMessage>

	/**
	 * Attempts to create as many build recipes as possible that match the given
	 * parameters. If it finds possible fusions, it should emit them to the
	 * observable as it calculates them
	 *
	 * @remarks
	 *   This is more of a wrapper method that validates user input, and
	 *   determines which function is best used for calculation based on user
	 *   input
	 * @abstract
	 * @param {UserInput} input User input specifying desired demon
	 * @returns {Observable<BuildMessage>} A stream of BuildMessages. If a
	 *   successful fusion was found the build message will have a new
	 *   BuildRecipe and a current fuseCount, other wise it will only have the
	 *   current fuseCount
	 * @throws {Error} If the user input is invalid
	 * @protected
	 */
	protected abstract getBuildRecipes(
		input: UserInput
	): Observable<BuildMessage>

	/**
	 * Checks for any immediately obvious reasons that building the specified
	 * demon is impossible. Emit feedback to the DOM explaining why it is
	 * impossible.
	 *
	 * @remarks
	 *   Performs the same checks as isPossible, but where isPossible will return
	 *   false if a check is failed, isValid will throw an error
	 * @abstract
	 * @param {string[]} targetSkills Skills specified by the user
	 * @param {string | null} [demonName] Name of the demon specified by the
	 *   user
	 * @throws {Error} If the user input is invalid
	 * @protected
	 */
	protected abstract isValid(targetSkills: string[], demonName?: string): void

	/**
	 * A recursive ttempts to create a single build recipe that results in the
	 * specified demon with the specified skills. If it is unable to create a
	 * buildRecipe it will return null.
	 *
	 * @abstract
	 * @param {string[]} targetSkills List of skills for the final demon to
	 *   inherit
	 * @param {number} recursiveDepth An incremental number to keep track of the
	 *   number of times the function has called itself. should be 0 unless the
	 *   function is calling itself
	 * @param {string} demonName Name of the demon to fuse to
	 * @returns {BuildRecipe | null}
	 * @protected
	 */
	protected abstract getBuildRecipe(
		targetSkills: string[],
		recursiveDepth: number,
		demonName: string
	): BuildRecipe | null

	/**
	 * Checks the specified skills, and optionally demon, for any immediately
	 * obvious reason as to why it may be impossible.
	 *
	 * @remarks
	 *   Performs the same checks as isValid, but where isValid will throw an
	 *   error is any check is failed, isPossible will return false
	 * @abstract
	 * @param {string[]} skills List of skills to check
	 * @param {string | null} [demonName] Name of demon to check
	 * @returns {boolean} If the appears to be possible
	 * @protected
	 */
	protected abstract isPossible(
		targetSkills: string[],
		demonName?: string
	): boolean

	/**
	 * Determins if either of the given sources in the given fusion are capable
	 * of inheritting all of the target skills.
	 *
	 * @param {string[]} targetSkills Skills to check for
	 * @param {Fusion} fusion Fusion to check
	 * @returns {boolean} True if ANY of the sources can inherit all of the
	 *   skills
	 * @protected
	 */
	protected validSources(targetSkills: string[], fusion: Fusion): boolean {
		for (let sourceName of fusion.sources) {
			if (this.compendium.demons[sourceName].level > this.maxLevel) {
				return false
			}
		}
		if (!this.canSourcesInherit(targetSkills, fusion)) return false
		return true
	}

	/**
	 * Determines if any of the sources in the fusion can inherit all of the
	 * specified skills
	 *
	 * @private
	 * @param {string[]} targetSkills Skills to check for
	 * @param {Fusion} fusion Fusion to check
	 * @returns {boolean} Returns true if ANY of the sources can inherit ALL of
	 *   the skills
	 */
	private canSourcesInherit(targetSkills: string[], fusion: Fusion): boolean {
		for (let sourceName of fusion.sources) {
			if (this.isPossible(targetSkills, sourceName)) return true
		}
		return false
	}

	/**
	 * Gets the maximum number of a skills a demon can inherit in a given
	 * recipe.
	 *
	 * @param {Fusion} recipe Recipe to check
	 * @returns {number} The number of skills that can be inherited
	 * @protected
	 */
	protected getMaxNumOfInherittedSkills(recipe: Fusion): number {
		if (recipe.sources.length == 2) return 4
		if (recipe.sources.length >= 4) return 6
		return 5
	}

	/**
	 * Returns every combination of subarrays from the passed array
	 *
	 * @param {string[]} arr The arry to get the combinations for
	 * @returns {string[][]} A list of every combination of the array of all
	 *   lengths
	 * @protected
	 */
	protected getSubArrays(arr: string[]): string[][] {
		if (arr === undefined)
			throw new Error('getSubArrays called with undefined argument')
		if (arr.length === 1) return [arr]
		else {
			let subarr = this.getSubArrays(arr.slice(1))
			return subarr.concat(
				subarr.map((e) => e.concat(arr[0])),
				[[arr[0]]]
			)
		}
	}

	/**
	 * Checks to see if any of the demons in teh fusion exceed the max level
	 *
	 * @param {Fusion} recipe Fusion to check
	 * @returns {boolean} True if any of the demons exceed the max level
	 * @protected
	 */
	protected exceedsMaxLevel(recipe: Fusion): boolean {
		for (let sourceName of recipe.sources)
			if (this.compendium.demons[sourceName].level > this.maxLevel)
				return true
		return false
	}

	/**
	 * Checks the sources of a given recipe for the skills specifie
	 *
	 * @param {string[]} targetSkills Skills to check for
	 * @param {Fusion} recipe Recipe to check
	 * @returns {string[]} List of skills found
	 * @protected
	 */
	protected checkFusionSkills(
		targetSkills: string[],
		recipe: Fusion
	): string[] {
		let foundSkills: string[] = []
		for (let sourceName of recipe.sources) {
			let intersects = _.intersection(
				targetSkills,
				Object.keys(this.compendium.demons[sourceName].skills)
			)
			if (intersects.length > 0) {
				foundSkills = foundSkills.concat(intersects)
				foundSkills = _.uniq(foundSkills)
			}
		}
		return foundSkills
	}

	/**
	 * Gets the level of the highest level demon in the specified recipe
	 *
	 * @param {BuildRecipe} recipe Recipe to check
	 * @returns {number} Level of the highest level demon
	 * @protected
	 */
	protected levelRequired(recipe: BuildRecipe): number {
		let level = 0
		for (let fusion of recipe.fusions) {
			for (let demonName of fusion.sources)
				if (this.compendium.demons[demonName].level > level)
					level = this.compendium.demons[demonName].level
			if (this.compendium.demons[fusion.result].level > level)
				level = this.compendium.demons[fusion.result].level
		}
		return level
	}

	/**
	 * Calculates final properties for the recipe and emits it to the observable
	 *
	 * @param {Fusion} fission The sources for the final step
	 * @param {string[]} skills The skills found in the final step
	 * @param {string[]} innate The skills learned by the final demon naturally
	 * @param {Subscriber<BuildMessage>} sub The subscription to emit the chain
	 *   to
	 * @param {BuildRecipe | null} [build] The build recipe to add the step to.
	 *   If there is only one step, don't pass a build, this function will
	 *   create an empty one
	 * @protected
	 */
	protected emitBuild(
		fission: Fusion,
		skills: string[],
		innate: string[],
		sub: Subscriber<BuildMessage>,
		build?: BuildRecipe
	): void {
		this.fuseCount++
		if (!build) build = new BuildRecipe()
		build.addStep(fission, skills)
		build.finishBuild(innate, this.levelRequired(build))
		sub.next({
			build: build,
			fusionCounter: this.fuseCount,
		})
	}

	/**
	 * Increase the fusion counter and emit an update to the observable
	 *
	 * @param {Subscriber<BuildMessage>} sub The subscription to emit the
	 *   counter to
	 * @protected
	 */
	protected incCount(sub: Subscriber<BuildMessage>): void {
		sub.next({
			build: null,
			fusionCounter: this.fuseCount++,
		})
	}
}
