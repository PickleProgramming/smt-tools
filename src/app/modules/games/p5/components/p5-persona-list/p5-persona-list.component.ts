import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { P5Compendium } from 'src/app/modules/games/p5/p5-config';
import { DemonListContainerComponent } from
	'src/app/shared/components/partials/_demon-list-container.component'

@Component({
	selector: 'app-p5-persona-list',
	templateUrl: './p5-persona-list.component.html',
	styleUrls: ['./p5-persona-list.component.scss']
})
export class P5PersonaListContainerComponent extends DemonListContainerComponent {

	appName: string;
	statHeaders: string[];
	resistHeaders: string[];
	inheritOrder: { [elem: string]: number };
	config: P5Compendium;

	constructor(
		title: Title,
		route: ActivatedRoute,
		changeDetectorRef: ChangeDetectorRef,
		fusionDataService: FusionDataService
	) {
		super(title, changeDetectorRef, fusionDataService);
		this.showAllies = !route.snapshot.data.showShadows;
		this.showEnemies = !this.showAllies;

		this.config = fusionDataService.config;
		this.defaultSortFun = (d1, d2) => (
			this.config.raceOrder[d1.race] -
			this.config.raceOrder[d2.race]
		) * 200 + d2.lvl - d1.lvl;

		this.appName = `List of Personas - ${fusionDataService.appName}`;
		this.statHeaders = this.config.baseStats;
		this.resistHeaders = this.config.resistElems;
		this.inheritOrder = this.config.elemOrder;

		if (this.showEnemies) {
			this.appName = `List of Shadows - ${fusionDataService.appName}`;
			this.statHeaders = ['HP', 'MP'];
			this.resistHeaders = this.config.enemyResists;
			this.inheritOrder = null!;
		}
	}
}
