import { P5_CHAIN_CALCULATOR } from '@shared/constants'
import { ChainMessage, FusionChain } from '@shared/types/smt-tools.types'
import { DoWorkUnit, runWorker } from 'observable-webworker'
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs'

export interface InputData {
	demonName: string | null
	level: number | null
	inputSkills: string[]
	deep: boolean
}

/* Class to run the fusion calculator in a web worker utilizes the 
    observable-worker library to make things much easier to deal with 
    https://github.com/cloudnc/observable-webworker*/
export class FusionChainWorker implements DoWorkUnit<InputData, ChainMessage> {
	chains: FusionChain[] = []
	chainCalc = P5_CHAIN_CALCULATOR

	comboSub?: Subscription

	public workUnit(input: InputData): Observable<ChainMessage> {
		const output$: Subject<ChainMessage> = new ReplaySubject(Infinity)
		this.comboSub = this.chainCalc.chainMessageObservable.subscribe(() => {
			output$.next({
				chains: this.chainCalc.chains,
				combo: this.chainCalc.combo,
			})
		})
		this.calculate(input)
		console.log('done!')
		return output$
	}

	private calculate(inputData: InputData): Observable<ChainMessage> {
		this.chainCalc.deep = inputData.deep
		if (inputData.level) this.chainCalc.maxLevel = inputData.level
		if (inputData.demonName) {
			return this.chainCalc.getChains(
				inputData.inputSkills,
				inputData.demonName
			)
		}
		return this.chainCalc.getChains(inputData.inputSkills)
	}
}

runWorker(FusionChainWorker)
