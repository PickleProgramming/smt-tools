import { Component, Input, OnInit } from '@angular/core'
import { P5ChainCalculator } from '@p5/models/p5-chain-calculator'
import { ChainCalculator } from '@shared/models/chain-calculator'
import { Compendium } from '@shared/models/compendium'
import { OperatorFunction, Observable } from 'rxjs'
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators'

@Component({
  selector: 'app-fusion-chain',
  templateUrl: './fusion-chain.component.html',
  styleUrls: ['./fusion-chain.component.scss']
})
export class FusionChainComponent implements OnInit {

  @Input() compendium!: Compendium
  @Input() chain!: P5ChainCalculator
  skills?: string[]
  demons?: string[]
  inputSkills: string[] = []
  demon: string = ''

  constructor() { }

  ngOnInit(): void {
    if (this.compendium === undefined)
      throw new Error('FusionChainComponent called without passing compendium')
    if (this.chain === undefined)
      throw new Error('FusionChainComponent called without passing chain calculator')
    this.skills = Object.keys(this.compendium.skills)
    this.demons = Object.keys(this.compendium.demons)
  }

  //Typeahead function for demon name
  searchDemons: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.demons!.filter(v =>
          v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  //Typeahead function for skill names
  searchSkills: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.skills!.filter(v =>
          v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  //TODO: TESTING
  testAll(): void {
    for (let i = 0; i < 13; i++)
      this.test(i)
  }

  testRange(cases: number[]): void {
    for (let i of cases)
      this.test(i)
  }

  test(testCase: number): void {
    let skills: string[]
    switch (testCase) {

      //No Max Level, No Demon Name, Not Unique Skills, < 4 Skills
      case 0:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Attack Master'
        ]
        console.log(this.chain.getChains(skills))
        return
      //Max Level, No Demon Name, Not Unique Skills, < 4 Skills
      case 1:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Attack Master'
        ]
        this.chain.maxLevel = 20
        console.log(this.chain.getChains(skills))
        this.chain.maxLevel = 50
        console.log(this.chain.getChains(skills))
        this.chain.maxLevel = 99
        return
      //No Max Level, Demon Name, Not Unique Skills, < 4 Skills
      case 2:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Attack Master'
        ]
        console.log(this.chain.getChains(skills), 'Quetzalcoatl')
        return
      //No Max Level, No Demon Name, Unique Skill, < 4 Skills
      case 3:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Die For Me!'
        ]
        console.log(this.chain.getChains(skills))
        return
      //No Max Level, No Demon Name, Not Unique Skills, > 4 Skills
      case 4:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Attack Master',
          'Regenerate 3'
        ]
        console.log(this.chain.getChains(skills))
        return
      //Max Level, Demon Name, Not Unique Skills, > 4 Skills
      case 5:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Attack Master'
        ]
        console.log(this.chain.getChains(skills), 'Ara Mitama')
        this.chain.maxLevel = 20
        console.log(this.chain.getChains(skills))
        this.chain.maxLevel = 50
        console.log(this.chain.getChains(skills))
        this.chain.maxLevel = 99
        return
      //Max Level, No Demon Name, Unique Skills, < 4 Skills
      case 6:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Die For Me!'
        ]
        console.log(this.chain.getChains(skills), 'Alice')
        this.chain.maxLevel = 20
        console.log(this.chain.getChains(skills))
        this.chain.maxLevel = 50
        console.log(this.chain.getChains(skills))
        this.chain.maxLevel = 99
        return
      //Max Level, No Demon Name, Not Unique Skills, = 4 Skills
      case 7:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Attack Master',
          'Growth 3'
        ]
        console.log(this.chain.getChains(skills))
        this.chain.maxLevel = 20
        console.log(this.chain.getChains(skills))
        this.chain.maxLevel = 50
        console.log(this.chain.getChains(skills))
        this.chain.maxLevel = 99
        return
      //Max Level, Demon Name, Unique Skills, < 4 Skills
      case 8:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Die For Me!'
        ]
        console.log(this.chain.getChains(skills), 'Alice')
        this.chain.maxLevel = 20
        console.log(this.chain.getChains(skills), 'Alice')
        this.chain.maxLevel = 50
        console.log(this.chain.getChains(skills), 'Alice')
        this.chain.maxLevel = 99
        return
      //Max Level, Demon Name, Unique Skills, > 4 Skills
      case 9:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Die For Me!'
        ]
        console.log(this.chain.getChains(skills), 'Alice')
        this.chain.maxLevel = 20
        console.log(this.chain.getChains(skills), 'Alice')
        this.chain.maxLevel = 50
        console.log(this.chain.getChains(skills), 'Alice')
        this.chain.maxLevel = 99
        return
      //No Max Level, Demon Name, Unique Skills, < 4 Skills
      case 10:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Die For Me!'
        ]
        console.log(this.chain.getChains(skills), 'Alice')
        return
      //No Max Level, Demon Name, Unique Skills, > 4 Skills
      case 11:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Attack Master',
          'Die For Me!'
        ]
        console.log(this.chain.getChains(skills), 'Alice')
        return
      //No Max Level, No Demon Name, Unique Skills, > 4 Skills
      case 12:
        skills = [
          'Miracle Punch',
          'Apt Pupil',
          'Attack Master',
          'Die For Me!'
        ]
        console.log(this.chain.getChains(skills))
        return
      default:
        console.log('Please use a proper test number')
        return
    }
  }
}
