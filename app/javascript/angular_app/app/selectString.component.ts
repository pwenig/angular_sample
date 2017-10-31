import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'select-string-component',
  template: `
    <select (change)="optionSelected()" id="{{label}}" [(ngModel)]="chosenOption">
    <option disabled hidden [value]="placeholder">Select {{label}}</option>
    <option *ngFor="let option of options" [ngValue]="option">{{option}}</option>
  `
})

export class SelectStringComponent {
  @Input() label: string;
  @Input() options: any;
  @Output() selected = new EventEmitter();

  private chosenOption: any;
  private placeholder: any;
  
  optionSelected() {
    this.selected.emit(this.chosenOption);
  }

}