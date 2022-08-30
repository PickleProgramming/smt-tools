import { Compendium } from "./compendium";

export interface Recipe {
    sources: string[]
    result: string
    cost?: number
}

export abstract class FusionCalculator {

    compendium: Compendium

    constructor(compendium: Compendium){
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

    /* get list of all the fusions that will yield in the passed species
        @param species: the desired recipe resultant species
        @returns {Recipe[]} a list of all recipes that result in the
            passed species*/
    abstract getSpeciesRecipes(species: string): Recipe[]
        //determine which species combinations are viable based on fusion chart
        //store every potential combination in parallel arrays
        //iterate over arrays creating recipe objects

    /* get the recipe that involves the passed demons, return null
        if fusion is not possible
    */
    abstract getFusion(demonA: string, demonB: string): Recipe
        //calculate the proper level and species of the result
        //find the demon with corresponding level a species
}