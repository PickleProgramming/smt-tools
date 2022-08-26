import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { P5PersonaListComponent } from './components/p5-persona-list/p5-persona-list.component';
import { P5DlcSettingsComponent } from './components/p5-dlc-settings/p5-dlc-settings.component';
import { P5FusionChartComponent } from './components/p5-fusion-chart/p5-fusion-chart.component';
import { P5SkillListComponent } from './components/p5-skill-list/p5-skill-list.component';
import { P5PersonaEntryComponent } from './components/p5-persona-entry/p5-persona-entry.component';
import { P5ShadowEntryComponent } from './components/p5-shadow-entry/p5-shadow-entry.component';
import { P5FusionSettingsComponent } from './components/p5-fusion-settings/p5-fusion-settings.component';
import { P5ShadowListComponent } from './components/p5-shadow-list/p5-shadow-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [
		P5PersonaListComponent,
		P5DlcSettingsComponent,
		P5FusionChartComponent,
		P5SkillListComponent,
		P5PersonaEntryComponent,
		P5ShadowEntryComponent,
		P5FusionSettingsComponent,
		P5ShadowListComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule
	]
})
export class P5Module { }
