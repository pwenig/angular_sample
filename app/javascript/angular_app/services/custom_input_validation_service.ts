import {Component, Injectable, Inject} from '@angular/core';

@Injectable()
export class CustomInputValidationService {

  constructor() {}

  validateInput(input, type) {
    // Alphanumeric, underscore, spaces
    let regex = /^[a-z0-9_\ t\-]+$/i;
    let status = regex.test(input);
    let response = {};
    if(status == true) {
      let indexes = [], i = -1;
      let stringSplit = input.toString().split('');
      // Check length. 60 for Placement, 30 for others
      if(type != 'Placement') {
        if(stringSplit.length > 30) {
          return response = {status: 'invalid', value: input};
        }
      } else {
        if(stringSplit.length > 60) {
          return response = {status: 'invalid', value: input};
        }
      }
      // Check for space or underscore
      while ((i = stringSplit.indexOf('_', i+1)) != -1){
        indexes.push(i);
      }
      while ((i = stringSplit.indexOf(' ', i+1)) != -1){
        indexes.push(i);
      }
      // replace with hyphen
      if(indexes.length > 0) {
        indexes.forEach((x) => {
          stringSplit[x] = '-';
        })
        input = stringSplit.join('');
      }
      return response = {status: 'valid', value: input};
    } else {
      return response = {status: 'invalid', value: input};
    }
  }

}