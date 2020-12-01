export interface GameModels {
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