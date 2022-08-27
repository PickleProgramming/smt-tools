import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SMT4PersonaEntryComponent } from './components/smt4-demon-entry.component'
import { SMT4RoutingModule } from './smt4-routing.module'



@NgModule({
  declarations: [
		SMT4PersonaEntryComponent
	],
  imports: [
		CommonModule,
		SMT4RoutingModule
  ]
})
export class SMT4Module { }
