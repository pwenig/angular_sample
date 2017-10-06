import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'year-select-component',
  template: `<label for="{{label}}">{{label}}</label>
  <select class="form-control" id="{{label}}" required (change)="optionSelected()" [(ngModel)]="chosenOption">
  <option *ngFor="let value of (2017 | range : 2027)" [ngValue]="value" >{{value}}</option>
  `
})

export class YearSelectComponent {
  @Input() label: string;
  @Output() selected = new EventEmitter();

  chosenOption = 2017;

  optionSelected() {
    this.selected.emit(this.chosenOption);
  }
}