import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { P5Module } from 'src/app/games/p5/p5.module'
import { P5RoutingModule } from 'src/app/games/p5/p5-routing.module';



@NgModule({
	imports: [
		CommonModule,
		P5Module,
		P5RoutingModule
	]
})
export class P5RModule { }
