import { Component, OnInit } from '@angular/core';
import { MetadataService } from '../services/metadata_service';
import { CampaignInputService } from '../services/campaign_input_service';

@Component({
  selector: 'main-component',
  template: `
    <div *ngIf="inputTag">Campaign Input: {{ campaignInput.campaignInputTag }}</div>
    
    <div *ngIf="showSelectors">
      <select-component [label]="networkLabel" [options]="networks" (selected)="attributeUpdated($event, 'network')"></select-component>

      <div *ngIf="campaignInput.network">
      <select-component [label]="programLabel" [options]="campaignInput.network.programs" (selected)="attributeUpdated($event, 'program')"></select-component>
      </div>

      <div *ngIf="campaignInput.program">
      <select-component [label]="seasonLabel" [options]="seasons" (selected)="attributeUpdated($event, 'season')"></select-component>
      </div>

      <div *ngIf="campaignInput.season">
      <select-component [label]="campaignTypeLabel" [options]="campaignTypes" (selected)="attributeUpdated($event, 'campaignType')"></select-component>
      </div>

      <div *ngIf="campaignInput.campaignType">
        <label for="type">Campaign Custom</label><br>
        <input type="text" id="Custom" [(ngModel)]="campaignInput.custom">
      </div>

      <div *ngIf="campaignInput.custom">
      <year-select-component [label]="startYearLabel" (selected)="attributeUpdated($event, 'startYear')"></year-select-component>
      </div>

      <div *ngIf="campaignInput.custom">
      <month-select-component [label]="startMonthLabel" (selected)="attributeUpdated($event, 'startMonth')"></month-select-component>
      </div>

      <div *ngIf="campaignInput.startMonth">
      <day-select-component [label]="startDayLabel" (selected)="attributeUpdated($event, 'startDay')"></day-select-component>
      </div>

      <div *ngIf="campaignInput.startDay">
      <year-select-component [label]="endYearLabel" (selected)="attributeUpdated($event, 'endYear')"></year-select-component>
      </div>

      <div *ngIf="campaignInput.startDay">
      <month-select-component [label]="endMonthLabel" (selected)="attributeUpdated($event, 'endMonth')"></month-select-component>
      </div>

      <div *ngIf="campaignInput.endMonth">
      <day-select-component [label]="endDayLabel" (selected)="attributeUpdated($event, 'endDay')"></day-select-component>
      </div>

      <br>
      <div *ngIf="campaignInput.endDay">
        <button class="input-submit" type="submit" (click)="saveInput()" [disabled]="saveDisabled">Select/Create</button>
      </div>

    </div>
  `
})

export class AppComponent implements OnInit {

  networks: any;
  seasons: any;
  campaignTypes: any;
  campaignInput: any = {};
  campaignInputTag: any;
  networkLabel: string = 'Network';
  programLabel: string = 'Program';
  seasonLabel: string = 'Season';
  campaignTypeLabel: string = 'Campaign Type';
  startYearLabel: string = 'Start Year';
  startMonthLabel: string = 'Start Month';
  startDayLabel: string = 'Start Day';
  endYearLabel: string = 'End Year';
  endMonthLabel: string = 'End Month';
  endDayLabel: string = 'End Day';
  inputTag: boolean = false;
  saveDisabled: boolean = false;
  showSelectors: boolean = true;
  
  constructor( private _metadata: MetadataService, private _campaign: CampaignInputService) {
  }

  ngOnInit() {
    this.campaignInput.startYear = 2017;
    this.campaignInput.endYear = 2017;
    
    // Call MetadataService
    this._metadata.getMetadata().subscribe(

      (data) => {
        this.networks = data['networks'];
        this.seasons = data['seasons'];
        this.campaignTypes = data['campaign_types'];
      },
      (error) => {
        console.log('Error', error)
      }

    )

  };

  // Updates the attribute when it is selected from child components
  attributeUpdated(value, attribute) {
    this.campaignInput[attribute] = value;

    if(attribute == 'endDay') {
      this.createTag();
    }

  }

  createTag() {
   
    // Create the campaign input tag
    this.campaignInput.campaignInputTag = 
      this.campaignInput.network.abbrev + '_' + 
      this.campaignInput.program.abbrev + '_' +
      this.campaignInput.season.abbrev + '_' +
      this.campaignInput.campaignType.abbrev + '_' +
      this.campaignInput.custom + '_' +
      this.campaignInput.startYear +
      this.campaignInput.startMonth +
      this.campaignInput.startDay + '-' +
      this.campaignInput.endYear +
      this.campaignInput.endMonth +
      this.campaignInput.endDay
    this.inputTag = true;

  }
  saveInput() {
    this.createTag();
    // Create the params
    var createParams = {
      network_id: this.campaignInput.network.id,
      program_id: this.campaignInput.program.id,
      season_id: this.campaignInput.season.id,
      campaign_type_id: this.campaignInput.campaignType.id,
      custom: this.campaignInput.custom,
      start_year: this.campaignInput.startYear,
      start_month: this.campaignInput.startMonth,
      start_day: this.campaignInput.startDay,
      end_year: this.campaignInput.endYear,
      end_month: this.campaignInput.endMonth,
      end_day: this.campaignInput.endDay,
      campaign_input_tag: this.campaignInput.campaignInputTag
    }
    this._campaign.createInput(createParams).subscribe(

      (result) => {
        this.saveDisabled = true;
        this.showSelectors = false;
      },
      (error) => {
        console.log('ERROR', error)
      }
    );

  }

}
