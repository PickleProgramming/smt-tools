import { InputChainData, BuildMessage } from '@shared/types/smt-tools.types'
import { fromWorkerPool } from 'observable-webworker'
import { Observable } from 'rxjs'

export function p5StartWebWorker(
	input$: Observable<InputChainData>
): Observable<BuildMessage> {
	return fromWorkerPool<InputChainData, BuildMessage>(
		() =>
			new Worker(new URL('./p5-demon-builder.worker', import.meta.url), {
				type: 'module',
			}),
		input$
	)
}
