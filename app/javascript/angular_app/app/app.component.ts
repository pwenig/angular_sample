import { Component, OnInit, ViewChild } from '@angular/core';
import { MetadataService } from '../services/metadata_service';
import {CampaignComponent} from './campaign.component';
import {CampaignInputService} from '../services/campaign_input_service';
import {CreativeInputService} from '../services/creative_input_service';
import {ExportService} from '../services/export_service';
import { LIFECYCLE_HOOKS_VALUES } from '@angular/compiler/src/lifecycle_reflector';

@Component({
  selector: 'app-component',
  template: `
   <div class="flexbox-item">
    <actions [selectedNameString]="selectedNameString" (namestringAction)="selectedAction($event)" [namestringSelected]="disableActions"></actions>
    <a href="/glossary">Glossary</a>
   </div>
      <tree class="flexbox-item-grow flexbox-parent" [loading]="loading" [current_created_input]="current_created_input" [action]="action" [all_inputs]="all_inputs" (selectedNamestring)="selectedString($event)"></tree>
    <div *ngIf="campaignAction">
      <campaign [selectedObject]="selectedObject" [agency]="agency" [networks]="networks" [seasons]="seasons" [allSeasons]="seasons" [campaignTags]="campaignTags" [campaignTypes]="campaignTypes" (campaignObject)="selectCampaignTag($event)" (campaignInputTagFinal)="setCampaignTag($event)" (campaignTagUpdate)="updateCampaignTag($event)" (errorHandler)="errorEvent($event)"></campaign>
    </div>
    <div *ngIf="packageAction">
      <package [selectedObject]="selectedObject" [agency]="agency" [publishers]="publishers" [buyMethods]="buyMethods" [inventoryTypes]="inventoryTypes" (packageObjectSelected)="selectPackageTag($event)" (packageInputTagFinal)="setPackageTag($event)" (packageTagUpdate)="updatePackageTag($event)" (errorHandler)="errorEvent($event)"></package>
    </div>
    <div *ngIf="placementAction">
      <placement [selectedObject]="selectedObject" [episodes]="episodes" [tactics]="tactics" [devices]="devices" [adTypes]="adTypes" [allAdTypes]="adTypes" [targetingTypes]="targetingTypes" (placementObjectSelected)="selectPlacementTag($event)" (placementTagFinal)="setPlacementTag($event)" (placementTagUpdate)="updatePlacementTag($event)" (errorHandler)="errorEvent($event)"></placement>
    </div>
    <div *ngIf="adAction">
      <ad [selectedObject]="selectedObject" [adTags]="adTags" [creativeGroups]="creativeGroups" (adTagFinal)="setAdTag($event)" (adObjectSelected)="selectAdTag($event)" (adTagUpdate)="updateAdTag($event)" (errorHandler)="errorEvent($event)"></ad>
    </div>
    <div *ngIf="creativeAction">
      <creative [selectedObject]="selectedObject" [creativeTags]="creativeTags" [creativeMessages]="creativeMessages" [abtestLabels]="abtestLabels" [videoLengths]="videoLengths" (creativeTagFinal)="setCreativeTag($event)" (creativeObjectSelected)="selectCreativeTag($event)" (creativeTagUpdate)="updateCreativeTag($event)" (errorHandler)="errorEvent($event)"></creative>
    </div>
    <div *ngIf="deleteAction">
      <delete [selectedObject]="selectedObject" (cancelDelete)="cancelDelete()" (namestringDeleted)="removeInput($event)"></delete>
    </div>
    <div *ngIf="errorOccured">
      <error-component [errorMessage]="errorMessage" (errorClosed)="errorClosed()"></error-component>
    </div>
  `
})

export class AppComponent implements OnInit {
  @ViewChild(CampaignComponent)
  private campaignComponent:CampaignComponent;

  networks: any = [];
  seasons: any = [];
  campaignTypes: any = [];
  agency: any = {};
  publishers: any = [];
  buyMethods: any = [];
  inventoryTypes: any = [];
  adTypes: any = [];
  targetingTypes: any = [];
  tactics: any = [];
  devices: any = [];
  episodes: any = [];
  creativeGroups: any = [];
  creativeMessages: any = [];
  abtestLabels: any = [];
  videoLengths: any = [];
  campaignInput: any = {};
  packageInput: any = {}
  placementInput: any = {};
  adInput: any = {};
  creativeInput: any = {};
  campaignTags: any = [];
  adTags: any = [];
  creativeTags: any = [];
  selectedNameString: any = {};
  disableActions: boolean = true;
  selectedObject: any = {};
  campaignAction: boolean;
  packageAction: boolean;
  placementAction: boolean;
  adAction: boolean;
  creativeAction: boolean;
  deleteAction: boolean;
  action: any;
  newCreatedCampaign: any = {};
  // Object that has current campaign object arrays for the current heirarchy
  current_created_input: any = {};
  // Current array of mamestrings that can be exported. Remove? No longer being passed to tree comp
  current_exports: any = [];
  all_inputs: any = [];
  // All namestrings that have been created. Remove? No longer being passed to tree comp.
  all_exports: any = [];
  errorOccured: boolean;
  errorMessage: any;
  loading: boolean = true;

