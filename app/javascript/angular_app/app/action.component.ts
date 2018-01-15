import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'actions',
  template: `
  <div class="btn-group actions">
    <button class="btn btn-primary action" (click)="actionSelected('Campaign')" [disabled]="disableNewCampaign">New Campaign</button>
    <button class="btn btn-primary action" (click)="actionSelected('Copy/Create')" [disabled]="namestringSelected">Copy/Create</button>
    <button class="btn btn-primary action" (click)="actionSelected('Edit')" [disabled]="namestringSelected">Edit</button>
    <button class="btn btn-primary action" (click)="actionSelected('Delete')" [disabled]="namestringSelected">Delete</button>
    <button class="btn btn-primary action" (click)="actionSelected('Export')" [disabled]="namestringSelected">Export</button>
    <button class="btn btn-primary action" *ngIf="selectedNameString.child" (click)="actionSelected(selectedNameString.child)" [disabled]="namestringSelected">New {{selectedNameString.child}}</button>
  </div>

  `
})

export class ActionComponent implements OnInit {

  @Input() selectedNameString: any = {};
  @Input() namestringSelected: boolean;
  @Input() disableNewCampaign: boolean;
  @Output() namestringAction = new EventEmitter();


  ngOnInit() {
    this.selectedNameString.child = 'Package';
  }

  actionSelected(action) {
    this.namestringAction.emit(action);
  }

}
