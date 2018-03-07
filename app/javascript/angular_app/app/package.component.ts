import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { PackageInputService } from '../services/package_input_service';
import {SelectComponent} from './select.component';
import {TreeService} from '../services/tree_service';
import {HistoryService} from '../services/history_service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'package',
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
                  <div class="column" *ngIf="publishers && publishers.length > 0">
                    <select-component [label]="publisherLabel"[default]="defaultPublisher" [options]="publishers" (selected)="attributeUpdated($event, 'publisher')"></select-component>
                  </div>
                  <div class="column" *ngIf="buyMethods && buyMethods.length > 0">
                    <select-component [label]="buyMethodLabel" [default]="defaultBuyMethod" [options]="buyMethods" (selected)="attributeUpdated($event, 'buy_method')"></select-component>
                   </div>
                </section>
                <section class="select">  
                  <div class="inv-type-column" *ngIf="inventoryTypes && inventoryTypes.length > 0">
                    <select-component [label]="inventoryTypeLabel" [default]="defaultInventoryType" [options]="inventoryTypes" (selected)="attributeUpdated($event, 'inventory_type')"></select-component>
                  </div>
                  <div class="custom-column"> 
                    <label for="customPackage">Package Custom</label><br>
                    <input type="text" id="customPackage" [(ngModel)]="packageInput.custom" placeholder="Enter Custom" (change)="checkAttributes()">
                  </div>
                </section>
                <section class="select">
                  <div class="action-column">
                    <button class="btn btn-primary action" (click)="Modal.hide()">Cancel</button>
                    <button class="btn btn-primary action" *ngIf="showSave" (click)="saveInput(action)">{{ action }}</button>
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

export class PackageComponent implements OnInit, OnChanges {
  @ViewChild(SelectComponent) 
  private selectComponent:SelectComponent;
  @ViewChild('Modal') public modal: ModalDirective;
  
  @Input() selectedObject: any = {};
  @Input() agency: {};
  @Input() publishers: any[];
  @Input() buyMethods: any[];
  @Input() inventoryTypes: any[];
  @Output() packageInputTagFinal = new EventEmitter();
  @Output() packageObjectSelected = new EventEmitter();
  @Output() packageTagUpdate = new EventEmitter();
  @Output() errorHandler = new EventEmitter();

  publisherLabel: string = 'Publisher';
  buyMethodLabel: string = 'Buy Method';
  inventoryTypeLabel: string = 'Inventory Type';
  packageLabel: string = 'Package Strings';
  packageInput: any = {};
  packageInputTag: any;
  existingPackageInput: any;
  showSelectors: boolean = false;
  showButtons: boolean = false;
  showFinal: boolean = false;
  invalid: boolean = true;
  defaultPublisher: any;
  defaultBuyMethod: any;
  defaultInventoryType: any;
  packageObject: any = {};
  showSave: boolean = false;
  showSelect: boolean = false;
  action: string = 'Create';
  editDisable: boolean = false;

  constructor( private _package: PackageInputService, private changeDetector: ChangeDetectorRef, private _tree: TreeService, private _history: HistoryService) {}

  ngOnInit() {
    if(this.selectedObject.action == 'New Package') {
      this.packageInput.custom = "XX";
      this.defaultInventoryType = undefined;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.selectedObject.currentValue.action == 'Edit Package') {
      this.action = 'Update'
      this.editDisable = true;
      this.duplicate();
    }
    if(changes.selectedObject.currentValue.action == 'Copy/Create Package') {
      this.action = 'Create'
      this.duplicate();
    }
  }

  closeModal() {
    this.selectedObject.action = null;
    this.packageInput = {};
    this.cancelInput();
    this.showSave = false;
  }

  // Updates the attribute when it is selected from child components
  attributeUpdated(value, attribute) {
    this.packageInput[attribute] = value;
    this.checkAttributes();
  }

  // Checks to see if everything is selected before creating the tag
  checkAttributes() {
    if(
      this.packageInput.publisher && 
      this.packageInput.buy_method &&
      this.packageInput.inventory_type &&
      this.packageInput.custom
      ){ 
        this.showSave = true;
        this.packageInput.packageInputTag = this._package.createPackageString(this.selectedObject.namestring.campaignParent, this.packageInput, this.agency)
      };
  }

  saveInput(action) {
    // Create the params
    var createParams = {
      campaign_input_id: this.selectedObject.namestring.namestring.id,
      agency_id: this.agency['id'],
      agency: this.agency,
      publisher_id: this.packageInput.publisher.id,
      publisher: this.packageInput.publisher,
      buy_method_id: this.packageInput.buy_method.id,
      buy_method: this.packageInput.buy_method,
      inventory_type_id: this.packageInput.inventory_type.id,
      custom: this.packageInput.custom,
      package_input_tag: this.packageInput.packageInputTag
    }

    if(action == 'Update') {
      createParams['campaign_input_id'] = this.selectedObject.namestring.namestring.campaign_input_id;
      this._package.updateInput(this.selectedObject.namestring.namestring, createParams, this.selectedObject.namestring.campaignParent).subscribe(

        (result) => {
          this.packageInput = result;
          this.packageTagUpdate.emit(this.packageInput);
          this.selectedObject.action = null;
          this.selectedObject.namestring.namestring = {};
          this.showSave = false;
        },
        (error) => {
          this.modal.hide();
          this.errorHandler.emit('Updating Package');
          console.log('Error', error);
        }
      )
    } else if(action == 'Create') {
      if(this.selectedObject.action == 'Copy/Create Package') {
        createParams['campaign_input_id'] = this.selectedObject.namestring.namestring.campaign_input_id;
      }
      this._package.createInput(createParams).subscribe(

        (result) => {
          this.packageObject = result[0];
          if(result[1]['status'] == 200) {
            this.packageObjectSelected.emit(this.packageObject);
          } else {
            this.packageInputTagFinal.emit(this.packageObject);
          }
          this.selectedObject.action = null;
          this.packageInput = {};
          this.showSave = false;
        },
        (error) => {
          this.modal.hide();
          this.errorHandler.emit('Creating Package');
          console.log('ERROR', error);
        }
      );

    } else {}
  }

  // Clears the selected options
  cancelInput() {
    this.defaultBuyMethod = undefined;
    this.defaultPublisher = undefined;
    this.defaultInventoryType = undefined;
    this.packageInput.custom = "XX";
    this.packageInput.packageInputTag = null;
  }

  duplicate() {
    // Set default values
    this.defaultPublisher = this.packageInput.publisher = this.publishers.find(x => x['id'] == this.selectedObject.namestring.namestring.publisher.id);
    this.defaultBuyMethod = this.packageInput.buy_method = this.buyMethods.find(x => x['id'] == this.selectedObject.namestring.namestring.buy_method.id);
    this.defaultInventoryType = this.packageInput.inventory_type = this.inventoryTypes.find(x => x['id'] == this.selectedObject.namestring.namestring.inventory_type_id);
    this.packageInput.custom = this.selectedObject.namestring.namestring.custom;
    // Checks to see if the ngIf has changed and the selectors are showing.
    this.changeDetector.detectChanges();
    // Set selectors
    this.selectComponent.setSelections(this.publisherLabel);
    this.selectComponent.setSelections(this.buyMethodLabel);
    this.selectComponent.setSelections(this.inventoryTypeLabel);
  }

}