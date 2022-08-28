/* Interface to store the different values for each inividual game
	@property mainList - whether the game uses Demons or Personas
	@property otherLinks - all the links the game uses apart from the universal ones
	@property hasSettings - wether the game hase a settings link or not 
	TODO: integrate settings link into otherLinks  */
export interface GameView {
	game: string
	abbrv: string
	logo: string
	colors: Colors
	font: string
	mainList: string
	otherLinks: Link[]
	hasSettings: boolean
}

export interface Colors{
	primary: string
	secondary: string
	text: string
}

export interface Link{
	title: string
	url: string
}