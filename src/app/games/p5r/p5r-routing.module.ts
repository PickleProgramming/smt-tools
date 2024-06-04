import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { P5RWrapperComponent } from './components/p5r-wrapper.component'

const routes: Routes = [
	{
		path: '',
		component: P5RWrapperComponent,
		children: [],
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class P5RRoutingModule {}
