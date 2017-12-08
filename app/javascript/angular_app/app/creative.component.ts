import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { CreativeInputService } from '../services/creative_input_service';
import { AdTypeService } from '../services/ad_type_service';
import {SelectComponent} from './select.component';
import {MonthSelectComponent} from './monthselect.component';
import {DaySelectComponent} from './dayselect.component';
import {HistoryService} from '../services/history_service';
import {CampaignInputService} from '../services/campaign_input_service';
import {TreeService} from '../services/tree_service';

@Component({
  selector: 'creative',
  template: `
  <h2 class="campaign-title">Creative Input</h2>
  <p *ngIf="showFinal" class="final-string">{{creativeInput.creativeInputTag}}<button class="duplicate" id="duplicateCreative" type="submit" (click)="duplicate()">Duplicate</button></p>
  <div class="input-tag-container">
    <div class="row">
    <section class="input-tag" *ngIf="(!showButtons && !showSelectors) && !showFinal">
      <select-string-component [options]="creativeTags" (selected)="selectInput($event)"></select-string-component>
      <button class="new-tag" type="submit" (click)="newTagSection()">New Creative String</button>
    </section>
      <section class="input-tag" *ngIf="showButtons">
        <input [ngModel]="creativeInput.creativeInputTag" class="form-control" [disabled]=true>
        <button class="new-tag" *ngIf="showSave" type="submit" (click)="saveInput()" [disabled]="invalid">Save Creative String</button>
        <button class="new-tag" *ngIf="showSelect" type="submit" (click)="selectInput(creativeInput.creativeInputTag)">Select Creative String</button>
        <button class="cancel-tag" *ngIf="showButtons" type="submit" (click)="cancelInput()">Clear</button>
      </section>
    </div>
  </div>

  <div *ngIf="showSelectors">
    <div class="select-container">
      <div class="row">
        <section class="select">
          <div class="first-column" *ngIf="creativeMessages && creativeMessages.length > 0">
            <select-component [label]="creativeMessageLabel" [default]="defaultCreativeMessage" [options]="creativeMessages" (selected)="attributeUpdated($event, 'creativeMessage')"></select-component>
          </div>
          <div class="custom-column">
            <label for="creativeCustom">Creative Version Custom</label>
            <input type="text" id="creativeCustom" [(ngModel)]="creativeInput.custom" placeholder="Enter Custom" (change)="checkAttributes()">
          </div>
          <div class="column">
            <month-select-component [label]="creativeVersionLabel" [default]="defaultCreativeVersion" (selected)="attributeUpdated($event, 'creativeVersion')"></month-select-component>
          </div>
        </section>
        <section class="select">
          <div class="first-column">
            <select-component [label]="abTestLabel" [options]="abtestLabels" [default]="defaultAbLabel" (selected)="attributeUpdated($event, 'abtestLabel')"></select-component>
          </div>
          <div class="second-column" *ngIf="_adtype.videoAdType(placementInput)">
            <select-component [label]="videoLengthLabel" [options]="videoLengths" [default]="defaultVideoLength" (selected)="attributeUpdated($event, 'videoLength')"></select-component>
          </div>
        </section>

        <section class="select-date">
          <div class="first-column">
            <input class="form-control" #drp="bsDaterangepicker" bsDaterangepicker [ngModel]="creativeRange" (ngModelChange)="dateChange($event)">
          </div>
          <div class="second-column">
            <button class="date-button" (click)="drp.toggle()">Creative Start / End Date</button>
          </div>
        </section>

      </div>
    </div>
  </div>
  `
})

export class CreativeComponent implements OnInit {
  @ViewChild(SelectComponent) 
  private selectComponent: SelectComponent;
  // @ViewChild(MonthSelectComponent)
  // private monthSelectComponent: MonthSelectComponent;
  // @ViewChild(DaySelectComponent) 
  // private daySelectComponent: DaySelectComponent;


  @Input() campaignInput: {};
  @Input() adInput: {};
  @Input() placementInput: {};
  @Input() creativeMessages: any[];
  @Input() abtestLabels: any[];
  @Input() videoLengths: any[];
  @Input() creativeTags: any[];
  @Output() creativeTagFinal = new EventEmitter();
  @Output() creativeObject = new EventEmitter();

  creativeInput: any = {};
  existingCreativeInput: any;
  creativeMessageLabel: string = 'Creative Message';
  creativeVersionLabel: string = 'Creative Version Number';
  videoLengthLabel: string = 'Video Length';
  abTestLabel: string = 'A/B Test Label';
  showFinal: boolean = false;
  showSelectors: boolean = false;
  showButtons: boolean = false;
  showSearch: boolean = true;
  invalid: boolean = true;
  defaultAbLabel: any;
  defaultCreativeMessage: any;
  defaultCreativeVersion: string;
  defaultVideoLength: any;
  creativeInputObject: any = {};
  creativeRange: any = [new Date(), new Date()];
  showSave: boolean = false;
  showSelect: boolean = false;

