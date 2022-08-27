import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemonListComponent } from './components/demon-list/demon-list.component';
import { RouterModule } from '@angular/router';
import { SkillListComponent } from './components/skill-list/skill-list.component';



@NgModule({
  declarations: [
    DemonListComponent,
    SkillListComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    DemonListComponent,
    SkillListComponent
  ]
})
export class SharedModule { }
