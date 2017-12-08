import { Component, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CampaignInputService } from '../services/campaign_input_service';
import {SelectComponent} from './select.component';
import {TreeService} from '../services/tree_service';
import {HistoryService} from '../services/history_service';

@Component({
  selector: 'campaign',
  template: `
    <h2 class="campaign-title">Campaign Input</h2>
    <p *ngIf="showFinal" class="final-string">{{campaignInput.campaignInputTag }}<button class="duplicate" id="duplicateCampaign" type="submit" (click)="duplicate()">Duplicate</button></p>
    <div class="input-tag-container">
      <div class="row">
        <search [inputTags]="campaignTags" [searchDesc]="searchDesc" *ngIf="showSearch" (newTag)="newInput()" (tagChosen)="tagSelected($event)"></search>
        <section class="input-tag" *ngIf="showButtons">
          <input [ngModel]="campaignInput.campaignInputTag" class="form-control" [disabled]=true>
          <button class="new-tag" *ngIf="showSave" type="submit" (click)="saveInput()" [disabled]="invalid">Save Campaign String</button>
          <button class="new-tag" *ngIf="showSelect" type="submit" (click)="selectInput()">Select Campaign String</button>
          <button class="cancel-tag" *ngIf="(!existingCampaignInput && showButtons) || (!existingCampaignInput && campaignTags.length == 0)" type="submit" (click)="cancelInput()">Clear</button>
        </section>
      </div>
    </div>

    <div *ngIf="showSelectors">
      <div class="select-container">
        <div class="row">
        
          <section class="select">
            <div class="first-column" *ngIf="networks && networks.length > 0">
              <select-component [label]="networkLabel" [default]="defaultNetwork" [options]="networks" (selected)="attributeUpdated($event, 'network')"></select-component>
            </div>
            <div class="column" *ngIf="campaignInput.network">
               <select-component [label]="programLabel" [default]="defaultProgram" [options]="campaignInput.network.programs" (selected)="attributeUpdated($event, 'program')"></select-component>
            </div>
            <div class="column" *ngIf="campaignInput.network">
              <select-component [label]="seasonLabel" [default]="defaultSeason" [options]="seasons" (selected)="attributeUpdated($event, 'season')"></select-component>
            </div>
          </section>

          <section class="select">
            <div class="campaign-type-column"> 
              <select-component [label]="campaignTypeLabel" [default]="defaultCampaignType" [options]="campaignTypes" (selected)="attributeUpdated($event, 'campaignType')"></select-component>
            </div>
            <div class="custom-column"> 
              <label for="type">Campaign Custom</label><br>
              <input type="text" id="customCampaign" [(ngModel)]="campaignInput.custom" placeholder="Enter Custom" (change)="checkAttributes()">
            </div>
          </section>
          <section class="select-date">
            <div class="first-column">
              <input class="form-control" #drp="bsDaterangepicker" bsDaterangepicker [ngModel]="campaignRange" (ngModelChange)="dateChange($event)">
            </div>
            <div class="second-column">
              <button class="date-button" (click)="drp.toggle()">Campaign Start / End Date</button>
            </div>
          </section>

        </div>

      </div>

    </div>
  `
})

export class CampaignComponent {
  @ViewChild(SelectComponent) 
  private selectComponent:SelectComponent;

  @Input() networks: any[];
  @Input() seasons: any[];
  @Input() campaignTypes: any[];
  @Input() campaignTags: any[];
  @Output() campaignInputTagFinal = new EventEmitter();
  @Output() campaignObject = new EventEmitter();

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
  showFinal: boolean = false;
  showSelectors: boolean = false;
  showButtons: boolean = false;
  showSearch: boolean = true;
  existingCampaignInput: any;
  searchDesc: string = 'Search Campaign Strings';
  invalid: boolean = true;
  defaultNetwork: any;
  defaultProgram: any;
  defaultSeason: any;
  defaultCampaignType: any;
  // defaultStartMonth: any;
  // defaultStartDay: any;
  // defaultEndMonth: any;
  // defaultEndDay: any;
  campaignInputObject: any;
  campaignRange: any = [new Date(), new Date()];
  showSave: boolean = false;
  showSelect: boolean = false;

  
  constructor( private _campaign: CampaignInputService, private changeDetector: ChangeDetectorRef, private _tree: TreeService, private _history: HistoryService) {}

  dateChange(date) {
    // Format the start date
    var start_date = date[0];
    this.campaignInput.startYear = start_date.getFullYear();
    var startMonth  = start_date.getMonth() + 1;
    if(startMonth < 10) {
      this.campaignInput.startMonth = "0" + startMonth.toString();
    } else {
      this.campaignInput.startMonth = startMonth.toString();
    }
    var startDay = start_date.getDate();
    if(startDay < 10) {
      this.campaignInput.startDay = "0" + startDay.toString();
    } else {
      this.campaignInput.startDay = startDay.toString();
    }
    
    // Format the end date
    var end_date = date[1];
    this.campaignInput.endYear = end_date.getFullYear();
    var endMonth = end_date.getMonth() + 1;
    if(endMonth < 10) {
      this.campaignInput.endMonth = "0" + endMonth.toString();
    } else {
      this.campaignInput.endMonth = endMonth.toString();
    }
    var endDay = end_date.getDate();
    if(endDay < 10) {
      this.campaignInput.endDay = "0" + endDay.toString();
    } else {
      this.campaignInput.endDay = endDay.toString();
    }
    this.checkAttributes();
  }

