import {Pipe, PipeTransform} from '@angular/core';

// This creates the range of days, months, and years for the selects
@Pipe({name: 'range'})
export class RangePipe implements PipeTransform {
    transform(minValue:string, maxValue:number):number[] {
        let range = [];
        for (let index = parseInt(minValue); index <= maxValue; index++) {
            if(minValue == '01' && index < 10 ) {
                let formatted_index  = '0' + index.toString()
                range.push(formatted_index)
            } else {
                range.push(index);
            }
            
        }
        return range;
    }
}
