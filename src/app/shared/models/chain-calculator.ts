import { Compendium } from "./compendium";
import { Recipe } from "./fusion-calculator";
import _ from 'lodash';


export abstract class ChainCalculator {
    compendium: Compendium
    private recursiveDepth = 4
    private maxChainLength = 10

    constructor(compendium: Compendium) {
        this.compendium = compendium
    }

    abstract getChain(skills: string[], demonName?: string): FusionChain

    abstract isPossible(skills: string[], demonName?: string, ): boolean

    setRecursiveDepth(recursiveDepth: number): void {
        this.recursiveDepth = recursiveDepth
    }
    setMaxChainLength(maxChainLength: number): void {
        this.maxChainLength = maxChainLength
    }
}

export abstract class FusionChain {
    steps: Recipe[] = []
    cost: number = 0
    inherittedSkills: string[][] = []

    constructor() {
    }

    protected addStep(recipe: Recipe, inherittedSkills: string[]) {
        this.steps.push(recipe)
        this.inherittedSkills.push(inherittedSkills)
    }

    protected getCost(): number {
        let cost: number = 0
        for (let step of this.steps)
            cost += step.cost!
        return cost
    }
}