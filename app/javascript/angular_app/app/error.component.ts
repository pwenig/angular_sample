import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';

@Component({
  selector: 'error-component',
  template: `
    <div [config]="{ show: true }" (onHide)=closeModal() bsModal #autoShownModal="bs-modal" #Modal="bs-modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xs">
        <div class="modal-content delete">
          <div class="modal-header">
            <h4 class="modal-title pull-left">Application Error</h4>
            <button type="button" class="close pull-right" (click)="Modal.hide()" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>There was an error with {{errorMessage}}</p>
          </div>
          <div class="modal-footer delete">
            <button class="btn btn-primary action delete" (click)="Modal.hide()">OK</button>
          </div>
        </div>
      </div>
    </div>
  
  `

})

export class ErrorComponent {

  @Input() errorMessage: any;
  @Output() errorClosed = new EventEmitter();

  constructor() {}

  closeModal() {
    this.errorMessage = null;
    this.errorClosed.emit();
  }

}
