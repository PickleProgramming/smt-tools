import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { P5WrapperComponent } from './components/p5-wrapper/p5-wrapper.component'
import { P5PersonaListComponent } from './components/p5-persona-list/p5-persona-list.component'
import { P5PersonaEntryComponent } from './components/p5-persona-entry.component'
import { P5SkillListComponent } from './components/p5-skill-list.component'
import { P5FusionTableComponent } from './components/p5-fusion-table.component'
import { P5DemonBuilderComponent } from './components/p5-demon-builder.component'
import { P5SettingsComponent } from './components/p5-settings.component'

const routes: Routes = [
	{
		path: '',
		component: P5WrapperComponent,
		children: [
			{ path: 'personas', component: P5PersonaListComponent },
			{ path: 'personas/:demonName', component: P5PersonaEntryComponent },
			{ path: 'skills', component: P5SkillListComponent },
			{ path: 'fusion-table', component: P5FusionTableComponent },
			{ path: 'fusion-chain', component: P5DemonBuilderComponent },
			{ path: 'settings', component: P5SettingsComponent },
		],
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class P5RoutingModule {}
