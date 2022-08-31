import { Pipe, PipeTransform } from '@angular/core'
import SHORTEN from 'src/app/shared/pipes/shorten.json'

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

  /* Used to get the specific three letter code that will represent a word in a table
      pulled from a JSON that I wrote. EX. Judgement -> Jud Priestess -> Prs 
     @param toShorten: string to be shortened*/
  transform(toShorten: string): string {
    let shorten: { [long: string]: string } = {}
    Object.entries(SHORTEN).forEach(([key, value]) => {
      shorten[key] = value
    })
    if (shorten[toShorten] === undefined)
      throw new Error('The term ' + toShorten + ' was not found in shorten.json')
    return shorten[toShorten]
  }

}
