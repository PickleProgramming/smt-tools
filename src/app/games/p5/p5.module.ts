import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { P5PersonaListComponent } from './components/p5-persona-list.component'
import { P5FusionTableComponent } from './components/p5-fusion-table.component'
import { P5SkillListComponent } from './components/p5-skill-list.component'
import { P5SettingsComponent } from './components/p5-fusion-settings.component'
import { SharedModule } from '@shared/shared.module'
import { RouterModule } from '@angular/router'
import { P5RoutingModule } from './p5-routing.module'
import { P5PersonaEntryComponent } from './components/p5-persona-entry.component'

@NgModule({
	declarations: [
		P5PersonaListComponent,
		P5FusionTableComponent,
		P5SkillListComponent,
		P5SettingsComponent,
		P5PersonaEntryComponent
	],
	imports: [
		P5RoutingModule,
		CommonModule,
		SharedModule,
		RouterModule
	]
})
export class P5Module { }
