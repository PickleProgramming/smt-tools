import { DemonBuilder } from '@shared/types/demon-builder'
import {
	ResultsMessage,
	FusionChain,
	Recipe,
} from '@shared/types/smt-tools.types'
import { Observable } from 'rxjs'

export class P5ChainCalculator extends DemonBuilder {
	getChains(
		targetSkills: string[],
		demonName?: string | undefined
	): Observable<ResultsMessage> {
		throw new Error('Method not implemented.')
	}
	protected getChain(
		targetSkills: string[],
		recursiveDepth: number,
		demonName: string
	): FusionChain | null {
		throw new Error('Method not implemented.')
	}
	protected isPossible(
		skills: string[],
		demonName?: string | undefined,
		recipe?: Recipe | undefined
	): { possible: boolean; reason: string } {
		throw new Error('Method not implemented.')
	}
	protected emitChain(
		recipe: Recipe,
		skills: string[],
		innates: string[],
		chain?: FusionChain | undefined
	): void {
		throw new Error('Method not implemented.')
	}
}
