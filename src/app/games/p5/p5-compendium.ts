import { Compendium, CompendiumConfig, Demon, Skill } from 'src/app/shared/models/compendium'

import PERSONA_DATA from 'src/app/games/p5/data/persona-data.json'
import SKILL_DATA from 'src/app/games/p5/data/skill-data.json'
import SPECIAL_RECIPES from 'src/app/games/p5/data/special-recipes.json'
import FUSION_TABLE from 'src/app/games/p5/data/fusion-table.json'
import ELEMENT_TABLE from 'src/app/games/p5/data/element-table.json'
import DLC_DATA from 'src/app/games/p5/data/dlc-data.json'

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

export class P5Compendium extends Compendium {
    constructor() {
        super(new P5CompendiumConfig, 
              PERSONA_DATA, 
              SKILL_DATA, 
              SPECIAL_RECIPES, 
              DLC_DATA)
        //remove any skills that are only used by party members
        Object.entries(this.skills).forEach(([skill, data]) => {
            if (Object.keys(this.skills[skill].learnedBy).length == 0)
                delete this.skills[skill]
        })
    }

    protected parseSkills(skillData: Object): { [name: string]: Skill } {
        let skills: { [name: string]: Skill } = {}
        Object.entries(skillData).forEach(([name, data]) => {
            skills[name] = {
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
            skills[name].cost = newCost
            if ('unique' in data)
                skills[name].unique = data['unique']
        })
        return skills
    }

    protected parseDemons(demonData: Object): { [name: string]: Demon } {
        let demons: { [name: string]: Demon } = {}
        Object.entries(demonData).forEach(([demon, data]) => {
            demons[demon] = {
                race: data.race,
                lvl: data.lvl,
                stats: data.stats,
                resists: data.resists,
                skills: data.skills,
                inherits: data.inherits,
                drop: data.item
            }
            Object.entries(
                demons[demon].skills).forEach(([skill, level]) =>
                    this.skills[skill].learnedBy[demon] = level)
        })
        return demons
    }

    protected parseSpecial(specialData: Object): { [name: string]: string[] } {
        let specialRecipes: { [name: string]: string[] } = {}
        Object.entries(specialData).forEach(([demon, recipe]) =>
            specialRecipes[demon] = recipe)
        return specialRecipes
        
    }
}