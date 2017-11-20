import {Component, Injectable, Inject} from '@angular/core';

@Injectable()
export class HistoryService {

  constructor() {}

  // Stores the input so it can be exported
  storeInput(inputObj) {
    var stored = [];
    stored = JSON.parse(localStorage.getItem('inputs'));
    if(stored && stored.length > 0) {
      stored.push(inputObj);
      localStorage.setItem('inputs', JSON.stringify(stored));
    }
    else {
      var stored = [];
      stored.push(inputObj);
      localStorage.setItem('inputs', JSON.stringify(stored));
    
    }
  }

}