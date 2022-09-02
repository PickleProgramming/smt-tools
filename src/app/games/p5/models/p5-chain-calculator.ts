import { P5_COMPENDIUM, P5_FUSION_CALCULATOR } from "@shared/constants"
import { ChainCalculator, FusionChain } from "@shared/models/chain-calculator"
import { P5Compendium } from "./p5-compendium"
import { P5FusionCalculator } from "./p5-fusion-calculator"
import _, { max } from "lodash"
import { Recipe } from "@shared/models/compendium"

export class P5ChainCalculator extends ChainCalculator {

    compendium!: P5Compendium
    calculator!: P5FusionCalculator

    constructor() {
        super(P5_COMPENDIUM, P5_FUSION_CALCULATOR)
    }

    getChains(targetSkills: string[]): FusionChain[] | null
    getChains(targetSkills: string[], demonName: string): FusionChain[] | null
    getChains(targetSkills: string[], demonName?: string): FusionChain[] | null {
        let chains: FusionChain[] | null
        if (demonName)
            chains = this.getChains_targetSkills_demonName(
                targetSkills, demonName, false)
        else
            chains = this.getChains_targetSkills(targetSkills, false)
        if (chains == null) {
            if (demonName)
                chains = this.getChains_targetSkills_demonName(
                    targetSkills, demonName, true)
            else
                chains = this.getChains_targetSkills(targetSkills, true)
        }
        if (chains != null && chains.length < this.maxChainLength) {
            let oldLength = this.maxChainLength
            this.maxChainLength -= chains.length
            if (demonName)
                chains = this.getChains_targetSkills_demonName(
                    targetSkills, demonName, true)
            else
                chains = this.getChains_targetSkills(targetSkills, true)
            this.maxChainLength = oldLength
        }
        return chains
    }
    private getChains_targetSkills(
        targetSkills: string[],
        deep: boolean): FusionChain[] | null {
        for (let skillName of targetSkills) {
            let unique = this.compendium.skills[skillName].unique
            if (unique) {
                let skills = _.difference(targetSkills, [skillName])
                return this.getChains_targetSkills_demonName(
                    skills, unique, deep)
            }
        }

        let chains: FusionChain[] = []
        //iterate over all demons
        for (let demonName in this.compendium.demons) {
            if (chains.length >= this.maxChainLength) {
                console.log('Chain number Reached')
                return chains
            }
            let demon = this.compendium.demons[demonName]
            if (!this.isPossible(targetSkills, demonName))
                continue

            //check if the demon has any of the skills we need
            let foundSkills: string[] = []
            let intersects = _.intersection(
                targetSkills, Object.keys(demon.skills))
            if (intersects.length > 0) {
                foundSkills = foundSkills.concat(intersects)
                if (intersects.length == targetSkills.length) {
                    console.log(demonName +
                        ' already has all the skills you need')
                    return null
                }
                let diff = _.difference(targetSkills, foundSkills)
                if (diff.length > 4)
                    continue
                let newChains = this.getChains_targetSkills_demonName(
                    diff, demonName, deep)
                if (newChains !== null)
                    chains = chains.concat(newChains)
            }
        }
        if (chains.length > 0)
            return chains
        console.debug('No fission chains of any demon can learn ' +
            ' can learn the skills ' + targetSkills + ' at level '
            + this.maxLevel)
        return null
    }
    private getChains_targetSkills_demonName(
        targetSkills: string[],
        demonName: string,
        deep: boolean): FusionChain[] | null {
        if (!this.isPossible(targetSkills, demonName))
            return null

        //Iterate over fissions
        let fissions = this.calculator.getFissions(demonName)
        let chains: FusionChain[] = []
        for (let fission of fissions) {
            if (chains.length >= this.maxChainLength) {
                console.log('Chain number reached')
                return chains
            }

            //iterate over sources
            let foundSkills: string[] = []
            for (let sourceName of fission.sources) {
                //check if any of target skills were found
                let intersects = _.intersection(targetSkills,
                    Object.keys(this.compendium.demons[sourceName].skills))
                if (intersects.length > 0) {
                    foundSkills = foundSkills.concat(intersects)
                    foundSkills = _.uniq(foundSkills)
                }
            }

            //check if we've found some of our target skills
            if (foundSkills.length > 0 || deep)
                for (let sourceName of fission.sources) {
                    let diff = _.difference(targetSkills, foundSkills)
                    //if we found all targetSkills add the recipe and continue
                    if (diff.length == 0) {
                        let chain = new FusionChain
                        chain.addStep(fission, foundSkills)
                        chain.cost = chain.getCost()
                        if (chain.steps.length > 1)
                            for (let i = 1; i < chain.steps.length; i++)
                                chain.inherittedSkills[i] =
                                    chain.inherittedSkills[i].concat(
                                        chain.inherittedSkills[i - 1])
                        chains.push(chain)
                        continue
                    }
                    //get a chain on the remaining skills needed
                    let chain = this.getChain(diff, 0, sourceName, deep)
                    if (chain != null) {
                        chain.addStep(fission, foundSkills)
                        chain.cost = chain.getCost()
                        if (chain.steps.length > 1)
                            for (let i = 1; i < chain.steps.length; i++)
                                chain.inherittedSkills[i] =
                                    chain.inherittedSkills[i].concat(
                                        chain.inherittedSkills[i - 1])
                        chains.push(chain)
                    }
                }
        }
        if (chains.length > 0)
            return chains
        console.debug('No fission chains of ' + demonName +
            ' can learn the skills ' + targetSkills)
        return null
    }

