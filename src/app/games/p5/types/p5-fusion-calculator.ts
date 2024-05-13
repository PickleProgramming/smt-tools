import { FusionCalculator } from '@shared/types/fusion-calculator'
import { Fusion, Demon } from '@shared/types/smt-tools.types'

import { P5_COMPENDIUM } from '@shared/constants'

export class P5FusionCalculator extends FusionCalculator {
	constructor() {
		super(P5_COMPENDIUM)
	}

	getFissions(targetName: string): Fusion[] {
		if (this.isElemental(targetName)) {
			throw new Error('Called getFissions on an elemental demon')
		}
		if (this.isSpecial(targetName))
			return [this.compendium.buildSpecialRecipe(targetName)]
		let targetRace: string = this.compendium.demons[targetName].race
		let raceCombos: string[][] = []
		let races = this.compendium.fusionTable.races
		let table = this.compendium.fusionTable.table
		//get all arcana combinations that result in target arcana
		for (let raceA of races) {
			for (let raceB of races) {
				let result = table[races.indexOf(raceA)][races.indexOf(raceB)]
				if (result == targetRace) raceCombos.push([raceA, raceB])
			}
		}
		/* try all fusion with potential combinations filtering those without
            the desired result */
		let fissions: Fusion[] = []
		for (let combo of raceCombos) {
			let fission: Fusion
			let raceA: { [name: string]: Demon } = this.getDemonsByRace(
				combo[0]
			)
			let raceB: { [name: string]: Demon } = this.getDemonsByRace(
				combo[1]
			)
			for (let nameA in raceA) {
				if (this.isElemental(nameA)) continue
				for (let nameB in raceB) {
					if (this.isElemental(nameB)) continue
					let nameR = this.fuse(nameA, nameB)
					if (nameR == null) continue
					if (nameR.result == targetName) {
						fission = {
							sources: [nameA, nameB],
							result: targetName,
						}
						fission.cost = this.compendium.getCost(fission)
						fissions.push(fission)
					}
				}
			}
		}
		return fissions
	}

	getFusions(targetName: string): Fusion[] {
		let recipes: Fusion[] = []
		for (let name in this.compendium.demons) {
			let result = this.fuse(targetName, name)
			if (result != null) recipes.push(result)
		}
		return recipes
	}

	protected fuse(nameA: string, nameB: string): Fusion | null {
		let demonA = this.compendium.demons[nameA]
		let demonB = this.compendium.demons[nameB]
		let recipeLevel: number =
			1 + Math.floor((demonA.level + demonB.level) / 2)
		let race = this.getResultantRace(nameA, nameB)
		if (race == null) return null
		let possibleDemons = this.getDemonsByRace(race)
		let result: string = ''
		//when two persona of the same race fuse, the result will be lower level
		if (demonA.race == demonB.race) {
			let level: number = 0
			for (let name in possibleDemons) {
				let demon = possibleDemons[name]
				if (demon.level > recipeLevel) continue
				if (demon.level > level) {
					level = demon.level
					result = name
				}
			}
		} else {
			let level: number = 100
			for (let name in possibleDemons) {
				let demon = possibleDemons[name]
				if (demon.level < recipeLevel) continue
				if (demon.level < level) {
					level = demon.level
					result = name
				}
			}
			//edge cases when resultant persona is lower than recipeLevel
			if (result == '') {
				for (let name in possibleDemons) {
					let demon = possibleDemons[name]
					if (
						result == '' ||
						possibleDemons[result].level < demon.level
					)
						result = name
				}
			}
		}
		let ret: Fusion = {
			sources: [nameA, nameB],
			result: result,
		}
		ret.cost = this.compendium.getCost(ret)
		return ret
	}
}
