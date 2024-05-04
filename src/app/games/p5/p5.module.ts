import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@shared/shared.module'

import { P5RoutingModule } from './p5-routing.module'
import { P5WrapperComponent } from './components/p5-wrapper/p5-wrapper.component'
import { P5HeaderComponent } from './components/p5-header/p5-header.component'
import { P5BookmarksComponent } from './components/p5-bookmarks/p5-bookmarks.component'
import { P5PersonaListComponent } from './components/p5-persona-list.component'
import { P5PersonaEntryComponent } from './components/p5-persona-entry.component'
import { P5SkillListComponent } from './components/p5-skill-list.component'
import { P5FusionTableComponent } from './components/p5-fusion-table.component'
import { P5FusionChainComponent } from './components/p5-fusion-chain.component'
import { P5SettingsComponent } from './components/p5-settings.component'

@NgModule({
	declarations: [
		P5WrapperComponent,
		P5HeaderComponent,
		P5BookmarksComponent,
		P5PersonaListComponent,
		P5PersonaEntryComponent,
		P5SkillListComponent,
		P5FusionTableComponent,
		P5FusionChainComponent,
		P5SettingsComponent,
	],
	imports: [CommonModule, SharedModule, RouterModule, P5RoutingModule],
})
export class P5Module {}
