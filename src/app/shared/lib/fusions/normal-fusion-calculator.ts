import {
	FusionChart, FusionCalculation,
	FusionCalculator
} from 'src/app/shared/models/fusionModels';
import { NamePair, Compendium } from 'src/app/shared/models/compendiumModels';

export class NormalFusionCalculator implements FusionCalculator {
	constructor(
		private fuseNonelem: FusionCalculation[],
		private fuseElement: FusionCalculation[]
	) { }

	getFusions(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
		let recipes: NamePair[] = [];
		const fusions = compendium.isElementDemon(name) ? this.fuseElement : this.fuseNonelem;

		for (const fusion of fusions) {
			recipes = recipes.concat(fusion(name, compendium, fusionChart));
		}

		return recipes;
	}
}