import { Component, Input, EventEmitter, Output } from '@angular/core';
import { PackageInputService } from '../services/package_input_service';

@Component({
  selector: 'package',
  template: `
    <h2 class="campaign-title">Package Input</h2>
    <div class="input-tag-container" *ngIf="inputTag">
      <div class="row">
        <section class="input-tag">
          <div class="submit-column" *ngIf="!existingPackageInput"><button class="input-submit" type="submit" (click)="saveInput()" [disabled]="saveDisabled">Create</button></div>
          <div class="submit-column" *ngIf="existingPackageInput"><button class="input-submit" type="submit" [disabled]="saveDisabled" (click)="selectInput()">Select</button></div>
          <div class="tag-column">{{ packageInput.packageInputTag }}</div>
        </section>
      </div>
    </div>

    <div *ngIf="showSelectors">
      <div class="select-container">
        <div class="row">
          <section class="select">
            <div class="network-column" *ngIf="agencies && agencies.length > 0">
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
              <label for="type">Package Custom</label><br>
              <input type="text" id="custom" [(ngModel)]="packageInput.custom" placeholder="Enter Custom" (change)="checkAttributes()">
            </div>
          </section>
        </div>
      </div>
    </div>
  `
})

export class PackageComponent {
  @Input() campaignInput: {};
  @Input() agencies: any[];
  @Input() publishers: any[];
  @Input() buyMethods: any[];
  @Input() inventoryTypes: any[];
  @Output() packageInputTagFinal = new EventEmitter();

  agencyLabel: string = 'Agency';
  publisherLabel: string = 'Publisher';
  buyMethodLabel: string = 'Buy Method';
  inventoryTypeLabel: string = 'Inventory Type';
  packageInput: any = {};
  packageInputTag: any;
  inputTag: boolean = false;
  existingPackageInput: any;
  showSelectors: boolean = true;
  saveDisabled: boolean = false;

  constructor( private _package: PackageInputService) {}

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
      ) { this.createTag(); };
  }

  createTag() {
    // Create the package tag
    this.packageInput.packageInputTag =
      this.campaignInput['network']['abbrev'] + '_' +
      this.campaignInput['program']['abbrev'] + '_' +
      this.campaignInput['season']['abbrev'] + '_' +
      this.packageInput.agency.abbrev + '_' +
      this.packageInput.publisher.abbrev + '_' +
      this.packageInput.buyMethod.abbrev + '_' +
      this.packageInput.inventoryType.abbrev + '_' +
      this.packageInput.custom
    // Check to see if package input exists
    if(this.packageInput.packageInputTag) {
      this.verifyTag();
    }
      this.inputTag = true
  }

  verifyTag() {
    this._package.verifyInput(this.packageInput.packageInputTag).subscribe(

      (result) => {
        this.existingPackageInput = result;
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
        this.saveDisabled = true;
        this.showSelectors = false;
        this.packageInputTagFinal.emit(result);
      },
      (error) => {
        console.log('ERROR', error)
      }
    );

  }

  selectInput() {
    this.saveDisabled = true;
    this.showSelectors = false;
    this.packageInputTagFinal.emit(this.existingPackageInput);
  }

}