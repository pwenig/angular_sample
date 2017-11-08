import { Component, Input, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import {AdInputService} from '../services/ad_input_service';
import {SelectComponent} from './select.component';

@Component({
  selector: 'ad',
  template: `
  <h2 class="campaign-title">Ad Input</h2>
  <p *ngIf="showFinal" class="final-string">{{ adInput.adInputTag }}</p>
  <div class="input-tag-container">
    <div class="row">
      <section class="input-tag" *ngIf="(!showButtons && !showSelectors) && !showFinal">
        <select-string-component  [options]="adTags" (selected)="selectInput($event)"></select-string-component>
        <button class="new-tag" type="submit" (click)="newTagSection()">New Ad String</button>
      </section>
      <section class="input-tag" *ngIf="showButtons">
        <input [ngModel]="adInput.adInputTag" class="form-control" [disabled]=true>
        <button class="new-tag" *ngIf="!existingAdInput && showButtons" type="submit" (click)="saveInput()" [disabled]="invalid">Create Ad String</button>
        <button class="new-tag" *ngIf="existingAdInput && showButtons" type="submit" (click)="selectInput(adInput.adInputTag)">Select Ad String</button>
        <button class="cancel-tag" *ngIf="showButtons" type="submit" (click)="cancelInput()">Clear</button>
      </section>
    </div>
  </div>

  <div *ngIf="showSelectors">
    <div class="select-container">
      <div class="row">
        <section class="select">
          <div class="column" *ngIf="creativeGroups && creativeGroups.length > 0">
            <select-component [label]="creativeGroupLabel" [options]="creativeGroups" (selected)="attributeUpdated($event, 'creativeGroup')"></select-component>
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
  @ViewChild(SelectComponent) selectComponent:SelectComponent;

  @Input() campaignInput: {};
  @Input() packageInput: {};
  @Input() placementInput: {};
  @Input() adTags: any[];
  @Input() creativeGroups: any[];
  @Output() adTagFinal = new EventEmitter();

  creativeGroupLabel: string = 'Creative Group';
  adInput: any = {};
  existingAdInput: any;
  showSelectors: boolean = false;
  showButtons: boolean = false;
  showFinal: boolean = false;
  invalid: boolean = true;

  constructor( private _ad: AdInputService) {}

  ngOnInit() {
    if(!this.adTags || this.adTags.length == 0) {
      this.showButtons = true;
      this.showSelectors = true;
    }
  }

  verifyTag() {
    this._ad.verifyInput(this.adInput.adInputTag).subscribe(

      (result) => {
        this.existingAdInput = result;
        if(result) {
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
    this.showButtons = true 
    this.showSelectors = true
  }

  cancelInput() {
    this.selectComponent.clearSelections('Creative Group');
    this.adInput.custom = null;
    this.adInput.adInputTag = null;
  }

}