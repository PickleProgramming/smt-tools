import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SMTSJRPersonaEntryComponent } from './components/smtsjr-demon-entry.component';
import { SMTSJRRoutingModule } from './smtsjr-routing.module';



@NgModule({
  declarations: [
		SMTSJRPersonaEntryComponent
	],
  imports: [
		CommonModule,
		SMTSJRRoutingModule
  ]
})
export class SMTSJRModule { }
