import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
	name: 'time',
})
export class TimePipe implements PipeTransform {
	transform(value: number): string {
		let minutes = Math.floor(value / 60000)
		let seconds = value / 1000 - minutes * 60
		if (minutes > 0)
			return `${minutes} minutes ${
				Math.round(seconds * 100) / 100
			} seconds`
		return `${seconds} seconds`
	}
}
