import { P5_DEMON_BUILDER } from '@shared/constants'
import { BuildRecipe, InputChainData } from '@shared/types/smt-tools.types'
import { DoWork, runWorker } from 'observable-webworker'
import { Observable, ReplaySubject, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

/* Class to run the fusion calculator in a web worker utilizes the 
    observable-worker library to make things much easier to deal with 
    https://github.com/cloudnc/observable-webworker*/
export class DemonBuilderWorker
	implements DoWork<InputChainData, BuildRecipe[]>
{
	chains: BuildRecipe[] = []
	demonBuilder = P5_DEMON_BUILDER

	public work(input$: Observable<InputChainData>): Observable<BuildRecipe[]> {
		return input$.pipe(
			map((inputData) => {
				return this.calculate(inputData)
			})
		)
	}

	private calculate(inputData: InputChainData): BuildRecipe[] {
		this.demonBuilder.recurDepth = inputData.recurDepth
		if (inputData.level) this.demonBuilder.maxLevel = inputData.level
		if (inputData.demonName) {
			return this.demonBuilder.getFusionChains(
				inputData.inputSkills,
				inputData.demonName
			)
		}
		return this.demonBuilder.getFusionChains(inputData.inputSkills)
	}
}

runWorker(DemonBuilderWorker)
