import { Inject, Injectable } from '@angular/core';
import { P5Compendium } from 'src/app/games/p5/p5-compendium';
import { Compendium, CompendiumConfig, Demon, Skill } from '../models/compendium';

//TODO: Do I even need this anymore?

@Injectable({
  providedIn: 'root'
})
export class CompendiumService {

  compendium!: Compendium

  constructor(
    @Inject('param') private param: string
  ) { 
    console.log(this.param)
  }

  getConfig(): CompendiumConfig {
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
