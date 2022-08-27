import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PQ2PersonaEntryComponent } from './components/pq2-persona-entry.component'
import { PQ2RoutingModule } from './pq2-routing.module'



@NgModule({
	declarations: [
		PQ2PersonaEntryComponent
	],
	imports: [
		CommonModule,
		PQ2RoutingModule
	]
})
export class PQ2Module { }
