import { P5_COMPENDIUM } from "src/app/shared/constants";
import { Demon } from "src/app/shared/models/compendium";
import { FusionCalculator, Recipe } from "src/app/shared/models/fusion-calculator"

//TODO: update ALL error messages to throw errors
//TODO: root out the forEach corruption
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
        races.forEach(raceA => {
            races.forEach(raceB => {
                let result = table[races.indexOf(raceA)][races.indexOf(raceB)]
                if (result == targetRace)
                    raceCombos.push([raceA, raceB])
            })
        })

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
                    if (this.fuse(nameA, nameB).result == targetName) {
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

    getFusions(demon: string): Recipe[] {
        throw new Error("Method not implemented.");
    }

    protected fuse(nameA: string, nameB: string): Recipe {
        let demonA = this.compendium.demons[nameA]
        let demonB = this.compendium.demons[nameB]
        let recipeLevel: number = 1 + Math.floor((demonA.lvl + demonB.lvl) / 2)
        let race = this.getResultantRace(nameA, nameB)
        let possibleDemons = this.getDemonsByRace(race)

        let level: number = 100
        let result: string = ""
        for (let name in possibleDemons) {
            let demon = possibleDemons[name]
            if (demon.lvl < recipeLevel)
                continue
            if (demon.lvl < level) {
                level = demon.lvl
                result = name
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
        recipe.sources.forEach(source => {
            let level = this.compendium.demons[source].lvl
            cost += (27 * level * level) + (126 * level) + 2147
        })
        return cost;
    }
}