/* Object that stores the information necessary to populate Demon List tables
    and calculate fusions  */
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

/* Object that stores the info necessary to populate Skill List tables
    and calculate fusion chaines
   @learnedBy can only be calculated with a demon list */
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

/* Object that keeps track of the demon races in a game as well as the table
    that dictates their fusion */
export interface FusionTable {
	races: string[]
	table: string[][]
}

/* Object that keeps track of the elemental races in a game as well as the table
    that dictates their fusions with demons */
export interface ElementTable {
	elems: string[]
	races: string[]
	table: number[][]
}

export interface Recipe {
	sources: string[]
	result: string
	cost?: number
}

/* Object that stores a chain of fusions to create a desired results, as well 
	as store directions to follow to create the result*/
export interface FusionChain {
	steps: Recipe[]
	cost: number
	inherittedSkills: string[][]
	innates: string[]
	level: number
	result: string
	directions: string[]
}

/*  Object that contains a series of fusion chains that are found based on 
	the user input. Sent to the DOM as a message via rxjs. Also contains a 
	series of reasons that certain fusions were impossible. If the results
	are empty, but the errors are not, the fusion the user asked for was 
	impossible. */
export interface ResultsMessage {
	results: FusionChain[] | null
	combo: number | null
	error: string | null
}

/* User input data taken from the demon form*/
export interface InputChainData {
	demonName: string | null
	level: number | null
	inputSkills: string[]
	deep: boolean
}

/* Interface to store the different values for each inividual game
	@property mainList - whether the game uses Demons or Personas
	@property otherLinks - all the links the game uses apart from the universal ones
	@property hasSettings - wether the game hase a settings link or not */
export interface GameView {
	game: string
	logo: string
	colors: Colors
	font: string
	mainList: string
	otherLinks: Link[]
}

export interface Colors {
	primary: string
	secondary: string
	text: string
}

export interface Link {
	title: string
	url: string
}
