import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DemonListComponent } from './components/demon-list/demon-list.component'
import { RouterModule } from '@angular/router'
import { SkillListComponent } from './components/skill-list/skill-list.component'
import { NormalFusionTableComponent } from './components/normal-fusion-table/normal-fusion-table.component'
import { ElementFusionTableComponent } from './components/element-fusion-table/element-fusion-table.component'
import { TripleFusionTableComponent } from './components/triple-fusion-table/triple-fusion-table.component'
import { SettingsComponent } from './components/settings/settings.component'
import { ShortenPipe } from './pipes/shorten.pipe'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DemonEntryComponent } from './components/demon-entry/demon-entry.component';
import { FusionChainComponent } from './components/fusion-chain/fusion-chain.component'

@NgModule({
  declarations: [
    DemonListComponent,
    SkillListComponent,
    NormalFusionTableComponent,
    ElementFusionTableComponent,
    TripleFusionTableComponent,
    SettingsComponent,
    DemonEntryComponent,
    ShortenPipe,
    FusionChainComponent,
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
    SettingsComponent,
    DemonEntryComponent,
    ShortenPipe
  ]
})
export class SharedModule { }
