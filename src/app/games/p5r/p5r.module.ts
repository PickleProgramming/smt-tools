import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { P5Module } from '@p5/p5.module'
import { P5RoutingModule } from '@p5/p5-routing.module';



@NgModule({
	imports: [
		CommonModule,
		P5Module,
		P5RoutingModule
	]
})
export class P5RModule { }
