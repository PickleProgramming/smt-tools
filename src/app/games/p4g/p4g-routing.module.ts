import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { P4GPersonaEntryComponent } from './components/p4g-persona-entry.component'

const routes: Routes = [
	{ path: '', redirectTo: 'personas', pathMatch: 'full' },
	{
		path: 'personas',
		component: P4GPersonaEntryComponent,
		data: { gameName: 'p4gr' },
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class P4GRoutingModule {}
