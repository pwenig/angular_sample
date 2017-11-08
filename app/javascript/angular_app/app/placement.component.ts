import { Component, Input, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { PlacementInputService } from '../services/placement_input_service';
import { AdTypeService } from '../services/ad_type_service';
import {SelectComponent} from './select.component';

@Component({
  selector: 'placement',
  template: `
    <h2 class="campaign-title">Placement Input</h2>
    <p *ngIf="showFinal" class="final-string">{{ placementInput.placementInputTag }} </p>
    <div class="input-tag-container">
      <div class="row">
        <section class="input-tag" *ngIf="(!showButtons && !showSelectors) && !showFinal">
          <select-string-component  [options]="placementTags" (selected)="selectInput($event)"></select-string-component>
          <button class="new-tag" type="submit" (click)="newTagSection()">New Placement String</button>
        </section>
        <section class="input-tag" *ngIf="showButtons">
          <input [ngModel]="placementInput.placementInputTag" class="form-control" [disabled]=true>
          <button class="new-tag" *ngIf="!existingPlacementInput && showButtons" type="submit" (click)="saveInput()" [disabled]="invalid">Create Placement String</button>
          <button class="new-tag" *ngIf="existingPlacementInput && showButtons" type="submit" (click)="selectInput(placementInput.placementInputTag)">Select Placement String</button>
          <button class="cancel-tag" *ngIf="showButtons" type="submit" (click)="cancelInput()">Clear</button>
        </section>
      </div>
    </div>

    <div *ngIf="showSelectors">
      <div class="select-container">
        <div class="row">
          <section class="select">
            <div class="column" *ngIf="(episodes && episodes.length > 0) && campaignInput.season.name != 'Tentpole'">
              <select-component [label]="episodeStartLabel" [options]="episodes" (selected)="attributeUpdated($event, 'episodeStartDate')"></select-component>
            </div>
            <div class="column" *ngIf="(episodes && episodes.length > 0) && campaignInput.season.name != 'Tentpole'">
              <select-component [label]="episodeEndLabel" [options]="episodes" (selected)="attributeUpdated($event, 'episodeEndDate')"></select-component>
            </div>
            <div class="custom-column" *ngIf="campaignInput.season.name == 'Tentpole'"> 
              <label for="customTentpole">Tentpole Details</label><br>
              <input type="text" id="customTentpole" [(ngModel)]="placementInput.tentpole" placeholder="Enter Details" (change)="checkAttributes()">
            </div>
          </section>

          <section class="select">
            <div class="column" *ngIf="tactics && tactics.length > 0">
              <select-component [label]="tacticLabel" [options]="tactics" (selected)="attributeUpdated($event, 'tactic')"></select-component>
            </div>
            <div class="column" *ngIf="devices && devices.length > 0">
             <select-component [label]="deviceLabel" [options]="devices" (selected)="attributeUpdated($event, 'device')"></select-component>
            </div>
            <div class="column" *ngIf="adTypes && adTypes.length > 0">
             <select-component [label]="adTypeLabel" [options]="adTypes" (selected)="attributeUpdated($event, 'ad_type')"></select-component>
            </div>
          </section>

          <section class="select" *ngIf="placementInput.ad_type">
            <div class="column" *ngIf="targetingTypes && targetingTypes.length > 0">
              <select-component [label]="targetingType1Label" [options]="targetingTypes" [default]="defaultTargetingType" (selected)="attributeUpdated($event, 'targetingType1')"></select-component>
            </div>
            <div class="column" *ngIf="targetingTypes && targetingTypes.length > 0">
              <select-component [label]="targetingType2Label" [options]="targetingTypes" [default]="defaultTargetingType" (selected)="attributeUpdated($event, 'targetingType2')"></select-component>
            </div>
            <div class="column" *ngIf="targetingTypes && targetingTypes.length > 0">
              <select-component [label]="targetingType3Label" [options]="targetingTypes" [default]="defaultTargetingType" (selected)="attributeUpdated($event, 'targetingType3')"></select-component>
            </div>
            <div class="column" *ngIf="targetingTypes && targetingTypes.length > 0">
              <select-component [label]="targetingType4Label" [options]="targetingTypes" [default]="defaultTargetingType" (selected)="attributeUpdated($event, 'targetingType4')"></select-component>
            </div>
          </section>

          <section class="select" *ngIf="placementInput.ad_type">
            <div class="custom-column"> 
              <label for="type">Audience Type</label><br>
              <input type="text" id="customAudience" [(ngModel)]="placementInput.audience" placeholder="Enter Type" (change)="checkAttributes()">
            </div>
            <div class="custom-column" *ngIf="!_adtype.videoAdType(placementInput)"> 
              <label for="type">Width</label><br>
              <input type="text" id="customWidth" [(ngModel)]="placementInput.width" placeholder="Enter Width" (change)="checkAttributes()">
            </div>
            <div class="custom-column" *ngIf="!_adtype.videoAdType(placementInput)"> 
              <label for="type">Height</label><br>
              <input type="text" id="customHeight" [(ngModel)]="placementInput.height" placeholder="Enter Width" (change)="checkAttributes()">
            </div>
          </section>

        </div>
      </div>
    
    </div>
  `
})

export class PlacementComponent {
  @ViewChild(SelectComponent) selectComponent:SelectComponent;
  
  @Input() campaignInput: {};
  @Input() packageInput: {};
  @Input() placementTags: any[];
  @Input() episodes: any[];
  @Input() tactics: any[];
  @Input() devices: any[];
  @Input() adTypes: any[];
  @Input() targetingTypes: any[];
  @Output() placementTagFinal = new EventEmitter();

  episodeStartLabel: string = 'Episode Start';
  episodeEndLabel: string = 'Episode End';
  tacticLabel: string = 'Tactic';
  deviceLabel: string = 'Device';
  adTypeLabel: string = 'Ad Type';
  targetingType1Label: string = 'Targeting Type 1';
  targetingType2Label: string = 'Targeting Type 2';
  targetingType3Label: string = 'Targeting Type 3';
  targetingType4Label: string = 'Targeting Type 4';
  placementInput: any = {};
  existingPlacementInput: any;
  showSelectors: boolean = false;
  showButtons: boolean = false;
  showFinal: boolean = false;
  invalid: boolean = true;
  defaultTargetingType: any = {};

  constructor( private _placement: PlacementInputService, private _adtype: AdTypeService) {}

  ngOnInit() {
    this.defaultTargetingType = this.targetingTypes.find(x => x['name'] == 'None')
    this.placementInput.targetingType1 = this.defaultTargetingType;
    this.placementInput.targetingType2 = this.defaultTargetingType;
    this.placementInput.targetingType3 = this.defaultTargetingType;
    this.placementInput.targetingType4 = this.defaultTargetingType;
    this.placementInput.tentpole = null;

    if(!this.placementTags || this.placementTags.length == 0) {
      this.showButtons = true;
      this.showSelectors = true;
    }

  }

  // Updates the attribute when it is selected from child components
  attributeUpdated(value, attribute) {
    this.placementInput[attribute] = value;
    this.checkAttributes();
  }

  // Checks to see if everything is selected before creating the tag
  checkAttributes(){
    // Not a tentpole and not video ad type
    if(this.campaignInput['season']['name'] != 'Tentpole' && !this._adtype.videoAdType(this.placementInput) && 
      this.placementInput.episodeStartDate &&
      this.placementInput.episodeEndDate &&
      this.placementInput.height &&
      this.placementInput.width &&
      this.mainAttributes()
    ){
      this.createString();

    // Tentpole and not video ad type
    }else if(this.campaignInput['season']['name'] == 'Tentpole' && !this._adtype.videoAdType(this.placementInput) && this.mainAttributes() &&
      this.placementInput.tentpole &&
      this.placementInput.height &&
      this.placementInput.width
    ){
      this.createString();

    // Not a tentpole and is a video ad type
    }else if(this.campaignInput['season']['name'] != 'Tentpole' && this._adtype.videoAdType(this.placementInput) &&
      this.placementInput.episodeStartDate &&
      this.placementInput.episodeEndDate &&
      this.mainAttributes()
    ){
      this.createString();

      // Tentpole and is a video ad type
    }else if(this.campaignInput['season']['name'] == 'Tentpole' && this._adtype.videoAdType(this.placementInput) &&
      this.placementInput.tentpole &&
      this.mainAttributes()
    ){
      this.createString();
      }

  }

  verifyTag() {
    this._placement.verifyInput(this.placementInput.placementInputTag).subscribe(

      (result) => {
        this.existingPlacementInput = result;
        if(result) {
          this.placementTagFinal.emit(result)
        }
        
      },
      (error) => {
        console.log('Error', error)
      }
    )
  }

  saveInput() {
    // Create the params
    let createParams = {};
    if(this.campaignInput['season']['name'] != 'Tentpole'){
      createParams = {
        package_input_id: this.packageInput['id'],
        tactic_id: this.placementInput.tactic.id,
        device_id: this.placementInput.device.id,
        ad_type_id: this.placementInput.ad_type.id,
        audience_type: this.placementInput.audience,
        width: this.placementInput.width,
        height: this.placementInput.height,
        targeting_type_1_id: this.placementInput.targetingType1.id,
        targeting_type_2_id: this.placementInput.targetingType2.id,
        targeting_type_3_id: this.placementInput.targetingType3.id,
        targeting_type_4_id: this.placementInput.targetingType4.id,
        episode_start_id: this.placementInput.episodeStartDate.id,
        episode_end_id: this.placementInput.episodeEndDate.id,
        placement_input_tag: this.placementInput.placementInputTag
      } 
    } else {
      createParams = {
        package_input_id: this.packageInput['id'],
        tentpole_details: this.placementInput.tentpole,
        tactic_id: this.placementInput.tactic.id,
        device_id: this.placementInput.device.id,
        ad_type_id: this.placementInput.ad_type.id,
        audience_type: this.placementInput.audience,
        width: this.placementInput.width,
        height: this.placementInput.height,
        targeting_type_1_id: this.placementInput.targetingType1.id,
        targeting_type_2_id: this.placementInput.targetingType2.id,
        targeting_type_3_id: this.placementInput.targetingType3.id,
        targeting_type_4_id: this.placementInput.targetingType4.id,
        placement_input_tag: this.placementInput.placementInputTag
      }
    }
    this._placement.createInput(createParams).subscribe(

      (result) => {
        this.showSelectors = false;
        this.showButtons = false;
        this.showFinal = true;
        this.placementTagFinal.emit(result);
      },
      (error) => {
        console.log('ERROR', error);
      }
    );

  }

  selectInput(tag) {
    this.placementInput.placementInputTag = tag;
    this.showFinal = true;
    this.showSelectors = false;
    this.showButtons = false;
    this.verifyTag();
  }

  newTagSection() {
    this.showButtons = true ;
    this.showSelectors = true;
  }

  // Clears the selected options
  cancelInput() {
    this.selectComponent.clearSelections('Tactic');
    this.selectComponent.clearSelections('Episode Start');
    this.selectComponent.clearSelections('Episode End');
    this.selectComponent.clearSelections('Device');
    this.selectComponent.clearSelections('Ad Type');
    this.selectComponent.clearSelections('Targeting Type 1');
    this.selectComponent.clearSelections('Targeting Type 2');
    this.selectComponent.clearSelections('Targeting Type 3');
    this.selectComponent.clearSelections('Targeting Type 4');
    this.placementInput.height = null;
    this.placementInput.width = null;
    this.placementInput.audience = null;
    this.placementInput.tentpole = null;
    this.placementInput.placementInputTag = null;
  }

  mainAttributes() {
    return (this.placementInput.tactic &&
      this.placementInput.device &&
      this.placementInput.ad_type &&
      this.placementInput.audience)
  }

  createString() {
    this.placementInput.placementInputTag = this._placement.createPlacementString(this.campaignInput, this.packageInput, this.placementInput)
    if(this.placementInput.placementInputTag){
      this.verifyTag();
    }
   this.invalid = false;

  }

}