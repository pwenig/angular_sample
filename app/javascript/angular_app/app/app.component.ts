import { Component, OnInit, ViewChild } from '@angular/core';
import { MetadataService } from '../services/metadata_service';
import {CampaignComponent} from './campaign.component';
import {CampaignInputService} from '../services/campaign_input_service';
import {CreativeInputService} from '../services/creative_input_service';

@Component({
  selector: 'app-component',
  template: `
    <tree [current_created_input]="current_created_input" [created_count]="created_count" [all_inputs]="all_inputs" [all_count]="all_count" [all_exports]="all_exports" [current_exports]="current_exports"></tree>
    <campaign [networks]="networks" [seasons]="seasons" [campaignTags]="campaignTags" [campaignTypes]="campaignTypes" (campaignInputTagFinal)="setCampaignTag($event)"></campaign>
    <div *ngIf="showPackageInput">
      <package [campaignInput]="campaignInput" [packageTags]="packageTags" [agencies]="agencies" [publishers]="publishers" [buyMethods]="buyMethods" [inventoryTypes]="inventoryTypes" (packageInputTagFinal)="setPackageTag($event)"></package>
    </div>
    <div *ngIf="showPlacementInput">
      <placement [campaignInput]="campaignInput" [placementTags]="placementTags" [packageInput]="packageInput" [episodes]="episodes" [tactics]="tactics" [devices]="devices" [adTypes]="adTypes" [targetingTypes]="targetingTypes" (placementTagFinal)="setPlacementTag($event)"></placement>
    </div>
    <div *ngIf="showAdInput">
      <ad [campaignInput]="campaignInput" [packageInput]="packageInput" [placementInput]="placementInput" [adTags]="adTags" [creativeGroups]="creativeGroups" (adTagFinal)="setAdTag($event)"></ad>
    </div>
    <div *ngIf="showCreativeInput">
      <creative [campaignInput]="campaignInput" [creativeTags]="creativeTags" [adInput]="adInput" [placementInput]="placementInput" [creativeMessages]="creativeMessages" [abtestLabels]="abtestLabels" [videoLengths]="videoLengths" (creativeTagFinal)="setCreativeTag($event)" (campaignObject)="createdCampaign($event)"></creative>
    </div>
    <div *ngIf="showNew">
      <button class="new" (click)="newCampaign()">New</button>
    </div>
  `
})

export class AppComponent implements OnInit {
  @ViewChild(CampaignComponent)
  private campaignComponent:CampaignComponent;

  networks: any = [];
  seasons: any = [];
  campaignTypes: any = [];
  agencies: any = [];
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
  showPackageInput: boolean = false;
  showPlacementInput: boolean = false;
  showAdInput: boolean = false;
  showCreativeInput: boolean = false;
  showNew: boolean = false;
  // Object that has current campaign object arrays for the current heirarchy
  current_created_input: any = {};
  // Current array of mamestrings that can be exported
  current_exports: any = [];
  created_count: any;
  // All of the campaign objects for the heirarchy
  all_inputs: any = [];
  // All namestrings that have been created
  all_exports: any = [];
  all_count: any;

  constructor( private _metadata: MetadataService, private _campaign: CampaignInputService, private _creative: CreativeInputService) {}

  ngOnInit() {
    // Call MetadataService
    this._metadata.getMetadata().subscribe(

      (data) => {
        this.networks = data['networks'];
        this.seasons = data['seasons'];
        this.campaignTypes = data['campaign_types'];
        this.agencies = data['agencies'];
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

    // Get the current input objects that have been created and stored in localStorage
    if(!JSON.parse(localStorage.getItem('inputs'))) {
      // If it does not exist, create an empty object
      this.current_created_input = {};
    } else {
      this.current_created_input = JSON.parse(localStorage.getItem('inputs'));
    }

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
    if(!JSON.parse(localStorage.getItem('creative_inputs'))) {
      this.current_exports = [];
    } else {
      this.current_exports = JSON.parse(localStorage.getItem('creative_inputs')).reverse();
      this.created_count = this.current_exports.length;
    }

    // Get all of the input strings that have been created
    this._creative.getInputs().subscribe(
      (data) => {
        this.all_exports = data.reverse();
        this.all_count = this.all_exports.length;
      },
      (error) => {
        console.log('Error', error);
      }
    )

  }

  setCampaignTag(campaignTag) {
    if(campaignTag == null) {
      this.showPackageInput = false;
      this.showPlacementInput = false;
      this.showAdInput = false;
      this.showCreativeInput = false;
    } else {
      this.campaignInput = campaignTag;
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
      if(this.packageInput.placement_inputs && this.packageInput.placement_inputs.length > 0) {
        this.placementTags = this.packageInput.placement_inputs.map(n=> n['placement_input_tag']);
      } else {
        this.placementInput = [];
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
      this.showCreativeInput = false;
    } else {
      this.adInput = adTag;
      if(this.adInput.creative_inputs && this.adInput.creative_inputs.length > 0) {
        this.creativeTags = this.adInput.creative_inputs.map(n=> n['creative_input_tag']);
      } else {
        this.creativeTags = [];
      }
      this.showCreativeInput = true;
    }
  }

  setCreativeTag(creativeTag) {
    this.creativeInput = creativeTag;
    if(creativeTag == null) {
      this.showNew = false;
    } else {
      // A new tag has been created. Update the arrays and counts.
      this.current_exports.unshift(creativeTag);
      this.created_count = this.current_exports.length;
      this.all_exports.unshift(creativeTag);
      this.all_count = this.all_exports.length;
      this.showNew= true;
    }
    
  }


  createdCampaign(campaign) {
    // Current object of campaign object arrays
    this.current_created_input = campaign;

     // Get all of the input strings that have been created
     this._campaign.getInputs().subscribe(
      (data) => {
        this.all_inputs = data.reverse();
      },
      (error) => {
        console.log('Error', error);
      }
    )
  }

  newCampaign(){
    this.campaignComponent.newCampaign();
    this.showAdInput = false;
    this.adInput = {};
    this.showCreativeInput = false;
    this.creativeInput = {};
    this.showPlacementInput = false;
    this.placementInput = {};
    this.showPackageInput = false;
    this.packageInput = {};
    this.showNew = false;
  }

}