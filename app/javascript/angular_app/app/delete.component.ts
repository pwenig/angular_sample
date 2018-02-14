import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {DeleteService} from '../services/delete_service';

@Component({
  selector: 'delete',
  template: `
  <div *ngIf="selectedObject.action">
    <div [config]="{ show: true }" (onHide)=closeModal() bsModal #autoShownModal="bs-modal" #Modal="bs-modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xs">
        <div class="modal-content delete">
          <div class="modal-header">
            <h4 class="modal-title pull-left">Delete {{selectedObject.namestring.parent}}</h4>
            <button type="button" class="close pull-right" (click)="Modal.hide()" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete the following namestring<span *ngIf="children.length > 0"> and it's children</span>?</p>
            <p>{{namestring}}</p>
          </div>
          <div class="modal-footer delete">
            <button class="btn btn-primary action delete" (click)="delete()">Yes</button>
            <button class="btn btn-primary action delete" (click)="Modal.hide()">No</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  `

})

export class DeleteComponent implements OnInit {

  @Input() selectedObject: any = {};
  @Output() cancelDelete = new EventEmitter();
  @Output() namestringDeleted = new EventEmitter();

  constructor(private _delete: DeleteService) {}

  namestring: any;
  children: any = [];

  ngOnInit() {
    if(this.selectedObject.namestring.child) {
      this.children = this.selectedObject.namestring.namestring[this.selectedObject.namestring.child.toLowerCase() + '_inputs'];
    }
    this.namestring = this.selectedObject.namestring.namestring[this.selectedObject.namestring.parent.toLowerCase() + '_input_tag'];
    this.selectedObject.endpoint = '/' + this.selectedObject.namestring.parent.toLowerCase() + '_inputs' + '/';
  }

  closeModal() {
    this.selectedObject.action = null;
    this.cancelDelete.emit();
  }

  delete() {
    this._delete.delete(this.selectedObject).subscribe(

      (result) => {
        this.namestringDeleted.emit(this.selectedObject);
        this.closeModal();
      },
      (error) => {
        console.log('Error', error);
      }
    )

    
  }



}
