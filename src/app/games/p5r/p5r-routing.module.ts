import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { P5RWrapperComponent } from './components/p5r-wrapper.component'
import { P5RPersonaListComponent } from './components/p5r-demon-list.component'
import { P5RSettingsComponent } from './components/p5r-settings.component'
import { P5RSkillListComponent } from './components/p5r-skill-list.component'
import { P5RTablesComponent } from './components/p5r-tables.component'

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
				path: 'settings',
				component: P5RSettingsComponent,
				title: 'P5R Settings',
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
		],
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class P5RRoutingModule {}