  constructor( private _metadata: MetadataService, private _campaign: CampaignInputService, private _creative: CreativeInputService, private _export: ExportService) {}

  ngOnInit() {
    // Call MetadataService
    this._metadata.getMetadata().subscribe(

      (data) => {
        this.networks = data['networks'];
        this.seasons = data['seasons'];
        this.campaignTypes = data['campaign_types'];
        this.agency = data['agency'];
        this.publishers = data['publishers'];
        this.buyMethods = data['buy_methods'];
        this.inventoryTypes = data['inventory_types'];
        this.adTypes = data['ad_types'];
        this.targetingTypes = data['targeting_types'];
        this.tactics = data['tactics'];
        this.devices = data['devices'];
        this.episodes = data['episodes'];
        this.creativeGroups = data['creative_groups'];
        this.creativeMessages = data['creative_messages'];
        this.abtestLabels = data['abtest_labels'];
        this.videoLengths = data['video_lengths'];
        this.campaignTags = data['campaign_tags'];
      },
      (error) => {
        console.log('Error', error)
      }

    )

    // // Get the current input objects that have been created and stored in localStorage
    // if(!JSON.parse(localStorage.getItem('inputs'))) {
    //   // If it does not exist, create an empty object
    //   this.current_created_input = {};
    // } else {
    //   this.current_created_input = JSON.parse(localStorage.getItem('inputs'));
    // }

    // Get all of the input objects that have been created
    this._campaign.getInputs().subscribe(
      (data) => {
        this.all_inputs = data.reverse();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.errorOccured = true;
        this.errorMessage = 'loading Namestrings';
        console.log('Error', error);
      }
    )

    // Get all of the current input strings
    if(!JSON.parse(localStorage.getItem('inputs'))) {
      this.current_exports = [];
    } else {
      this.current_exports = JSON.parse(localStorage.getItem('inputs'));
    }
  }

  // This function is called when a namestring has been selected from the children-component
  selectedString(nameStringObject) {
    if(nameStringObject == null) {
      this.selectedNameString = null
      this.disableActions = true;
    } else {
      this.selectedNameString = nameStringObject;
      this.disableActions = false;
    }
  }

  // This is called when an action has been selected
  selectedAction(action) {
    this.selectedObject = {namestring: this.selectedNameString, action: action};
    if(action.includes('Campaign')) {
      this.changeModals(true, false, false, false, false);
    }
    if(action.includes('Package')) {
      this.changeModals(false, true, false, false, false);
    }
    if(action.includes('Placement')) {
      this.changeModals(false, false, true, false, false)
    }
    if( action.includes('Ad')) {
      this.changeModals(false, false, false, true, false);
    }
    if(action.includes('Creative')) {
      this.changeModals(false, false, false, false, true)
    }
    if(action.includes('Export')) {
      this._export.export(this.selectedObject.namestring);
    }
    if(action.includes('Delete')) {
      this.deleteAction = true;
      this.changeModals(false, false, false, false, false);
    }
  }

  cancelDelete() {
    this.deleteAction = false;
  }

  changeModals(campaignModal, packageModal, placementModal, adModal, creativeModal) {
      this.campaignAction = campaignModal;
      this.packageAction = packageModal;
      this.placementAction = placementModal;
      this.adAction = adModal;
      this.creativeAction = creativeModal;
  }

  setCampaignTag(campaignTag) {
    this.campaignInput = campaignTag;
    this.current_created_input = {namestring: campaignTag, parentType: 'Campaign', childType: 'Package'};
    this.all_inputs.unshift(campaignTag);
    this.campaignTags.push(campaignTag.campaign_input_tag);
    this.campaignAction = false;
  }

