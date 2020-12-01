import { FusionEntry, FusionPair, 
				 NameTrio, DemonTrio } from 'src/app/shared/models/fusionModels';
 import { NamePair, Compendium } from 'src/app/shared/models/compendiumModels';

export function toFusionEntry(name: string, compendium: Compendium): FusionEntry {
	const demon = compendium.getDemon(name);

	return {
		price: demon.price,
		race1: demon.race,
		lvl1: demon.lvl,
		name1: name
	};
}

export function toFusionPair(names: NamePair, compendium: Compendium): FusionPair {
	const demon1 = compendium.getDemon(names.name1);
	const demon2 = compendium.getDemon(names.name2);

	return {
		price: demon1.price + demon2.price,
		race1: demon1.race,
		lvl1: demon1.lvl,
		name1: names.name1,
		race2: demon2.race,
		lvl2: demon2.lvl,
		name2: names.name2
	};
}

export function toFusionPairResult(names: NamePair, compendium: Compendium): FusionPair {
	const demon1 = compendium.getDemon(names.name1);
	const demon2 = compendium.getDemon(names.name2);

	return {
		price: demon1.price,
		race1: demon1.race,
		lvl1: demon1.lvl,
		name1: names.name1,
		race2: demon2.race,
		lvl2: demon2.lvl,
		name2: names.name2
	};
}

export function toDemonTrio(names: NameTrio, compendium: Compendium): DemonTrio {
	const d1 = compendium.getDemon(names.name1);
	const d2 = compendium.getDemon(names.name2);
	const d3 = compendium.getDemon(names.name3);

	return {
		price: d1.price + d2.price + d3.price,
		d1, d2, d3
	};
}

export function toDemonTrioResult(names: NameTrio, compendium: Compendium): DemonTrio {
	const d1 = compendium.getDemon(names.name1);
	const d2 = compendium.getDemon(names.name2);
	const d3 = compendium.getDemon(names.name3);

	return {
		price: d1.price + d2.price,
		d1, d2, d3
	};
}