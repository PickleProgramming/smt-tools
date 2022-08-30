import { Compendium, Demon } from "./compendium";

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
    abstract getFissions(demon: string): Recipe[]
    //get species combinations
    //determine which have viable levels
    //filter inviable recipes
    //add cost field to all recipies

    /* get list of different fusions that the passed demon 
        can be involved in  
        @param demon: name of the factor demon
        @returns {Recipe[]} a list of recipes where the
            passed demon is one of the sources*/
    abstract getFusions(demon: string): Recipe[]
    //iterate over every demon and calculate the resultant demon
    //add cost field to all recipies

    //determine which species combinations are viable based on fusion chart
    //store every potential combination in parallel arrays
    //iterate over arrays creating recipe objects

    /* get the recipe that involves the passed demons, return null
        if fusion is not possible
    */
    abstract getFusion(demonA: string, demonB: string): Recipe
    //calculate the proper level and species of the result
    //find the demon with corresponding level a species

    /* Returns all the demons in the compendium with the corresponding race
        @param race: the target race
        @return: a key-value pair of all the demons with the desired race*/
    protected getDemonsByRace(race: string): { [name: string]: Demon } {
        let demons: { [name: string]: Demon } = {}
        Object.entries(this.compendium.demons).forEach(([name, demon]) => {
            if(demon.race == race)
                demons[name] = demon
        })
        return demons
    }
}