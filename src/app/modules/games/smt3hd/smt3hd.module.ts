import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SMT3HDPersonaEntryComponent } from './components/smt3hd-demon-entry.component';
import { SMT3HDRoutingModule } from './smt3hd-routing.module';



@NgModule({
	declarations: [
		SMT3HDPersonaEntryComponent
	],
	imports: [
		CommonModule,
		SMT3HDRoutingModule
	]
})
export class SMT3HDModule { }
