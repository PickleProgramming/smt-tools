import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
	{ path: '', redirectTo: 'p5', pathMatch: 'full' },
	{
		path: 'p5',
		loadChildren: () =>
			import('../games/p5/p5.module').then((m) => m.P5Module),
	},
	{
		path: 'p5r',
		loadChildren: () =>
			import('../games/p5r/p5r.module').then((m) => m.P5RModule),
	},
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
