import { P5_COMPENDIUM } from "@shared/constants";
import { ChainCalculator, FusionChain } from "@shared/models/chain-calculator";
import _ from "lodash";
import { P5Compendium } from "./p5-compendium";

export class P5ChainCalculator extends ChainCalculator {
    compendium!: P5Compendium

    constructor() {
        super(P5_COMPENDIUM)
    }

    getChain(skills: string[], demonName?: string, ): FusionChain {
        throw new Error("Method not implemented.");
    }

    /* Determines if the passed persona is capable learning the skills passed
        determines if ANY persona is capable if no name is give */
    isPossible(targetSkills: string[], demonName?: string): boolean {
        for (let skillName of targetSkills) {
            let skill = this.compendium.skills[skillName]
            //unique skills can't be inheritted
            if (skill.unique !== demonName) {
                console.log(skillName + ' is unique and can only be used by ' + skill.unique)
                return false
            }
        }
        if (demonName) {
            //make sure inheritted skills are allowed by inheritance types
            for (let skillName of targetSkills) {
                let skill = this.compendium.skills[skillName]
                if (!this.compendium.isInheritable(demonName, skillName)) {
                    console.log(demonName + ' cannot inherit skills of type ' + skill.element)
                    return false
                }
            }
            //only 4 skills can be inheritted, the others will need to be learned
            // either through hangings or innate skills
            if (targetSkills.length > 4) {
                let numberNeeded: number = targetSkills.length - 4
                //build every combination of skills with length numberNeeded
                let innates = this.getSubArrays(targetSkills)
                for (let i = 0; i < innates.length; i++)
                    if (innates[i].length != numberNeeded)
                        delete innates[i]
                innates = _.compact(innates)
                //see if the demon innately learns these subsets
                let skills = Object.keys(this.compendium.demons[demonName].skills)
                for (let innate of innates)
                    if (_.intersection(innate, skills).length == numberNeeded)
                        return true
                return false
            }
            return true
        }
        //only 4 skills can be inheritted, the others will need to be learned
        // either through hangings or innate skills
        if (targetSkills.length > 4) {
            let numberNeeded: number = targetSkills.length - 4
            //build every combination of skills with length numberNeeded
            let innates = this.getSubArrays(targetSkills)
            for (let i = 0; i < innates.length; i++)
                if (innates[i].length != numberNeeded)
                    delete innates[i]
            innates = _.compact(innates)
            //see if there are any demons with innates skills as such
            for (let name in this.compendium.demons) {
                let skills = Object.keys(this.compendium.demons[name].skills)
                for (let innate of innates)
                    if (_.intersection(innate, skills).length == numberNeeded)
                        return true
            }
            return false
        }
        return true
    }

    /* Returns every combination of subarrays from the passed array*/
    getSubArrays(arr: string[]): string[][] {
        if (arr === undefined)
            throw new Error('getSubArrays called with undefined argument')
        if (arr.length === 1)
            return [arr]
        else {
            let subarr = this.getSubArrays(arr.slice(1))
            return subarr.concat(subarr.map(e => e.concat(arr[0])), [[arr[0]]])
        }
    }

    test(targetSkills: string[] | undefined): void {
        console.log('Button Push!')
        console.log(targetSkills)
        if (targetSkills === undefined || targetSkills.length < 5) {
            console.log('Please enter at least 5 skills')
            return
        }
        let numberNeeded: number = targetSkills.length - 4
        //build every combination of skills with length numberNeeded
        let innates = this.getSubArrays(targetSkills)
        for (let i = 0; i < innates.length; i++)
            if (innates[i].length != numberNeeded)
                delete innates[i]
        innates = _.compact(innates)
        //see if there are any demons with innates skills as such
        for (let name in this.compendium.demons) {
            let skills = Object.keys(this.compendium.demons[name].skills)
            for (let innate of innates) {
                console.log(_.intersection(innate, skills))
                if (_.intersection(innate, skills).length == numberNeeded) {
                    console.log('TRUE: ' + name + ': ' + this.compendium.demons[name].skills)
                    return
                }
            }
        }
        console.log('FALSE')
    }
}

