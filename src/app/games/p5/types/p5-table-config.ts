import { TableConfig } from '@shared/types/table-config'

import FUSION_TABLE from '@p5/data/fusion-table.json'
import ELEMENT_TABLE from '@p5/data/element-table.json'
import INHERIT_DATA from '@p5/data/inheritance-types.json'

export class P5TableConfig extends TableConfig {
	constructor() {
		super(FUSION_TABLE, ELEMENT_TABLE)
		this.demonCols.push('inherits')
		this.statCols = ['St', 'Ma', 'En', 'Ag', 'Lu']
		this.demonCols = this.demonCols.concat(this.statCols)
		this.resistanceCols = [
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
		]
		this.demonCols = this.demonCols.concat(this.resistanceCols)
		this.inheritCols = INHERIT_DATA.elems
		this.skillCols.push('Skill Card')
	}
}
