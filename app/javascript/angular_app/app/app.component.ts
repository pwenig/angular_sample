import { Component, OnInit } from '@angular/core';
import { MetadataService } from '../services/metadata_service';

@Component({
  selector: 'app-component',
  template: `
    <campaign [networks]="networks" [seasons]="seasons" [campaignTags]="campaignTags" [campaignTypes]="campaignTypes" (campaignInputTagFinal)="setCampaignTag($event)"></campaign>
    <div *ngIf="checkCampaignInput(campaignInput)">
      <package [campaignInput]="campaignInput" [agencies]="agencies" [publishers]="publishers" [buyMethods]="buyMethods" [inventoryTypes]="inventoryTypes" (packageInputTagFinal)="setPackageTag($event)"></package>
    </div>
  `
})

export class AppComponent implements OnInit {

  networks: any[];
  seasons: any[];
  campaignTypes: any[];
  agencies: any[];
  publishers: any[];
  buyMethods: any[];
  inventoryTypes: any[];
  campaignInput: any = {};
  packageInput: any = [];
  campaignTags: any = [];
  showPackageInput: boolean = false;

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
        this.campaignTags = data['campaign_tags'];
      },
      (error) => {
        console.log('Error', error)
      }

    )

  }

  setCampaignTag(campaignTag) {
    this.campaignInput = campaignTag;
    this.showPackageInput = true;
  }

  setPackageTag(packageTag) {
    this.packageInput = packageTag;
  }

  checkCampaignInput(campaignTag) {
    return (campaignTag && (Object.keys(campaignTag).length != 0));
  }

}