  constructor( private _creative: CreativeInputService, private _adtype: AdTypeService, private changeDetector: ChangeDetectorRef, private _history: HistoryService, private _tree: TreeService) {}

  ngOnInit() {
    if(!this.creativeTags || this.creativeTags.length == 0) {
      this.showButtons = true;
      this.showSelectors = true;
    }
    this.defaultAbLabel = this.abtestLabels.find(x => x['name'] == 'Not Applicable');
    this.creativeInput.abtestLabel = this.defaultAbLabel;
    this.creativeInput.custom = "XX";
  }

  dateChange(date) {
    // Format the start date
    var start_date = date[0];
    this.creativeInput.startYear = start_date.getFullYear();
    var startMonth  = start_date.getMonth() + 1;
    if(startMonth < 10) {
      this.creativeInput.startMonth = "0" + startMonth.toString();
    } else {
      this.creativeInput.startMonth = startMonth.toString();
    }
    var startDay = start_date.getDate();
    if(startDay < 10) {
      this.creativeInput.startDay = "0" + startDay.toString();
    } else {
      this.creativeInput.startDay = startDay.toString();
    }
    
    // Format the end date
    var end_date = date[1];
    this.creativeInput.endYear = end_date.getFullYear();
    var endMonth = end_date.getMonth() + 1;
    if(endMonth < 10) {
      this.creativeInput.endMonth = "0" + endMonth.toString();
    } else {
      this.creativeInput.endMonth = endMonth.toString();
    }
    var endDay = end_date.getDate();
    if(endDay < 10) {
      this.creativeInput.endDay = "0" + endDay.toString();
    } else {
      this.creativeInput.endDay = endDay.toString();
    }
    this.checkAttributes();
  }


  verifyTag() {
    this._creative.verifyInput(this.creativeInput.creativeInputTag).subscribe(

      (result) => {
        // This is the object that sets the create/select button
        this.existingCreativeInput = result;
        this.showSave = true;

        if(result) {
          this.showSelect = false;
          // This is the object that will be used to copy
          this.creativeInputObject = result;
           // Store the object for exporting
          this._history.storeInput(result);
          // Add to the heiarchy tree
          this._tree.createCreativeTree(result);
          // Send it to the app comp so the tree comp is updated
          this.creativeObject.emit(JSON.parse(localStorage.getItem('inputs')));
          this.creativeTagFinal.emit(result);
        }
      },
      (error) => {
        console.log('Error', error)
      }
    )

  }

  saveInput() {
    let createParams = {};
    if(this._adtype.videoAdType(this.placementInput)){
      createParams = {
        ad_input_id: this.adInput['id'],
        creative_message_id: this.creativeInput.creativeMessage.id,
        abtest_label_id: this.creativeInput.abtestLabel.id,
        video_length_id: this.creativeInput.videoLength.id,
        start_month: this.creativeInput.startMonth,
        start_day: this.creativeInput.startDay,
        start_year: this.creativeInput.startYear,
        end_month: this.creativeInput.endMonth,
        end_day: this.creativeInput.endDay,
        end_year: this.creativeInput.end_year,
        creative_version_number: this.creativeInput.creativeVersion,
        custom: this.creativeInput.custom,
        creative_input_tag: this.creativeInput.creativeInputTag
      }
    } else {
      createParams = {
        ad_input_id: this.adInput['id'],
        creative_message_id: this.creativeInput.creativeMessage.id,
        abtest_label_id: this.creativeInput.abtestLabel.id,
        start_month: this.creativeInput.startMonth,
        start_day: this.creativeInput.startDay,
        start_year: this.creativeInput.startYear,
        end_month: this.creativeInput.endMonth,
        end_day: this.creativeInput.endDay,
        end_year: this.creativeInput.endYear,
        creative_version_number: this.creativeInput.creativeVersion,
        custom: this.creativeInput.custom,
        creative_input_tag: this.creativeInput.creativeInputTag
      }
    }
    this._creative.createInput(createParams).subscribe(

      (result) => {
        this.showSelectors = false;
        this.showButtons = false;
        this.showFinal = true;
        this.creativeInputObject = result;
        // Store the object for exporting
        this._history.storeInput(result);
        this._tree.createCreativeTree(result);
        this.creativeObject.emit(JSON.parse(localStorage.getItem('inputs')));
        this.creativeTagFinal.emit(result);
      },
      (error) => {
        console.log('ERROR', error);
      }
    );

  }

