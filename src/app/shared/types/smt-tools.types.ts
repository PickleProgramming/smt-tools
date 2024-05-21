import { BuildRecipe } from './build-recipe'

/**
 * Holds several values specific to a game. The values are primarily used to
 * display the games tables properly, but also ocassionally get used for other
 * things.
 *
 * @typedef {TableConfig}
 * @export
 * @interface TableConfig
 */
export interface TableConfig {
	/**
	 * Specifies the fields of information to display in a table regarding
	 * demons. Ex. Level, Name, Race, etc.
	 *
	 * @type {string[]}
	 */
	demonCols: string[]
	/**
	 * Specifies the the stats of a demon to be displayed in the game
	 *
	 * @type {string[]}
	 */
	statCols: string[]
	/**
	 * Species the columns to be displayed in a games skills table
	 *
	 * @type {string[]}
	 */
	skillCols: string[]
	/**
	 * Holds information about a games fusion table
	 *
	 * @type {FusionTable}
	 */
	fusionTable: FusionTable
	/**
	 * Holds information about the games elemental demons, if present
	 *
	 * @type {ElementTable | null}
	 */
	elementTable?: ElementTable
	/**
	 * Specifies what columns should be show to represent a demons elemental
	 * weaknesses
	 *
	 * @type {?string[]}
	 */
	resistanceCols?: string[]
	/**
	 * Specifies what columns should be shown to represent a demon's affinity
	 *
	 * @type {?string[]}
	 */
	affinityCols?: string[]
	/**
	 * A table representing what demon inherit types can inherit what type of
	 * skills
	 *
	 * @type {?string[][]}
	 */
	inheritTypes?: string[][]
	/**
	 * Specifies what columns should be shown to represent a demon's inheritType
	 *
	 * @type {?string[]}
	 */
	inheritCols?: string[]
}

/**
 * Interface that stores the information necessary to populate Demon List tables
 * and calculate fusions
 *
 * @typedef {Demon}
 * @export
 * @interface Demon
 */
export interface Demon {
	/**
	 * The race of the demon
	 *
	 * @type {string}
	 */
	race: string
	/**
	 * The level the demon starts at
	 *
	 * @type {number}
	 */
	level: number
	/**
	 * The base stats of the demon. Parallel with the statCols array in a games
	 * tablceConfig
	 *
	 * @type {number[]}
	 */
	stats: number[]
	/**
	 * The resistances of the demon. Parallel with the resistanceCols in any
	 * games tableConfig
	 *
	 * @type {string}
	 */
	resistances: string
	/**
	 * A list of key-value pairs relating a skills name with the level this
	 * demon learns that skill at
	 *
	 * @type {{ [skill: string]: number }}
	 */
	skills: { [skill: string]: number }
	/**
	 * The estimated price to summon a demon
	 *
	 * @type {number | null}
	 */
	price?: number
	/**
	 * The inheritance type of a demon. Determines the elements of the skill it
	 * can inherit
	 *
	 * @type {string | null}
	 */
	inherits?: string
	/**
	 * TODO: From a game I haven't played yet
	 *
	 * @type {?number[]}
	 */
	affinities?: number[]
	/**
	 * TODO: From a game I haven't played yet
	 *
	 * @type {?number[]}
	 */
	estats?: number[]
	/**
	 * TODO: From a game I haven't played yet
	 *
	 * @type {string | null}
	 */
	area?: string
	/**
	 * The item the demon might drop from either being defeated or being
	 * executed
	 *
	 * @type {string | null}
	 */
	drop?: string
	/**
	 * If the demon can appear as an enemy in the game
	 *
	 * @type {boolean | null}
	 */
	isEnemy?: boolean
	/**
	 * TODO: From a game I haven't played yet
	 *
	 * @type {string | null}
	 */
	align?: string
}

/**
 * Interface that stores the info necessary to populate Skill List tables and
 * calculate build recipes
 *
 * @typedef {Skill}
 * @export
 * @interface Skill
 */
