import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { P3PPersonaEntryComponent } from './components/p3p-persona-entry.component'

const routes: Routes = [
	{ path: '', redirectTo: 'personas', pathMatch: 'full' },
	{
		path: 'personas',
		component: P3PPersonaEntryComponent,
		data: {gameName: 'p3pr'}
	}
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class P3PRoutingModule { }
