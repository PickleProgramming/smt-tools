import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemonInheritsComponent } from
	'./components/demon-tables/demon-inherits/demon-inherits.component';
import { DemonResistsComponent } from
	'./components/demon-tables/demon-resists/demon-resists.component';
import { DemonSkillsComponent } from
	'./components/demon-tables/demon-skills/demon-skills.component';
import { DemonStatsComponent } from
	'./components/demon-tables/demon-stats/demon-stats.component';
import { FusionEntryTableComponent } from
	'./components/fusion-tables/fusion-entry-table/fusion-entry-table.component';
import { FusionPairTableComponent } from
	'./components/fusion-tables/fusion-pair-table/fusion-pair-table.component';
import { FusionTrioTableComponent } from
	'./components/fusion-tables/fusion-trio-table/fusion-trio-table.component';
import { FusionChartComponent } from
	'./components/fusion-tables/fusion-chart/fusion-chart.component';
import { FusionTableContainerComponent } from
	'./components/fusion-tables/fusion-table-container/fusion-table-container.component';
import { FusionTableRootComponent } from
	'./components/fusion-tables/fusion-table-root/fusion-table-root.component';
import { SkillListHeaderComponent } from './components/skill-tables/skill-list-header/skill-list-header.component';
import { SkillListComponent } from './components/skill-tables/skill-list/skill-list.component';
import { FusionTrioRootComponent } from './components/fusion-tables/fusion-trio-root/fusion-trio-root.component';
import { FusionTriChartComponent } from './components/fusion-tables/fusion-tri-chart/fusion-tri-chart.component';
import { FissionTrioTableComponent } from './components/fission-tables/fission-trio-table/fission-trio-table.component';
import { FissionTableComponent } from './components/fission-tables/fission-table/fission-table.component';



@NgModule({
	declarations: [
		DemonInheritsComponent,
		DemonResistsComponent,
		DemonSkillsComponent,
		DemonStatsComponent,
		FusionEntryTableComponent,
		FusionPairTableComponent,
		FusionTrioTableComponent,
		FusionChartComponent,
		FusionTableContainerComponent,
		FusionTableRootComponent,
		SkillListHeaderComponent,
		SkillListComponent,
		FusionTrioRootComponent,
		FusionTriChartComponent,
		FissionTrioTableComponent,
		FissionTableComponent
	],
	imports: [
		CommonModule
	]
})
export class SharedModule { }
