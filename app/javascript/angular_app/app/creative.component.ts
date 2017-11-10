import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { CreativeInputService } from '../services/creative_input_service';
import { AdTypeService } from '../services/ad_type_service';
import {SelectComponent} from './select.component';
import {MonthSelectComponent} from './monthselect.component';
import {DaySelectComponent} from './dayselect.component';

@Component({
  selector: 'creative',
  template: `
  <h2 class="campaign-title">Creative Input</h2>
  <p *ngIf="showFinal" class="final-string">{{creativeInput.creativeInputTag}}<button class="duplicate" id="duplicateCreative" type="submit" (click)="duplicate()">Duplicate</button></p>
  <div class="input-tag-container">
    <div class="row">
    <section class="input-tag" *ngIf="(!showButtons && !showSelectors) && !showFinal">
      <select-string-component  [options]="creativeTags" (selected)="selectInput($event)"></select-string-component>
      <button class="new-tag" type="submit" (click)="newTagSection()">New Creative String</button>
    </section>
      <section class="input-tag" *ngIf="showButtons">
        <input [ngModel]="creativeInput.creativeInputTag" class="form-control" [disabled]=true>
        <button class="new-tag" *ngIf="!existingCreativeInput && showButtons" type="submit" (click)="saveInput()" [disabled]="invalid">Create Creative String</button>
        <button class="new-tag" *ngIf="existingCreativeInput && showButtons" type="submit" (click)="selectInput(creativeInput.creativeInputTag)">Select Creative String</button>
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
        <section class="select">
          <div class="first-column">
            <month-select-component [label]="startMonthLabel" [default]="defaultStartMonth" (selected)="attributeUpdated($event, 'startMonth')"></month-select-component>
          </div>
          <div class="column">
            <day-select-component [label]="startDayLabel" [default]="defaultStartDay" (selected)="attributeUpdated($event, 'startDay')"></day-select-component>
          </div>
          <div class="column">
          <month-select-component [label]="endMonthLabel" [default]="defaultEndMonth" (selected)="attributeUpdated($event, 'endMonth')"></month-select-component>
          </div>
          <div class="column">
            <day-select-component [label]="endDayLabel" [default]="defaultEndDay" (selected)="attributeUpdated($event, 'endDay')"></day-select-component>
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
  @ViewChild(MonthSelectComponent)
  private monthSelectComponent: MonthSelectComponent;
  @ViewChild(DaySelectComponent) 
  private daySelectComponent: DaySelectComponent;


  @Input() campaignInput: {};
  @Input() adInput: {};
  @Input() placementInput: {};
  @Input() creativeMessages: any[];
  @Input() abtestLabels: any[];
  @Input() videoLengths: any[];
  @Input() creativeTags: any[];
  @Output() creativeTagFinal = new EventEmitter();

  creativeInput: any = {};
  existingCreativeInput: any;
  creativeMessageLabel: string = 'Creative Message';
  creativeVersionLabel: string = 'Creative Version Number';
  videoLengthLabel: string = 'Video Length';
  abTestLabel: string = 'A/B Test Label';
  startMonthLabel: string = 'Start Month';
  startDayLabel: string = 'Start Day';
  endMonthLabel: string = 'End Month';
  endDayLabel: string = 'End Day';
  showFinal: boolean = false;
  showSelectors: boolean = false;
  showButtons: boolean = false;
  showSearch: boolean = true;
  invalid: boolean = true;
  defaultAbLabel: any;
  defaultCreativeMessage: any;
  defaultCreativeVersion: string;
  defaultVideoLength: any;
  defaultStartMonth: string;
  defaultStartDay: string;
  defaultEndMonth: string;
  defaultEndDay: string;
  creativeInputObject: any = {};

  constructor( private _creative: CreativeInputService, private _adtype: AdTypeService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.defaultAbLabel = this.abtestLabels.find(x => x['name'] == 'Not Applicable');
    this.creativeInput.abtestLabel = this.defaultAbLabel;
  }

  verifyTag() {
    this._creative.verifyInput(this.creativeInput.creativeInputTag).subscribe(

      (result) => {
        // This is the object that sets the create/select button
        this.existingCreativeInput = result;

        if(result) {
          // This is the object that will be used to copy
          this.creativeInputObject = result;
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
        end_month: this.creativeInput.endMonth,
        end_day: this.creativeInput.endDay,
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
        end_month: this.creativeInput.endMonth,
        end_day: this.creativeInput.endDay,
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
        this.creativeTagFinal.emit(result);
      },
      (error) => {
        console.log('ERROR', error)
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
    this.showButtons = true;
    this.showSelectors = true;
  }

  cancelInput() {
    if(this._adtype.videoAdType(this.placementInput)) {
      this.selectComponent.setSelections(this.videoLengthLabel);
    }
    this.selectComponent.setSelections(this.creativeMessageLabel);
    this.creativeInput.custom = null;
    this.monthSelectComponent.setSelections(this.creativeVersionLabel);
    this.selectComponent.setSelections(this.abTestLabel);
    this.monthSelectComponent.setSelections(this.startMonthLabel);
    this.monthSelectComponent.setSelections(this.endMonthLabel);
    this.daySelectComponent.setSelections(this.startDayLabel);
    this.daySelectComponent.setSelections(this.endDayLabel);
    this.creativeInput.creativeInputTag = null;
  }

  duplicate() {
    this.showButtons = true;
    this.showFinal = false;
    this.existingCreativeInput = false;
    this.invalid = true;
    // Hide Export Button
    this.creativeTagFinal.emit(null);

    if(this._adtype.videoAdType(this.placementInput)) {
      this.defaultVideoLength = this.creativeInput.videoLength = this.videoLengths.find(x => x['name'] == this.creativeInputObject.video_length.name);
    }
     // Set the default values for each of the selectors and set the object attributes
     this.defaultCreativeMessage = this.creativeInput.creativeMessage = this.creativeMessages.find(x => x['name'] == this.creativeInputObject.creative_message.name);
     this.creativeInput.custom = this.creativeInputObject.custom;
     this.defaultCreativeVersion = this.creativeInput.creativeVersion = this.creativeInputObject.creative_version_number;
     this.defaultAbLabel = this.creativeInput.abtestLabel = this.abtestLabels.find(x => x['name'] == this.creativeInputObject.abtest_label.name);
     this.defaultStartMonth = this.creativeInput.startMonth = this.creativeInputObject.start_month;
     this.defaultEndMonth = this.creativeInput.endMonth = this.creativeInputObject.end_month;
     this.defaultEndDay = this.creativeInput.endDay = this.creativeInputObject.end_day;
     this.defaultStartDay = this.creativeInput.startDay = this.creativeInputObject.start_day;

    this.showSelectors = true;
    // Checks to see if the ngIf has changed and the selectors are showing.
    this.changeDetector.detectChanges();

     // Set the selectors to the current value
    if(this._adtype.videoAdType(this.placementInput)) {
      this.selectComponent.setSelections(this.videoLengthLabel);
    }
    this.selectComponent.setSelections(this.creativeMessageLabel);
    this.selectComponent.setSelections(this.abTestLabel);
    this.monthSelectComponent.setSelections(this.creativeVersionLabel);
    this.monthSelectComponent.setSelections(this.startMonthLabel);
    this.monthSelectComponent.setSelections(this.endMonthLabel);
    this.daySelectComponent.setSelections(this.startDayLabel);
    this.daySelectComponent.setSelections(this.endDayLabel);
  }
  
}