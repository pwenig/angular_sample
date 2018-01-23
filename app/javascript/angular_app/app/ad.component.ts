import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import {AdInputService} from '../services/ad_input_service';
import {SelectComponent} from './select.component';
import {TreeService} from '../services/tree_service';
import {HistoryService} from '../services/history_service';

@Component({
  selector: 'ad',
  template: `

    <div *ngIf="selectedObject.action">
      <div [config]="{ show: true }" (onHide)=closeModal() bsModal #autoShownModal="bs-modal" #Modal="bs-modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content campaign">
            <div class="modal-header">
              <h4 class="modal-title pull-left">{{selectedObject.action}} Ad</h4>
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
                      <button class="btn btn-primary action" (click)="Modal.hide()">Cancel Ad</button>
                      <button class="btn btn-primary action" *ngIf="showSave" (click)="saveInput(action)">{{action}} Ad</button>
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
  @ViewChild(SelectComponent) 
  private selectComponent:SelectComponent;

  // Remove this.
  @Input() campaignInput: {};
  @Input() selectedObject: any = {};
  @Input() adTags: any[];
  @Input() creativeGroups: any[];

  @Output() adTagFinal = new EventEmitter();
  @Output() adObjectCreated = new EventEmitter();
  @Output() adTagUpdate = new EventEmitter();

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
    if(this.selectedObject.action == 'New') {
      this.adInput.custom = "XX";
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.selectedObject.currentValue.action == 'Edit') {
      this.action = 'Update'
      this.duplicate();
    } else if(changes.selectedObject.currentValue.action == 'New') {
      this.adInput = {};
      this.adInput.custom = 'XX';
      this.showSave = false;
    }
  }

  closeModal() {
    this.selectedObject.action = null;
    this.adInput = {};
    this.adInput.custom = "XX";
    this.showSave = false;
  }

  verifyTag() {
    this._ad.verifyInput(this.adInput.adInputTag).subscribe(

      (result) => {
        // This is the object that sets the create/select button
        this.existingAdInput = result;
        this.showSave = true;
        if(result) {
          // What needs to happen here??

          // This is the object that will be used to copy
          this.adInputObject = result;
          this.showSelect = true;
          this._history.storeInput(result);
          // this._tree.createAdTree(result);
          this.adObjectCreated.emit(JSON.parse(localStorage.getItem('inputs')));
          this.adTagFinal.emit(result)
        }

      },
      (error) => {
        console.log('Error', error);
      }
    )
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
      createParams['placement_input_id'] = this.selectedObject.namestring.placementParent.id;
      // Need to get ids of the creative inputs and update each 
      // of the namestrings.
      this._ad.updateInput(this.selectedObject.namestring.namestring, createParams, this.selectedObject.namestring.campaignParent, this.selectedObject.namestring.placementParent).subscribe(

        (result) => {
          this.adInput = result;
          this.adInput.placement_input.package_input = this.selectedObject.namestring.packageParent;
          this.adInput.placement_input.package_input.campaign_input = this.selectedObject.namestring.campaignParent;
          this._history.storeInput(this.adInput);
          // this._tree.createAdTree(this.adInput);
          this.adTagUpdate.emit(this.adInput);
          this.selectedObject.action = null;
          this.selectedObject.namestring.namestring = {};
          this.showSave = false;
        }
      )



    } else if(action == 'Create') {
      this._ad.createInput(createParams).subscribe(

        (result) => {
          this.adInputObject = result;
          // this._history.storeInput(result);
          // this._tree.createAdTree(result);
          this.adObjectCreated.emit(JSON.parse(localStorage.getItem('inputs')));
          this.adTagFinal.emit(result);
          this.selectedObject.action = null;
          this.adInput = {};
          this.adInput.custom = "XX";
          this.showSave = false;
  
        },
        (error) => {
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
      if(this.adInput.adInputTag) {
        this.verifyTag();
      }
    }
  }

  selectInput(tag) {
    this.adInput.adInputTag = tag;
    this.showFinal = true;
    this.showSelectors = false;
    this.showButtons = false;
    this.verifyTag();
  }


  // cancelInput() {
  //   this.selectComponent.setSelections(this.creativeGroupLabel);
  //   this.adInput.custom = "XX";
  //   this.adInput.adInputTag = null;
  // }

  duplicate() {
    this.defaultCreativeGroup = this.adInput.creative_group = this.creativeGroups.find(x => x['id'] == this.selectedObject.namestring.namestring.creative_group.id);
    this.adInput.custom = this.selectedObject.namestring.namestring.custom;
    // Checks to see if the ngIf has changed and the selectors are showing.
    this.changeDetector.detectChanges();
    this.selectComponent.setSelections(this.creativeGroupLabel);
  }

}