  selectInput(tag) {
    this.creativeInput.creativeInputTag = tag;
    this.showFinal = true;
    this.showSelectors = false;
    this.showButtons = false;
    this.verifyTag();
  }

   // Updates the attribute when it is selected from child components
   attributeUpdated(value, attribute) {
    this.creativeInput[attribute] = value;
    this.checkAttributes();
  }

  checkAttributes() {
    if(this.creativeInput.creativeMessage && this._adtype.videoAdType(this.placementInput) &&
      this.creativeInput.custom &&
      this.creativeInput.creativeVersion &&
      this.creativeInput.abtestLabel &&
      this.creativeInput.videoLength &&
      this.creativeInput.startMonth &&
      this.creativeInput.startDay &&
      this.creativeInput.endMonth &&
      this.creativeInput.endDay
    ){
      this.creativeInput.creativeInputTag = this._creative.createCreativeString(this.campaignInput, this.placementInput, this.adInput, this.creativeInput)
      if(this.creativeInput.creativeInputTag){
        this.verifyTag();
      }
      this.invalid = false;
    
    } else if (
      this.creativeInput.creativeMessage &&
      this.creativeInput.custom &&
      this.creativeInput.creativeVersion &&
      this.creativeInput.abtestLabel &&
      this.creativeInput.startMonth &&
      this.creativeInput.startDay &&
      this.creativeInput.endMonth &&
      this.creativeInput.endDay
    ){
      this.creativeInput.creativeInputTag = this._creative.createCreativeString(this.campaignInput, this.placementInput, this.adInput, this.creativeInput)
      if(this.creativeInput.creativeInputTag){
        this.verifyTag();
      }
      this.invalid = false;
    }  

  }

  newTagSection() {
    this.creativeInput.custom = "XX";
    this.creativeRange = [new Date(), new Date()];
    this.showButtons = true;
    this.showSelectors = true;
  }

  cancelInput() {
    if(this._adtype.videoAdType(this.placementInput)) {
      this.selectComponent.setSelections(this.videoLengthLabel);
    }
    this.selectComponent.setSelections(this.creativeMessageLabel);
    this.creativeInput.custom = "XX";
    this. creativeRange = [new Date(), new Date()];
    this.selectComponent.setSelections(this.abTestLabel);
    this.creativeInput.creativeInputTag = null;
  }

  duplicate() {
    this.showButtons = true;
    this.showFinal = false;
    this.existingCreativeInput = false;
    this.invalid = true;

    if(this._adtype.videoAdType(this.placementInput)) {
      this.defaultVideoLength = this.creativeInput.videoLength = this.videoLengths.find(x => x['name'] == this.creativeInputObject.video_length.name);
    }
     // Set the default values for each of the selectors and set the object attributes
     this.defaultCreativeMessage = this.creativeInput.creativeMessage = this.creativeMessages.find(x => x['name'] == this.creativeInputObject.creative_message.name);
     this.creativeInput.custom = this.creativeInputObject.custom;
     this.defaultCreativeVersion = this.creativeInput.creativeVersion = this.creativeInputObject.creative_version_number;
     this.defaultAbLabel = this.creativeInput.abtestLabel = this.abtestLabels.find(x => x['name'] == this.creativeInputObject.abtest_label.name);
     this.creativeInput.startMonth = this.creativeInputObject.start_month;
     this.creativeInput.endMonth = this.creativeInputObject.end_month;
     this.creativeInput.endDay = this.creativeInputObject.end_day;
     this.creativeInput.startDay = this.creativeInputObject.start_day;
     this.creativeInput.endYear = this.creativeInputObject.end_year;
     this.creativeInput.startYear = this.creativeInputObject.start_year;

    this.showSelectors = true;
    // Checks to see if the ngIf has changed and the selectors are showing.
    this.changeDetector.detectChanges();

     // Set the selectors to the current value
    if(this._adtype.videoAdType(this.placementInput)) {
      this.selectComponent.setSelections(this.videoLengthLabel);
    }
    this.selectComponent.setSelections(this.creativeMessageLabel);
    this.selectComponent.setSelections(this.abTestLabel);
    // Set the creativeRange
    var date = new Date();
    this.creativeRange = [new Date(this.creativeInputObject.start_year, this.creativeInputObject.start_month - 1, this.creativeInputObject.start_day), new Date(this.creativeInputObject.end_year, this.creativeInputObject.end_month - 1, this.creativeInputObject.end_day)]
    
    // this.monthSelectComponent.setSelections(this.creativeVersionLabel);
    // this.monthSelectComponent.setSelections(this.startMonthLabel);
    // this.monthSelectComponent.setSelections(this.endMonthLabel);
    // this.daySelectComponent.setSelections(this.startDayLabel);
    // this.daySelectComponent.setSelections(this.endDayLabel);
  }
  
}