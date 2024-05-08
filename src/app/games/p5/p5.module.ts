import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@shared/shared.module'

import { MatCard } from '@angular/material/card'

import { P5RoutingModule } from './p5-routing.module'
import { P5WrapperComponent } from './components/p5-wrapper/p5-wrapper.component'
import { P5HeaderComponent } from './components/p5-header/p5-header.component'
import { P5BookmarksComponent } from './components/p5-bookmarks/p5-bookmarks.component'
import { P5PersonaListComponent } from './components/p5-demon-list/p5-demon-list.component'
import { P5DemonEntryComponent } from './components/p5-demon-entry.component/p5-demon-entry.component'
import { P5SkillListComponent } from './components/p5-skill-list/p5-skill-list.component'
import { P5TablesComponent } from './components/p5-tables/p5-tables.component'
import { P5DemonBuilderComponent } from './components/p5-demon-builder.component'
import { P5SettingsComponent } from './components/p5-settings.component'

@NgModule({
	declarations: [
		P5WrapperComponent,
		P5HeaderComponent,
		P5BookmarksComponent,
		P5PersonaListComponent,
		P5DemonEntryComponent,
		P5SkillListComponent,
		P5TablesComponent,
		P5DemonBuilderComponent,
		P5SettingsComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule,
		MatCard,
		P5RoutingModule,
	],
})
export class P5Module {}