export interface Skill {
	/**
	 * Element of the skill
	 *
	 * @type {string}
	 */
	element: string
	/**
	 * The effect the skill has
	 *
	 * @type {string}
	 */
	effect: string
	/**
	 * List of key-value pairs containing what demons learn this skill related
	 * to the level they learn this skill
	 *
	 * @type {{ [demon: string]: number }}
	 */
	learnedBy: { [demon: string]: number }
	/**
	 * The cost of this skill. It's a string because the skill can either cost
	 * HP or SP
	 *
	 * @type {string}
	 */
	cost: string
	/**
	 * TODO: From a game I haven't played yet
	 *
	 * @type {string | null}
	 */
	target?: string
	/**
	 * TODO: From a game I haven't played yet
	 *
	 * @type {string | null}
	 */
	requires?: string
	/**
	 * TODO: From a game I haven't played yet
	 *
	 * @type {string | null}
	 */
	inherit?: string
	/**
	 * If the skill is unique to any demon, that name is stored here. Otherwise
	 * it is null
	 *
	 * @type {string | null}
	 */
	unique?: string
	/**
	 * If the skill can be obtained from a card, the name of the demon that can
	 * be executed to obtain that card is stored here
	 *
	 * @type {string | null}
	 */
	card?: string
	/**
	 * TODO: From a game I haven't played yet
	 *
	 * @type {?string[]}
	 */
	inheritFrom?: string[]
	/**
	 * Description placeholder
	 *
	 * @type {string | null}
	 */
	dSource?: string
	/**
	 * TODO: From a game I haven't played yet
	 *
	 * @type {string | null}
	 */
	transferable?: string
	/**
	 * TODO: From a game I haven't played yet
	 *
	 * @type {number | null}
	 */
	rank?: number
}

/**
 * Interface that keeps track of the demon races in a game as well as the table
 * that dictates their fusion
 *
 * @typedef {FusionTable}
 * @export
 * @interface FusionTable
 */
export interface FusionTable {
	/**
	 * Names of all the races in a game
	 *
	 * @type {string[]}
	 */
	races: string[]
	/**
	 * Table dictating what race combinations yield what races
	 *
	 * @type {string[][]}
	 */
	table: string[][]
}

/**
 * Interface that keeps track of the elemental races in a game as well as the
 * table that dictates their fusions with demons
 *
 * @typedef {ElementTable}
 * @export
 * @interface ElementTable
 */
export interface ElementTable {
	/**
	 * Names of the elemental demons in a game
	 *
	 * @type {string[]}
	 */
	elems: string[]
	/**
	 * Races of the elemental demons in a game
	 *
	 * @type {string[]}
	 */
	races: string[]
	/**
	 * A table that dictates the fusions of the elemental races
	 *
	 * @type {number[][]}
	 * @see {@link https://steamuserimages-a.akamaihd.net/ugc/1859450446890621672/17712F017BD86E86A33A3B96EA6AF1FEADFC7AAB/}
	 */
	table: number[][]
}

/**
 * Interface that stores a single fusion in the form of the fusion sources, the
 * resultant demon, and optionally the estimated cost of the fusion
 *
 * @typedef {Fusion}
 * @export
 * @interface Fusion
 */
export interface Fusion {
	/**
	 * A list containing the names of the source demons. Length 2 for normal
	 * fusions, length 3-5 for special fusions
	 *
	 * @type {string[]}
	 */
	sources: string[]
	/**
	 * The name of the resultant demon
	 *
	 * @type {string}
	 */
	result: string
	/**
	 * The estimated cost of the fusion
	 *
	 * @type {number | null}
	 */
	cost?: number
}

/**
 * User input take form the demon form. Should contain all information for the
 * demon builder to function. This is the object type passed to the webworker
 *
 * @typedef {UserInput}
 * @export
 * @interface UserInput
 */
export interface UserInput {
	/**
	 * Name of the demon to try to build.
	 *
	 * @type {string | null}
	 */
	demonName: string | null
	/**
	 * The maximum level that the resultant demons can be
	 *
	 * @type {number | null}
	 */
	maxLevel: number | null
	/**
	 * The skills to build specified by the user
	 *
	 * @type {string[]}
	 */
	targetSkills: string[]
}

/**
 * Type for the WebWorker to return to the demon-builder components
 *
 * @remarks
 *   This is the ONLY way you are going to get info out of the WebWorker, so if
 *   you need something more than this, you'll have to add it here.
 * @typedef {BuildMessage}
 * @export
 * @interface BuildMessage
 */
export interface BuildMessage {
	/**
	 * If not null, this is a sucessful build recipe the WebWorker calculated
	 *
	 * @type {BuildRecipe | null}
	 */
	build: BuildRecipe | null
	/**
	 * An update from the WebWorker on the number of fusions attempted
	 *
	 * @type {number}
	 */
	fuseCount: number
}
