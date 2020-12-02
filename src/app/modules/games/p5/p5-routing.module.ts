import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { P5PersonaEntryComponent } from './components/p5-persona-entry/p5-persona-entry.component';

import { P5PersonaListComponent } from './components/p5-persona-list/p5-persona-list.component';

const routes: Routes = [
	{ path: '', redirectTo: 'personas', pathMatch: 'full' },
	{
		path: 'personas',
		component: P5PersonaListComponent,
		data: { gameName: 'p5r' }
	}
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class P5RoutingModule { }
