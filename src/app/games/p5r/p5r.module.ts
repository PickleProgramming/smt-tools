import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { P5RRoutingModule } from './p5r-routing.module'
import { P5RWrapperComponent } from './components/p5r-wrapper.component'
import { P5RHeaderComponent } from './components/p5r-header.component'
import { MatCard } from '@angular/material/card'
import { SharedModule } from '@shared/shared.module'
import { P5RPersonaListComponent } from './components/p5r-demon-list.component'
import { P5RSettingsComponent } from './components/p5r-settings.component'

@NgModule({
	declarations: [
		P5RWrapperComponent,
		P5RHeaderComponent,
		P5RPersonaListComponent,
		P5RSettingsComponent,
	],
	imports: [CommonModule, SharedModule, MatCard, P5RRoutingModule],
})
export class P5RModule {}
