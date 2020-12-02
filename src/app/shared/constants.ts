import { InjectionToken } from '@angular/core';
import { FusionServiceInterface, FusionTrioService } from './models/fusionModels';
import { CompendiumConfig } from './models/compendiumModels';

import { NormalFusionCalculator } from './lib/fusions/normal-fusion-calculator';
import { fuseWithDiffRace, fuseWithSameRace, fuseWithElement, fuseLightDark } from './lib/fusions/smt-nonelem-fusions';
import { fuseWithNormResult, fuseWithSpecResult, fuseTwoElements } from './lib/fusions/smt-element-fusions';
import { splitWithDiffRace, splitWithElement } from './lib/fissions/smt-nonelem-fissions';
import { splitElement } from './lib/fissions/smt-element-fissions';

import { fuseWithSameRace as perFuseSame } from './lib/fusions/per-nonelem-fusions';
import { splitWithSameRace as perSplitSame } from './lib/fissions/per-nonelem-fissions';

import { TripleFusionCalculator } from './lib/fusions/triple-fusion-calculator';
import {
	fuseT1WithDiffRace as fuse3T1,
	fuseN1WithDiffRace as fuse3N1,
	fuseWithSameRace as fuse3SR
} from './lib/fusions/per-triple-fusions';
import {
	splitWithDiffRace as split3DR,
	splitWithSameRace as split3SR,
} from './lib/fissions/tri-element-fissions';
import { splitWithPrevLvl as split3PL } from './lib/fissions/per-triple-fissions';

export const COMPENDIUM_CONFIG = new InjectionToken<CompendiumConfig>('compendium.config');
export const FUSION_DATA_SERVICE = new InjectionToken<FusionServiceInterface>('fusion.data.service');
export const FUSION_TRIO_SERVICE = new InjectionToken<FusionTrioService>('fusion.trio.service');

export const SMT_NORMAL_FUSION_CALCULATOR = new NormalFusionCalculator(
	[fuseWithDiffRace, fuseWithSameRace, fuseWithElement],
	[fuseWithNormResult, fuseWithSpecResult, fuseTwoElements]
);

export const SMT_NES_NORMAL_FUSION_CALCULATOR = new NormalFusionCalculator(
	[fuseWithDiffRace, fuseWithSameRace, fuseWithElement, fuseLightDark],
	[fuseWithNormResult, fuseWithSpecResult, fuseTwoElements]
);

export const SMT_NORMAL_FISSION_CALCULATOR = new NormalFusionCalculator(
	[splitWithDiffRace, splitWithElement],
	[splitElement]
);

export const P3_NORMAL_FUSION_CALCULATOR = new NormalFusionCalculator(
	[fuseWithDiffRace, perFuseSame],
	[]
);

export const P3_NORMAL_FISSION_CALCULATOR = new NormalFusionCalculator(
	[splitWithDiffRace, perSplitSame],
	[]
);

export const P3_TRIPLE_FUSION_CALCULATOR = new TripleFusionCalculator(
	[fuse3T1, fuse3N1, fuse3SR],
	[]
);

export const P3_TRIPLE_FISSION_CALCULATOR = new TripleFusionCalculator(
	[split3DR, split3SR, split3PL],
	[]
);

function getEnumOrder(target: string[]): { [key: string]: number } {
	const result: {[key: string]: number} = {};
	for (let i = 0; i < target.length; i++) {
		result[target[i]] = i;
	}
	return result;
}

export const ResistanceLevels = [
	'wk', 'no', 'rs', 'st', 'nu', 'rp', 'dr', 'ab'
];

export const ResistOrder = getEnumOrder(ResistanceLevels);