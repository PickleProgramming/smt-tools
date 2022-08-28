import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DemonListComponent } from './components/demon-list/demon-list.component'
import { RouterModule } from '@angular/router'
import { SkillListComponent } from './components/skill-list/skill-list.component'
import { NormalFusionTableComponent } from './components/normal-fusion-table/normal-fusion-table.component'
import { ElementFusionTableComponent } from './components/element-fusion-table/element-fusion-table.component'
import { TripleFusionTableComponent } from './components/triple-fusion-table/triple-fusion-table.component'
import { FusionSettingsComponent } from './components/fusion-settings/fusion-settings.component'
import { ShortenPipe } from './pipes/shorten.pipe'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    DemonListComponent,
    SkillListComponent,
    NormalFusionTableComponent,
    ElementFusionTableComponent,
    TripleFusionTableComponent,
    FusionSettingsComponent,
    ShortenPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    DemonListComponent,
    SkillListComponent,
    NormalFusionTableComponent,
    ElementFusionTableComponent,
    TripleFusionTableComponent,
    FusionSettingsComponent,
    ShortenPipe
  ]
})
export class SharedModule { }
