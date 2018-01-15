import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PlacementInputService } from '../services/placement_input_service';
import { AdTypeService } from '../services/ad_type_service';
import { CampaignTypeService } from '../services/campaign_type_service';
import {SelectComponent} from './select.component';
import {TreeService} from '../services/tree_service';
import {HistoryService} from '../services/history_service';

@Component({
  selector: 'placement',
  template: `

  <div *ngIf="selectedObject.action">
    <div [config]="{ show: true }" (onHide)=closeModal() bsModal #autoShownModal="bs-modal" #Modal="bs-modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content campaign">
          <div class="modal-header">
            <h4 class="modal-title pull-left">{{selectedObject.action}} Placement</h4>
            <button type="button" class="close pull-right" (click)="Modal.hide()" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="select-container">
              <div class="row">
                <section class="select">
                <div class="column" *ngIf="(episodes && episodes.length > 0) && !_campaign.tentpole(selectedObject.namestring.campaignParent)">
                <select-component [label]="episodeStartLabel" [default]="defaultEpisodeStart" [options]="episodes" (selected)="attributeUpdated($event, 'episodeStartDate')"></select-component>
                </div>
                <div class="column" *ngIf="(episodes && episodes.length > 0) && !_campaign.tentpole(selectedObject.namestring.campaignParent)">
                  <select-component [label]="episodeEndLabel" [default]="defaultEpisodeEnd" [options]="episodes" (selected)="attributeUpdated($event, 'episodeEndDate')"></select-component>
                </div>
                <div class="custom-column" *ngIf="_campaign.tentpole(selectedObject.namestring.campaignParent)"> 
                  <label for="customTentpole">Tentpole Details</label><br>
                  <input type="text" id="customTentpole" [(ngModel)]="placementInput.tentpole" placeholder="Enter Details" (change)="checkAttributes()">
                </div>
                </section>
                <section class="select">  
                <div class="column" *ngIf="tactics && tactics.length > 0">
                  <select-component [label]="tacticLabel" [default]="defaultTactic" [options]="tactics" (selected)="attributeUpdated($event, 'tactic')"></select-component>
                </div>
                <div class="column" *ngIf="devices && devices.length > 0">
                  <select-component [label]="deviceLabel" [default]="defaultDevice" [options]="devices" (selected)="attributeUpdated($event, 'device')"></select-component>
                </div>
                <div class="column" *ngIf="adTypes && adTypes.length > 0">
                  <select-component [label]="adTypeLabel" [default]="defaultAdType" [options]="adTypes" (selected)="attributeUpdated($event, 'ad_type')"></select-component>
                </div>
                </section>
                <section class="select" *ngIf="placementInput.ad_type">
                  <div class="column" *ngIf="targetingTypes && targetingTypes.length > 0">
                    <select-component [label]="targetingType1Label" [options]="targetingTypes" [default]="defaultTargetingType1" (selected)="attributeUpdated($event, 'targetingType1')"></select-component>
                  </div>
                  <div class="column" *ngIf="targetingTypes && targetingTypes.length > 0">
                    <select-component [label]="targetingType2Label" [options]="targetingTypes" [default]="defaultTargetingType2" (selected)="attributeUpdated($event, 'targetingType2')"></select-component>
                  </div>
                  <div class="column" *ngIf="targetingTypes && targetingTypes.length > 0">
                    <select-component [label]="targetingType3Label" [options]="targetingTypes" [default]="defaultTargetingType3" (selected)="attributeUpdated($event, 'targetingType3')"></select-component>
                  </div>
                  <div class="column" *ngIf="targetingTypes && targetingTypes.length > 0">
                    <select-component [label]="targetingType4Label" [options]="targetingTypes" [default]="defaultTargetingType4" (selected)="attributeUpdated($event, 'targetingType4')"></select-component>
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
                <section class="select">
                  <div class="action-column">
                    <button class="btn btn-primary action" (click)="Modal.hide()">Cancel Placement</button>
                    <button class="btn btn-primary action" *ngIf="showSave" (click)="saveInput()">Create Placement</button>
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

export class PlacementComponent {
  @ViewChild(SelectComponent) 
  private selectComponent:SelectComponent;
  
  // Remove this?
  @Input() campaignInput: {};
  @Input() selectedObject: any = {};
  @Input() placementTags: any[];
  @Input() episodes: any[];
  @Input() tactics: any[];
  @Input() devices: any[];
  @Input() adTypes: any[];
  @Input() targetingTypes: any[];
  @Output() placementTagFinal = new EventEmitter();
  @Output() placementObjectCreated = new EventEmitter();

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
  defaultTargetingType1: any = {};
  defaultTargetingType2: any = {};
  defaultTargetingType3: any = {};
  defaultTargetingType4: any = {};
  defaultEpisodeStart: any;
  defaultEpisodeEnd: any;
  defaultTactic: any;
  defaultDevice: any;
  defaultAdType: any;
  placementObject: any = {};
  showSave: boolean = false;
  showSelect: boolean = false;

  constructor( private _placement: PlacementInputService, private _adtype: AdTypeService, private _campaign: CampaignTypeService,  private changeDetector: ChangeDetectorRef, private _tree: TreeService, private _history: HistoryService) {}

  ngOnInit() {
    this.defaultTargetingType1 = this.defaultTargetingType2 = this.defaultTargetingType3 = this.defaultTargetingType4 = this.targetingTypes.find(x => x['name'] == 'None')
    this.placementInput.targetingType1 = this.defaultTargetingType1;
    this.placementInput.targetingType2 = this.defaultTargetingType2;
    this.placementInput.targetingType3 = this.defaultTargetingType3;
    this.placementInput.targetingType4 = this.defaultTargetingType4;
    this.placementInput.tentpole = null;

    // if(!this.placementTags || this.placementTags.length == 0) {
    //   this.showButtons = true;
    //   this.showSelectors = true;
    // }

  }

  closeModal() {
    this.selectedObject.action = null;
    this.placementInput = {};
    this.defaultTargetingType1 = this.defaultTargetingType2 = this.defaultTargetingType3 = this.defaultTargetingType4 = this.targetingTypes.find(x => x['name'] == 'None')
    this.placementInput.targetingType1 = this.defaultTargetingType1;
    this.placementInput.targetingType2 = this.defaultTargetingType2;
    this.placementInput.targetingType3 = this.defaultTargetingType3;
    this.placementInput.targetingType4 = this.defaultTargetingType4;
    this.placementInput.tentpole = null;
    this.showSave = false;
  }

  // Updates the attribute when it is selected from child components
  attributeUpdated(value, attribute) {
    this.placementInput[attribute] = value;
    this.checkAttributes();
  }

  // Checks to see if everything is selected before creating the tag
  checkAttributes(){
    // Not a tentpole and not video ad type
    if(!this._campaign.tentpole(this.selectedObject.namestring.campaignParent) && !this._adtype.videoAdType(this.placementInput) && 
      this.placementInput.episodeStartDate &&
      this.placementInput.episodeEndDate &&
      this.placementInput.height &&
      this.placementInput.width &&
      this.mainAttributes()
    ){
      this.showSave = true;
      this.createString();

    // Tentpole and not video ad type
    }else if(this._campaign.tentpole(this.selectedObject.namestring.campaignParent) && !this._adtype.videoAdType(this.placementInput) && this.mainAttributes() &&
      this.placementInput.tentpole &&
      this.placementInput.height &&
      this.placementInput.width
    ){
      this.showSave = true;
      this.createString();

    // Not a tentpole and is a video ad type
    }else if(!this._campaign.tentpole(this.selectedObject.namestring.campaignParent) && this._adtype.videoAdType(this.placementInput) &&
      this.placementInput.episodeStartDate &&
      this.placementInput.episodeEndDate &&
      this.mainAttributes()
    ){
      this.showSave = true;
      this.createString();

      // Tentpole and is a video ad type
    }else if(this._campaign.tentpole(this.selectedObject.namestring.campaignParent) && this._adtype.videoAdType(this.placementInput) &&
      this.placementInput.tentpole &&
      this.mainAttributes()
    ){
      this.showSave = true;
      this.createString();
      }

  }

  verifyTag() {
    this._placement.verifyInput(this.placementInput.placementInputTag).subscribe(

      (result) => {
        this.existingPlacementInput = result;
        this.showSave = true;
        if(result) {
          this.placementObject = result;
          this.showSelect = true;
          this._history.storeInput(result);
          this._tree.createPlacementTree(result);
          this.placementObjectCreated.emit(JSON.parse(localStorage.getItem('inputs')));
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
    if(!this._campaign.tentpole(this.selectedObject.namestring.campaignParent)){
      createParams = {
        package_input_id: this.selectedObject.namestring.packageParent.id,
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
        package_input_id: this.selectedObject.namestring.packageParent.id,
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
        // this.showSelectors = false;
        // this.showButtons = false;
        // this.showFinal = true;
        this.placementObject = result;
        // this._history.storeInput(result);
        this._tree.createPlacementTree(result);
        this.placementObjectCreated.emit(JSON.parse(localStorage.getItem('inputs')));
        this.placementTagFinal.emit(result);
        this.selectedObject.action = null;
        // Reset everything
        this.placementInput = {};
        this.defaultTargetingType1 = this.defaultTargetingType2 = this.defaultTargetingType3 = this.defaultTargetingType4 = this.targetingTypes.find(x => x['name'] == 'None')
        this.placementInput.targetingType1 = this.defaultTargetingType1;
        this.placementInput.targetingType2 = this.defaultTargetingType2;
        this.placementInput.targetingType3 = this.defaultTargetingType3;
        this.placementInput.targetingType4 = this.defaultTargetingType4;
        this.placementInput.tentpole = null;
        this.showSave = false;
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
  // cancelInput() {
  //   if(this._campaign.tentpole(this.campaignInput)) {
  //     this.placementInput.tentpole = null;
  //   }
  //   if(!this._campaign.tentpole(this.campaignInput)) {
  //     this.selectComponent.setSelections(this.episodeStartLabel);
  //     this.selectComponent.setSelections(this.episodeEndLabel);
  //   }
  //   this.selectComponent.setSelections(this.tacticLabel);
  //   this.selectComponent.setSelections(this.deviceLabel);
  //   this.selectComponent.setSelections(this.adTypeLabel);
  //   this.selectComponent.setSelections(this.targetingType1Label);
  //   this.selectComponent.setSelections(this.targetingType2Label);
  //   this.selectComponent.setSelections(this.targetingType3Label);
  //   this.selectComponent.setSelections(this.targetingType4Label);
  //   this.placementInput.height = null;
  //   this.placementInput.width = null;
  //   this.placementInput.audience = null;
  //   this.placementInput.placementInputTag = null;
  // }

  mainAttributes() {
    return (this.placementInput.tactic &&
      this.placementInput.device &&
      this.placementInput.ad_type &&
      this.placementInput.audience)
  }

  createString() {
    this.placementInput.placementInputTag = this._placement.createPlacementString(this.selectedObject.namestring.campaignParent, this.selectedObject.namestring.packageParent, this.placementInput)
    if(this.placementInput.placementInputTag){
      this.verifyTag();
    }
   this.invalid = false;

  }

  duplicate() {
    this.showButtons = true;
    this.showFinal = false;
    this.existingPlacementInput = false;
    this.invalid = true;
    // Hide the Ad input section
    this.placementTagFinal.emit(null);
    // Set default values
    if(this._campaign.tentpole(this.campaignInput)) {
      this.placementInput.tentpole = this.placementObject.tentpole;
    }
    if(!this._campaign.tentpole(this.campaignInput)) {
      this.defaultEpisodeStart = this.placementInput.episodeStartDate = this.episodes.find(x => x['name'] == this.placementObject.episode_start.name);
      this.defaultEpisodeEnd = this.placementInput.episodeEndDate = this.episodes.find(x => x['name'] == this.placementObject.episode_end.name);
    }
    this.defaultTactic = this.placementInput.tactic = this.tactics.find(x => x['name'] == this.placementObject.tactic.name);
    this.defaultDevice = this.placementInput.device = this.devices.find(x => x['name'] == this.placementObject.device.name);
    this.defaultAdType = this.placementInput.ad_type = this.adTypes.find(x => x['name'] == this.placementObject.ad_type.name);
    this.placementInput.audience = this.placementObject.audience_type;
    this.placementInput.height = this.placementObject.height;
    this.placementInput.width = this.placementObject.width;
    this.defaultTargetingType1 = this.placementInput.targeting_type_1 = this.targetingTypes.find(x => x['name'] == this.placementObject.targeting_type_1.name);
    this.defaultTargetingType2 = this.placementInput.targeting_type_2 = this.targetingTypes.find(x => x['name'] == this.placementObject.targeting_type_2.name);
    this.defaultTargetingType3 = this.placementInput.targeting_type_3 = this.targetingTypes.find(x => x['name'] == this.placementObject.targeting_type_3.name);
    this.defaultTargetingType4 = this.placementInput.targeting_type_4 = this.targetingTypes.find(x => x['name'] == this.placementObject.targeting_type_4.name);
    this.showSelectors = true;
    // Checks to see if the ngIf has changed and the selectors are showing.
    this.changeDetector.detectChanges();
    // Set selectors
    this.selectComponent.setSelections(this.tacticLabel);
    this.selectComponent.setSelections(this.deviceLabel);
    this.selectComponent.setSelections(this.adTypeLabel);
    this.selectComponent.setSelections(this.targetingType1Label);
    this.selectComponent.setSelections(this.targetingType2Label);
    this.selectComponent.setSelections(this.targetingType3Label);
    this.selectComponent.setSelections(this.targetingType4Label);
    if(!this._campaign.tentpole(this.campaignInput)) {
      this.selectComponent.setSelections(this.episodeStartLabel);
      this.selectComponent.setSelections(this.episodeEndLabel);
    }
  }

}