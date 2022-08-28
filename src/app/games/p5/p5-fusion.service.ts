import { Injectable, Input } from '@angular/core';
import { Demon, Skill } from 'src/app/shared/models/compendium';
import { P5Compendium, P5CompendiumConfig } from './p5-compendium';

@Injectable({
  providedIn: 'root'
})
export class P5FusionService {

  compendium: P5Compendium = new P5Compendium

  constructor() { }

  getConfig(): P5CompendiumConfig {
    return this.compendium.config
  }

  getDemons(): { [name: string]: Demon } {
    return this.compendium.demons
  }

  getSkills(): { [name: string]: Skill } {
    return this.compendium.skills
  }

  getSpecialRecipes(): { [name: string]: string[] } | undefined {
    if (typeof this.compendium.specialRecipes === undefined) {
      console.error('Compendium does not contain any special recipes')
      return undefined
    }
    return this.compendium.specialRecipes
  }

  getDlcDemons(): { [name: string]: Demon } | undefined {
    if (typeof this.compendium.specialRecipes === undefined) {
      console.error('Compendium does not contain any dlc Demons')
      return undefined
    }
    return this.compendium.dlcDemons
  }
}