  newInput() {
    this.showSearch = false;
    this.showButtons = true;
    this.showSelectors = true;
    this.campaignInput = {};
    this.campaignRange = [new Date(), new Date()];
    this.campaignInput.custom = "XX"
  }

  newCampaign() {
    this.campaignInput = {};
    this.showSearch = true;
    this.campaignRange = [new Date(), new Date()];
    this.showFinal = false;
  }

  // Updates the attribute when it is selected from child components
  attributeUpdated(value, attribute) {
    this.campaignInput[attribute] = value;
    this.checkAttributes();
  }

  // Checks to see if everything is selected before creating the tag
  checkAttributes() {
    if(this.campaignInput.network && 
      this.campaignInput.program &&
      this.campaignInput.season &&
      this.campaignInput.campaignType && 
      this.campaignInput.custom &&
      this.campaignInput.startYear &&
      this.campaignInput.startMonth &&
      this.campaignInput.startDay &&
      this.campaignInput.endYear &&
      this.campaignInput.endMonth &&
      this.campaignInput.endDay
      ){ 
        this.campaignInput.campaignInputTag = this._campaign.createCampaignString(this.campaignInput)
        // This will enable the create button
        this.invalid = false; 
        if(this.campaignInput.campaignInputTag) {
          this.verifyTag();
        }
      };
  }

  verifyTag() {
    this._campaign.verifyInput(this.campaignInput.campaignInputTag).subscribe(
      
      (result) => {
        // Show either select or create button
        this.existingCampaignInput = result;
        this.showSave = true;
        this.showSelect = false;
        if(result) {
          this.campaignInputObject = result;
          this.showSelect = true;
          this.showSave = false;
          this._history.storeInput(result);
          // Add to the heiarchy tree
          this._tree.createCampaignTree(result);
          // Send it to the app comp so the tree comp is updated
          this.campaignObject.emit(JSON.parse(localStorage.getItem('inputs')));
          this.campaignInputTagFinal.emit(result);
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
        this.showSelectors = false;
        this.showButtons = false;
        this.showFinal = true;
        this.campaignInputObject = result;
        // Store the object for exporting
        this._history.storeInput(result);
         // Add to heirarchy
        this._tree.createCampaignTree(result);
        this.campaignObject.emit(JSON.parse(localStorage.getItem('inputs')));

        this.campaignInputTagFinal.emit(result);
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
    this.campaignInputTagFinal.emit(this.existingCampaignInput);
  }

  tagSelected(tag) {
    this.campaignInput.campaignInputTag = tag;
    this.showFinal = true;
    this.showSearch = false;
    this.verifyTag();
  }

  // Clears the selected options
  cancelInput(){
    this.selectComponent.setSelections(this.networkLabel);
    this.selectComponent.setSelections(this.programLabel);
    this.selectComponent.setSelections(this.seasonLabel);
    this.selectComponent.setSelections(this.campaignTypeLabel);
    this.campaignRange = [new Date(), new Date()];
    this.campaignInput.campaignInputTag = null;
    this.campaignInput.custom = "XX"
  }

  duplicate() {
    this.showButtons = true;
    this.showFinal = false;
    this.existingCampaignInput = false;
    this.invalid = true;
    this.campaignInputTagFinal.emit(null);
    // Set default values
    this.defaultNetwork = this.campaignInput.network = this.networks.find(x => x['name'] == this.campaignInputObject.network.name);
    this.defaultProgram = this.campaignInput.program = this.campaignInput.network.programs.find(x => x['name'] == this.campaignInputObject.program.name);
    this.defaultSeason = this.campaignInput.season = this.seasons.find(x => x['name'] == this.campaignInputObject.season.name);
    this.defaultCampaignType = this.campaignInput.campaignType = this.campaignTypes.find(x => x['name'] == this.campaignInputObject.campaign_type.name);
    this.campaignInput.startMonth = this.campaignInputObject.start_month;
    this.campaignInput.startDay = this.campaignInputObject.start_day;
    this.campaignInput.endMonth = this.campaignInputObject.end_month;
    this.campaignInput.endDay = this.campaignInputObject.end_day;
    this.campaignInput.custom = this.campaignInputObject.custom;
    
    this.showSelectors = true;
    // Checks to see if the ngIf has changed and the selectors are showing.
    this.changeDetector.detectChanges();

    // Set Selectors
    this.selectComponent.setSelections(this.networkLabel);
    this.selectComponent.setSelections(this.programLabel);
    this.selectComponent.setSelections(this.seasonLabel);
    this.selectComponent.setSelections(this.campaignTypeLabel);
    // Set campaignRange
    this.campaignRange = [new Date(this.campaignInputObject.start_year, this.campaignInputObject.start_month - 1, this.campaignInputObject.start_day), new Date(this.campaignInputObject.end_year, this.campaignInputObject.end_month - 1, this.campaignInputObject.end_day)]
  }

}