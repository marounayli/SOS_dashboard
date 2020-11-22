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
}
