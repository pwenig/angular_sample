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
              <div *ngIf="current_created_inputs && current_created_inputs.length > 0">
                <button class="export" (click)="export(current_created_inputs)">Export ({{created_count }})</button>
                <ul *ngFor="let input of current_created_inputs">
                  <li id='campaign'>
                    <span style='font-weight: 900'>Campaign:</span> {{ input['ad_input']['placement_input']['package_input']['campaign_input']['campaign_input_tag'] }}
                  </li>
                  <li id='package'>
                  <span style='font-weight: 900'>Package:</span> {{ input['ad_input']['placement_input']['package_input']['package_input_tag'] }}
                  </li>
                  <li id='placement'>
                  <span style='font-weight: 900'>Placement:</span> {{ input['ad_input']['placement_input']['placement_input_tag'] }}
                  </li>
                  <li id='ad'>
                  <span style='font-weight: 900'>Ad:</span> {{ input['ad_input']['ad_input_tag'] }}
                  </li>
                  <li id='creative'>
                  <span style='font-weight: 900'>Creative:</span> {{ input['creative_input_tag'] }}
                  </li>
                </ul>
              </div>
            </tab>
            <tab heading="All Inputs">
              <div *ngIf="all_inputs.length == 0">
                <p>Loading...</p>
              </div>
              <div *ngIf="all_inputs && all_inputs.length > 0">
                <button class="export" (click)="export(all_inputs)">Export All ({{all_count }})</button>
                <ul *ngFor="let input of all_inputs">
                  <li id='campaign'>
                    <span style='font-weight: 900'>Campaign:</span> {{ input['ad_input']['placement_input']['package_input']['campaign_input']['campaign_input_tag'] }}
                  </li>
                  <li id='package'>
                  <span style='font-weight: 900'>Package:</span> {{ input['ad_input']['placement_input']['package_input']['package_input_tag'] }}
                  </li>
                  <li id='placement'>
                  <span style='font-weight: 900'>Placement:</span> {{ input['ad_input']['placement_input']['placement_input_tag'] }}
                  </li>
                  <li id='ad'>
                  <span style='font-weight: 900'>Ad:</span> {{ input['ad_input']['ad_input_tag'] }}
                  </li>
                  <li id='creative'>
                  <span style='font-weight: 900'>Creative:</span> {{ input['creative_input_tag'] }}
                  </li>
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
  @Input() current_created_inputs: any[];
  @Input() created_count: any;
  @Input() all_inputs: any[];
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
