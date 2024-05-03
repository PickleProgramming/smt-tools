import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@shared/shared.module'

import { P5RPersonaListComponent } from './components/p5r-persona-list.component'
import { P5RPersonaEntryComponent } from './components/p5r-persona-entry.component'
import { P5RRoutingModule } from './p5r-routing.module'

@NgModule({
	declarations: [P5RPersonaListComponent, P5RPersonaEntryComponent],
	imports: [P5RRoutingModule, CommonModule, SharedModule, RouterModule],
})
export class P5RModule {}
