import { Component, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CampaignInputService } from '../services/campaign_input_service';
import {SelectComponent} from './select.component';
import {TreeService} from '../services/tree_service';
import {HistoryService} from '../services/history_service';

@Component({
  selector: 'campaign',
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
                  <div class="column">
                    <label>Campaign Start / End Date</label>
                    <input class="form-control" #drp="bsDaterangepicker" bsDaterangepicker [ngModel]="campaignRange" (ngModelChange)="dateChange($event)">
                  </div>
                </section>
                <section class="select">
                  <div class="action-column">
                    <button class="btn btn-primary action" (click)="Modal.hide()">Cancel Campaign</button>
                    <button class="btn btn-primary action" *ngIf="showSave" (click)="saveInput(action)">{{action}} Campaign</button>
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

export class CampaignComponent implements OnInit, OnChanges {
  @ViewChild(SelectComponent) 
  private selectComponent:SelectComponent;

  @Input() networks: any = [];
  @Input() seasons: any = [];
  @Input() allSeasons: any = [];
  @Input() campaignTypes: any = [];
  @Input() campaignTags: any = [];
  @Input() selectedObject: any = {};
  @Input() agency: {};
  @Output() campaignInputTagFinal = new EventEmitter();
  @Output() campaignObject = new EventEmitter();
  @Output() campaignTagUpdate = new EventEmitter();

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
  defaultNetwork: any;
  defaultProgram: any;
  defaultSeason: any;
  defaultCampaignType: any;
  campaignInputObject: any;
  campaignRange: any = [new Date(), new Date()];
  showSave: boolean = false;
  showSelect: boolean = false;
  showModal: boolean;
  action: string = 'Create';
  
  constructor( private _campaign: CampaignInputService, private changeDetector: ChangeDetectorRef, private _tree: TreeService, private _history: HistoryService) {}

  ngOnInit() {
    if(this.selectedObject.action == 'New Campaign') {
      this.campaignInput.custom = 'XX';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
      if(changes.selectedObject.currentValue.action == 'Edit Campaign') {
        this.action = 'Update'
        this.duplicate();
      }
      if(changes.selectedObject.currentValue.action == 'Copy/Create Campaign') {
        this.action = 'Create'
        this.duplicate();
      }
    }

  closeModal() {
    this.selectedObject.action = null;
    this.campaignInput = {};
    this.seasons = this.allSeasons;
    this.cancelInput();
    this.showSave = false;
  }

  dateChange(date) {
    // Format the start date
    var start_date = date[0];
    this.campaignInput.start_year = start_date.getFullYear();
    var startMonth  = start_date.getMonth() + 1;
    if(startMonth < 10) {
      this.campaignInput.start_month = "0" + startMonth.toString();
    } else {
      this.campaignInput.start_month = startMonth.toString();
    }
    var startDay = start_date.getDate();
    if(startDay < 10) {
      this.campaignInput.start_day = "0" + startDay.toString();
    } else {
      this.campaignInput.start_day = startDay.toString();
    }
    
    // Format the end date
    var end_date = date[1];
    this.campaignInput.end_year = end_date.getFullYear();
    var endMonth = end_date.getMonth() + 1;
    if(endMonth < 10) {
      this.campaignInput.end_month = "0" + endMonth.toString();
    } else {
      this.campaignInput.end_month = endMonth.toString();
    }
    var endDay = end_date.getDate();
    if(endDay < 10) {
      this.campaignInput.end_day = "0" + endDay.toString();
    } else {
      this.campaignInput.end_day = endDay.toString();
    }
    this.checkAttributes();
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
      this.campaignInput.start_year &&
      this.campaignInput.start_month &&
      this.campaignInput.start_day &&
      this.campaignInput.end_year &&
      this.campaignInput.end_month &&
      this.campaignInput.end_day
      ){ 
        this.showSave = true;
        this.campaignInput.campaignInputTag = this._campaign.createCampaignString(this.campaignInput)
      };
  }

  saveInput(action) {
    // Create the params
    var createParams = {
      network_id: this.campaignInput.network.id,
      network: this.campaignInput.network,
      program_id: this.campaignInput.program.id,
      program: this.campaignInput.program,
      season_id: this.campaignInput.season.id,
      season: this.campaignInput.season,
      campaign_type_id: this.campaignInput.campaignType.id,
      custom: this.campaignInput.custom,
      start_year: this.campaignInput.start_year,
      start_month: this.campaignInput.start_month,
      start_day: this.campaignInput.start_day,
      end_year: this.campaignInput.end_year,
      end_month: this.campaignInput.end_month,
      end_day: this.campaignInput.end_day,
      campaign_input_tag: this.campaignInput.campaignInputTag
    }

    if(action == 'Update') {
      this._campaign.updateInput(this.selectedObject.namestring.namestring, createParams, this.agency).subscribe(

        (result) => {
          this.campaignInput = result;
          this.campaignTagUpdate.emit(this.campaignInput);
          this.selectedObject.action = null;
          this.selectedObject.namestring.namestring = {};
          this.showSave = false;
        }
      )

    } else if (action == 'Create') {
      
      this._campaign.createInput(createParams).subscribe(

        (result) => {
          this.campaignInputObject = result[0];
          // 200 means it already exists. Don't add it to the array
          if(result[1]['status'] ==  200) {
            this.campaignObject.emit(this.campaignInputObject);
          } else {
            this.campaignInputTagFinal.emit(this.campaignInputObject);
          }
          this.selectedObject.action = null;
          this.campaignInput = {};
          
        },
        (error) => {
          console.log('ERROR', error)
        }
      );

    } else {}
  }

  cancelInput() {
    this.defaultNetwork = undefined;
    this.defaultProgram = undefined;
    this.defaultSeason = undefined;
    this.defaultCampaignType = undefined;
    this.campaignInput.custom = 'XX';
    this.campaignRange = [new Date(), new Date()];
    this.campaignInput.campaignInputTag = null;
  }

  duplicate() {
    if(this.selectedObject.namestring.namestring.package_inputs && this.selectedObject.namestring.namestring.package_inputs.length > 0 && this.selectedObject.namestring.namestring.season.name != 'Tentpole') {
      // Remove the tentpole option since there are children that will be effected.
      this.seasons = this.seasons.filter(x => x.name != 'Tentpole');
    }
    
    // Remove the season options since there are children that will be effected.
    if(this.selectedObject.namestring.namestring.package_inputs && this.selectedObject.namestring.namestring.package_inputs.length > 0 && this.selectedObject.namestring.namestring.season.name == 'Tentpole') {
      this.seasons = this.seasons.filter(x => x.name == 'Tentpole');
    }

    // Set default values
    this.defaultNetwork = this.campaignInput.network = this.networks.find(x => x['id'] == this.selectedObject.namestring.namestring.network.id);
    this.defaultProgram = this.campaignInput.program = this.campaignInput.network.programs.find(x => x['id'] == this.selectedObject.namestring.namestring.program.id);
    this.defaultSeason = this.campaignInput.season = this.seasons.find(x => x['id'] == this.selectedObject.namestring.namestring.season.id);
    this.defaultCampaignType = this.campaignInput.campaignType = this.campaignTypes.find(x => x['id'] == this.selectedObject.namestring.namestring.campaign_type.id);
    this.campaignInput.start_month = this.selectedObject.namestring.namestring.start_month;
    this.campaignInput.start_day = this.selectedObject.namestring.namestring.start_day;
    this.campaignInput.start_year = this.selectedObject.namestring.namestring.start_year;
    this.campaignInput.end_month = this.selectedObject.namestring.namestring.end_month;
    this.campaignInput.end_day = this.selectedObject.namestring.namestring.end_day;
    this.campaignInput.end_year = this.selectedObject.namestring.namestring.end_year;
    this.campaignInput.custom = this.selectedObject.namestring.namestring.custom;
    
    // Checks to see if the ngIf has changed and the selectors are showing.
    this.changeDetector.detectChanges();

    // Set Selectors
    this.selectComponent.setSelections(this.networkLabel);
    this.selectComponent.setSelections(this.programLabel);
    this.selectComponent.setSelections(this.seasonLabel);
    this.selectComponent.setSelections(this.campaignTypeLabel);
    // Set campaignRange
    this.campaignRange = [new Date(this.selectedObject.namestring.namestring.start_year, this.selectedObject.namestring.namestring.start_month - 1, this.selectedObject.namestring.namestring.start_day), new Date(this.selectedObject.namestring.namestring.end_year, this.selectedObject.namestring.namestring.end_month - 1, this.selectedObject.namestring.namestring.end_day)]
  }

}