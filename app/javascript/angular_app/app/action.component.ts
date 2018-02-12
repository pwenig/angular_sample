import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'actions',
  template: `
  <div class="btn-group actions">
    <button class="btn btn-primary action" (click)="actionSelected('New Campaign')">New Campaign</button>
    <button class="btn btn-primary action" (click)="actionSelected('Copy/Create ' + selectedNameString.parent)" [disabled]="namestringSelected">Copy/Create</button>
    <button class="btn btn-primary action" (click)="actionSelected('Edit ' + selectedNameString.parent)" [disabled]="namestringSelected">Edit</button>
    <button class="btn btn-primary action" (click)="actionSelected('Delete')" [disabled]="namestringSelected">Delete</button>
    <button class="btn btn-primary action" (click)="actionSelected('Export')" [disabled]="namestringSelected">Export</button>
    <button class="btn btn-primary action" *ngIf="selectedNameString && selectedNameString.child" (click)="actionSelected('New ' + selectedNameString.child)" [disabled]="namestringSelected">New {{selectedNameString.child}}</button>
  </div>

  `
})

export class ActionComponent {

  @Input() selectedNameString: any = {};
  @Input() namestringSelected: boolean;
  @Output() namestringAction = new EventEmitter();

  
  actionSelected(action) {
    this.namestringAction.emit(action);
  }

}
