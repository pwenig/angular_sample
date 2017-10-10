import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'month-select-component',
  template: `<label for="{{label}}">{{label}}</label>
  <select class="form-control" id="{{label}}" required (change)="optionSelected()" [(ngModel)]="chosenOption">
  <option disabled hidden [value]="placeholder">Select {{label}}</option>
  <option *ngFor="let value of ('01' | range : 12)" [ngValue]="value" >{{value}}</option>
  `
})

export class MonthSelectComponent {
  @Input() label: string;
  @Output() selected = new EventEmitter();

  private chosenOption: any;
  private placeholder: any;

  optionSelected() {
    this.selected.emit(this.chosenOption);
  }
}