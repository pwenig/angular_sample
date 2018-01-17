import {Component, Injectable} from '@angular/core';

@Injectable()
export class DateFormatService {

  formatDate(month, day, year) {
    let date = month + ' ' + day + ' ' + year.toString();
    return new Date(date);
  }
  
}