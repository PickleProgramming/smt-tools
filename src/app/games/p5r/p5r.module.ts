import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { P5RRoutingModule } from './p5r-routing.module'
import { P5RWrapperComponent } from './components/p5r-wrapper.component'
import { P5RHeaderComponent } from './components/p5r-header.component'
import { MatCard, MatCardModule } from '@angular/material/card'
import { SharedModule } from '@shared/shared.module'
import { P5RPersonaListComponent } from './components/p5r-demon-list.component'
import { P5RSettingsComponent } from './components/p5r-settings.component'
import { P5RSkillListComponent } from './components/p5r-skill-list.component'
import { P5RTablesComponent } from './components/p5r-tables.component'
import { MatTableModule } from '@angular/material/table'
import { P5RDemonEntryComponent } from './components/p5r-demon-entry.component/p5r-demon-entry.component'
import { RouterModule } from '@angular/router'
import { P5RDemonBuilderComponent } from './components/p5r-demon-builder/p5r-demon-builder.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { MatSortModule } from '@angular/material/sort'

@NgModule({
	declarations: [
		P5RWrapperComponent,
		P5RHeaderComponent,
		P5RPersonaListComponent,
		P5RSettingsComponent,
		P5RSkillListComponent,
		P5RTablesComponent,
		P5RDemonEntryComponent,
		P5RDemonBuilderComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
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
		P5RRoutingModule,
	],
	exports: [],
})
export class P5RModule {}
