/**
 * Interface that stores the information necessary to populate Demon List tables
 * and calculate fusions
 */
export interface Demon {
	race: string
	level: number
	stats: number[]
	resistances: string
	skills: { [skill: string]: number }
	price?: number
	inherits?: string
	affinities?: number[]
	estats?: number[]
	area?: string
	drop?: string
	isEnemy?: boolean
	align?: string
}

/**
 * Interface that stores the info necessary to populate Skill List tables and
 * calculate fusion chaines
 *
 * @property learnedBy Can only be calculated with a demon list
 */
export interface Skill {
	element: string
	effect: string
	learnedBy: { [demon: string]: number }
	cost: string
	target?: string
	requires?: string
	inherit?: string
	unique?: string
	card?: string
	inheritFrom?: string[]
	dSource?: string
	transferable?: string
	rank?: number
}

/**
 * Interface that keeps track of the demon races in a game as well as the table
 * that dictates their fusion
 */
export interface FusionTable {
	races: string[]
	table: string[][]
}

/**
 * Interface that keeps track of the elemental races in a game as well as the
 * table that dictates their fusions with demons
 */
export interface ElementTable {
	elems: string[]
	races: string[]
	table: number[][]
}

/**
 * Interface that stores a single fusion in the form of the fusion sources, the
 * resultant demon, and optionally the estimated cost of the fusion
 */
export interface Fusion {
	sources: string[]
	result: string
	cost?: number
}

/**
 * Interface that stores a chain of fusions to create a desired results, as well
 * as store directions to follow to create the result
 *
 * @property fusions A list of fusions that will result in the resultant demon
 * @property cost Estimated cost of fusing all the demons
 * @property inherittedSkills A list parallel to steps that specificies what
 *   skills should be inheritted at each step
 * @property innates Skills that the resultant demon will be able to learn by
 *   leveling up
 * @property level The default level of the resultant demon
 * @property result The name of the resultant demon
 * @property directions A list of strings that tell the user how to follow the
 *   fusion chain in plain english. This is what is meant to be displayed on the
 *   webpage
 */
export interface BuildRecipe {
	fusions: Fusion[]
	cost: number
	inherittedSkills: string[][]
	innates: string[]
	level: number
	result: string
	directions: string[]
}

/**
 * Interface that contains a series of fusion chains that are found based on the
 * user input. Sent to the DOM as a message via rxjs. Also contains a series of
 * reasons that certain fusions were impossible. If the results are empty, but
 * the errors are not, the fusion the user asked for was impossible.
 */
export interface ResultsMessage {
	results: BuildRecipe[] | null
	combo: number | null
	error: string | null
}

/** User input data taken from the demon form */
export interface InputChainData {
	demonName: string | null
	level: number | null
	inputSkills: string[]
	recurDepth: number
}
