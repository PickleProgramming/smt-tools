import { P5_COMPENDIUM } from "@shared/constants";
import { Demon } from "@shared/models/compendium";
import { FusionCalculator, Recipe } from "@shared/models/fusion-calculator"

export class P5FusionCalculator extends FusionCalculator {

    constructor() {
        super(P5_COMPENDIUM)
        console.log('P5FusionCalculator created')
    }

    getFissions(targetName: string): Recipe[] {
        if (this.isElemental(targetName) || this.isSpecial(targetName))
            throw new Error('Called getFissions on an elemental or special demon')

        console.log('Getting fissions for ' + targetName)

        let targetRace: string = this.compendium.demons[targetName].race
        let raceCombos: string[][] = []
        let races = this.compendium.config.fusionTable.races
        let table = this.compendium.config.fusionTable.table

        //get all arcana combinations that result in target arcana
        for (let raceA of races) {
            for (let raceB of races) {
                let result = table[races.indexOf(raceA)][races.indexOf(raceB)]
                if (result == targetRace)
                    raceCombos.push([raceA, raceB])
            }
        }

        /* try all fusion with potential combinations filtering those without
            the desired result */
        let fissions: Recipe[] = []
        for (let combo of raceCombos) {
            let fission: Recipe
            let raceA: { [name: string]: Demon } = this.getDemonsByRace(combo[0])
            let raceB: { [name: string]: Demon } = this.getDemonsByRace(combo[1])
            for (let nameA in raceA) {
                if (this.isElemental(nameA))
                    continue
                for (let nameB in raceB) {
                    if (this.isElemental(nameB))
                        continue
                    let nameR = this.fuse(nameA, nameB)
                    if (nameR == null)
                        continue
                    if (nameR.result == targetName) {
                        fission = {
                            sources: [nameA, nameB],
                            result: targetName
                        }
                        fission.cost = this.getCost(fission)
                        fissions.push(fission)
                    }
                }
            }
        }
        return fissions
    }

    getFusions(targetName: string): Recipe[] {
        console.log('Getting fusions for ' + targetName)
        let recipes: Recipe[] = []
        for (let name in this.compendium.demons) {
            let result = this.fuse(targetName, name)
            if (result != null)
                recipes.push(result)
        }
        return recipes
    }

    protected fuse(nameA: string, nameB: string): Recipe | null {
        let demonA = this.compendium.demons[nameA]
        let demonB = this.compendium.demons[nameB]

        let recipeLevel: number = 1 + Math.floor((demonA.lvl + demonB.lvl) / 2)
        let race = this.getResultantRace(nameA, nameB)
        if (race == null)
            return null
        let possibleDemons = this.getDemonsByRace(race)
        let result: string = ""

        //when two persona of the same race fuse, the result will be lower level
        if (demonA.race == demonB.race) {
            let level: number = 0
            for (let name in possibleDemons) {
                let demon = possibleDemons[name]
                if (demon.lvl > recipeLevel)
                    continue
                if (demon.lvl > level) {
                    level = demon.lvl
                    result = name
                }
            }
        } else {
            let level: number = 100
            for (let name in possibleDemons) {
                let demon = possibleDemons[name]
                if (demon.lvl < recipeLevel)
                    continue
                if (demon.lvl < level) {
                    level = demon.lvl
                    result = name
                }
            }
            //edge cases when resultant persona is lower than recipeLevel
            if (result == '') {
                for (let name in possibleDemons) {
                    let demon = possibleDemons[name]
                    if (result == '' || possibleDemons[result].lvl < demon.lvl)
                        result = name
                }
            }
        }
        let ret: Recipe = {
            sources: [nameA, nameB],
            result: result
        }
        ret.cost = this.getCost(ret)
        return ret
    }

    protected getCost(recipe: Recipe): number {
        let cost = 0;
        for (let source of recipe.sources) {
            let level = this.compendium.demons[source].lvl
            cost += (27 * level * level) + (126 * level) + 2147
        }
        return cost;
    }
}