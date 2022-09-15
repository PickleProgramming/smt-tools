import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
	{ path: '', redirectTo: 'p5', pathMatch: 'full' },
	{
		path: 'smt3hd',
		loadChildren: () =>
			import('../games/smt3hd/smt3hd.module').then((m) => m.SMT3HDModule),
	},
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
	{
		path: 'pq2',
		loadChildren: () =>
			import('../games/pq2/pq2.module').then((m) => m.PQ2Module),
	},
	{
		path: 'smt4',
		loadChildren: () =>
			import('../games/smt4/smt4.module').then((m) => m.SMT4Module),
	},
	{
		path: 'smtsjr',
		loadChildren: () =>
			import('../games/smtsjr/smtsjr.module').then((m) => m.SMTSJRModule),
	},
	{
		path: 'p4g',
		loadChildren: () =>
			import('../games/p4g/p4g.module').then((m) => m.P4GModule),
	},
	{
		path: 'p3p',
		loadChildren: () =>
			import('../games/p3p/p3p.module').then((m) => m.P3PModule),
	},
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
