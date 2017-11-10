import { Component, Input, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { PackageInputService } from '../services/package_input_service';
import {SelectComponent} from './select.component';

@Component({
  selector: 'package',
  template: `
    <h2 class="campaign-title">Package Input</h2>
    <p *ngIf="showFinal" class="final-string">{{ packageInput.packageInputTag }}</p>
    <div class="input-tag-container">
      <div class="row">
        <section class="input-tag" *ngIf="(!showButtons && !showSelectors) && !showFinal">
          <select-string-component [label]="packageLabel" [options]="packageTags" (selected)="selectInput($event)"></select-string-component>
          <button class="new-tag" type="submit" (click)="newTagSection()">New Package String</button>
          </section>

        <section class="input-tag" *ngIf="showButtons">
          <input [ngModel]="packageInput.packageInputTag" class="form-control" [disabled]=true>
          <button class="new-tag" *ngIf="!existingPackageInput && showButtons" type="submit" (click)="saveInput()" [disabled]="invalid">Create Package String</button>
          <button class="new-tag" *ngIf="existingPackageInput && showButtons" type="submit" (click)="selectInput(packageInput.packageInputTag)">Select Package String</button>
          <button class="cancel-tag" *ngIf="showButtons" type="submit" (click)="cancelInput()">Clear</button>
          </section>
      </div>
    </div>

    <div *ngIf="showSelectors">
      <div class="select-container">
        <div class="row">
          <section class="select">
            <div class="first-column" *ngIf="agencies && agencies.length > 0">
              <select-component [label]="agencyLabel" [options]="agencies" (selected)="attributeUpdated($event, 'agency')"></select-component>
            </div>
            <div class="column" *ngIf="publishers && publishers.length > 0">
              <select-component [label]="publisherLabel" [options]="publishers" (selected)="attributeUpdated($event, 'publisher')"></select-component>
            </div>
            <div class="column" *ngIf="buyMethods && buyMethods.length > 0">
              <select-component [label]="buyMethodLabel" [options]="buyMethods" (selected)="attributeUpdated($event, 'buyMethod')"></select-component>
            </div>
          </section>

          <section class="select">  
            <div class="inv-type-column" *ngIf="inventoryTypes && inventoryTypes.length > 0">
              <select-component [label]="inventoryTypeLabel" [options]="inventoryTypes" (selected)="attributeUpdated($event, 'inventoryType')"></select-component>
            </div>
            <div class="custom-column"> 
              <label for="customPackage">Package Custom</label><br>
              <input type="text" id="customPackage" [(ngModel)]="packageInput.custom" placeholder="Enter Custom" (change)="checkAttributes()">
            </div>
          </section>
        </div>
      </div>
    </div>
  `
})

export class PackageComponent implements OnInit {
  @ViewChild(SelectComponent) selectComponent:SelectComponent;
  
  @Input() campaignInput: {};
  @Input() agencies: any[];
  @Input() publishers: any[];
  @Input() buyMethods: any[];
  @Input() inventoryTypes: any[];
  @Input() packageTags: any[];
  @Output() packageInputTagFinal = new EventEmitter();

  agencyLabel: string = 'Agency';
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

  constructor( private _package: PackageInputService) {}

  ngOnInit() {
    if(!this.packageTags || this.packageTags.length == 0) {
      this.showButtons = true;
      this.showSelectors = true;
    }
  }

  // Updates the attribute when it is selected from child components
  attributeUpdated(value, attribute) {
    this.packageInput[attribute] = value;
    this.checkAttributes();
  }

  // Checks to see if everything is selected before creating the tag
  checkAttributes() {
    if(this.packageInput.agency && 
      this.packageInput.publisher && 
      this.packageInput.buyMethod &&
      this.packageInput.inventoryType &&
      this.packageInput.custom
      ){ 
        this.packageInput.packageInputTag = this._package.createPackageString(this.campaignInput, this.packageInput)
        if(this.packageInput.packageInputTag) {
          this.verifyTag();
        }
        // This will enable the create button
        this.invalid = false;
      };
  }

  // Check to see if package input exists
  verifyTag() {
    this._package.verifyInput(this.packageInput.packageInputTag).subscribe(

      (result) => {
        this.existingPackageInput = result;
        if(result) {
          this.packageInputTagFinal.emit(result)
        }
        
      },
      (error) => {
        console.log('Error', error)
      }
    )
  }

  saveInput() {
    // Create the params
    var createParams = {
      campaign_input_id: this.campaignInput['id'],
      agency_id: this.packageInput.agency.id,
      publisher_id: this.packageInput.publisher.id,
      buy_method_id: this.packageInput.buyMethod.id,
      inventory_type_id: this.packageInput.inventoryType.id,
      custom: this.packageInput.custom,
      package_input_tag: this.packageInput.packageInputTag
    }
    this._package.createInput(createParams).subscribe(

      (result) => {
        this.showSelectors = false;
        this.showButtons = false;
        this.showFinal = true;
        this.packageInputTagFinal.emit(result);
      },
      (error) => {
        console.log('ERROR', error)
      }
    );

  }

  selectInput(tag) {
    this.packageInput.packageInputTag = tag;
    this.showFinal = true;
    this.showSelectors = false;
    this.showButtons = false;
    this.verifyTag();
  }

  newTagSection() {
    this.showButtons = true 
    this.showSelectors = true
  }

  // Clears the selected options
  cancelInput() {
    this.selectComponent.setSelections('Agency');
    this.selectComponent.setSelections('Publisher');
    this.selectComponent.setSelections('Buy Method');
    this.selectComponent.setSelections('Inventory Type');
    this.packageInput.custom = null;
    this.packageInput.packageInputTag = null;
  }

}