  selectCampaignTag(campaignTag) {
    this.campaignInput = campaignTag;
    this.current_created_input = {namestring: campaignTag, parentType: 'Campaign', childType: 'Package'};
    let updatedCampaign = this.all_inputs.find(x => x.id == campaignTag.id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    this.all_inputs.splice(index, 1);
    this.all_inputs.unshift(campaignTag);
    this.action = 'Edit';
    this.campaignAction = false;
  }

  setPackageTag(packageTag) {
    this.packageInput = packageTag;
    this.current_created_input = {namestring: packageTag, parentType: 'Package', childType: 'Placement'};
    // Update the object in the all_inputs array
    let updatedCampaign = this.all_inputs.find(x => x.id == packageTag.campaign_input_id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    updatedCampaign.package_inputs.unshift(packageTag);
    this.all_inputs[index] = updatedCampaign;
    this.packageAction = false;
  }

  selectPackageTag(packageTag) {
    this.packageInput = packageTag;
    this.current_created_input = {namestring: packageTag, parentType: 'Package', childType: 'Placement'};
    let updatedCampaign = this.all_inputs.find(x => x.id == packageTag.campaign_input_id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let packageIndex = updatedCampaign.package_inputs.find(x => x.id == packageTag.id);
    updatedCampaign.package_inputs.splice(packageIndex, 1);
    updatedCampaign.package_inputs.unshift(packageTag);
    this.all_inputs[index] = updatedCampaign;
    this.packageAction = false;
  }

  setPlacementTag(placementTag) {
    this.placementInput = placementTag;
    this.current_created_input = {namestring: placementTag, parentType: 'Placement', childType: 'Ad'};
    let updatedCampaign = this.all_inputs.find(x => x.id == placementTag.package_input.campaign_input_id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == placementTag.package_input.id);
    updatedPackage.placement_inputs.unshift(placementTag);
    this.all_inputs[index] = updatedCampaign;
    this.placementAction = false;
    if(this.placementInput.ad_inputs && this.placementInput.ad_inputs.length > 0) {
      this.adTags = this.placementInput.ad_inputs.map(n=> n['ad_input_tag']);
    } else {
      this.adTags = [];
    }
  }

  selectPlacementTag(placementTag) {
    this.placementInput = placementTag;
    this.current_created_input = {namestring: placementTag, parentType: 'Placement', childType: 'Ad'};
    let updatedCampaign = this.all_inputs.find(x => x.id == placementTag.package_input.campaign_input_id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == placementTag.package_input.id);
    let placementIndex = updatedPackage.placement_inputs.find(x => x.id == placementTag.id);
    updatedPackage.placement_inputs.splice(placementIndex, 1);
    updatedPackage.placement_inputs.unshift(placementTag);
    this.all_inputs[index] = updatedCampaign;
    this.placementAction = false;
  }


  setAdTag(adTag) {
    this.adInput = adTag;
    this.current_created_input = {namestring: adTag, parentType: 'Ad', childType: 'Creative'};
    let updatedCampaign = this.all_inputs.find(x => x.id == adTag.placement_input.package_input.campaign_input_id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == adTag.placement_input.package_input.id);
    let updatedPlacement = updatedPackage.placement_inputs.find(x => x.id == adTag.placement_input_id);
    updatedPlacement.ad_inputs.unshift(adTag);
    this.all_inputs[index] = updatedCampaign;
    this.selectedNameString.namestring = adTag;
    this.adAction = false;
    if(this.adInput.creative_inputs && this.adInput.creative_inputs.length > 0) {
      this.creativeTags = this.adInput.creative_inputs.map(n=> n['creative_input_tag']);
    } else {
      this.creativeTags = [];
    }
  }

  selectAdTag(adTag) {
    this.adInput = adTag;
    this.current_created_input = {namestring: adTag, parentType: 'Ad', childType: 'Creative'};
    let updatedCampaign = this.all_inputs.find(x => x.id == adTag.placement_input.package_input.campaign_input_id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == adTag.placement_input.package_input.id);
    let updatedPlacement = updatedPackage.placement_inputs.find(x => x.id == adTag.placement_input_id);
    let adIndex = updatedPlacement.ad_inputs.find(x => x.id == adTag.id);
    updatedPlacement.ad_inputs.splice(adIndex, 1);
    updatedPlacement.ad_inputs.unshift(adTag);
    this.all_inputs[index] = updatedCampaign;
    this.adAction = false;
  }

  setCreativeTag(creativeTag) {
    this.creativeInput = creativeTag;
    this.current_created_input = {namestring: creativeTag, parentType: 'Creative', childType: null };
    let updatedCampaign = this.all_inputs.find(x => x.id == creativeTag.ad_input.placement_input.package_input.campaign_input_id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == creativeTag.ad_input.placement_input.package_input.id);
    let updatedPlacement = updatedPackage.placement_inputs.find(x => x.id == creativeTag.ad_input.placement_input.id);
    let updatedAd = updatedPlacement.ad_inputs.find( x => x.id == creativeTag.ad_input.id);
    updatedAd.creative_inputs.unshift(creativeTag);
    this.all_inputs[index] = updatedCampaign;
    this.selectedNameString.namestring = creativeTag;
    this.creativeAction = false;
  }

  selectCreativeTag(creativeTag) {
    this.creativeInput = creativeTag;
    this.current_created_input = {namestring: creativeTag, parentType: 'Creative', childType: null };
    let updatedCampaign = this.all_inputs.find(x => x.id == creativeTag.ad_input.placement_input.package_input.campaign_input_id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == creativeTag.ad_input.placement_input.package_input.id);
    let updatedPlacement = updatedPackage.placement_inputs.find(x => x.id == creativeTag.ad_input.placement_input.id);
    let updatedAd = updatedPlacement.ad_inputs.find( x => x.id == creativeTag.ad_input.id);
    let creativeIndex = updatedAd.creative_inputs.find(x => x.id == creativeTag.ad);
    updatedAd.creative_inputs.splice(creativeIndex, 1);
    updatedAd.creative_inputs.unshift(creativeTag);
    this.all_inputs[index] = updatedCampaign;
    this.creativeAction = false;
  }

  updateCreativeTag(creativeTag) {
    this.creativeInput = creativeTag;
    this.current_created_input = {namestring: creativeTag, parentType: 'Creative', childType: null};
    let updatedCampaign = this.all_inputs.find(x => x.id == creativeTag.ad_input.placement_input.package_input.campaign_input_id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == creativeTag.ad_input.placement_input.package_input.id);
    let updatedPlacement = updatedPackage.placement_inputs.find(x => x.id == creativeTag.ad_input.placement_input.id);
    let updatedAd = updatedPlacement.ad_inputs.find( x => x.id == creativeTag.ad_input.id);
    let updatedCreative = updatedAd.creative_inputs.find(x => x.id == creativeTag.id);
    let creativeIndex = updatedAd.creative_inputs.indexOf(updatedCreative);
    updatedAd.creative_inputs.splice(creativeIndex, 1);
    updatedAd.creative_inputs.unshift(creativeTag);
    this.selectedNameString.namestring.namestring = creativeTag;
    this.all_inputs[index] = updatedCampaign;
    this.action = 'Edit';
    this.creativeAction = false;
  }

  updateAdTag(adTag) {
    this.adInput = adTag;
    this.current_created_input = {namestring: adTag, parentType: 'Ad', childType: 'Creative'};
    let updatedCampaign = this.all_inputs.find( x => x.id == adTag.placement_input.package_input.campaign_input.id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find( x => x.id == adTag.placement_input.package_input.id);
    let updatedPlacement = updatedPackage.placement_inputs.find( x => x.id == adTag.placement_input.id);
    let updatedAd = updatedPlacement.ad_inputs.find( x => x.id == adTag.id);
    updatedAd.creative_inputs = adTag.creative_inputs;
    let adIndex = updatedPlacement.ad_inputs.indexOf(updatedAd);
    updatedPlacement.ad_inputs.splice(adIndex, 1);
    updatedPlacement.ad_inputs.unshift(adTag);
    this.selectedNameString.namestring.namestring = adTag;
    this.all_inputs[index] = updatedCampaign;
    this.action = 'Edit';
    this.adAction = false;
  }

  updatePlacementTag(placementTag) {
    this.placementInput = placementTag;
    this.current_created_input = {namestring: placementTag, parentType: 'Placement', childType: 'Ad' };
    let updatedCampaign = this.all_inputs.find( x => x.id == placementTag.package_input.campaign_input.id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find( x => x.id = placementTag.package_input.id);
    let updatedPlacement = updatedPackage.placement_inputs.find( x => x.id == placementTag.id);
    if(updatedPlacement.ad_inputs && updatedPlacement.ad_inputs.length > 0) {updatedPlacement.ad_inputs = placementTag.ad_inputs;}
    let placementIndex = updatedPackage.placement_inputs.indexOf(updatedPlacement);
    updatedPackage.placement_inputs.splice(placementIndex, 1);
    updatedPackage.placement_inputs.unshift(placementTag);
    this.selectedNameString.namestring.namestring = placementTag;
    this.all_inputs[index] = updatedCampaign;
    this.action = 'Edit';
    this.placementAction = false;
  }

  updatePackageTag(packageTag) {
    this.packageInput = packageTag;
    this.current_created_input = {namestring: packageTag, parentType: 'Package', childType: 'Placement'};
    let updatedCampaign = this.all_inputs.find( x => x.id == packageTag.campaign_input.id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == packageTag.id );
    updatedPackage.placement_inputs = packageTag.placement_inputs;
    let packageIndex = updatedCampaign.package_inputs.indexOf(updatedPackage);
    updatedCampaign.package_inputs.splice(packageIndex, 1);
    updatedCampaign.package_inputs.unshift(packageTag);
    this.selectedNameString.namestring.namestring = packageTag;
    this.all_inputs[index] = updatedCampaign;
    this.action = 'Edit';
    this.packageAction = false;
  }

  updateCampaignTag(campaignTag) {
    this.campaignInput = campaignTag;
    this.current_created_input = {namestring: campaignTag, parentType: 'Campaign', childType: 'Package'};
    let updatedCampaign = this.all_inputs.find( x => x.id == campaignTag.id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    this.selectedNameString.namestring.namestring = campaignTag;
    this.all_inputs.splice(index, 1);
    this.all_inputs.unshift(campaignTag);
    this.action = 'Edit';
    this.campaignAction = false;
  }

  removeInput(input) {
    if(input.namestring.parent == 'Campaign') {
      this.removeCampaign(input);
    }
    if(input.namestring.parent == 'Package') {
      this.removePackage(input);
    }
    if(input.namestring.parent == 'Placement') {
      this.removePlacement(input);
    }
    if(input.namestring.parent == 'Ad') {
      this.removeAd(input);
    }
    if(input.namestring.parent == 'Creative') {
      this.removeCreative(input);
    }
  }
  
  removeCampaign(input) {
    let removedCampaign = this.all_inputs.find( x => x.id == input.namestring.namestring.id);
    let index = this.all_inputs.indexOf(removedCampaign);
    this.all_inputs.splice(index, 1);
  }

  removePackage(input) {
    let updatedCampaign = this.all_inputs.find(x => x.id == input.namestring.campaignParent.id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let removedPackage = updatedCampaign.package_inputs.find(x => x.id == input.namestring.namestring.id);
    let packageIndex = updatedCampaign.package_inputs.indexOf(removedPackage);
    updatedCampaign.package_inputs.splice(packageIndex, 1);
    this.all_inputs[index] = updatedCampaign;
  }

  removePlacement(input) {
    let updatedCampaign = this.all_inputs.find( x => x.id == input.namestring.campaignParent.id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == input.namestring.packageParent.id);
    let removedPlacement = updatedPackage.placement_inputs.find(x => x.id == input.namestring.namestring.id);
    let placementIndex = updatedPackage.placement_inputs.indexOf(removedPlacement);
    updatedPackage.placement_inputs.splice(placementIndex, 1);
    this.all_inputs[index] = updatedCampaign;
  }

  removeAd(input) {
    let updatedCampaign = this.all_inputs.find( x => x.id == input.namestring.campaignParent.id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == input.namestring.packageParent.id);
    let updatedPlacement = updatedPackage.placement_inputs.find( x => x.id == input.namestring.placementParent.id);
    let removedAd = updatedPlacement.ad_inputs.find(x => x.id == input.namestring.namestring.id);
    let adIndex = updatedPlacement.ad_inputs.indexOf(removedAd);
    updatedPlacement.ad_inputs.splice(adIndex, 1);
    this.all_inputs[index] = updatedCampaign;
  }

  removeCreative(input) {
    let updatedCampaign = this.all_inputs.find( x => x.id == input.namestring.campaignParent.id);
    let index = this.all_inputs.indexOf(updatedCampaign);
    let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == input.namestring.packageParent.id);
    let updatedPlacement = updatedPackage.placement_inputs.find( x => x.id == input.namestring.placementParent.id);
    let updatedAd = updatedPlacement.ad_inputs.find(x => x.id == input.namestring.adParent.id);
    let removedCreative = updatedAd.creative_inputs.find(x => x.id == input.namestring.namestring.id);
    let creativeIndex = updatedAd.creative_inputs.indexOf(removedCreative);
    updatedAd.creative_inputs.splice(creativeIndex, 1);
    this.all_inputs[index] = updatedCampaign;
  }

  errorEvent(error) {
    this.errorOccured = true;
    this.errorMessage = error;
  }

  errorClosed() {
    this.errorOccured = false;
  }

}
