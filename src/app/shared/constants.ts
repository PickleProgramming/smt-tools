import { TableConfig } from './types/smt-tools.types'

import { P5Compendium } from '@p5/types/p5-compendium'
import { P5FusionCalculator } from '@p5/types/p5-fusion-calculator'

import P5_DEMON_DATA from '@p5/data/demon-data.json'
import P5_SKILL_DATA from '@p5/data/skill-data.json'
import P5_SPECIAL_RECIPES from '@p5/data/special-recipes.json'
import P5_DLC_DATA from '@p5/data/dlc-data.json'
import P5_INHERIT_DATA from '@p5/data/inheritance-types.json'
import P5_FUSION_TABLE from '@p5/data/fusion-table.json'
import P5_ELEMENT_TABLE from '@p5/data/element-table.json'

/* import P5R_DEMON_DATA from '@p5r/data/demon-data.json'
import P5R_SKILL_DATA from '@p5r/data/skill-data.json'
import P5R_SPECIAL_RECIPES from '@p5r/data/special-recipes.json'
import P5R_DLC_DATA from '@p5r/data/dlc-data.json'
import P5R_FUSION_TABLE from '@p5r/data/fusion-table.json'
import P5R_ELEMENT_TABLE from '@p5r/data/element-table.json' */

// -- Persona 5 --
export const P5_COMPENDIUM: P5Compendium = new P5Compendium(
	P5_DEMON_DATA,
	P5_SKILL_DATA,
	P5_FUSION_TABLE,
	P5_SPECIAL_RECIPES,
	P5_DLC_DATA,
	P5_ELEMENT_TABLE,
	P5_INHERIT_DATA
)
export const P5_TABLE_CONFIG: TableConfig = {
	demonCols: ['race', 'level', 'name', 'inherits'],
	statCols: ['St', 'Ma', 'En', 'Ag', 'Lu'],
	skillCols: ['Element', 'Name', 'Cost', 'Effect', 'learnedBy', 'skillCard'],
	fusionTable: P5_FUSION_TABLE,
	elementTable: P5_ELEMENT_TABLE,
	resistanceCols: [
		'Phys',
		'Gun',
		'Fire',
		'Ice',
		'Elec',
		'Wind',
		'Psy',
		'Nuke',
		'Bless',
		'Curse',
	],
	inheritCols: P5_INHERIT_DATA.elems,
}
export const P5_FUSION_CALCULATOR: P5FusionCalculator = new P5FusionCalculator()

// -- Persona 5 Royal --
/* export const P5R_COMPENDIUM: P5Compendium = new P5Compendium(
	P5R_DEMON_DATA,
	P5R_SKILL_DATA,
	P5R_FUSION_TABLE,
	P5R_SPECIAL_RECIPES,
	P5R_DLC_DATA,
	P5R_ELEMENT_TABLE,
	P5_INHERIT_DATA
)
export const P5R_TABLE_CONFIG: TableConfig = {
	demonCols: ['race', 'level', 'name', 'inherits'],
	statCols: ['St', 'Ma', 'En', 'Ag', 'Lu'],
	skillCols: ['Element', 'Name', 'Cost', 'Effect', 'learnedBy', 'skillCard'],
	fusionTable: P5R_FUSION_TABLE,
	elementTable: P5R_ELEMENT_TABLE,
	resistanceCols: [
		'Phys',
		'Gun',
		'Fire',
		'Ice',
		'Elec',
		'Wind',
		'Psy',
		'Nuke',
		'Bless',
		'Curse',
	],
	inheritCols: P5_INHERIT_DATA.elems,
} */
