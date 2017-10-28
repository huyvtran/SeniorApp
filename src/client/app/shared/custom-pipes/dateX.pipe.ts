import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'dateX'
})

export class DatexPipe implements PipeTransform {
    transform(value: any, format: string = ''): string {
        if ( !value || value === '' ) return '';
        return moment(value).format(format);
    }
}
