import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { SMT4PersonaEntryComponent } from './components/smt4-demon-entry.component'

const routes: Routes = [
	{ path: '', redirectTo: 'demons', pathMatch: 'full' },
	{
		path: 'demons',
		component: SMT4PersonaEntryComponent,
		data: { gameName: 'smt4r' },
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SMT4RoutingModule {}
