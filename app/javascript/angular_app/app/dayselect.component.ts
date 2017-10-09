import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'day-select-component',
  template: `<label for="{{label}}">{{label}}</label>
  <select class="form-control" id="{{label}}" required (change)="optionSelected()" [(ngModel)]="chosenOption">
  <option *ngFor="let value of ('01' | range : 31)" [ngValue]="value" >{{value}}</option>
  `
})

export class DaySelectComponent {
  @Input() label: string;
  @Output() selected = new EventEmitter();

  chosenOption: any;

  optionSelected() {
    this.selected.emit(this.chosenOption);
  }
}