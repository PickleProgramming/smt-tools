import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { P4GPersonaEntryComponent } from './components/p4g-persona-entry.component'
import { P4GRoutingModule } from './p4g-routing.module'

@NgModule({
	declarations: [P4GPersonaEntryComponent],
	imports: [CommonModule, P4GRoutingModule],
})
export class P4GModule {}
