import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  mapMonthToNb = {
    '01':'JAN',
    '02':'FEB',
    '03':'MAR',
    '04':'APR',
    '05':'MAY',
    '06':'JUN',
    '07':'JUL',
    '08':'AUG',
    '09':'SEP',
    '10':'OCT',
    '11':'NOV',
    '12':'DEC'
  }

  convertDate(date: Date){  // yyyy-mm-dd
    let splittedDate = date.toString().split(' ')[0].split('-');
    let result = this.mapMonthToNb[splittedDate[1]] + ' ' + splittedDate[2]  + ' ' + splittedDate[0];
    return result
  }

  handleAggregationDate(low: Date, high: Date){
    let splittedLow = low.toString().split(' ')[0].split('-');
    let splittedHigh = high.toString().split(' ')[0].split('-');

    let result = this.mapMonthToNb[splittedLow[1]] + ' ' + splittedLow[2] + '-' + splittedHigh[2];
    return result;
  }

  parseFromToDates(from, to){

    let fromDate: any = Object.values(from);
    let toDate: any = Object.values(to);

    fromDate[0] = fromDate[0].toString();
    fromDate[1] = ('0' + fromDate[1]).slice(-2);
    fromDate[2] = ('0' + fromDate[2]).slice(-2);

    toDate[0] = toDate[0].toString();
    toDate[1] = ('0' + toDate[1]).slice(-2);
    toDate[2] = ('0' + toDate[2]).slice(-2);

    fromDate = fromDate.join('-') + ' 00:00:00';
    toDate = toDate.join('-') + ' 00:00:00';

    return {
      fromDate: fromDate,
      toDate: toDate
    }
  }
}
