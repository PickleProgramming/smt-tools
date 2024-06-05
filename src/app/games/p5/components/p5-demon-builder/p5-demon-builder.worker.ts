import { runWorker } from 'observable-webworker'
import { P5DemonBuilderWorker } from './p5-demon-builder'

//we need this line to tell the worker to actually start. See observable-worker docmuentaiton for more details
runWorker(P5DemonBuilderWorker)
