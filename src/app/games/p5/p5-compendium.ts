import { Compendium, CompendiumConfig, Demon, Skill } from 'src/app/shared/models/compendium'

import PERSONA_DATA from 'src/app/games/p5/data/persona-data.json'
import SKILL_DATA from 'src/app/games/p5/data/skill-data.json'
import SPECIAL_Recipes from 'src/app/games/p5/data/special-recipes.json'
import FUSION_TABLE from 'src/app/games/p5/data/fusion-table.json'
import ELEMENT_TABLE from 'src/app/games/p5/data/element-table.json'

export class P5CompendiumConfig extends CompendiumConfig {
    constructor() {
        super(FUSION_TABLE, ELEMENT_TABLE)
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
    config: P5CompendiumConfig = new P5CompendiumConfig
    demons: { [name: string]: Demon } = {}
    skills: { [name: string]: Skill } = {}
    specialRecipes: { [name: string]: string[] } = {}
    dlcDemons: { [name: string]: Demon } = {}
    fusionTable: string[][] = []

    constructor() {
        Object.entries(SKILL_DATA).forEach(([name, data]) => {
            this.skills[name] = {
                effect: data.effect,
                element: data.element,
                learnedBy: {},
                cost: ''
            }
            let newCost: string
            if ('cost' in data) {
                if (data['cost'] > 1000)
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
        this.fusionTable = FUSION_TABLE['table']
        Object.entries(PERSONA_DATA).forEach(([demon, data]) => {
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
        //Remove any skills that are only learned by party members
        Object.entries(this.skills).forEach(([skill, data]) => {
            if (Object.keys(this.skills[skill].learnedBy).length == 0)
                delete this.skills[skill]
        })
    }
}