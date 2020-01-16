import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'unique',
    pure: false
})

export class UniquePipe implements PipeTransform {
    transform(value: any): any {
        if (value !== undefined && value !== null) {
            return _.uniqBy(value);
        }
        return value;
    }

   /*  transform(value: any, args?: any): any {
        // Remove the duplicate elements
        var art = value.map(x=>{
            return x.map(y=>{ return y.value;});;
        }).reduce((acc,ele,i)=>{
            acc = acc.concat(ele);
            return acc;
        });
        return new Set(art);
    } */

}