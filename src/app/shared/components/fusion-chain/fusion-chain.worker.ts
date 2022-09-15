import { P5_CHAIN_CALCULATOR } from '@shared/constants'
import {
	ChainMessage,
	FusionChain,
	InputChainData,
} from '@shared/types/smt-tools.types'
import { DoWorkUnit, runWorker } from 'observable-webworker'
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs'

/* Class to run the fusion calculator in a web worker utilizes the 
    observable-worker library to make things much easier to deal with 
    https://github.com/cloudnc/observable-webworker*/
export class FusionChainWorker
	implements DoWorkUnit<InputChainData, ChainMessage>
{
	chains: FusionChain[] = []
	chainCalc = P5_CHAIN_CALCULATOR

	public workUnit(input: InputChainData): Observable<ChainMessage> {
		const output$: Subject<ChainMessage> = new ReplaySubject(Infinity)
		const sub = this.chainCalc.chainMessageObservable.subscribe((data) => {
			output$.next({
				chains: data.chains,
				combo: data.combo,
			})
		})
		this.calculate(input)
		console.log('done!')
		sub.unsubscribe()
		return output$
	}

	private calculate(inputData: InputChainData): Observable<ChainMessage> {
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
