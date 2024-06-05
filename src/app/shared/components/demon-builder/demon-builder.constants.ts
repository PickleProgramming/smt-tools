import { fromWorkerPool } from 'observable-webworker'
import { Observable } from 'rxjs'

import { UserInput, BuildMessage } from '@shared/types/smt-tools.types'

/**
 * Because of how webpack creates webworkers, it is impossible to create a
 * webworker using a variable. We MUST pass the path to the webworker as an
 * explicit string within the argument. Thus, instead of one function that can
 * call any webworker, we need one function for each game individually. This is
 * a wrapper function that calls one of these functions, defined in
 * ./demon-builder.constants.ts, based on the games abbreviation.
 */

export function p5StartWebWorker(
	input$: Observable<UserInput>
): Observable<BuildMessage> {
	return fromWorkerPool<UserInput, BuildMessage>(
		() =>
			new Worker(
				new URL(
					'../../../games/p5/components/p5-demon-builder/p5-demon-builder.worker',
					import.meta.url
				),
				{
					type: 'module',
				}
			),
		input$
	)
}
export function p5rStartWebWorker(
	input$: Observable<UserInput>
): Observable<BuildMessage> {
	return fromWorkerPool<UserInput, BuildMessage>(
		() =>
			new Worker(
				new URL(
					'../../../games/p5r/components/p5r-demon-builder/p5r-demon-builder.worker',
					import.meta.url
				),
				{
					type: 'module',
				}
			),
		input$
	)
}
