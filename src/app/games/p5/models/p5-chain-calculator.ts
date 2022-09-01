import { P5_COMPENDIUM, P5_FUSION_CALCULATOR } from "@shared/constants"
import { ChainCalculator, FusionChain } from "@shared/models/chain-calculator"
import { P5Compendium } from "./p5-compendium"
import { P5FusionCalculator } from "./p5-fusion-calculator"
import _ from "lodash"

export class P5ChainCalculator extends ChainCalculator {

    compendium!: P5Compendium
    calculator!: P5FusionCalculator

    constructor() {
        super(P5_COMPENDIUM, P5_FUSION_CALCULATOR)
    }

    getChains(targetSkills: string[], demonName: string): FusionChain[] | null
    getChains(targetSkills: string[]): FusionChain[] | null
    getChains(targetSkills: string[], demonName?: string): FusionChain[] | null {
        if (demonName)
            return this.getChains_targetSkills_demonName(targetSkills, demonName)
        return this.getChains_targetSkills(targetSkills)
    }

    private getChains_targetSkills_demonName(
        targetSkills: string[],
        demonName: string): FusionChain[] | null {
        if (!this.isPossible(targetSkills, demonName))
            return null
        let fissions = this.calculator.getFissions(demonName)
        let chains: FusionChain[] = []
        for (let fission of fissions) {
            let levelA = this.compendium.demons[fission.sources[0]].lvl
            let levelB = this.compendium.demons[fission.sources[1]].lvl
            if (levelA > this.maxLevel || levelB > this.maxLevel)
                continue
            if (chains.length >= this.maxChainLength)
                return chains
            let foundSkills: string[] = []
            for (let sourceName of fission.sources) {
                let intersects = _.intersection(targetSkills,
                    Object.keys(this.compendium.demons[sourceName].skills))
                if (intersects.length > 0) {
                    foundSkills = foundSkills.concat(intersects)
                    foundSkills = _.uniq(foundSkills)
                }
            }
            if (foundSkills.length == targetSkills.length) {
                let chain: FusionChain = new FusionChain
                chain.addStep(fission, targetSkills)
                chain.cost = chain.getCost()
                chains.push()
                continue
            }
            if (foundSkills.length > 0) {
                for (let sourceName of fission.sources) {
                    let diff = _.difference(targetSkills, foundSkills)
                    let chain = this.getChain(diff, 0, sourceName)
                    if (chain != null) {
                        chain.addStep(fission, foundSkills)
                        chain.cost = chain.getCost()
                        chains.push(chain)
                    }
                }
            }
        }
        if (chains.length > 0)
            return chains
        return null
    }

    private getChains_targetSkills(
        targetSkills: string[]): FusionChain[] | null {
        let chains: FusionChain[] = []
        for (let demonName in this.compendium.demons) {
            if (chains.length >= this.maxChainLength)
                return chains
            let foundSkills: string[] = []
            let demon = this.compendium.demons[demonName]
            if (demon.lvl > this.maxLevel)
                continue
            let intersects = _.intersection(targetSkills, Object.keys(demon.skills))
            if (intersects.length > 0) {
                foundSkills = foundSkills.concat(intersects)
                if (intersects.length == targetSkills.length) {
                    console.log(demonName + ' already has all the skills you need')
                    continue
                }
                let diff = _.difference(targetSkills, foundSkills)
                let newChains = this.getChains_targetSkills_demonName(diff, demonName)
                if (newChains !== null)
                    chains = chains.concat(newChains)
            }
        }
        if (chains.length > 0)
            return chains
        return null
    }

    protected getChain(
        targetSkills: string[],
        recursiveDepth: number,
        demonName: string): FusionChain | null {
        if (recursiveDepth > this.recursiveDepth)
            return null
        if (!this.isPossible(targetSkills, demonName))
            return null
        let fissions = this.calculator.getFissions(demonName)
        for (let fission of fissions) {
            let levelA = this.compendium.demons[fission.sources[0]].lvl
            let levelB = this.compendium.demons[fission.sources[1]].lvl
            if (levelA > this.maxLevel || levelB > this.maxLevel)
                continue

            let foundSkills: string[] = []
            for (let sourceName of fission.sources) {
                let intersects = _.intersection(targetSkills,
                    Object.keys(this.compendium.demons[sourceName].skills))
                if (intersects.length > 0) {
                    foundSkills = foundSkills.concat(intersects)
                    foundSkills = _.uniq(foundSkills)
                }
            }
            if (foundSkills.length == targetSkills.length) {
                let chain: FusionChain = new FusionChain
                chain.addStep(fission, targetSkills)
                return chain
            }
            if (foundSkills.length > 0) {
                for (let sourceName of fission.sources) {
                    let diff = _.difference(targetSkills, foundSkills)
                    let chain = this.getChain(diff, recursiveDepth + 1, sourceName)
                    if (chain != null) {
                        chain.addStep(fission, foundSkills)
                        return chain
                    }
                }
            }
        }
        return null
    }

    protected isPossible(targetSkills: string[], demonName?: string): boolean {
        for (let skillName of targetSkills) {
            let skill = this.compendium.skills[skillName]
            //unique skills can't be inheritted
            if (skill.unique !== demonName) {
                console.log(skillName +
                    ' is unique and can only be used by ' + skill.unique)
                return false
            }
        }
        if (demonName) {
            //make sure inheritted skills are allowed by inheritance types
            for (let skillName of targetSkills) {
                let skill = this.compendium.skills[skillName]
                if (!this.compendium.isInheritable(demonName, skillName)) {
                    console.log(demonName +
                        ' cannot inherit skills of type ' + skill.element)
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
}