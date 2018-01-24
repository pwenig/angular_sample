import { Component, OnInit, ViewChild } from '@angular/core';
import { MetadataService } from '../services/metadata_service';
import {CampaignComponent} from './campaign.component';
import {CampaignInputService} from '../services/campaign_input_service';
import {CreativeInputService} from '../services/creative_input_service';
import { LIFECYCLE_HOOKS_VALUES } from '@angular/compiler/src/lifecycle_reflector';

@Component({
  selector: 'app-component',
  template: `
   <actions [selectedNameString]="selectedNameString" (namestringAction)="selectedAction($event)" [namestringSelected]="disableActions"></actions>
    <tree [current_created_input]="current_created_input" [action]="action" [all_inputs]="all_inputs" [all_exports]="all_exports" [current_exports]="current_exports" (selectedNamestring)="selectedString($event)"></tree>
    <div *ngIf="campaignAction">
      <campaign [selectedObject]="selectedObject" [agency]="agency" [networks]="networks" [seasons]="seasons" [campaignTags]="campaignTags" [campaignTypes]="campaignTypes" (campaignInputTagFinal)="setCampaignTag($event)" (campaignTagUpdate)="updateCampaignTag($event)"></campaign>
    </div>
    <div *ngIf="packageAction">
      <package [selectedObject]="selectedObject" [agency]="agency" [packageTags]="packageTags" [publishers]="publishers" [buyMethods]="buyMethods" [inventoryTypes]="inventoryTypes" (packageInputTagFinal)="setPackageTag($event)" (packageTagUpdate)="updatePackageTag($event)"></package>
    </div>
    <div *ngIf="placementAction">
      <placement [selectedObject]="selectedObject" [placementTags]="placementTags" [episodes]="episodes" [tactics]="tactics" [devices]="devices" [adTypes]="adTypes" [targetingTypes]="targetingTypes" (placementTagFinal)="setPlacementTag($event)" (placementTagUpdate)="updatePlacementTag($event)"></placement>
    </div>
    <div *ngIf="adAction">
      <ad [selectedObject]="selectedObject" [adTags]="adTags" [creativeGroups]="creativeGroups" (adTagFinal)="setAdTag($event)" (adTagUpdate)="updateAdTag($event)"></ad>
    </div>
    <div *ngIf="creativeAction">
      <creative [selectedObject]="selectedObject" [creativeTags]="creativeTags" [adInput]="adInput" [placementInput]="placementInput" [creativeMessages]="creativeMessages" [abtestLabels]="abtestLabels" [videoLengths]="videoLengths" (creativeTagFinal)="setCreativeTag($event)" (creativeTagUpdate)="updateCreativeTag($event)"></creative>
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
  packageTags: any = [];
  adTags: any = [];
  creativeTags: any = [];
  placementTags: any = [];
  // Remove these?
  showPackageInput: boolean = false;
  showPlacementInput: boolean = false;
  showAdInput: boolean = false;
  showCreativeInput: boolean = false;
  selectedNameString: any = {};
  disableActions: boolean = true;
  selectedObject: any = {};
  campaignAction: boolean;
  packageAction: boolean;
  placementAction: boolean;
  adAction: boolean;
  creativeAction: boolean;
  action: any;
  newCreatedCampaign: any = {};
  // Object that has current campaign object arrays for the current heirarchy
  current_created_input: any = {};
  // Current array of mamestrings that can be exported
  current_exports: any = [];
  all_inputs: any = [];
  // All namestrings that have been created
  all_exports: any = [];

  constructor( private _metadata: MetadataService, private _campaign: CampaignInputService, private _creative: CreativeInputService) {}

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
      },
      (error) => {
        console.log('Error', error);
      }
    )

    // Get all of the current input strings
    if(!JSON.parse(localStorage.getItem('inputs'))) {
      this.current_exports = [];
    } else {
      this.current_exports = JSON.parse(localStorage.getItem('inputs'));
    }

    // // Get all of the input strings that have been created
    // this._creative.getInputs().subscribe(
    //   (data) => {
    //     this.all_exports = data.reverse();
    //   },
    //   (error) => {
    //     console.log('Error', error);
    //   }
    // )
    
  }

  // This function is called when a namestring has been selected from the children-component
  selectedString(nameStringObject) {
    this.selectedNameString = nameStringObject;
    this.disableActions = false;
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
  }

  changeModals(campaignModal, packageModal, placementModal, adModal, creativeModal) {
      this.campaignAction = campaignModal;
      this.packageAction = packageModal;
      this.placementAction = placementModal;
      this.adAction = adModal;
      this.creativeAction = creativeModal;
  }

  setCampaignTag(campaignTag) {
    if(campaignTag == null) {
      this.showPackageInput = false;
      this.showPlacementInput = false;
      this.showAdInput = false;
      this.showCreativeInput = false;
    } else {
      this.campaignInput = campaignTag;
      this.current_created_input = {namestring: campaignTag, parentType: 'Campaign', childType: 'Package'};
      this.all_inputs.unshift(campaignTag);
      this.campaignTags.push(campaignTag.campaign_input_tag);
      this.campaignAction = false;
      if(this.campaignInput.package_inputs && this.campaignInput.package_inputs.length > 0) {
        this.packageTags = this.campaignInput.package_inputs.map(n=> n['package_input_tag']);
      } else {
        this.packageTags = [];
      }
      this.showPackageInput = true;
    }
   
  }

  setPackageTag(packageTag) {
    if(packageTag == null) {
      this.showPlacementInput = false;
      this.showAdInput = false;
      this.showCreativeInput = false;
    } else {
      this.packageInput = packageTag;
      this.current_created_input = {namestring: packageTag, parentType: 'Package', childType: 'Placement'};
      // Update the object in the all_inputs array
      let updatedCampaign = this.all_inputs.find(x => x.id == packageTag.campaign_input_id);
      let index = this.all_inputs.indexOf(updatedCampaign);
      updatedCampaign.package_inputs.unshift(packageTag);
      this.all_inputs[index] = updatedCampaign;
      this.packageAction = false;
      if(this.packageInput.placement_inputs && this.packageInput.placement_inputs.length > 0) {
        this.placementTags = this.packageInput.placement_inputs.map(n=> n['placement_input_tag']);
      } else {
        this.placementTags = [];
      }
      this.showPlacementInput = true;
    }
  }

  setPlacementTag(placementTag) {
    if(placementTag == null) {
      this.showAdInput = false;
      this.showCreativeInput = false;
    } else {
      this.placementInput = placementTag;
      this.current_created_input = {namestring: placementTag, parentType: 'Placement', childType: 'Ad'};
      let updatedCampaign = this.all_inputs.find(x => x.id == placementTag.package_input.campaign_input_id);
      let index = this.all_inputs.indexOf(updatedCampaign);
      let updatedPackage = updatedCampaign.package_inputs.find(x => x.id == placementTag.package_input.id);
      updatedPackage.placement_inputs.unshift(placementTag);
      this.all_inputs[index] = updatedCampaign;
      this.placementInput = false;
      if(this.placementInput.ad_inputs && this.placementInput.ad_inputs.length > 0) {
        this.adTags = this.placementInput.ad_inputs.map(n=> n['ad_input_tag']);
      } else {
        this.adTags = [];
      }
      this.showAdInput = true;
    }
  }

  setAdTag(adTag) {
    if(adTag == null) {
      // this.showCreativeInput = false;
    } else {
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
      this.showCreativeInput = true;
    }
  }

  setCreativeTag(creativeTag) {
    if(creativeTag == null) {
      // this.showNew = false;
    } else {
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
    updatedPlacement.ad_inputs = placementTag.ad_inputs;
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

}