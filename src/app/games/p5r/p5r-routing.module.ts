import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { P5RWrapperComponent } from './components/p5r-wrapper.component'
import { P5RPersonaListComponent } from './components/p5r-demon-list.component'

const routes: Routes = [
	{
		path: '',
		component: P5RWrapperComponent,
		children: [
			{
				path: 'personas',
				component: P5RPersonaListComponent,
				title: 'P5R Persona List',
			},
		],
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class P5RRoutingModule {}
