import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { P5RRoutingModule } from './p5r-routing.module'
import { P5RWrapperComponent } from './components/p5r-wrapper.component'
import { P5RHeaderComponent } from './components/p5r-header.component'
import { MatCard } from '@angular/material/card'

@NgModule({
	declarations: [P5RWrapperComponent, P5RHeaderComponent],
	imports: [CommonModule, MatCard, P5RRoutingModule],
})
export class P5RModule {}
