import _ from 'lodash'
import { FusionTable, ElementTable } from './smt-tools.types'

/* Holds all the variables that are used to create each game view, except for the 
demon and skill data
@param fusionTable
  The games internal table of demon races, used in fusion calculation among a number of
  other things. normally found in [game]/data/fustion-table.json */
export abstract class TableConfig {
	demonCols: string[]
	statCols: string[]
	skillCols: string[]
	fusionTable: FusionTable
	elementTable?: ElementTable
	resistanceCols?: string[]
	affinityCols?: string[]
	inheritTypes?: string[][]
	inheritCols?: string[]

	constructor(fusionTable: FusionTable, elementTable?: ElementTable) {
		this.demonCols = ['race', 'level', 'name']
		this.statCols = ['St', 'Ma', 'Ag', 'Lu']
		this.skillCols = ['Element', 'Name', 'Cost', 'Effect', 'learnedBy']

		this.fusionTable = {
			races: fusionTable['races'],
			table: fusionTable['table'],
		}
		if (elementTable) {
			this.elementTable = {
				elems: elementTable['elems'],
				races: elementTable['races'],
				table: elementTable['table'],
			}
		}
	}
}
