import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'actions',
  template: `
  <div class="btn-group actions">
    <button class="btn btn-primary action" (click)="actionSelected('new-campaign')">New Campaign</button>
    <button class="btn btn-primary action" (click)="actionSelected('copy')" [disabled]="namestringSelected">Copy/Create</button>
    <button class="btn btn-primary action" (click)="actionSelected('edit')" [disabled]="namestringSelected">Edit</button>
    <button class="btn btn-primary action" (click)="actionSelected('delete')" [disabled]="namestringSelected">Delete</button>
    <button class="btn btn-primary action" (click)="actionSelected('export')" [disabled]="namestringSelected">Export</button>
    <button class="btn btn-primary action" *ngIf="selectedNameString.child" (click)="actionSelected('new-child')" [disabled]="namestringSelected">New {{selectedNameString.child}}</button>
  </div>

  `
})

export class ActionComponent implements OnInit {

  @Input() selectedNameString: any = {};
  @Input() namestringSelected: boolean;
  @Output() namestringAction = new EventEmitter();


  ngOnInit() {
    this.selectedNameString.child = 'Package';
  }

  actionSelected(action) {
    this.namestringAction.emit(action);
  }

}
