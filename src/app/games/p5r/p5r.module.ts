import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { P5RPersonaEntryComponent } from './components/p5r-persona-entry.component'
import { P5RRoutingModule } from './p5r-routing.module'

@NgModule({
	declarations: [P5RPersonaEntryComponent],
	imports: [CommonModule, P5RRoutingModule],
})
export class P5RModule {}
