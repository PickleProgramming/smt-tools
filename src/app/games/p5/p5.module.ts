import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { P5PersonaListComponent } from './components/p5-persona-list/p5-persona-list.component';
import { P5FusionTableComponent } from './components/p5-fusion-table/p5-fusion-table.component';
import { P5SkillListComponent } from './components/p5-skill-list/p5-skill-list.component';
import { P5PersonaEntryComponent } from './components/p5-persona-entry/p5-persona-entry.component';
import { P5FusionSettingsComponent } from './components/p5-fusion-settings/p5-fusion-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [
		P5PersonaListComponent,
		P5FusionTableComponent,
		P5SkillListComponent,
		P5FusionSettingsComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule
	]
})
export class P5Module { }
