import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { P5RPersonaEntryComponent } from './components/p5r-persona-entry.component'

const routes: Routes = [
	{ path: '', redirectTo: 'personas', pathMatch: 'full' },
	{
		path: 'personas',
		component: P5RPersonaEntryComponent,
		data: { gameName: 'p5r' },
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class P5RRoutingModule {}
