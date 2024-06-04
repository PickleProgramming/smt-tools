import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { P5RWrapperComponent } from './components/p5-wrapper/p5-wrapper.component'
import { P5RPersonaListComponent } from './components/p5-demon-list/p5-demon-list.component'
import { P5RDemonEntryComponent } from './components/p5-demon-entry.component/p5-demon-entry.component'
import { P5RSkillListComponent } from './components/p5-skill-list/p5-skill-list.component'
import { P5RTablesComponent } from './components/p5-tables/p5-tables.component'
import { P5RDemonBuilderComponent } from './components/p5-demon-builder/p5-demon-builder.component'
import { P5RSettingsComponent } from './components/p5-settings.component'

const routes: Routes = [
	{
		path: '',
		component: P5RWrapperComponent,
		children: [
			{
				path: 'personas',
				component: P5RPersonaListComponent,
				title: 'P5R Persona List',
			},
			{
				path: 'personas/:demonName',
				component: P5RDemonEntryComponent,
				title: 'P5R :demonName',
			},
			{
				path: 'skills',
				component: P5RSkillListComponent,
				title: 'P5R Skill List',
			},
			{
				path: 'fusion-table',
				component: P5RTablesComponent,
				title: 'P5R Fusion Table',
			},
			{
				path: 'demon-builder',
				component: P5RDemonBuilderComponent,
				title: 'P5R Demon Builder',
			},
			{
				path: 'settings',
				component: P5RSettingsComponent,
				title: 'P5R DLC Settings',
			},
		],
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class P5RoutingModule {}
