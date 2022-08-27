import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { SMT3HDPersonaEntryComponent } from './components/smt3hd-demon-entry.component'

const routes: Routes = [
	{ path: '', redirectTo: 'demons', pathMatch: 'full' },
	{
		path: 'demons',
		component: SMT3HDPersonaEntryComponent,
		data: {gameName: 'smt3hdr'}
	}
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SMT3HDRoutingModule { }
