import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
	{
		path: 'smt3hd',
		loadChildren: () =>
			import('../games/smt3hd/smt3hd.module').then((m) => m.SMT3HDModule),
		data: { gameName: 'smt3hd' },
	},
	{
		path: 'p5',
		loadChildren: () =>
			import('../games/p5/p5.module').then((m) => m.P5Module),
		data: { gameName: 'p5' },
	},
	{
		path: 'pq2',
		loadChildren: () =>
			import('../games/pq2/pq2.module').then((m) => m.PQ2Module),
		data: { gameName: 'pq2' },
	},
	{
		path: 'smt4',
		loadChildren: () =>
			import('../games/smt4/smt4.module').then((m) => m.SMT4Module),
		data: { gameName: 'smt4' },
	},
	{
		path: 'smtsjr',
		loadChildren: () =>
			import('../games/smtsjr/smtsjr.module').then((m) => m.SMTSJRModule),
		data: { gameName: 'smtsjr' },
	},
	{
		path: 'p4g',
		loadChildren: () =>
			import('../games/p4g/p4g.module').then((m) => m.P4GModule),
		data: { gameName: 'p4g' },
	},
	{
		path: 'p3p',
		loadChildren: () =>
			import('../games/p3p/p3p.module').then((m) => m.P3PModule),
		data: { gameName: 'p3p' },
	},
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
