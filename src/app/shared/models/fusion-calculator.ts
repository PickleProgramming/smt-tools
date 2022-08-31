import { Compendium, Demon } from "./compendium"

export interface Recipe {
    sources: string[]
    result: string
    cost?: number
}

export abstract class FusionCalculator {

    compendium: Compendium

    constructor(compendium: Compendium) {
        this.compendium = compendium
    }

    /* get list of different fusions that result in the passed demon
        @param demon: name of the resultant demon
        @returns {Recipe[]} a list of recipes where the passed
            demon is the resultant demon*/
    abstract getFissions(targetName: string): Recipe[]

    /* get list of different fusions that the passed demon can participate in
        @param demon: name of factor demon
        @returns {Recipe[]} a list of recipes where the passed demon is a factor */
    abstract getFusions(targetName: string): Recipe[]

    /* determine the recipe object given the 2 sources
        @param nameA: name of first demon to fuse
        @param nameB: name of second demon to fuse
        @returns {Recipe | null}: returns Recipe object if fusion was possible
            or null otherwise */
    protected abstract fuse(nameA: string, nameB: string): Recipe | null

    /* calculate the approximate cost of the given recipe cost is impossible
        to determine exactly as it varies on in game factors that are simply
        not feasible to account for. */
    protected abstract getCost(recipe: Recipe): number

    /* Returns all the demons in the compendium with the corresponding race
        @param race: the target race
        @return: a key-value pair of all the demons with the desired race*/
    protected getDemonsByRace(race: string): { [name: string]: Demon } {
        let demons: { [name: string]: Demon } = {}
        for (let name in this.compendium.demons) {
            let demon = this.compendium.demons[name]
            if (demon.race == race)
                demons[name] = demon
        }
        return demons
    }

    /* determines the race that a resultant demon will be. Some races cannot
        fuse, and this will return null in those cases
        @param nameA: first demon to fuse
        @param nameB: second demon to fuse
        @returns {string}: the race that the resultant demon will be, null if
            the two demons cannot fuse*/
    protected getResultantRace(nameA: string, nameB: string): string | null {
        let demonA = this.compendium.demons[nameA]
        let demonB = this.compendium.demons[nameB]
        let races = this.compendium.config.fusionTable.races
        let table = this.compendium.config.fusionTable.table
        let result = table[races.indexOf(demonA.race)][races.indexOf(demonB.race)]
        if (result == '-')
            return null
        return result
    }

    /* determines if the demon given by name is in the result of one of the 
        compendiums special fusions */
    protected isSpecial(name: string): boolean {
        if (this.compendium.specialRecipes === undefined)
            throw new Error('isSpecial() called on compendium with no special recipes')
        for (let recipe in this.compendium.specialRecipes)
            if (name == recipe)
                return true
        return false
    }

    /* determines if the demon given by name is in the compendiums elemental list */
    protected isElemental(name: string): boolean {
        if (this.compendium.config.elementTable === undefined)
            throw new Error('isElemental() called on compendium with no elementals')
        for (let element of this.compendium.config.elementTable.elems)
            if (name == element)
                return true
        return false
    }
}