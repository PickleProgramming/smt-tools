import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

//Models
import { Compendium, CompendiumConfig } from 'src/app/shared/models/compendiumModels';
import { FusionChart, FusionServiceInterface } from 'src/app/shared/models/fusionModels';

//Constants
import { COMPENDIUM_CONFIG } from 'src/app/shared/constants';

//Fusion Libs
import { NormalFusionCalculator } from 'src/app/shared/lib/fusions/normal-fusion-calculator';
import { fuseWithDiffRace, fuseWithElement } from 'src/app/shared/lib/fusions/smt-nonelem-fusions';
import { fuseWithSameRace } from 'src/app/shared/lib/fusions/per-nonelem-fusions';
import { fuseWithNormResult, fuseWithSpecResult } from 'src/app/shared/lib/fusions/smt-element-fusions';
import { fuseTwoElements } from 'src/app/shared/lib/fusions/per-element-fusions';

//Fission Libs
import { splitWithDiffRace, splitWithElement } from 'src/app/shared/lib/fissions/smt-nonelem-fissions';
import { splitWithSameRace } from 'src/app/shared/lib/fissions/per-nonelem-fissions';

@Injectable()
export class FusionDataService implements FusionServiceInterface {
	fissionCalculator = new NormalFusionCalculator(
		[splitWithDiffRace, splitWithSameRace, splitWithElement],
		[]
	);

	fusionCalculator = new NormalFusionCalculator(
		[fuseWithDiffRace, fuseWithSameRace, fuseWithElement],
		[fuseWithNormResult, fuseWithSpecResult, fuseTwoElements]
	);

	private _compendium: Compendium;
	private _compendium$: BehaviorSubject<Compendium>;
	compendium: Observable<Compendium>;

	private _fusionChart: FusionChart;
	private _fusionChart$: BehaviorSubject<FusionChart>;
	fusionChart: Observable<FusionChart>;

	compConfig: CompendiumConfig;
	gameAbbr: string;
	appName: string;
	fusionSettingsKey: string;
	fusionSettingsVersion: number;

	constructor(@Inject(COMPENDIUM_CONFIG) compConfig: CompendiumConfig, router: Router) {
		this.compConfig = compConfig;
		this.appName = compConfig.appTitle + ' Fusion Calculator';

		this.fusionSettingsKey = compConfig.settingsKey;
		this.fusionSettingsVersion = compConfig.settingsVersion;

		this._compendium = new Compendium(compConfig);
		this._compendium$ = new BehaviorSubject(this._compendium);
		this.compendium = this._compendium$.asObservable();

		this._fusionChart = new FusionChart(compConfig.normalTable, compConfig.elementTable);
		this._fusionChart$ = new BehaviorSubject(this._fusionChart);
		this.fusionChart = this._fusionChart$.asObservable();

		const settings = JSON.parse(localStorage.getItem(this.fusionSettingsKey));

		if (settings && settings.version && settings.version >= this.fusionSettingsVersion) {
			this.nextDlcDemons(settings.dlcDemons);
		}

		window.addEventListener('storage', this.onStorageUpdated.bind(this));
	}

	nextDlcDemons(dlcDemons: { [name: string]: boolean }) {
		localStorage.setItem(this.fusionSettingsKey, JSON.stringify({ version: this.fusionSettingsVersion, dlcDemons }));
		this._compendium.dlcDemons = dlcDemons;
		this._compendium$.next(this._compendium);
	}

	onStorageUpdated(e) {
		switch (e.key) {
			case this.fusionSettingsKey:
				this._compendium.dlcDemons = JSON.parse(e.newValue).dlcDemons;
				this._compendium$.next(this._compendium);
				break;
			default:
				break;
		}
	}
}