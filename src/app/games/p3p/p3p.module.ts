import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { P3PPersonaEntryComponent } from './components/p3p-persona-entry.component'
import { P3PRoutingModule } from './p3p-routing.module'

@NgModule({
	declarations: [P3PPersonaEntryComponent],
	imports: [CommonModule, P3PRoutingModule],
})
export class P3PModule {}
