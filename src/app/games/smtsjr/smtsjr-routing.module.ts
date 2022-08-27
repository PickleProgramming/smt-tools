import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { SMTSJRPersonaEntryComponent } from './components/smtsjr-demon-entry.component'

const routes: Routes = [
	{ path: '', redirectTo: 'demons', pathMatch: 'full' },
	{
		path: 'demons',
		component: SMTSJRPersonaEntryComponent,
		data: {gameName: 'smtsjrr'}
	}
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SMTSJRRoutingModule { }
