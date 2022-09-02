import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { P5PersonaListComponent } from './components/p5-persona-list.component'
import { P5SkillListComponent } from './components/p5-skill-list.component'
import { P5FusionTableComponent } from './components/p5-fusion-table.component'
import { P5SettingsComponent } from './components/p5-settings.component'
import { P5PersonaEntryComponent } from './components/p5-persona-entry.component'
import { P5FusionChainComponent } from './components/p5-fusion-chain.component'

const routes: Routes = [
	{ path: '', redirectTo: 'personas', pathMatch: 'full' },
	{
		path: 'personas',
		component: P5PersonaListComponent,
		data: { gameName: 'p5' },
	},
	{
		path: 'skills',
		component: P5SkillListComponent,
		data: { gameName: 'p5' },
	},
	{
		path: 'fusion-table',
		component: P5FusionTableComponent,
		data: { gameName: 'p5' },
	},
	{
		path: 'fusion-chain',
		component: P5FusionChainComponent,
		data: { gamename: 'p5' },
	},
	{
		path: 'fusion-chain/:chainName',
		component: P5FusionChainComponent,
	},
	{
		path: 'settings',
		component: P5SettingsComponent,
		data: { gameName: 'p5' },
	},
	{
		path: 'personas/:demonName',
		component: P5PersonaEntryComponent,
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class P5RoutingModule {}
