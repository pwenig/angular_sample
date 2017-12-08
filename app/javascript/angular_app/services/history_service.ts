import {Component, Injectable, Inject} from '@angular/core';

@Injectable()
export class HistoryService {

  constructor() {}

  // Stores the input so it can be exported
  storeInput(creativeObj) {
    // var storedInputs = [];
    // storedInputs = JSON.parse(localStorage.getItem('export_inputs'));
    // if(storedInputs && storedInputs.length > 0) {
    //   storedInputs.push(creativeObj);
    //   localStorage.setItem('export_inputs', JSON.stringify(storedInputs));
    // } else {
    //   var storedInputs = [];
    //   storedInputs.push(creativeObj);
    //   localStorage.setItem('export_inputs', JSON.stringify(storedInputs));
    // }
  }

}