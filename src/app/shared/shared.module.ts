import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DemonListComponent } from './components/demon-list/demon-list.component'
import { RouterModule } from '@angular/router'
import { SkillListComponent } from './components/skill-list/skill-list.component'
import { NormalFusionTableComponent } from './components/normal-fusion-table/normal-fusion-table.component'
import { ElementFusionTableComponent } from './components/element-fusion-table/element-fusion-table.component'
import { SettingsComponent } from './components/settings/settings.component'
import { ShortenPipe } from './pipes/shorten.pipe'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DemonEntryComponent } from './components/demon-entry/demon-entry.component'
import { FusionChainComponent } from './components/fusion-chain/fusion-chain.component'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { DataTablesModule } from 'angular-datatables'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatCheckboxModule } from '@angular/material/checkbox'

@NgModule({
	declarations: [
		DemonListComponent,
		SkillListComponent,
		NormalFusionTableComponent,
		ElementFusionTableComponent,
		SettingsComponent,
		DemonEntryComponent,
		ShortenPipe,
		FusionChainComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		MatExpansionModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatCardModule,
		DataTablesModule,
		MatTableModule,
		MatSortModule,
		MatCheckboxModule,
	],
	exports: [
		DemonListComponent,
		SkillListComponent,
		NormalFusionTableComponent,
		ElementFusionTableComponent,
		SettingsComponent,
		DemonEntryComponent,
		FusionChainComponent,
		ShortenPipe,
	],
})
export class SharedModule {}
