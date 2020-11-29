import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompendiumComponent } from './components/compendium/compendium.component';

const routes: Routes = [
	{ path: '', component: CompendiumComponent }
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class P5RRoutingModule { }