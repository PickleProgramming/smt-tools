import {
	ChangeDetectorRef, OnInit,
	OnDestroy
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

import { FusionServiceInterface } from 'src/app/shared/models/fusionModels';
import { Demon, Compendium } from 'src/app/shared/models/compendiumModels';

export abstract class DemonListContainerComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	demons?: Observable<Demon[]>;
	appName = 'List of Demons - Megami Tensei Fusion Tools';
	initListLen = 50;
	showAllies = true;
	showEnemies = false;
	defaultSortFun = (a: Demon, b: Demon) => a.name.localeCompare(b.name);

	constructor(
		private title2: Title,
		private changeDetectorRef: ChangeDetectorRef,
		private fusionDataService2: FusionServiceInterface
	) { }

	ngOnInit() {
		this.title2.setTitle(this.appName);

		this.subscriptions.push(
			this.fusionDataService2.compendium.subscribe(
				this.onCompendiumUpdated.bind(this)));
	}

	ngOnDestroy() {
		for (const subscription of this.subscriptions) {
			subscription.unsubscribe();
		}
	}

	onCompendiumUpdated(compendium: Compendium) {
		this.changeDetectorRef.markForCheck();
		this.demons = new Observable (observer => {
			let demons = compendium.allDemons;

			if (!this.showAllies) {
				demons = demons.filter(d => d.isEnemy);
			} if (!this.showEnemies) {
				demons = demons.filter(d => !d.isEnemy);
			}

			demons.sort(this.defaultSortFun);
			observer.next(demons.slice(0, this.initListLen));
			setTimeout(() => observer.next(demons));
		});
	}
}