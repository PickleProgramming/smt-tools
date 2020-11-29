import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompendiumComponent } from './components/compendium/compendium.component';
import { P5RRoutingModule } from './p5r-routing.module';

@NgModule({
  declarations: [CompendiumComponent],
  imports: [
		CommonModule,
		P5RRoutingModule
  ]
})
export class P5RModule { }
