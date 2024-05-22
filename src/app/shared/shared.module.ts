import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { MatExpansionModule } from '@angular/material/expansion'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'

import { DemonListComponent } from './components/demon-list/demon-list.component'
import { SkillListComponent } from './components/skill-list/skill-list.component'
import { NormalFusionTableComponent } from './components/normal-fusion-table/normal-fusion-table.component'
import { ElementFusionTableComponent } from './components/element-fusion-table/element-fusion-table.component'
import { SettingsComponent } from './components/settings/settings.component'
import { DemonEntryComponent } from './components/demon-entry/demon-entry.component'
import { DemonBuilderComponent } from './components/demon-builder/demon-builder.component'
import { ShortenPipe } from './pipes/shorten.pipe'
import { CommaPipe } from './pipes/comma.pipe'

@NgModule({
	declarations: [
		DemonListComponent,
		SkillListComponent,
		NormalFusionTableComponent,
		ElementFusionTableComponent,
		SettingsComponent,
		DemonEntryComponent,
		DemonBuilderComponent,
		ShortenPipe,
		CommaPipe,
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
		MatTableModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSelectModule,
	],
	exports: [
		DemonListComponent,
		SkillListComponent,
		NormalFusionTableComponent,
		ElementFusionTableComponent,
		SettingsComponent,
		DemonEntryComponent,
		DemonBuilderComponent,
		ShortenPipe,
		CommaPipe,
	],
})
export class SharedModule {}
