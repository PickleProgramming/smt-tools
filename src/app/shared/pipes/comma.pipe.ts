import { Pipe, PipeTransform } from '@angular/core'

/**
 * Takes 4+ digit number and adds commas in appropriate places
 *
 * @class CommaPipe
 * @typedef {CommaPipe}
 * @export
 * @implements {PipeTransform}
 */
@Pipe({
	name: 'comma',
})
export class CommaPipe implements PipeTransform {
	transform(value: number): string {
		return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}
}
