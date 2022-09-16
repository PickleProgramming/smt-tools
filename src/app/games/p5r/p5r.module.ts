import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@shared/shared.module'

import { P5RRoutingModule } from '@p5r/p5r-routing.module'
import { P5RFusionChainComponent } from './components/p5r-fusion-chain.component'
import { P5RFusionTableComponent } from './components/p5r-fusion-table.component'
import { P5RPersonaEntryComponent } from './components/p5r-persona-entry.component'
import { P5RPersonaListComponent } from './components/p5r-persona-list.component'
import { P5RSettingsComponent } from './components/p5r-settings.component'
import { P5RSkillListComponent } from './components/p5r-skill-list.component'

@NgModule({
	declarations: [
		P5RPersonaListComponent,
		P5RFusionTableComponent,
		P5RSkillListComponent,
		P5RSettingsComponent,
		P5RPersonaEntryComponent,
		P5RFusionChainComponent,
	],
	imports: [P5RRoutingModule, CommonModule, SharedModule, RouterModule],
})
export class P5RModule {}
