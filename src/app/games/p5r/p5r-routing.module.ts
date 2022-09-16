import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { P5RPersonaListComponent } from '@p5r/components/p5r-persona-list.component'
import { P5RSkillListComponent } from '@p5r/components/p5r-skill-list.component'
import { P5RFusionTableComponent } from '@p5r/components/p5r-fusion-table.component'
import { P5RSettingsComponent } from '@p5r/components/p5r-settings.component'
import { P5RPersonaEntryComponent } from '@p5r/components/p5r-persona-entry.component'
import { P5RFusionChainComponent } from '@p5r/components/p5r-fusion-chain.component'

const routes: Routes = [
	{ path: '', redirectTo: 'personas', pathMatch: 'full' },
	{
		path: 'personas',
		component: P5RPersonaListComponent,
	},
	{
		path: 'personas/:demonName',
		component: P5RPersonaEntryComponent,
	},
	{
		path: 'skills',
		component: P5RSkillListComponent,
	},
	{
		path: 'fusion-table',
		component: P5RFusionTableComponent,
	},
	{
		path: 'fusion-chain',
		component: P5RFusionChainComponent,
	},
	{
		path: 'settings',
		component: P5RSettingsComponent,
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class P5RRoutingModule {}
