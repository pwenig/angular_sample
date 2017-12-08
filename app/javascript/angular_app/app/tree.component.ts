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
                <button class="export" (click)="export(current_exports)">Export</button>
                <ul *ngFor="let campaign of current_created_input['campaignInputs']">
                  <li id='campaign'>
                    <span style='font-weight: 900'>Campaign:</span> {{ campaign.input }}
                  </li>
                  <span *ngIf="campaign.package_inputs && campaign.package_inputs.length > 0">
                    <span *ngFor="let package_input of campaign.package_inputs" >
                      <li id='package'>
                        <span style='font-weight: 900'>Package:</span> {{ package_input.input }}
                      </li>
                      <span *ngIf="package_input.placement_inputs && package_input.placement_inputs.length > 0">
                        <span *ngFor="let placement_input of package_input.placement_inputs">
                          <li id='placement'>
                            <span style='font-weight: 900'>Placement:</span> {{ placement_input.input }}
                          </li>
                          <span *ngIf="placement_input.ad_inputs && placement_input.ad_inputs.length > 0">
                            <span *ngFor="let ad_input of placement_input.ad_inputs">
                              <li id='ad'>
                                <span style='font-weight: 900'>Ad:</span> {{ ad_input.input }}
                              </li>
                              <span *ngIf="ad_input.creative_inputs && ad_input.creative_inputs.length > 0">
                                <span *ngFor="let creative_input of ad_input.creative_inputs">
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
                <button class="export" (click)="export(all_inputs)">Export All</button>
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
  @Input() all_inputs: any[];
  @Input() all_exports: any[];

  constructor() {}

  // Creates the omniture code from an input from current_exports
  createOmniCode(creativeInput) {
     var omnitureCode = '/?xrs=crm_' + creativeInput.ad_input.placement_input.package_input.campaign_input.network.abbrev + '_'
        + creativeInput.ad_input.placement_input.package_input.campaign_input.program.abbrev + '_' +
        creativeInput.ad_input.placement_input.package_input.campaign_input.season.abbrev + '_' +
        creativeInput.ad_input.placement_input.package_input.publisher.abbrev
    return omnitureCode;
  }

  // Creates the omniture code from an input from the all_exports
  createAlternateOminCode(input, packageInput) {
    var omnitureCode = '/?xrs=crm_' + input.network.abbrev + '_'
      + input.program.abbrev + '_' +
      input.season.abbrev + '_' +
      packageInput.publisher.abbrev
    return omnitureCode;
  }

  export(inputs) {
    var data = [];
    var inputObject = {};
    var export_all = false;
    // Inputs from current_inputs is formatted differently
    if(inputs['campaignInputs']){
      var namestringInputs = inputs['campaignInputs'];
    } else {
      var namestringInputs = inputs;
      export_all = true;
    }
    for (let input of namestringInputs ) {
      if(input.package_inputs.length > 0) {
        for(let packageInput of input.package_inputs) {
          if(packageInput.placement_inputs.length > 0) {
            for(let placementInput of packageInput.placement_inputs) {
              if(placementInput.ad_inputs.length > 0) {
                for(let adInput of placementInput.ad_inputs) {
                  if(adInput.creative_inputs.length > 0) {
                    for(let creativeInput of adInput.creative_inputs) {
                      if(creativeInput.object){
                        var omniCode = this.createOmniCode(creativeInput.object);
                      } else {
                        var omniCode = this.createAlternateOminCode(input, packageInput);
                      }
                      if(export_all) {
                        inputObject = {
                          'CAMPAIGN ID': input.campaign_input_tag,
                          'PACKAGE ID': packageInput.package_input_tag,
                          'PLACEMENT ID': placementInput.placement_input_tag,
                          'AD ID': adInput.ad_input_tag,
                          'CREATIVE ID': creativeInput.creative_input_tag,
                          'OMNITURE CODE': omniCode
                        }
                        data.push(inputObject);
                      } else {
                        inputObject = {
                          'CAMPAIGN ID': input.input,
                          'PACKAGE ID': packageInput.input,
                          'PLACEMENT ID': placementInput.input,
                          'AD ID': adInput.input,
                          'CREATIVE ID': creativeInput.input,
                          'OMNITURE CODE': omniCode
                        }
                        data.push(inputObject);
                      }
                      
                    }
                  } else {
                    if(export_all){
                      inputObject = {
                        'CAMPAIGN ID': input.campaign_input_tag,
                        'PACKAGE ID': packageInput.package_input_tag,
                        'PLACEMENT ID': placementInput.placement_input_tag,
                        'AD ID': adInput.ad_input_tag,
                        'CREATIVE ID': null,
                        'OMNITURE CODE': null
                      }
                      data.push(inputObject);
                    } else {
                      inputObject = {
                        'CAMPAIGN ID': input.input,
                        'PACKAGE ID': packageInput.input,
                        'PLACEMENT ID': placementInput.input,
                        'AD ID': adInput.input,
                        'CREATIVE ID': null,
                        'OMNITURE CODE': null
                      }
                      data.push(inputObject);
                    }
                    
                  }
                }
              } else {
                if(export_all){
                  inputObject = {
                    'CAMPAIGN ID': input.campaign_input_tag,
                    'PACKAGE ID': packageInput.package_input_tag,
                    'PLACEMENT ID': placementInput.placement_input_tag,
                    'AD ID': null,
                    'CREATIVE ID': null,
                    'OMNITURE CODE': null
                  }
                  data.push(inputObject);
                } else {
                  inputObject = {
                    'CAMPAIGN ID': input.input,
                    'PACKAGE ID': packageInput.input,
                    'PLACEMENT ID': placementInput.input,
                    'AD ID': null,
                    'CREATIVE ID': null,
                    'OMNITURE CODE': null
                  }
                  data.push(inputObject);
                }
                

              }
            }

          } else {
            if(export_all) {
              inputObject = {
                'CAMPAIGN ID': input.campaign_input_tag,
                'PACKAGE ID': packageInput.package_input_tag,
                'PLACEMENT ID': null,
                'AD ID': null,
                'CREATIVE ID': null,
                'OMNITURE CODE': null
              }
              data.push(inputObject);
            } else {
              inputObject = {
                'CAMPAIGN ID': input.input,
                'PACKAGE ID': packageInput.input,
                'PLACEMENT ID': null,
                'AD ID': null,
                'CREATIVE ID': null,
                'OMNITURE CODE': null
              }
              data.push(inputObject);
            }
            

          }
        }
      } else {
        if(export_all) {
          inputObject = {
            'CAMPAIGN ID': input.campaign_input_tag,
            'PACKAGE ID': null,
            'PLACEMENT ID': null,
            'AD ID': null,
            'CREATIVE ID': null,
            'OMNITURE CODE': null
          }
          data.push(inputObject);
        } else {
          inputObject = {
            'CAMPAIGN ID': input.input,
            'PACKAGE ID': null,
            'PLACEMENT ID': null,
            'AD ID': null,
            'CREATIVE ID': null,
            'OMNITURE CODE': null
          }
          data.push(inputObject);
        }
      }
        
      }
    new Angular2Csv(data, 'Output', { headers: Object.keys(data[0])} );
  }

}
