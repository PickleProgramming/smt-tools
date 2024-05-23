import { Pipe, PipeTransform } from '@angular/core'
import SHORTEN from '@shared/pipes/shorten.json'

/**
 * Used to get the specific three letter code that will represent a word in a
 * table pulled from a JSON that I wrote. EX. Judgement -> Jud Priestess -> Prs
 *
 * @class ShortenPipe
 * @typedef {ShortenPipe}
 * @export
 *
 * @implements {PipeTransform}
 */
@Pipe({
	name: 'shorten',
})
export class ShortenPipe implements PipeTransform {
	/**
	 * Used to get the specific three letter code that will represent a word in
	 * a table pulled from a JSON that I wrote. EX. Judgement -> Jud, Priestess
	 * -> Prs
	 *
	 * @param {string} toShorten
	 * @returns {string | undefined}
	 */
	transform(toShorten: string): string | undefined {
		let shorten: { [long: string]: string } = {}
		Object.entries(SHORTEN).forEach(([key, value]) => {
			shorten[key] = value
		})
		return shorten[toShorten]
	}
}
