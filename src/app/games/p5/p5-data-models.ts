import { Compendium, CompendiumConfig, Demon, Skill } from 'src/app/shared/models/compendiumModels'

import PERSONA_DATA from 'src/app/games/p5/data/persona-data.json'
import SKILL_DATA from 'src/app/games/p5/data/skill-data.json'
import SPECIAL_Recipes from 'src/app/games/p5/data/special-recipes.json'
import DLC_PERSONA from 'src/app/games/p5/data/dlc-data.json'
import FUSION_CHART from 'src/app/games/p5/data/fusion-chart.json'

export class P5CompendiumConfig extends CompendiumConfig {
    constructor() {
        super()
        this.demonCols.push('Inherits')
        this.statCols = [
            'St',
            'Ma',
            'En',
            'Ag',
            'Lu'
        ]
        this.resistanceCols = [
            'Physical',
            'Gun',
            'Fire',
            'Ice',
            'Lightning',
            'Wind',
            'Psychic',
            'Nuclear',
            'Bless',
            'Curse'
        ]
    }
}

export class P5Compendium implements Compendium {
    demons: { [name: string]: Demon } = {}
    skills: { [name: string]: Skill } = {}
    raceOrder: string[] = []
    specialRecipes: { [name: string]: string[] } = {}
    dlcDemons: Demon[] = []
    fusionChart: string[][] = []

    constructor() {
        Object.entries(SKILL_DATA).forEach(([name, data]) => {
            this.skills[name] = {
                effect: data.effect,
                element: data.element,
                learnedBy: {},
                cost: ''
            }
            let newCost: string
            if ('cost' in data)
            {
                if(data['cost'] > 1000)
                    newCost = (data['cost'] - 1000) + ' MP'
                else
                    newCost = (data['cost']) + '% HP'
            }
            else
                newCost = '-'
            this.skills[name].cost = newCost
            if ('unique' in data)
                this.skills[name].unique = data['unique']
        })
        Object.entries(SPECIAL_Recipes).forEach(([demon, recipe]) =>
            this.specialRecipes[demon] = recipe)
        this.raceOrder = FUSION_CHART['races']
        this.fusionChart = FUSION_CHART['table']
        this.importDemons(PERSONA_DATA)
        //TODO: change when DLC configuration is implemented
        this.importDemons(DLC_PERSONA)
        //Remove any skills that are only learned by party members
        Object.entries(this.skills).forEach(([skill, data]) => {
            if (Object.keys(this.skills[skill].learnedBy).length == 0)
                delete this.skills[skill]
        })
    }

    /* Fills persona list with persona listed in JSON object and skill list with
    their skills
    @param data JSON object with desired persona */
    private importDemons(jsonData: Object): void {
        Object.entries(jsonData).forEach(([demon, data]) => {
            this.demons[demon] = {
                race: data.race,
                lvl: data.lvl,
                stats: data.stats,
                resists: data.resists,
                skills: data.skills,
                inherits: data.inherits,
                drop: data.item
            }
            Object.entries(
                this.demons[demon].skills).forEach(([skill, level]) =>
                    this.skills[skill].learnedBy[demon] = level)
        })
    }
}