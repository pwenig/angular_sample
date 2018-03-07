import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import {AdInputService} from '../services/ad_input_service';
import {SelectComponent} from './select.component';
import {TreeService} from '../services/tree_service';
import {HistoryService} from '../services/history_service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ad',
  template: `

    <div *ngIf="selectedObject.action">
      <div [config]="{ show: true }" (onHide)=closeModal() bsModal #autoShownModal="bs-modal" #Modal="bs-modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content campaign">
            <div class="modal-header">
              <h4 class="modal-title pull-left">{{selectedObject.action}}</h4>
              <button type="button" class="close pull-right" (click)="Modal.hide()" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="select-container">
                <div class="row">
                  <section class="select">
                  <div class="column" *ngIf="creativeGroups && creativeGroups.length > 0">
                    <select-component [label]="creativeGroupLabel" [default]="defaultCreativeGroup" [options]="creativeGroups" (selected)="attributeUpdated($event, 'creative_group')"></select-component>
                  </div>
                  <div class="custom-column">
                    <label for="customAd">Ad Custom</label><br>
                    <input type="text" id="customAd" [(ngModel)]="adInput.custom" placeholder="Enter Custom" (change)="checkAttributes()">
                  </div>
                  </section>
                  <section class="select">
                    <div class="action-column">
                      <button class="btn btn-primary action" (click)="Modal.hide()">Cancel</button>
                      <button class="btn btn-primary action" *ngIf="showSave" (click)="saveInput(action)">{{action}}</button>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  
  `
})

export class AdComponent implements OnInit, OnChanges {
  @ViewChild(SelectComponent) private selectComponent:SelectComponent;
  @ViewChild('Modal') public modal: ModalDirective;

  @Input() selectedObject: any = {};
  @Input() adTags: any[];
  @Input() creativeGroups: any[];
  @Output() adTagFinal = new EventEmitter();
  @Output() adObjectSelected = new EventEmitter();
  @Output() adTagUpdate = new EventEmitter();
  @Output() errorHandler = new EventEmitter();

  creativeGroupLabel: string = 'Creative Group';
  adInput: any = {};
  existingAdInput: any;
  showSelectors: boolean = false;
  showButtons: boolean = false;
  showFinal: boolean = false;
  invalid: boolean = true;
  defaultCreativeGroup: any;
  adInputObject: any = {};
  showSave: boolean = false;
  showSelect: boolean = false;
  action: any = 'Create';

  constructor( private _ad: AdInputService, private changeDetector: ChangeDetectorRef, private _tree: TreeService, private _history: HistoryService) {}

  ngOnInit() {
    if(this.selectedObject.action == 'New Ad') {
      this.adInput.custom = "XX";
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.selectedObject.currentValue.action == 'Edit Ad') {
      this.action = 'Update'
      this.duplicate();
    }
    if(changes.selectedObject.currentValue.action == 'Copy/Create Ad') {
      this.action = 'Create';
      this.duplicate();
    }
  }

  closeModal() {
    this.selectedObject.action = null;
    this.adInput = {};
    this.adInput.custom = "XX";
    this.showSave = false;
  }

  saveInput(action) {
    let createParams = {
      placement_input_id: this.selectedObject.namestring.namestring.id,
      creative_group_id: this.adInput.creative_group.id,
      creative_group: this.adInput.creative_group,
      custom: this.adInput.custom,
      ad_input_tag: this.adInput.adInputTag
    }
    if(action == 'Update') {
      createParams['placement_input_id'] = this.selectedObject.namestring.namestring.placement_input_id;
      // Need to get ids of the creative inputs and update each 
      // of the namestrings.
      this._ad.updateInput(this.selectedObject.namestring.namestring, createParams, this.selectedObject.namestring.campaignParent, this.selectedObject.namestring.placementParent).subscribe(

        (result) => {
          this.adInput = result;
          this.adInput.placement_input.package_input = this.selectedObject.namestring.packageParent;
          this.adInput.placement_input.package_input.campaign_input = this.selectedObject.namestring.campaignParent;
          this.adTagUpdate.emit(this.adInput);
          this.selectedObject.action = null;
          this.selectedObject.namestring.namestring = {};
          this.showSave = false;
        },
        (error) => {
          this.modal.hide();
          this.errorHandler.emit('Updating Ad');
          console.log('Error', error);
        }
      )


    } else if(action == 'Create') {
      if(this.selectedObject.action == 'Copy/Create Ad') {
       createParams['placement_input_id'] = this.selectedObject.namestring.namestring.placement_input_id;
      }
      this._ad.createInput(createParams).subscribe(

        (result) => {
          this.adInputObject = result[0];
          if(result[1]['status'] == 200) {
            this.adObjectSelected.emit(this.adInputObject);
          } else {
            this.adTagFinal.emit(this.adInputObject);
          }
          this.selectedObject.action = null;
          this.adInput = {};
          this.adInput.custom = "XX";
          this.showSave = false;
        },
        (error) => {
          this.modal.hide();
          this.errorHandler.emit('Creating Ad');
          console.log('ERROR', error);
        }
      );

    } else {}
    
  }

   // Updates the attribute when it is selected from child components
   attributeUpdated(value, attribute) {
    this.adInput[attribute] = value;
    this.checkAttributes();
  }

  // Checks to see if everything is selected before creating the tag
  checkAttributes() {
    if(this.adInput.creative_group && this.adInput.custom) {
      this.adInput.adInputTag = this._ad.createAdString(this.selectedObject.namestring.campaignParent, this.selectedObject.namestring.packageParent, this.selectedObject.namestring.placementParent, this.adInput)
      this.showSave = true;
    }
  }

  duplicate() {
    this.defaultCreativeGroup = this.adInput.creative_group = this.creativeGroups.find(x => x['id'] == this.selectedObject.namestring.namestring.creative_group.id);
    this.adInput.custom = this.selectedObject.namestring.namestring.custom;
    // Checks to see if the ngIf has changed and the selectors are showing.
    this.changeDetector.detectChanges();
    this.selectComponent.setSelections(this.creativeGroupLabel);
  }

}