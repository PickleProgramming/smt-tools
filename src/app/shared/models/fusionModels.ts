import { Observable } from 'rxjs';
import { Compendium, NamePair, Demon } from './compendiumModels';

export interface FusionTableHeaders {
  left: string;
  right: string;
}

export interface FusionDataService {
  fissionCalculator: FusionCalculator;
  fusionCalculator: FusionCalculator;
  compendium: Observable<Compendium>;
  fusionChart: Observable<FusionChart>;
  nextDlcDemons?(dlcDemons: { [name: string]: boolean }): void;
}

export interface FusionTrioService extends FusionDataService {
  triFissionCalculator: TripleCalculator;
  triFusionCalculator: TripleCalculator;
  squareChart: Observable<SquareChart>;
}

export type FusionCalculation = (
  demon: string,
  compendium: Compendium,
  fusionChart: FusionChart
) => NamePair[];

export interface FusionCalculator {
  getFusions(demon: string, compendium: Compendium, fusionChart: FusionChart): NamePair[];
}

export type TripleCalculation = (
  demon: string,
  compendium: Compendium,
  fusionChart: SquareChart
) => NameTrio[];

export interface TripleCalculator {
  getFusions(demon: string, compendium: Compendium, fusionChart: SquareChart): NameTrio[];
}

export interface NameTrio extends NamePair {
  name3: string;
}

export interface DemonPair {
  d1: Demon;
  d2: Demon;
}

export interface DemonTrio extends DemonPair {
  price: number;
  d3: Demon;
}

export interface SpecialRecipe {
  ingreds?: string[];
  pairs?: NamePair[];
}

export interface FusionTrio {
  demon: Demon;
  minPrice: number;
  fusions: DemonTrio[];
}

export interface FusionEntry {
  price: number;
  race1: string;
  lvl1: number;
  name1: string;
}

export interface FusionPair extends FusionEntry {
  race2: string;
  lvl2: number;
  name2: string;
  notes?: string;
}

export interface FissionTable { [race: string]: FissionRow; }
export interface FusionTable  { [race: string]: FusionRow; }
export interface ElementTable { [race: string]: ElementRow; }

export interface FissionRow    { [race: string]: string[]; }
export interface FusionRow     { [race: string]: string; }
export interface ElementRow    { [race: string]: number; }
export interface ElemModifiers { [modifier: number]: string[]; }

export interface FusionChart {
  lvlModifier: number;
  elementDemons: string[];
  races: string[];

  getLightDark(race: string): number;
  getRaceFissions(race: string): FissionRow;
  getRaceFusions(race: string): FusionRow;
  getRaceFusion(raceA: string, raceB: string): string;
  getElemModifiers(race: string): ElemModifiers;
  getElemFusions(elem: string): ElementRow;
  isConvertedRace(race: string): boolean;
}

export interface SquareChart {
  normalChart: FusionChart;
  tripleChart: FusionChart;
  raceOrder?: { [race: string]: number };
}