import { Compendium, CompendiumConfig, Demon, Recipe, Skill } from '@shared/models/compendium'

import PERSONA_DATA from '@p5/data/persona-data.json'
import SKILL_DATA from '@p5/data/skill-data.json'
import SPECIAL_RECIPES from '@p5/data/special-recipes.json'
import FUSION_TABLE from '@p5/data/fusion-table.json'
import ELEMENT_TABLE from '@p5/data/element-table.json'
import DLC_DATA from '@p5/data/dlc-data.json'
import INHERIT_DATA from '@p5/data/inheritance-types.json'

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
        this.inheritCols = INHERIT_DATA.elems
    }

    /*  @param: the element to check the inheritance capabilites of
        returns: an array of the inheritance capabilites of the demon
            see https://megamitensei.fandom.com/wiki/Skill_Inheritance */
    getInherits(element: string): boolean[] {
        console.log('getInherits() called with "element" : ' + element)
        let ret: boolean[] = []
        let inherits = INHERIT_DATA.ratios[INHERIT_DATA.inherits.
            indexOf(element)].split('')
        for (let elem of inherits) {
            if (elem === 'O')
                ret.push(true)
            else
                ret.push(false)
        }
        return ret
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
        for (let skill in this.skills)
            if (Object.keys(this.skills[skill].learnedBy).length == 0)
                delete this.skills[skill]
        console.log('Created P5Compendium')
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
                resistances: data.resists,
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

    /*  Determines if the demon with the given name can inherit the skill
        with the given name
        @param demonName: name of demon to check
        @param skillName: name of skill to check
        @returns {boolean}: returns true if the demon can inherit this skill
        false othewise 
    */
    isInheritable(demonName: string, skillName: string): boolean {
        let skillElem = this.skills[skillName].element
        if (skillElem === 'support' || 
            skillElem === 'almighty' || 
            skillElem === 'passive')
            return true
        let demonElem = this.demons[demonName].inherits
        let ratios = INHERIT_DATA.ratios[INHERIT_DATA.inherits.indexOf(demonElem!)]
        if (ratios.charAt(INHERIT_DATA.elems.indexOf(skillElem)) == 'O')
            return true
        return false
    }

    /* returns the approximate cost of the supplied recipe */
    getCost(recipe: Recipe): number {
        let cost = 0
        for (let source of recipe.sources) {
            let level = this.demons[source].lvl
            cost += (27 * level * level) + (126 * level) + 2147
        }
        return cost
    }
}