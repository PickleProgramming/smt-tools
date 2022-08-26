import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PQ2PersonaEntryComponent } from './components/pq2-persona-entry.component';

const routes: Routes = [
	{ path: '', redirectTo: 'personas', pathMatch: 'full' },
	{
		path: 'personas',
		component: PQ2PersonaEntryComponent,
		data: {gameName: 'pq2'}
	}
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PQ2RoutingModule { }
