import { P5_CHAIN_CALCULATOR } from '@shared/constants'
import { FusionChain } from '@shared/models/chain-calculator'
import { DoWork, runWorker } from 'observable-webworker'
import { Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'

interface InputData {
	demonName: string
	level: number
	inputSkills: string[]
	deep: boolean
}

/* Class to run the fusion calculator in a web worker utilizes the 
    observable-worker library to make things much easier to deal with 
    https://github.com/cloudnc/observable-webworker*/
export class FusionChainWorker implements DoWork<string, string> {
	chains: FusionChain[] = []
	chainCalc = P5_CHAIN_CALCULATOR

	calculate(dataString: string): string {
		let data: InputData = JSON.parse(dataString)
		this.chainCalc.deep = data.deep
		if (data.level) this.chainCalc.maxLevel = data.level
		if (data.demonName) {
			this.chainCalc.getChains(data.inputSkills, data.demonName)
		} else {
			this.chainCalc.getChains(data.inputSkills)
		}
		return JSON.stringify({
			chains: this.chainCalc.chains,
			combo: this.chainCalc.combo,
		})
	}

	public work(input$: Observable<string>): Observable<string> {
		return input$.pipe(
			map((data) => {
				return this.calculate(data)
			})
		)
	}
}

runWorker(FusionChainWorker)
