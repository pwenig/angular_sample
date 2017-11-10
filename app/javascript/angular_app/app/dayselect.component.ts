import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'day-select-component',
  template: `<label for="{{label}}">{{label}}</label>
  <select class="form-control" id="{{label}}" required (change)="optionSelected()" [(ngModel)]="chosenOption">
  <option disabled hidden [value]="placeholder">Select {{label}}</option>
  <option *ngFor="let value of ('01' | range : 31)" [ngValue]="value" >{{value}}</option>
  `
})

export class DaySelectComponent {
  @Input() label: string;
  @Input() default: string;
  @Output() selected = new EventEmitter();

  private chosenOption: any;
  private placeholder: any;

  ngOnInit() {
    this.chosenOption = this.default;
  }

  optionSelected() {
    this.selected.emit(this.chosenOption);
  }

  clearSelections(label) {
    var selectElement = document.getElementById(label);
    selectElement['value'] = null;
  }

  setSelections(label) {
    var selectElement = document.getElementById(label);
    selectElement['value'] = this.default;
  }

}