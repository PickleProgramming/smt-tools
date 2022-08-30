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
        console.log('Getting fissions for ' + targetName)
        let targetDemon: Demon = this.compendium.demons[targetName]
        //get all arcana combinations
        let targetRace: string = this.compendium.demons[targetName].race
        let raceCombos: string[][] = []
        let races = this.compendium.config.fusionTable.races
        let table = this.compendium.config.fusionTable.table
        races.forEach(raceA => {
            races.forEach(raceB => {
                let result = table[races.indexOf(raceA)][races.indexOf(raceB)]
                if (result == targetRace)
                    raceCombos.push([raceA, raceB])
            })
        })
        //get the resultant demon for each arcana combination at every level
        let fissions: Recipe[] = []
        //determine the level range that the fusion can occur in
        let minLevel: number = 0
        let maxLevel: number = targetDemon.lvl
        let demonsRace = this.getDemonsByRace(targetDemon.race)
        for (let name in demonsRace) {
            let demon = demonsRace[name]
            if (demon.lvl >= maxLevel)
                continue
            if (demon.lvl > minLevel)
                minLevel = demon.lvl
        }

        for (let combo of raceCombos) {
            let fission: Recipe
            let raceA: { [name: string]: Demon } = this.getDemonsByRace(combo[0])
            let raceB: { [name: string]: Demon } = this.getDemonsByRace(combo[1])
            for (let nameA in raceA) {
                let demonA = raceA[nameA]
                for (let nameB in raceB) {
                    let demonB = raceB[nameB]
                    let level: number = 1 + Math.floor((demonA.lvl + demonB.lvl) / 2)
                    if (level > minLevel && level <= maxLevel) {
                        fission = {
                            sources: [nameA, nameB],
                            result: targetName
                        }
                        fissions.push(fission)
                    }
                }
            }
        }
        for (let recipe of fissions)
            recipe.cost = this.getCost(recipe)
        return fissions
    }

    getCost(recipe: Recipe): number {
        let cost = 0;
        recipe.sources.forEach(source => {
            let level = this.compendium.demons[source].lvl
            cost += (27 * level * level) + (126 * level) + 2147
        })
        return cost;
    }

    getFusions(demon: string): Recipe[] {
        throw new Error("Method not implemented.");
    }

    getFusion(demonA: string, demonB: string): Recipe {
        throw new Error("Method not implemented.");
    }

}