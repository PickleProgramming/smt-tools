import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { P5PersonaListComponent } from './components/p5-persona-list/p5-persona-list.component';
import { P5SkillListComponent } from './components/p5-skill-list/p5-skill-list.component';
import { P5FusionTableComponent } from './components/p5-fusion-table/p5-fusion-table.component';
import { P5FusionSettingsComponent } from './components/p5-fusion-settings/p5-fusion-settings.component';
import { P5PersonaEntryComponent } from './components/p5-persona-entry/p5-persona-entry.component';

const routes: Routes = [
	{ path: '', redirectTo: 'personas', pathMatch: 'full' },
	{
		path: 'personas',
		component: P5PersonaListComponent,
		data: {gameName: 'P5r'}
	},
	{
		path: 'skills',
		component: P5SkillListComponent,
		data: {gameName: 'P5r'}
	},
	{
		path: 'fusion-table',
		component: P5FusionTableComponent,
		data: {gameName: 'P5r'}
	},
	{
		path: 'fusion-settings',
		component: P5FusionSettingsComponent,
		data: {gameName: 'P5r'}
	},
	{
		path: 'personas/:demonName',
		component: P5PersonaEntryComponent
	}
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class P5RoutingModule { }
