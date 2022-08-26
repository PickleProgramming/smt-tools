import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemonListComponent } from './components/demon-list/demon-list.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [DemonListComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    DemonListComponent
  ]
})
export class SharedModule { }
