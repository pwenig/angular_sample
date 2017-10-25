import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { PackageInputService } from '../services/package_input_service';

@Component({
  selector: 'package',
  template: `
    <h2 class="campaign-title">Package Input</h2>
    <p *ngIf="showFinal">{{ packageInput.packageInputTag }}</p>
    <div class="input-tag-container">
      <div class="row">
      <search [inputTags]="packageTags" [searchDesc]="searchDesc" *ngIf="showSearch && (packageTags && packageTags.length > 0)" (newTag)="showSelectors=true && showButtons=true" (tagChosen)="tagSelected($event)"></search> 
      <section class="input-tag" *ngIf="showButtons">
        <input [ngModel]="packageInput.packageInputTag" class="form-control" [disabled]=true>
        <button class="new-tag" *ngIf="!existingPackageInput && showButtons" type="submit" (click)="saveInput()" [disabled]="invalid">Create</button>
        <button class="new-tag" *ngIf="existingPackageInput && showButtons" type="submit" (click)="selectInput()">Select</button>
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

export class PackageComponent implements OnInit {
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
  packageInput: any = {};
  packageInputTag: any;
  existingPackageInput: any;
  showSelectors: boolean = false;
  showButtons: boolean = false;
  showSearch: boolean = true;
  showFinal: boolean = false;
  searchDesc: string = 'Search Package Tags';
  invalid: boolean = true;

  constructor( private _package: PackageInputService) {}

  ngOnInit() {
    if(this.packageTags.length == 0) {
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
        this.createTag(); 
        // This will enable the create button
        this.invalid = false;
      };
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
  }

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

  selectInput() {
    this.showFinal = true;
    this.showSelectors = false;
    this.showButtons = false;
    this.packageInputTagFinal.emit(this.existingPackageInput);
  }

  tagSelected(tag) {
    this.packageInput.packageInputTag = tag;
    this.showFinal = true;
    this.showSearch = false;
    this.verifyTag();
  }

}