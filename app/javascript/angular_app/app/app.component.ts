import { Component, OnInit } from '@angular/core';
import { MetadataService } from '../services/metadata_service';

@Component({
  selector: 'app-component',
  template: `
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
      <creative [campaignInput]="campaignInput" [creativeTags]="creativeTags" [adInput]="adInput" [placementInput]="placementInput" [creativeMessages]="creativeMessages" [abtestLabels]="abtestLabels" [videoLengths]="videoLengths" (creativeTagFinal)="setCreativeTag($event)"></creative>
    </div>
  `
})

export class AppComponent implements OnInit {

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

  constructor( private _metadata: MetadataService) {}

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

  }

  setCampaignTag(campaignTag) {
    this.campaignInput = campaignTag;
    if(this.campaignInput.package_inputs && this.campaignInput.package_inputs.length > 0) {
      this.packageTags = this.campaignInput.package_inputs.map(n=> n['package_input_tag']);
    }
    this.showPackageInput = true;
  }

  setPackageTag(packageTag) {
    this.packageInput = packageTag;
    if(this.packageInput.placement_inputs && this.packageInput.placement_inputs.length > 0) {
      this.placementTags = this.packageInput.placement_inputs.map(n=> n['placement_input_tag']);
    }
    this.showPlacementInput = true;

  }

  setPlacementTag(placementTag) {
    this.placementInput = placementTag;
    if(this.placementInput.ad_inputs && this.placementInput.ad_inputs.length > 0) {
      this.adTags = this.placementInput.ad_inputs.map(n=> n['ad_input_tag']);
    }
    this.showAdInput = true;
  }

  setAdTag(adTag) {
    this.adInput = adTag;
    if(this.adInput.creative_inputs && this.adInput.creative_inputs.length > 0) {
      this.creativeTags = this.adInput.creative_inputs.map(n=> n['creative_input_tag']);
    }
    this.showCreativeInput = true;
  }

  setCreativeTag(creativeTag) {
    this.creativeInput = creativeTag;
  }

}