import { Component, Input, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { CreativeInputService } from '../services/creative_input_service';
import {SelectComponent} from './select.component';
import {MonthSelectComponent} from './monthselect.component';
import {DaySelectComponent} from './dayselect.component';

@Component({
  selector: 'creative',
  template: `
  <h2 class="campaign-title">Creative Input</h2>
  <p *ngIf="showFinal" class="final-string">{{creativeInput.creativeInputTag}}</p>
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
            <select-component [label]="creativeMessageLabel" [options]="creativeMessages" (selected)="attributeUpdated($event, 'creativeMessage')"></select-component>
          </div>
          <div class="custom-column">
            <label for="creativeCustom">Creative Version Custom</label>
            <input type="text" id="creativeCustom" [(ngModel)]="creativeInput.custom" placeholder="Enter Custom" (change)="checkAttributes()">
          </div>
          <div class="column">
            <month-select-component [label]="creativeVersionLabel" (selected)="attributeUpdated($event, 'creativeVersion')"></month-select-component>
          </div>
        </section>
        <section class="select">
          <div class="first-column">
            <select-component [label]="abTestLabel" [options]="abtestLabels" [default]="defaultAbLabel" (selected)="attributeUpdated($event, 'abtestLabel')"></select-component>
          </div>
          <div class="second-column" *ngIf="videoAdType()">
            <select-component [label]="videoLengthLabel" [options]="videoLengths" (selected)="attributeUpdated($event, 'videoLength')"></select-component>
          </div>
        </section>
        <section class="select">
          <div class="first-column">
            <month-select-component [label]="startMonthLabel" (selected)="attributeUpdated($event, 'startMonth')"></month-select-component>
          </div>
          <div class="column">
            <day-select-component [label]="startDayLabel" (selected)="attributeUpdated($event, 'startDay')"></day-select-component>
          </div>
          <div class="column">
          <month-select-component [label]="endMonthLabel" (selected)="attributeUpdated($event, 'endMonth')"></month-select-component>
          </div>
          <div class="column">
            <day-select-component [label]="endDayLabel" (selected)="attributeUpdated($event, 'endDay')"></day-select-component>
          </div>
        </section>
      </div>
    </div>
  </div>
  `
})

export class CreativeComponent implements OnInit {
  @ViewChild(SelectComponent) selectComponent:SelectComponent;
  @ViewChild(MonthSelectComponent) monthSelectComponent:MonthSelectComponent;
  @ViewChild(DaySelectComponent) daySelectComponent:DaySelectComponent;

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
  defaultAbLabel: any = {};

  constructor( private _creative: CreativeInputService) {}

  ngOnInit() {
    this.defaultAbLabel = this.abtestLabels.find(x => x['name'] == 'Not Applicable');
    this.creativeInput.abtestLabel = this.defaultAbLabel;
  }

  verifyTag() {
    this._creative.verifyInput(this.creativeInput.creativeInputTag).subscribe(

      (result) => {
        this.existingCreativeInput = result;
        if(result) {
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
    if(this.placementInput['ad_type']['abbrev'] == 'SVD' || this.placementInput['ad_type']['abbrev'] == 'NSV'){
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
    if(this.creativeInput.creativeMessage && this.videoAdType() &&
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
    this.showButtons = true 
    this.showSelectors = true
  }

  cancelInput() {
    this.selectComponent.clearSelections('Creative Message');
    this.creativeInput.custom = null;
    this.monthSelectComponent.clearSelections('Creative Version Number');
    this.selectComponent.clearSelections('Video Length');
    this.selectComponent.clearSelections('A/B Test Label');
    this.monthSelectComponent.clearSelections('Start Month');
    this.monthSelectComponent.clearSelections('End Month');
    this.daySelectComponent.clearSelections('Start Day');
    this.daySelectComponent.clearSelections('End Day');
    this.creativeInput.creativeInputTag = null;
  }

  videoAdType() {
    return this.placementInput['ad_type']['abbrev'] == 'SVD' || this.placementInput['ad_type']['abbrev'] == 'NSV'
  }
  
}