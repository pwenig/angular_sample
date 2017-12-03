import {Component, Injectable, Inject} from '@angular/core';

@Injectable()
export class HistoryService {

  constructor() {}

  // Stores the input so it can be exported
  storeCreativeInput(creativeObj) {
    var storedCreative = [];
    storedCreative = JSON.parse(localStorage.getItem('creative_inputs'));
    if(storedCreative && storedCreative.length > 0) {
      storedCreative.push(creativeObj);
      localStorage.setItem('creative_inputs', JSON.stringify(storedCreative));
    } else {
      var storedCreative = [];
      storedCreative.push(creativeObj);
      localStorage.setItem('creative_inputs', JSON.stringify(storedCreative));
    }
  }

}