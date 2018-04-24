import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { PlacementInputService } from '../services/placement_input_service';
import { AdTypeService } from '../services/ad_type_service';
import { CampaignTypeService } from '../services/campaign_type_service';
import {SelectComponent} from './select.component';
import {TreeService} from '../services/tree_service';
import {HistoryService} from '../services/history_service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CustomInputValidationService } from '../services/custom_input_validation_service';

@Component({
  selector: 'placement',
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
                <div class="column" *ngIf="(episodes && episodes.length > 0) && !_campaign.tentpole(selectedObject.namestring.campaignParent)">
                <select-component [label]="episodeStartLabel" [default]="defaultEpisodeStart" [options]="episodes" (selected)="attributeUpdated($event, 'episode_start')"></select-component>
                </div>
                <div class="column" *ngIf="(episodes && episodes.length > 0) && !_campaign.tentpole(selectedObject.namestring.campaignParent)">
                  <select-component [label]="episodeEndLabel" [default]="defaultEpisodeEnd" [options]="episodes" (selected)="attributeUpdated($event, 'episode_end')"></select-component>
                </div>
                <div class="custom-column" *ngIf="_campaign.tentpole(selectedObject.namestring.campaignParent)"> 
                  <label for="customTentpole">Tentpole Details<span *ngIf="invalidTentpole" style="color: red"> Invalid</span></label><br>
                  <input type="text" id="customTentpole" [(ngModel)]="placementInput.tentpole_details" placeholder="Enter Details" (change)="checkAttributes()">
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
                    <select-component [label]="targetingType1Label" [options]="targetingTypes" [default]="defaultTargetingType1" (selected)="attributeUpdated($event, 'targeting_type_1')"></select-component>
                  </div>
                  <div class="column" *ngIf="targetingTypes && targetingTypes.length > 0">
                    <select-component [label]="targetingType2Label" [options]="targetingTypes" [default]="defaultTargetingType2" (selected)="attributeUpdated($event, 'targeting_type_2')"></select-component>
                  </div>
                  <div class="column" *ngIf="targetingTypes && targetingTypes.length > 0">
                    <select-component [label]="targetingType3Label" [options]="targetingTypes" [default]="defaultTargetingType3" (selected)="attributeUpdated($event, 'targeting_type_3')"></select-component>
                  </div>
                  <div class="column" *ngIf="targetingTypes && targetingTypes.length > 0">
                    <select-component [label]="targetingType4Label" [options]="targetingTypes" [default]="defaultTargetingType4" (selected)="attributeUpdated($event, 'targeting_type_4')"></select-component>
                  </div>
                </section>
                <section class="select" *ngIf="placementInput.ad_type">
                <div class="custom-column"> 
                  <label for="type">Audience Type<span *ngIf="invalidAudience" style="color: red"> Invalid</span></label><br>
                  <input type="text" id="customAudience" [(ngModel)]="placementInput.audience_type" placeholder="Enter Type" (change)="checkAttributes()">
                </div>
                <div class="custom-column"> 
                  <label for="type">Width<span *ngIf="invalidWidth" style="color: red"> Invalid</span></label><br>
                  <input type="text" id="customWidth" [(ngModel)]="placementInput.width" placeholder="Enter Width" (change)="checkAttributes()">
                </div>
                <div class="custom-column"> 
                  <label for="type">Height<span *ngIf="invalidHeight" style="color: red"> Invalid</span></label><br>
                  <input type="text" id="customHeight" [(ngModel)]="placementInput.height" placeholder="Enter Width" (change)="checkAttributes()">
                </div>
                </section>
                <section class="select">
                  <div class="action-column">
                    <button class="btn btn-primary action" (click)="Modal.hide()">Cancel</button>
                    <button class="btn btn-primary action" *ngIf="showSave" [disabled]="saveDisabled()" (click)="saveInput(action)">{{action}}</button>
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

export class PlacementComponent implements OnInit, OnChanges {
  @ViewChild(SelectComponent) 
  private selectComponent:SelectComponent;
  @ViewChild('Modal') public modal: ModalDirective;
  
  // Remove this?
  @Input() campaignInput: {};
  @Input() selectedObject: any = {};
  @Input() episodes: any[];
  @Input() tactics: any[];
  @Input() devices: any[];
  @Input() adTypes: any[];
  @Input() allAdTypes: any[];
  @Input() targetingTypes: any[];
  @Output() placementTagFinal = new EventEmitter();
  @Output() placementObjectSelected = new EventEmitter();
  @Output() placementTagUpdate = new EventEmitter();
  @Output() errorHandler = new EventEmitter();

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
  action: string = 'Create';
  invalidAudience: boolean;
  invalidTentpole: boolean;
  invalidWidth: boolean;
  invalidHeight: boolean;
  
  constructor( private _placement: PlacementInputService, private _adtype: AdTypeService, private _campaign: CampaignTypeService,  private changeDetector: ChangeDetectorRef, private _tree: TreeService, private _history: HistoryService, private _customValidate: CustomInputValidationService) {}

  ngOnInit() {
    if(this.selectedObject.action == 'New Placement') {
      this.defaultTargetingType1 = this.defaultTargetingType2 = this.defaultTargetingType3 = this.defaultTargetingType4 = this.targetingTypes.find(x => x['name'] == 'None')
      this.placementInput.targeting_type_1 = this.defaultTargetingType1;
      this.placementInput.targeting_type_2 = this.defaultTargetingType2;
      this.placementInput.targeting_type_3 = this.defaultTargetingType3;
      this.placementInput.targeting_type_4 = this.defaultTargetingType4;
      this.placementInput.tentpole_details = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.selectedObject.currentValue.action == 'Edit Placement') {
      this.action = 'Update'
      this.duplicate();
    }
    if(changes.selectedObject.currentValue.action == 'Copy/Create Placement') {
      this.action = 'Create'
      this.duplicate();
    }
  }

closeModal() {
    this.selectedObject.action = null;
    this.placementInput = {};
    this.adTypes = this.allAdTypes;
    this.cancelInput();
    this.showSave = false;
  }

  // Updates the attribute when it is selected from child components
  attributeUpdated(value, attribute) {
    this.placementInput[attribute] = value;
    this.checkAttributes();
  }

  saveDisabled = function() {
    return this.invalidAudience || this.invalidTentpole || this.invalidWidth || this.invalidHeight;
  }

  // Checks to see if everything is selected before creating the tag
  checkAttributes(){
    // Custom validations
    if(this.placementInput.audience_type) {
      let validResponse = this._customValidate.validateInput(this.placementInput.audience_type, 'Placement');
      if(validResponse['status'] == 'invalid') {
        this.invalidAudience = true;
        this.placementInput.audience_type = validResponse['value'];
      } else {
        this.invalidAudience = false;
        this.placementInput.audience_type = validResponse['value'];
      }
    }
    if(this.placementInput.tentpole_details) {
      let validResponse = this._customValidate.validateInput(this.placementInput.tentpole_details, 'Placement');
      if(validResponse['status'] == 'invalid') {
        this.invalidTentpole = true;
        this.placementInput.tentpole_details = validResponse['value'];
      } else {
        this.invalidTentpole = false;
        this.placementInput.tentpole_details = validResponse['value'];
      }
    }
    if(this.placementInput.width) {
      let validResponse = this._customValidate.validateInput(this.placementInput.width, 'Placement');
      if(validResponse['status'] == 'invalid') {
        this.invalidWidth = true;
        this.placementInput.width = validResponse['value'];
      } else {
        this.invalidWidth = false;
        this.placementInput.width = validResponse['value'];
      }
    }
    if(this.placementInput.height) {
      let validResponse = this._customValidate.validateInput(this.placementInput.height, 'Placement');
      if(validResponse['status'] == 'invalid') {
        this.invalidHeight = true;
        this.placementInput.height = validResponse['value'];
      } else {
        this.invalidHeight = false;
        this.placementInput.height = validResponse['value'];
      }
    }

    // Not a tentpole and not video ad type
    if(!this._campaign.tentpole(this.selectedObject.namestring.campaignParent) && !this._adtype.videoAdType(this.placementInput) && 
      this.placementInput.episode_start &&
      this.placementInput.episode_end &&
      this.placementInput.height &&
      this.placementInput.width &&
      this.mainAttributes()
    ){
      this.showSave = true;
      this.createString();

    // Tentpole and not video ad type
    }else if(this._campaign.tentpole(this.selectedObject.namestring.campaignParent) && !this._adtype.videoAdType(this.placementInput) && this.mainAttributes() &&
      this.placementInput.tentpole_details &&
      this.placementInput.height &&
      this.placementInput.width
    ){
      this.showSave = true;
      this.createString();

    // Not a tentpole and is a video ad type
    }else if(!this._campaign.tentpole(this.selectedObject.namestring.campaignParent) && this._adtype.videoAdType(this.placementInput) &&
      this.placementInput.episode_start &&
      this.placementInput.episode_end &&
      this.mainAttributes()
    ){
      this.showSave = true;
      this.createString();

      // Tentpole and is a video ad type
    }else if(this._campaign.tentpole(this.selectedObject.namestring.campaignParent) && this._adtype.videoAdType(this.placementInput) &&
      this.placementInput.tentpole_details &&
      this.mainAttributes()
    ){
      this.showSave = true;
      this.createString();
      }

  }

  saveInput(action) {
    // Create the params
    let createParams = {};
    if(!this._campaign.tentpole(this.selectedObject.namestring.campaignParent)){
      createParams = {
        package_input_id: this.selectedObject.namestring.packageParent.id,
        tactic_id: this.placementInput.tactic.id,
        device_id: this.placementInput.device.id,
        ad_type_id: this.placementInput.ad_type.id,
        audience_type: this.placementInput.audience_type,
        width: this.placementInput.width,
        height: this.placementInput.height,
        targeting_type_1_id: this.placementInput.targeting_type_1.id,
        targeting_type_2_id: this.placementInput.targeting_type_2.id,
        targeting_type_3_id: this.placementInput.targeting_type_3.id,
        targeting_type_4_id: this.placementInput.targeting_type_4.id,
        episode_start_id: this.placementInput.episode_start.id,
        episode_end_id: this.placementInput.episode_end.id,
        placement_input_tag: this.placementInput.placementInputTag
      } 
    } else {
      createParams = {
        package_input_id: this.selectedObject.namestring.packageParent.id,
        tentpole_details: this.placementInput.tentpole_details,
        tactic_id: this.placementInput.tactic.id,
        device_id: this.placementInput.device.id,
        ad_type_id: this.placementInput.ad_type.id,
        audience_type: this.placementInput.audience_type,
        width: this.placementInput.width,
        height: this.placementInput.height,
        targeting_type_1_id: this.placementInput.targeting_type_1.id,
        targeting_type_2_id: this.placementInput.targeting_type_2.id,
        targeting_type_3_id: this.placementInput.targeting_type_3.id,
        targeting_type_4_id: this.placementInput.targeting_type_4.id,
        placement_input_tag: this.placementInput.placementInputTag
      }
    }

    if(action == 'Update') {
      createParams['package_input_id'] = this.selectedObject.namestring.namestring.package_input_id;
      createParams['ad_type'] = this.selectedObject.namestring.namestring.ad_type;
      createParams['lock_version'] = this.selectedObject.namestring.namestring.lock_version;
      this._placement.updateInput(this.selectedObject.namestring.namestring, createParams, this.selectedObject.namestring.campaignParent, this.selectedObject.namestring.packageParent).subscribe(

        (result) => {
          this.placementInput = result;
          this.placementInput.package_input = this.selectedObject.namestring.packageParent;
          this.placementInput.package_input.campaign_input = this.selectedObject.namestring.campaignParent;
          this.placementTagUpdate.emit(this.placementInput);
          this.selectedObject.action = null;
          this.selectedObject.namestring.namestring = {};
          this.showSave = false;
        },
        (error) => {
          this.modal.hide();
          if(error.status == 409) {
            this.errorHandler.emit('Conflicting Updates');
          } else {
           this.errorHandler.emit('Updating Placement');
          }
          console.log('Error', error);
        }
      )

    } else if(action == 'Create') {
      if(this.selectedObject.action == 'Copy/Create Placement') {
        createParams['package_input_id'] = this.selectedObject.namestring.namestring.package_input_id;
      }
      this._placement.createInput(createParams).subscribe(

        (result) => {
          this.placementObject = result[0];
          if(result[1]['status'] == 200) {
            this.placementObjectSelected.emit(this.placementObject);
          } else {
            this.placementTagFinal.emit(this.placementObject);
          }
          this.selectedObject.action = null;
          // Reset everything
          this.placementInput = {};
          this.defaultTargetingType1 = this.defaultTargetingType2 = this.defaultTargetingType3 = this.defaultTargetingType4 = this.targetingTypes.find(x => x['name'] == 'None')
          this.placementInput.targeting_type_1 = this.defaultTargetingType1;
          this.placementInput.targeting_type_3 = this.defaultTargetingType2;
          this.placementInput.targeting_type_3 = this.defaultTargetingType3;
          this.placementInput.targeting_type_4 = this.defaultTargetingType4;
          this.placementInput.tentpole_details = null;
         
          this.showSave = false;
        },
        (error) => {
          this.modal.hide();
          this.errorHandler.emit('Creating Placement');
          console.log('ERROR', error);
        }
      );

    } else {}
  }

  // Clears the selected options
  cancelInput() {
    if(this._campaign.tentpole(this.selectedObject.namestring.campaignParent)) {
      this.placementInput.tentpole_details = null;
    }
    if(!this._campaign.tentpole(this.selectedObject.namestring.campaignParent)) {
      this.defaultEpisodeStart = undefined;
      this.defaultEpisodeEnd = undefined;
    }
    this.defaultTactic = undefined;
    this.defaultDevice = undefined;
    this.defaultAdType = undefined;
    this.defaultTargetingType1 = this.defaultTargetingType2 = this.defaultTargetingType3 = this.defaultTargetingType4 = this.targetingTypes.find(x => x['name'] == 'None')
    this.placementInput.targeting_type_1 = this.defaultTargetingType1;
    this.placementInput.targeting_type_2 = this.defaultTargetingType2;
    this.placementInput.targeting_type_3 = this.defaultTargetingType3;
    this.placementInput.targeting_type_4 = this.defaultTargetingType4;
  }

  mainAttributes() {
    return (this.placementInput.tactic &&
      this.placementInput.device &&
      this.placementInput.ad_type &&
      this.placementInput.audience_type)
  }

  createString() {
    this.placementInput.placementInputTag = this._placement.createPlacementString(this.selectedObject.namestring.campaignParent, this.selectedObject.namestring.packageParent, this.placementInput)
    this.invalid = false;
  }

  duplicate() {

    if(this.selectedObject.namestring.namestring.ad_inputs && this.selectedObject.namestring.namestring.ad_inputs.length > 0 && this.selectedObject.namestring.namestring.ad_type.abbrev == 'SVD' || this.selectedObject.namestring.namestring.ad_type.abbrev == 'NSV') {
      // Remove non-video options since children could be effected.
      this.adTypes = [];
      this.adTypes.push(this.allAdTypes.find( x => x.abbrev == 'SVD'));
      this.adTypes.push(this.allAdTypes.find( x => x.abbrev == 'NSV'));
    }

    if(this.selectedObject.namestring.namestring.ad_inputs && this.selectedObject.namestring.namestring.ad_inputs.length > 0 && this.selectedObject.namestring.namestring.ad_type.abbrev != 'SVD' && this.selectedObject.namestring.namestring.ad_type.abbrev != 'NSV') {
      // Remove the video options since children could be effected.
      this.adTypes = this.adTypes.filter( x => x.abbrev != 'SVD' && x.abbrev != 'NSV')
    }

    if(this._campaign.tentpole(this.selectedObject.namestring.campaignParent)) {
      this.placementInput.tentpole_details = this.selectedObject.namestring.namestring.tentpole_details;
    }
    if(!this._campaign.tentpole(this.selectedObject.namestring.campaignParent)) {
      this.defaultEpisodeStart = this.placementInput.episode_start = this.episodes.find(x => x['id'] == this.selectedObject.namestring.namestring.episode_start_id);
      this.defaultEpisodeEnd = this.placementInput.episode_end = this.episodes.find(x => x['id'] == this.selectedObject.namestring.namestring.episode_end_id);
    }
    this.defaultTactic = this.placementInput.tactic = this.tactics.find(x => x['id'] == this.selectedObject.namestring.namestring.tactic_id);
    this.defaultDevice = this.placementInput.device = this.devices.find(x => x['id'] == this.selectedObject.namestring.namestring.device_id);
    this.defaultAdType = this.placementInput.ad_type = this.adTypes.find(x => x['id'] == this.selectedObject.namestring.namestring.ad_type_id);
    this.placementInput.audience_type = this.selectedObject.namestring.namestring.audience_type;
    this.placementInput.height = this.selectedObject.namestring.namestring.height;
    this.placementInput.width = this.selectedObject.namestring.namestring.width;
    this.defaultTargetingType1 = this.placementInput.targeting_type_1 = this.targetingTypes.find(x => x['id'] == this.selectedObject.namestring.namestring.targeting_type_1_id);
    this.defaultTargetingType2 = this.placementInput.targeting_type_2 = this.targetingTypes.find(x => x['id'] == this.selectedObject.namestring.namestring.targeting_type_2_id);
    this.defaultTargetingType3 = this.placementInput.targeting_type_3 = this.targetingTypes.find(x => x['id'] == this.selectedObject.namestring.namestring.targeting_type_3_id);
    this.defaultTargetingType4 = this.placementInput.targeting_type_4 = this.targetingTypes.find(x => x['id'] == this.selectedObject.namestring.namestring.targeting_type_4_id);
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
    if(!this._campaign.tentpole(this.selectedObject.namestring.campaignParent)) {
      this.selectComponent.setSelections(this.episodeStartLabel);
      this.selectComponent.setSelections(this.episodeEndLabel);
    }
  }

}