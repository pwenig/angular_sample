import { Component, Input } from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'tree',
  template: `
    <div class="tree-container">
      <div class="row">
        <section class="tree">
          <tabset>
            <tab heading="Current Inputs" id="tab1">
              <div *ngIf="current_created_input && current_created_input['campaignInputs'] && current_created_input['campaignInputs'].length > 0">
                <button class="export" (click)="export(current_exports)">Export ({{created_count }})</button>
                <ul *ngFor="let campaign of current_created_input['campaignInputs']">
                  <li id='campaign'>
                    <span style='font-weight: 900'>Campaign:</span> {{ campaign.input }}
                  </li>
                  <span *ngIf="campaign.packageInputs && campaign.packageInputs.length > 0">
                    <span *ngFor="let package_input of campaign.packageInputs" >
                      <li id='package'>
                        <span style='font-weight: 900'>Package:</span> {{ package_input.input }}
                      </li>
                      <span *ngIf="package_input.placementInputs && package_input.placementInputs.length > 0">
                        <span *ngFor="let placement_input of package_input.placementInputs">
                          <li id='placement'>
                            <span style='font-weight: 900'>Placement:</span> {{ placement_input.input }}
                          </li>
                          <span *ngIf="placement_input.adInputs && placement_input.adInputs.length > 0">
                            <span *ngFor="let ad_input of placement_input.adInputs">
                              <li id='ad'>
                                <span style='font-weight: 900'>Ad:</span> {{ ad_input.input }}
                              </li>
                              <span *ngIf="ad_input.creativeInputs && ad_input.creativeInputs.length > 0">
                                <span *ngFor="let creative_input of ad_input.creativeInputs">
                                  <li id='creative'>
                                    <span style='font-weight: 900'>Creative:</span> {{ creative_input.input }}
                                  </li>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </ul>
              </div>
            </tab>
            <tab heading="All Inputs">
              <div *ngIf="all_inputs && all_inputs.length > 0">
                <button class="export" (click)="export(all_exports)">Export All ({{all_count }})</button>
                <ul *ngFor="let input of all_inputs">
                  <li id='campaign'>
                    <span style='font-weight: 900'>Campaign:</span> {{ input.campaign_input_tag }}
                  </li>
                  <span *ngIf="input.package_inputs && input.package_inputs.length > 0">
                    <span *ngFor="let package_input of input.package_inputs" >
                      <li id='package'>
                        <span style='font-weight: 900'>Package:</span> {{ package_input.package_input_tag }}
                      </li>
                      <span *ngIf="package_input.placement_inputs && package_input.placement_inputs.length > 0">
                        <span *ngFor="let placement_input of package_input.placement_inputs">
                          <li id='placement'>
                            <span style='font-weight: 900'>Placement:</span> {{ placement_input.placement_input_tag }}
                          </li>
                          <span *ngIf="placement_input.ad_inputs && placement_input.ad_inputs.length > 0">
                            <span *ngFor="let ad_input of placement_input.ad_inputs">
                              <li id='ad'>
                                <span style='font-weight: 900'>Ad:</span> {{ ad_input.ad_input_tag }}
                              </li>
                              <span *ngIf="ad_input.creative_inputs && ad_input.creative_inputs.length > 0">
                                <span *ngFor="let creative_input of ad_input.creative_inputs">
                                  <li id='creative'>
                                    <span style='font-weight: 900'>Creative:</span> {{ creative_input.creative_input_tag }}
                                  </li>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </ul>
              </div>
            </tab>
          </tabset>
         
        </section>
      </div>
    </div>
  
  `
})

export class TreeComponent {
  @Input() current_created_input: any = {};
  @Input() current_exports: any[];
  @Input() created_count: any;
  @Input() all_inputs: any[];
  @Input() all_exports: any[];
  @Input() all_count: any;

  omnitureCode: any;

  constructor() {}

  export(inputs) {
    var data = [];
    var inputObject = {};
    for (let input of inputs ) {
       var omnitureCode = '/?xrs=crm_' + input.ad_input.placement_input.package_input.campaign_input.network.abbrev + '_'
        + input.ad_input.placement_input.package_input.campaign_input.program.abbrev + '_' +
        input.ad_input.placement_input.package_input.campaign_input.season.abbrev + '_' +
        input.ad_input.placement_input.package_input.publisher.abbrev

       inputObject = {
        'CAMPAIGN ID': input.ad_input.placement_input.package_input.campaign_input.campaign_input_tag,
        'PACKAGE ID': input.ad_input.placement_input.package_input.package_input_tag,
        'PLACEMENT ID': input.ad_input.placement_input.placement_input_tag,
        'AD ID': input.ad_input.ad_input_tag,
        'CREATIVE ID': input.creative_input_tag,
        'OMNITURE CODE': omnitureCode
       }
       data.push(inputObject);
        
      }
    new Angular2Csv(data, 'Output', { headers: Object.keys(data[0])} );
  }

}
