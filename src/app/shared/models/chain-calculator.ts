import { Compendium } from "./compendium"
import { FusionCalculator, Recipe } from "./fusion-calculator"
import _ from 'lodash'


export abstract class ChainCalculator {
    compendium: Compendium
    calculator: FusionCalculator

    protected recursiveDepth = 4
    protected maxChainLength = 10
    maxLevel = 99

    constructor(compendium: Compendium, calculator: FusionCalculator) {
        this.compendium = compendium
        this.calculator = calculator
    }

    abstract getChains(
        targetSkills: string[],
        demonName: string,
        maxLevel: number): FusionChain[] | null

    abstract getChains(targetSkills: string[],
        maxLevel: number): FusionChain[] | null

    protected abstract getChain(
        targetSkills: string[],
        recursiveDepth: number,
        demonName: string,
        maxLevel: number): FusionChain | null

    /* Determines if the passed persona is capable learning the skills passed
        determines if ANY persona is capable if no name is give */
    protected abstract isPossible(skills: string[], demonName?: string,): boolean

    /* Returns every combination of subarrays from the passed array*/
    protected getSubArrays(arr: string[]): string[][] {
        if (arr === undefined)
            throw new Error('getSubArrays called with undefined argument')
        if (arr.length === 1)
            return [arr]
        else {
            let subarr = this.getSubArrays(arr.slice(1))
            return subarr.concat(subarr.map(e => e.concat(arr[0])), [[arr[0]]])
        }
    }

    setRecursiveDepth(recursiveDepth: number): void {
        this.recursiveDepth = recursiveDepth
    }
    setMaxChainLength(maxChainLength: number): void {
        this.maxChainLength = maxChainLength
    }
}

export class FusionChain {
    steps: Recipe[] = []
    cost: number = 0
    inherittedSkills: string[][] = []

    constructor() {
    }

    addStep(recipe: Recipe, inherittedSkills: string[]) {
        this.steps.push(recipe)
        this.inherittedSkills.push(inherittedSkills)
    }

    getCost(): number {
        let cost: number = 0
        for (let step of this.steps)
            cost += step.cost!
        return cost
    }
}