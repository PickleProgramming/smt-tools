import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { P5WrapperComponent } from './components/p5-wrapper.component'
import { P5PersonaListComponent } from './components/p5-demon-list.component'
import { P5DemonEntryComponent } from './components/p5-demon-entry.component/p5-demon-entry.component'
import { P5SkillListComponent } from './components/p5-skill-list.component'
import { P5TablesComponent } from './components/p5-tables.component'
import { P5DemonBuilderComponent } from './components/p5-demon-builder/p5-demon-builder.component'
import { P5SettingsComponent } from './components/p5-settings.component'

const routes: Routes = [
	{
		path: '',
		component: P5WrapperComponent,
		children: [
			{
				path: 'personas',
				component: P5PersonaListComponent,
				title: 'P5 Persona List',
			},
			{
				path: 'personas/:demonName',
				component: P5DemonEntryComponent,
				title: 'P5 :demonName',
			},
			{
				path: 'skills',
				component: P5SkillListComponent,
				title: 'P5 Skill List',
			},
			{
				path: 'fusion-table',
				component: P5TablesComponent,
				title: 'P5 Fusion Table',
			},
			{
				path: 'demon-builder',
				component: P5DemonBuilderComponent,
				title: 'P5 Demon Builder',
			},
			{
				path: 'settings',
				component: P5SettingsComponent,
				title: 'P5 DLC Settings',
			},
		],
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class P5RoutingModule {}
