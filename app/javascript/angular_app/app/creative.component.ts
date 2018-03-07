import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectorRef, OnChanges, SimpleChanges} from '@angular/core';
import { CreativeInputService } from '../services/creative_input_service';
import { AdTypeService } from '../services/ad_type_service';
import {SelectComponent} from './select.component';
import {HistoryService} from '../services/history_service';
import {CampaignInputService} from '../services/campaign_input_service';
import {TreeService} from '../services/tree_service';
import {DateFormatService} from '../services/date_format_service'
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'creative',
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
                  <div class="first-column" *ngIf="creativeMessages && creativeMessages.length > 0">
                    <select-component [label]="creativeMessageLabel" [default]="defaultCreativeMessage" [options]="creativeMessages" (selected)="attributeUpdated($event, 'creative_message')"></select-component>
                  </div>
                  <div class="custom-column">
                    <label for="creativeCustom">Creative Version Custom</label>
                    <input type="text" id="creativeCustom" [(ngModel)]="creativeInput.custom" placeholder="Enter Custom" (change)="checkAttributes()">
                  </div>
                  <div class="column">
                    <month-select-component [label]="creativeVersionLabel" [default]="defaultCreativeVersion" (selected)="attributeUpdated($event, 'creative_version_number')"></month-select-component>
                  </div>
                </section>
                <section class="select">
                  <div class="first-column">
                    <select-component [label]="abTestLabel" [options]="abtestLabels" [default]="defaultAbLabel" (selected)="attributeUpdated($event, 'abtest_label')"></select-component>
                  </div>
                  <div class="creative-date-column">
                    <label>Creative Start / End Date</label>
                    <input class="form-control" #drp="bsDaterangepicker" bsDaterangepicker [ngModel]="creativeRange" (ngModelChange)="dateChange($event)">
                   </div>
                  <div class="column" *ngIf="_adtype.videoAdType(selectedObject.namestring.placementParent)">
                    <select-component [label]="videoLengthLabel" [options]="videoLengths" [default]="defaultVideoLength" (selected)="attributeUpdated($event, 'video_length')"></select-component>
                  </div>
                </section>
                <section class="select">
                  <div class="action-column">
                    <button class="btn btn-primary action" (click)="Modal.hide()">Cancel</button>
                    <button class="btn btn-primary action" *ngIf="showSave" (click)="saveInput(action)">{{action}}</button>
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
  @ViewChild('Modal') public modal: ModalDirective;

  @Input() campaignInput: {};
  @Input() selectedObject: any = {};
  @Input() creativeMessages: any[];
  @Input() abtestLabels: any[];
  @Input() videoLengths: any[];
  @Input() creativeTags: any[];

  @Output() creativeTagFinal = new EventEmitter();
  @Output() creativeObjectSelected = new EventEmitter();
  @Output() creativeTagUpdate = new EventEmitter();
  @Output() errorHandler = new EventEmitter();

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
    if(this.selectedObject.action == 'New Creative') {
      this.creativeInput.custom = "XX";
      
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.selectedObject.currentValue.action == 'Edit Creative') {
      this.action = 'Update';
      this.duplicate();
    }
    if(changes.selectedObject.currentValue.action == 'Copy/Create Creative') {
      this.action = 'Create';
      this.duplicate();
    }
  }

  closeModal() {
    this.selectedObject.action = null;
    this.cancelInput();
    this.showSave = false;
  }


  cancelInput() {
    if(this._adtype.videoAdType(this.selectedObject.namestring.placementParent)) {
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
    this.creativeInput.start_year = start_date.getFullYear();
    var startMonth  = start_date.getMonth() + 1;
    if(startMonth < 10) {
      this.creativeInput.start_month = "0" + startMonth.toString();
    } else {
      this.creativeInput.start_month = startMonth.toString();
    }
    var startDay = start_date.getDate();
    if(startDay < 10) {
      this.creativeInput.start_day = "0" + startDay.toString();
    } else {
      this.creativeInput.start_day = startDay.toString();
    }
    
    // Format the end date
    var end_date = date[1];
    this.creativeInput.end_year = end_date.getFullYear();
    var endMonth = end_date.getMonth() + 1;
    if(endMonth < 10) {
      this.creativeInput.end_month = "0" + endMonth.toString();
    } else {
      this.creativeInput.end_month = endMonth.toString();
    }
    var endDay = end_date.getDate();
    if(endDay < 10) {
      this.creativeInput.end_day = "0" + endDay.toString();
    } else {
      this.creativeInput.end_day = endDay.toString();
    }
    this.checkAttributes();
  }

  saveInput(action) {
    let createParams = {};
    if(this._adtype.videoAdType(this.selectedObject.namestring.placementParent)){
      createParams = {
        ad_input_id: this.selectedObject.namestring.namestring.id,
        creative_message_id: this.creativeInput.creative_message.id,
        abtest_label_id: this.creativeInput.abtest_label.id,
        video_length_id: this.creativeInput.video_length.id,
        start_month: this.creativeInput.start_month,
        start_day: this.creativeInput.start_day,
        start_year: this.creativeInput.start_year,
        end_month: this.creativeInput.end_month,
        end_day: this.creativeInput.end_day,
        end_year: this.creativeInput.end_year,
        creative_version_number: this.creativeInput.creative_version_number,
        custom: this.creativeInput.custom,
        creative_input_tag: this.creativeInput.creativeInputTag
      }
    } else {
      createParams = {
        ad_input_id: this.selectedObject.namestring.namestring.id,
        creative_message_id: this.creativeInput.creative_message.id,
        abtest_label_id: this.creativeInput.abtest_label.id,
        start_month: this.creativeInput.start_month,
        start_day: this.creativeInput.start_day,
        start_year: this.creativeInput.start_year,
        end_month: this.creativeInput.end_month,
        end_day: this.creativeInput.end_day,
        end_year: this.creativeInput.end_year,
        creative_version_number: this.creativeInput.creative_version_number,
        custom: this.creativeInput.custom,
        creative_input_tag: this.creativeInput.creativeInputTag
      }
    }

    if(action == 'Update') {
      createParams['ad_input_id'] = this.selectedObject.namestring.namestring.ad_input_id;
      this._creative.updateInput(this.selectedObject.namestring.namestring.id, createParams).subscribe(

        (result) => {
          this.creativeInput = result;
          this.creativeTagUpdate.emit(result);
          this.selectedObject.action = null;
          this.selectedObject.namestring.namestring = {};
          this.showSave = false;
  
        },
        (error) => {
          this.modal.hide();
          this.errorHandler.emit('Updating Creative');
          console.log('ERROR', error);
        }
      );

    } else if (action == 'Create') {
      if(this.selectedObject.action == 'Copy/Create Creative') {
        createParams['ad_input_id'] = this.selectedObject.namestring.namestring.ad_input_id;
      }
      this._creative.createInput(createParams).subscribe(

        (result) => {
          this.creativeInputObject = result[0];
          if(result[1]['status'] == 200) {
            this.creativeObjectSelected.emit(this.creativeInputObject);
          } else {
            this.creativeTagFinal.emit(this.creativeInputObject);
          }
          this.selectedObject.action = null;
          this.creativeInput = {};
          this.showSave = false;
  
        },
        (error) => {
          this.modal.hide();
          this.errorHandler.emit('Creating Creative');
          console.log('ERROR', error);
        }
      );

    } else {}
  }

   // Updates the attribute when it is selected from child components
   attributeUpdated(value, attribute) {
    this.creativeInput[attribute] = value;
    this.checkAttributes();
  }

  checkAttributes() {
    if(this.creativeInput.creative_message && this._adtype.videoAdType(this.selectedObject.namestring.placementParent) &&
      this.creativeInput.custom &&
      this.creativeInput.creative_version_number &&
      this.creativeInput.abtest_label &&
      this.creativeInput.start_month &&
      this.creativeInput.start_day &&
      this.creativeInput.end_month &&
      this.creativeInput.end_day
    ){
      if(this.creativeInput.video_length) {
        this.creativeInput.creativeInputTag = this._creative.createCreativeString(this.selectedObject.namestring.campaignParent, this.selectedObject.namestring.placementParent, this.selectedObject.namestring.adParent, this.creativeInput)
        this.showSave = true;
      }
      this.invalid = false;
    
    } else if (
      this.creativeInput.creative_message &&
      this.creativeInput.custom &&
      this.creativeInput.creative_version_number &&
      this.creativeInput.abtest_label&&
      this.creativeInput.start_month &&
      this.creativeInput.start_day &&
      this.creativeInput.end_month &&
      this.creativeInput.end_day
    ){
      this.creativeInput.creativeInputTag = this._creative.createCreativeString(this.selectedObject.namestring.campaignParent, this.selectedObject.namestring.placementParent, this.selectedObject.namestring.adParent, this.creativeInput)
      this.showSave = true;
      this.invalid = false;
    }  

  }

  duplicate() {
    if(this._adtype.videoAdType(this.selectedObject.namestring.placementParent)) {
      this.defaultVideoLength = this.creativeInput.video_length = this.videoLengths.find(x => x['name'] == this.selectedObject.namestring.namestring.video_length.name);
    }
     // Set the default values for each of the selectors and set the object attributes
     this.defaultCreativeMessage = this.creativeInput.creative_message = this.creativeMessages.find(x => x['id'] == this.selectedObject.namestring.namestring.creative_message_id);
     this.creativeInput.custom = this.selectedObject.namestring.namestring.custom;
     this.defaultCreativeVersion = this.creativeInput.creative_version_number = this.selectedObject.namestring.namestring.creative_version_number;
     this.defaultAbLabel = this.creativeInput.abtest_label = this.abtestLabels.find(x => x['id'] == this.selectedObject.namestring.namestring.abtest_label_id);
     this.creativeInput.start_month = this.selectedObject.namestring.namestring.start_month;
     this.creativeInput.end_month = this.selectedObject.namestring.namestring.end_month;
     this.creativeInput.end_day = this.selectedObject.namestring.namestring.end_day;
     this.creativeInput.start_day = this.selectedObject.namestring.namestring.start_day;
     this.creativeInput.end_year = this.selectedObject.namestring.namestring.end_year;
     this.creativeInput.start_year = this.selectedObject.namestring.namestring.start_year;

    // Checks to see if the ngIf has changed and the selectors are showing.
    this.changeDetector.detectChanges();

     // Set the selectors to the current value
    if(this._adtype.videoAdType(this.selectedObject.namestring.placementParent)) {
      this.selectComponent.setSelections(this.videoLengthLabel);
    }
    this.selectComponent.setSelections(this.creativeMessageLabel);
    this.selectComponent.setSelections(this.abTestLabel);
    // Set the creativeRange
    var date = new Date();
    this.creativeRange = [new Date(this.selectedObject.namestring.namestring.start_year, this.selectedObject.namestring.namestring.start_month - 1, this.selectedObject.namestring.namestring.start_day), new Date(this.selectedObject.namestring.namestring.end_year, this.selectedObject.namestring.namestring.end_month - 1, this.selectedObject.namestring.namestring.end_day)]
  }
  
}