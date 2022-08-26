import { Compendium, CompendiumConfig, Demon, Skill } from "src/app/shared/models/compendiumModels"

import PERSONA_DATA from "src/app/games/p5/data/persona-data.json"

export class P5Compendium implements Compendium {
    demons: { [name: string]: Demon } = {}
    skills: { [name: string]: Skill} = {}
    raceOrder: { [race: string]: number } = {}
    specialDemons: Demon[] = []
    dlcDemons: Demon[] = []
    
    getDemon(name: string): Demon {
        return this.demons[name]
    }
    getSkill(name: string): Skill {
        return this.skills[name]
    }

    constructor() {
        Object.entries(PERSONA_DATA).forEach(([name, data]) => {
            this.demons[name] = {
                race: data.race,
                lvl: data.lvl,
                stats: data.stats,
                resists: data.resists,
                skills: data.skills,
                inherits: data.inherits,
                drop: data.item
            }
        })
        //TODO: specialDemons, dlcDemons, raceOrder, skill
    }
}

export const P5_COMPENDIUM: P5Compendium = new P5Compendium

export const P5_COMPENDIUM_CONFIG: CompendiumConfig = {
    demonCols: [
        'Race',
        'Level',
        'Name',
        'Inherits'
    ],
    statCols: [
        'St',
        'Ma',
        'En',
        'Ag',
        'Lu'
    ],
    resistanceCols: [
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