import { P5_CHAIN_CALCULATOR } from '@shared/constants'
import { DoWork, runWorker } from 'observable-webworker'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export class FusionChainWorker implements DoWork<string, string> {
	chainCalc = P5_CHAIN_CALCULATOR

	public work(input$: Observable<string>): Observable<string> {
		return input$.pipe(
			map((message) => {
				console.log(message) // outputs 'Hello from main thread'
				return `Hello from webworker`
			})
		)
	}
}

runWorker(FusionChainWorker)
