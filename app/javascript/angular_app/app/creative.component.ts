import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectorRef, OnChanges, SimpleChanges} from '@angular/core';
import { CreativeInputService } from '../services/creative_input_service';
import { AdTypeService } from '../services/ad_type_service';
import {SelectComponent} from './select.component';
import {HistoryService} from '../services/history_service';
import {CampaignInputService} from '../services/campaign_input_service';
import {TreeService} from '../services/tree_service';
import {DateFormatService} from '../services/date_format_service'

@Component({
  selector: 'creative',
  template: `

  <div *ngIf="selectedObject.action">
    <div [config]="{ show: true }" (onHide)=closeModal() bsModal #autoShownModal="bs-modal" #Modal="bs-modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content campaign">
          <div class="modal-header">
            <h4 class="modal-title pull-left">{{selectedObject.action}} Creative</h4>
            <button type="button" class="close pull-right" (click)="Modal.hide()" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
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
                  <div class="creative-date-column">
                    <label>Creative Start / End Date</label>
                    <input class="form-control" #drp="bsDaterangepicker" bsDaterangepicker [ngModel]="creativeRange" (ngModelChange)="dateChange($event)">
                   </div>
                  <div class="column" *ngIf="_adtype.videoAdType(selectedObject.namestring.placementParent)">
                    <select-component [label]="videoLengthLabel" [options]="videoLengths" [default]="defaultVideoLength" (selected)="attributeUpdated($event, 'videoLength')"></select-component>
                  </div>
                </section>
                <section class="select">
                  <div class="action-column">
                    <button class="btn btn-primary action" (click)="Modal.hide()">Cancel Creative</button>
                    <button class="btn btn-primary action" *ngIf="showSave" (click)="saveInput(action)">{{action}} Creative</button>
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

export class CreativeComponent implements OnInit, OnChanges {
  @ViewChild(SelectComponent) 
  private selectComponent: SelectComponent;


  @Input() campaignInput: {};
  @Input() selectedObject: any = {};
  // Remove below two?
  @Input() adInput: {};
  @Input() placementInput: {};
  @Input() creativeMessages: any[];
  @Input() abtestLabels: any[];
  @Input() videoLengths: any[];
  @Input() creativeTags: any[];


  @Output() creativeTagFinal = new EventEmitter();
  @Output() creativeObject = new EventEmitter();
  @Output() creativeTagUpdate = new EventEmitter();

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
  action: any = 'Create';

  constructor( private _creative: CreativeInputService, private _adtype: AdTypeService, private changeDetector: ChangeDetectorRef, private _history: HistoryService, private _tree: TreeService, private _date: DateFormatService) {}

  ngOnInit() {
    this.creativeInput.custom = "XX";
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.selectedObject.currentValue.action == 'Edit') {
      this.action = 'Update'
      this.duplicate();
    }
  }

  closeModal() {
    this.selectedObject.action = null;
    this.creativeInput = {};
    this.cancelInput();
    this.showSave = false;
  }


  cancelInput() {
    if(this._adtype.videoAdType(this.placementInput)) {
      this.selectComponent.setSelections(this.videoLengthLabel);
    }
    this.creativeInput = {};
    this.defaultCreativeMessage = undefined;
    this.defaultCreativeVersion = undefined;
    this.defaultAbLabel = undefined;
    this.creativeInput.custom = "XX";
    this. creativeRange = [new Date(), new Date()];
  }

  dateChange(date) {
    this.creativeRange = date;
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

  saveInput(action) {
    let createParams = {};
    if(this._adtype.videoAdType(this.selectedObject.namestring.placementParent)){
      createParams = {
        ad_input_id: this.selectedObject.namestring.namestring.id,
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
        ad_input_id: this.selectedObject.namestring.namestring.id,
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

    if(action == 'Update') {
      createParams['ad_input_id'] = this.selectedObject.namestring.namestring.ad_input_id,
      this._creative.updateInput(this.selectedObject.namestring.namestring.id, createParams).subscribe(

        (result) => {
          this.creativeInput = result;
          // Store the object for exporting
          this._history.storeInput(result);
          this._tree.createCreativeTree(result);
          // this.creativeObject.emit(JSON.parse(localStorage.getItem('inputs')));
          this.creativeTagUpdate.emit(result);
          this.selectedObject.action = null;
          this.selectedObject.namestring.namestring = {};
          this.showSave = false;
  
        },
        (error) => {
          console.log('ERROR', error);
        }
      );

    } else if (action == 'Create') {
      this._creative.createInput(createParams).subscribe(

        (result) => {
          this.creativeInputObject = result;
          // Store the object for exporting
          this._history.storeInput(result);
          this._tree.createCreativeTree(result);
          // this.creativeObject.emit(JSON.parse(localStorage.getItem('inputs')));
          this.creativeTagFinal.emit(result);
          this.selectedObject.action = null;
          this.creativeInput = {};
          this.showSave = false;
  
        },
        (error) => {
          console.log('ERROR', error);
        }
      );

    } else {}
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
    if(this.creativeInput.creativeMessage && this._adtype.videoAdType(this.selectedObject.namestring.placementParent) &&
      this.creativeInput.custom &&
      this.creativeInput.creativeVersion &&
      this.creativeInput.abtestLabel &&
      this.creativeInput.startMonth &&
      this.creativeInput.startDay &&
      this.creativeInput.endMonth &&
      this.creativeInput.endDay
    ){
      if(this.creativeInput.videoLength) {
        this.creativeInput.creativeInputTag = this._creative.createCreativeString(this.selectedObject.namestring.campaignParent, this.selectedObject.namestring.placementParent, this.selectedObject.namestring.adParent, this.creativeInput)
        this.showSave = true;
      }
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
      this.creativeInput.creativeInputTag = this._creative.createCreativeString(this.selectedObject.namestring.campaignParent, this.selectedObject.namestring.placementParent, this.selectedObject.namestring.adParent, this.creativeInput)
      this.showSave = true;
      if(this.creativeInput.creativeInputTag){
        this.verifyTag();
      }
      this.invalid = false;
    }  

  }

  duplicate() {
    if(this._adtype.videoAdType(this.placementInput)) {
      this.defaultVideoLength = this.creativeInput.videoLength = this.videoLengths.find(x => x['name'] == this.selectedObject.namestring.namestring.video_length.name);
    }
     // Set the default values for each of the selectors and set the object attributes
     this.defaultCreativeMessage = this.creativeInput.creativeMessage = this.creativeMessages.find(x => x['id'] == this.selectedObject.namestring.namestring.creative_message_id);
     this.creativeInput.custom = this.selectedObject.namestring.namestring.custom;
     this.defaultCreativeVersion = this.creativeInput.creativeVersion = this.selectedObject.namestring.namestring.creative_version_number;
     this.defaultAbLabel = this.creativeInput.abtestLabel = this.abtestLabels.find(x => x['id'] == this.selectedObject.namestring.namestring.abtest_label_id);
     this.creativeInput.startMonth = this.selectedObject.namestring.namestring.start_month;
     this.creativeInput.endMonth = this.selectedObject.namestring.namestring.end_month;
     this.creativeInput.endDay = this.selectedObject.namestring.namestring.end_day;
     this.creativeInput.startDay = this.selectedObject.namestring.namestring.start_day;
     this.creativeInput.endYear = this.selectedObject.namestring.namestring.end_year;
     this.creativeInput.startYear = this.selectedObject.namestring.namestring.start_year;

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
    this.creativeRange = [new Date(this.selectedObject.namestring.namestring.start_year, this.selectedObject.namestring.namestring.start_month - 1, this.selectedObject.namestring.namestring.start_day), new Date(this.selectedObject.namestring.namestring.end_year, this.selectedObject.namestring.namestring.end_month - 1, this.selectedObject.namestring.namestring.end_day)]
  }
  
}