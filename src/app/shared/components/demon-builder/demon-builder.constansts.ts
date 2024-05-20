import { UserInput, BuildMessage } from '@shared/types/smt-tools.types'
import { fromWorkerPool } from 'observable-webworker'
import { Observable } from 'rxjs'

export function p5StartWebWorker(
	input$: Observable<UserInput>
): Observable<BuildMessage> {
	return fromWorkerPool<UserInput, BuildMessage>(
		() =>
			new Worker(new URL('./p5-demon-builder.worker', import.meta.url), {
				type: 'module',
			}),
		input$
	)
}
