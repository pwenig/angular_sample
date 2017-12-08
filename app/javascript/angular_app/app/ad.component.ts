import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {AdInputService} from '../services/ad_input_service';
import {SelectComponent} from './select.component';
import {TreeService} from '../services/tree_service';
import {HistoryService} from '../services/history_service';

@Component({
  selector: 'ad',
  template: `
  <h2 class="campaign-title">Ad Input</h2>
  <p *ngIf="showFinal" class="final-string">{{ adInput.adInputTag }}<button class="duplicate" id="duplicateAd" type="submit" (click)="duplicate()">Duplicate</button></p>
  <div class="input-tag-container">
    <div class="row">
      <section class="input-tag" *ngIf="(!showButtons && !showSelectors) && !showFinal">
        <select-string-component  [options]="adTags" (selected)="selectInput($event)"></select-string-component>
        <button class="new-tag" type="submit" (click)="newTagSection()">New Ad String</button>
      </section>
      <section class="input-tag" *ngIf="showButtons">
        <input [ngModel]="adInput.adInputTag" class="form-control" [disabled]=true>
        <button class="new-tag" *ngIf="showSave" type="submit" (click)="saveInput()" [disabled]="invalid">Save Ad String</button>
        <button class="new-tag" *ngIf="showSelect" type="submit" (click)="selectInput(adInput.adInputTag)">Select Ad String</button>
        <button class="cancel-tag" *ngIf="showButtons" type="submit" (click)="cancelInput()">Clear</button>
      </section>
    </div>
  </div>

  <div *ngIf="showSelectors">
    <div class="select-container">
      <div class="row">
        <section class="select">
          <div class="column" *ngIf="creativeGroups && creativeGroups.length > 0">
            <select-component [label]="creativeGroupLabel" [default]="defaultCreativeGroup" [options]="creativeGroups" (selected)="attributeUpdated($event, 'creativeGroup')"></select-component>
          </div>
          <div class="custom-column">
            <label for="customAd">Ad Custom</label><br>
            <input type="text" id="customAd" [(ngModel)]="adInput.custom" placeholder="Enter Custom" (change)="checkAttributes()">
          </div>
        </section>
      </div>
    </div>
  </div>
  
  `
})

export class AdComponent implements OnInit {
  @ViewChild(SelectComponent) 
  private selectComponent:SelectComponent;

  @Input() campaignInput: {};
  @Input() packageInput: {};
  @Input() placementInput: {};
  @Input() adTags: any[];
  @Input() creativeGroups: any[];
  @Output() adTagFinal = new EventEmitter();
  @Output() adObjectCreated = new EventEmitter();

  creativeGroupLabel: string = 'Creative Group';
  adInput: any = {};
  existingAdInput: any;
  showSelectors: boolean = false;
  showButtons: boolean = false;
  showFinal: boolean = false;
  invalid: boolean = true;
  defaultCreativeGroup: any;
  adInputObject: any = {};
  showSave: boolean = false;
  showSelect: boolean = false;

  constructor( private _ad: AdInputService, private changeDetector: ChangeDetectorRef, private _tree: TreeService, private _history: HistoryService) {}

  ngOnInit() {
    if(!this.adTags || this.adTags.length == 0) {
      this.showButtons = true;
      this.showSelectors = true;
    }
    this.adInput.custom = "XX";
  }

  verifyTag() {
    this._ad.verifyInput(this.adInput.adInputTag).subscribe(

      (result) => {
        // This is the object that sets the create/select button
        this.existingAdInput = result;
        this.showSave = true;
        if(result) {
          // This is the object that will be used to copy
          this.adInputObject = result;
          this.showSelect = true;
          this._history.storeInput(result);
          this._tree.createAdTree(result);
          this.adObjectCreated.emit(JSON.parse(localStorage.getItem('inputs')));
          this.adTagFinal.emit(result)
        }

      },
      (error) => {
        console.log('Error', error);
      }
    )
  }

  saveInput() {
    let create_params = {
      placement_input_id: this.placementInput['id'],
      creative_group_id: this.adInput.creativeGroup.id,
      custom: this.adInput.custom,
      ad_input_tag: this.adInput.adInputTag
    }
    this._ad.createInput(create_params).subscribe(

      (result) => {
        this.showSelectors = false;
        this.showButtons = false;
        this.showFinal = true;
        this.adInputObject = result;
        this._history.storeInput(result);
        this._tree.createAdTree(result);
        this.adObjectCreated.emit(JSON.parse(localStorage.getItem('inputs')));
        this.adTagFinal.emit(result);
      },
      (error) => {
        console.log('ERROR', error);
      }
    );
  }

   // Updates the attribute when it is selected from child components
   attributeUpdated(value, attribute) {
    this.adInput[attribute] = value;
    this.checkAttributes();
  }

  // Checks to see if everything is selected before creating the tag
  checkAttributes() {
    if(this.adInput.creativeGroup && this.adInput.custom) {
      this.adInput.adInputTag = this._ad.createAdString(this.campaignInput, this.packageInput, this.placementInput, this.adInput)
      if(this.adInput.adInputTag) {
        this.verifyTag();
      }
      this.invalid = false;
    }
  }

  selectInput(tag) {
    this.adInput.adInputTag = tag;
    this.showFinal = true;
    this.showSelectors = false;
    this.showButtons = false;
    this.verifyTag();
  }

  newTagSection() {
    this.showButtons = true ;
    this.showSelectors = true;
    this.adInput.custom = "XX";
  }

  cancelInput() {
    this.selectComponent.setSelections(this.creativeGroupLabel);
    this.adInput.custom = "XX";
    this.adInput.adInputTag = null;
  }

  duplicate() {
    this.showButtons = true;
    this.showFinal = false;
    this.existingAdInput = false;
    this.invalid = true;
    // Hide the creative input section
    this.adTagFinal.emit(null);
    // Set default values
    this.defaultCreativeGroup = this.adInput.creativeGroup = this.creativeGroups.find(x => x['name'] == this.adInputObject.creative_group.name);
    this.adInput.custom = this.adInputObject.custom;
    this.showSelectors = true;
    // Checks to see if the ngIf has changed and the selectors are showing.
    this.changeDetector.detectChanges();
    this.selectComponent.setSelections(this.creativeGroupLabel);
  }

}