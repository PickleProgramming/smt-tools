import { FusionChart } from 'src/app/shared/models/fusionModels';
import { NamePair, Compendium } from 'src/app/shared/models/compendiumModels';

export function fuseWithSameRace(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
  const recipes: NamePair[] = [];
  const { race: ingRace1, lvl: ingLvl1 } = compendium.getDemon(name);

  const ingLvls2 = compendium.getIngredientDemonLvls(ingRace1).filter(lvl => lvl !== ingLvl1);
  const resultLvls = compendium.getResultDemonLvls(ingRace1).filter(lvl => lvl !== ingLvl1).map(lvl => 2 * lvl);

  for (const ingLvl2 of ingLvls2) {
    const findResultLvlFun = (index, resultLvl) => ingLvl1 + ingLvl2 >= resultLvl ? index + 1 : index;
    let resultLvlIndex = resultLvls.reduce(findResultLvlFun, -1);

    if (resultLvls[resultLvlIndex] / 2 === ingLvl2) {
      resultLvlIndex = resultLvlIndex - 1;
    }

    const resultLvl = resultLvls[resultLvlIndex] / 2;
    if (resultLvl) {
      recipes.push({
        name1: compendium.reverseLookupDemon(ingRace1, ingLvl2),
        name2: compendium.reverseLookupDemon(ingRace1, resultLvl)
      });
    }
  }

  return recipes;
}