    protected getChain(
        targetSkills: string[],
        recursiveDepth: number,
        demonName: string,
        deep: boolean): FusionChain | null {
        if (targetSkills.length == 0)
            throw new Error('getChain was called with an empty targetSkills arg')
        if (recursiveDepth > this.recursiveDepth) {
            console.log('Recursive depth reached')
            return null
        }
        if (this.compendium.isElemental(demonName))
            return null
        if (!this.isPossible(targetSkills, demonName))
            return null

        //build a list of viable fissions
        let fissions = this.calculator.getFissions(demonName)
        let viable: Recipe[] = []
        for (let fission of fissions) {
            if (this.exceedsMaxLevel(fission))
                continue
            if (!this.isPossible(targetSkills, undefined, fission))
                continue
            viable.push(fission)
        }

        //iterate over viable fissions
        for (let fission of viable) {
            let foundSkills: string[] = []
            for (let sourceName of fission.sources) {
                //check if the source has any skills
                let intersects = _.intersection(targetSkills,
                    Object.keys(this.compendium.demons[sourceName].skills))
                if (intersects.length > 0) {
                    foundSkills = foundSkills.concat(intersects)
                    foundSkills = _.uniq(foundSkills)
                }
            }
            //complete the chain if we've found all the skills we need
            if (foundSkills.length == targetSkills.length) {
                let chain: FusionChain = new FusionChain
                chain.addStep(fission, targetSkills)
                return chain
            }
            //check deeper in the chain if we still need more skills
            if (foundSkills.length > 0 || deep)
                for (let sourceName of fission.sources) {
                    let diff = _.difference(targetSkills, foundSkills)
                    let chain = this.getChain(
                        diff, recursiveDepth + 1, sourceName, deep)
                    if (chain != null) {
                        chain.addStep(fission, foundSkills)
                        return chain
                    }
                }
        }
        console.debug('No fission chains of ' + demonName +
            ' can learn the skills ' + targetSkills)
        return null
    }

    protected isPossible(
        targetSkills: string[],
        demonName?: string,
        recipe?: Recipe): boolean {
        if (recipe !== undefined && demonName !== undefined)
            throw new Error('isPossible() cannot accept both a demon ' +
                'name and a recipe')
        if (recipe)
            return this.isPossible_targetSkills_recipe(targetSkills, recipe)
        if (demonName)
            return this.isPossible_targetSkills_demonName(
                targetSkills, demonName)
        return this.isPossible_targetSkills(targetSkills)
    }
    protected isPossible_targetSkills(targetSkills: string[]): boolean {
        //check the demon necessary for a given unique skill
        for (let skillName of targetSkills) {
            let skill = this.compendium.skills[skillName]
            if (skill.unique) {
                return this.isPossible_targetSkills_demonName(
                    targetSkills, skill.unique)
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
    protected isPossible_targetSkills_recipe(
        targetSkills: string[],
        recipe: Recipe): boolean {
        for (let sourceName of recipe.sources)
            if (!this.isPossible_targetSkills_demonName(
                targetSkills, sourceName))
                return false
        return true
    }
    protected isPossible_targetSkills_demonName(
        targetSkills: string[],
        demonName: string): boolean {
        if (this.compendium.demons[demonName].lvl > this.maxLevel)
            return false
        for (let skillName of targetSkills) {
            let skill = this.compendium.skills[skillName]
            if (skill.unique && skill.unique !== demonName) {
                console.info(skillName +
                    ' is unique and can only be used by ' + skill.unique)
                return false
            }
            if (!this.compendium.isInheritable(demonName, skillName)) {
                console.debug(demonName +
                    ' cannot inherit skills of type ' + skill.element)
                return false
            }
            if (this.compendium.getSkillLevel(skillName) > this.maxLevel) {
                console.info(skillName + ' cannot be learned at level ' +
                    this.maxLevel)
                return false
            }
        }
        let inheritNum: number
        if (this.compendium.isSpecial(demonName)) {
            let specialRecipe = this.compendium.buildSpecialRecipe(demonName)
            inheritNum = this.getMaxNumOfInherittedSkills(specialRecipe)
        } else
            inheritNum = 4
        if (targetSkills.length > inheritNum) {
            let numberNeeded: number = targetSkills.length - inheritNum
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
}