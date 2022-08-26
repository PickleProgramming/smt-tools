import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { P5PersonaListComponent } from './components/p5-persona-list/p5-persona-list.component';
import { P5SkillListComponent } from './components/p5-skill-list/p5-skill-list.component';
import { P5FusionChartComponent } from './components/p5-fusion-chart/p5-fusion-chart.component';
import { P5FusionSettingsComponent } from './components/p5-fusion-settings/p5-fusion-settings.component';
import { P5ShadowListComponent } from './components/p5-shadow-list/p5-shadow-list.component';
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
		path: 'fusion-chart',
		component: P5FusionChartComponent,
		data: {gameName: 'P5r'}
	},
	{
		path: 'shadow-list',
		component: P5ShadowListComponent,
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
