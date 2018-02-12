import {Component, Injectable, Inject} from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Injectable()
export class ExportService {

  constructor() {}

   export(input) {
    if(input.namestring.creative_input_tag) {
      this.creativeExport(input);
    }
    if(input.namestring.ad_input_tag) {
      this.adExport(input);
    }
    if(input.namestring.placement_input_tag) {
      this.placementExport(input);
    }
    if(input.namestring.package_input_tag) {
      this.packageExport(input);
    }
    if(input.namestring.campaign_input_tag) {
      this.campaignExport(input);
    }
  };

  formatExport(campaignInput, packageInput, placementInput, adInput, creativeInput, input) {
    let inputObject = {
      'CAMPAIGN ID': campaignInput,
      'PACKAGE ID': packageInput,
      'PLACEMENT ID': placementInput,
      'AD ID': adInput,
      'CREATIVE ID': creativeInput,
      'OMNITURE CODE': this.createOmniCode(input)
    }
    return inputObject;
  };

  // Creates the omniture code from an input
  createOmniCode(input) {
    if(input != null && input.campaignParent.program && input.campaignParent.season && input.packageParent.publisher) {
      var omnitureCode = '/?xrs=crm_' + input.campaignParent.network.abbrev + '_'
      + input.campaignParent.program.abbrev + '_' +
      input.campaignParent.season.abbrev + '_' +
      input.packageParent.publisher.abbrev
      return omnitureCode;
    } else
    return null;
  };

  creativeExport(input) {
    let data = [];
    let inputObject = {};
    inputObject = this.formatExport(input.campaignParent.campaign_input_tag, input.packageParent.package_input_tag, input.placementParent.placement_input_tag, input.adParent.ad_input_tag, input.namestring.creative_input_tag, input);
    data.push(inputObject);
    new Angular2Csv(data, 'Output', { headers: Object.keys(data[0])} );
  };

  adExport(input) {
    let data = [];
    let inputObject = {};
     // Check for children
    if(input.namestring.creative_inputs && input.namestring.creative_inputs.length > 0) {
      for(let creative of input.namestring.creative_inputs) {
        inputObject = this.formatExport(input.campaignParent.campaign_input_tag, input.packageParent.package_input_tag, input.placementParent.placement_input_tag, input.namestring.ad_input_tag, creative.creative_input_tag, input);
        data.push(inputObject);
      }
      new Angular2Csv(data, 'Output', { headers: Object.keys(data[0])} );
    } else {
      inputObject = this.formatExport(input.campaignParent.campaign_input_tag, input.packageParent.package_input_tag, input.placementParent.placement_input_tag, input.namestring.ad_input_tag, null, input);
      data.push(inputObject);
      new Angular2Csv(data, 'Output', { headers: Object.keys(data[0])} );
    }
  };

  placementExport(input) {
    let data = [];
    let inputObject = {};
    if(input.namestring.ad_inputs && input.namestring.ad_inputs.length > 0) {
      for(let ad of input.namestring.ad_inputs) {
        // Check for children
        if(ad.creative_inputs && ad.creative_inputs.length > 0) {
          for(let creative of ad.creative_inputs) {
            inputObject = this.formatExport(input.campaignParent.campaign_input_tag, input.packageParent.package_input_tag, input.namestring.placement_input_tag, ad.ad_input_tag, creative.creative_input_tag, input);
            data.push(inputObject);  
          }
        } else {
          inputObject = this.formatExport(input.campaignParent.campaign_input_tag, input.packageParent.package_input_tag, input.namestring.placement_input_tag, ad.ad_input_tag, null, input);
          data.push(inputObject);  
        }
      }
      new Angular2Csv(data, 'Output', { headers: Object.keys(data[0])} );
      
    } else {
      inputObject = this.formatExport(input.campaignParent.campaign_input_tag, input.packageParent.package_input_tag, input.namestring.placement_input_tag, null, null, input);
      data.push(inputObject);
      new Angular2Csv(data, 'Output', { headers: Object.keys(data[0])} );
    }
  };

  packageExport(input) {
    let data = [];
    let inputObject = {};
    if(input.namestring.placement_inputs && input.namestring.placement_inputs.length > 0) {
      for(let placement of input.namestring.placement_inputs) {
        if(placement.ad_inputs && placement.ad_inputs.length > 0) {
          for(let ad of placement.ad_inputs) {
            if(ad.creative_inputs && ad.creative_inputs.length > 0) {
              for(let creative of ad.creative_inputs) {
                inputObject = this.formatExport(input.campaignParent.campaign_input_tag, input.namestring.package_input_tag, placement.placement_input_tag, ad.ad_input_tag, creative.creative_input_tag, input);
                data.push(inputObject);
              }
            } else {
              inputObject = this.formatExport(input.campaignParent.campaign_input_tag, input.namestring.package_input_tag, placement.placement_input_tag, ad.ad_input_tag, null, input);
              data.push(inputObject);
            }
          }
        } else {
          inputObject = this.formatExport(input.campaignParent.campaign_input_tag, input.namestring.package_input_tag, placement.placement_input_tag, null, null, input);
          data.push(inputObject);
        }
      }
      new Angular2Csv(data, 'Output', { headers: Object.keys(data[0])} );
      
    } else {
      inputObject = this.formatExport(input.campaignParent.campaign_input_tag, input.namestring.package_input_tag, null, null, null, input);
      data.push(inputObject);
      new Angular2Csv(data, 'Output', { headers: Object.keys(data[0])} );
    }
  };

  campaignExport(input) {
    let data = [];
    let inputObject = {};
    if(input.namestring.package_inputs && input.namestring.package_inputs.length > 0) {
      for(let packageInput of input.namestring.package_inputs) {
        if(packageInput.placement_inputs && packageInput.placement_inputs.length >0) {
          for(let placement of packageInput.placement_inputs) {
            if(placement.ad_inputs && placement.ad_inputs.length > 0) {
              for(let ad of placement.ad_inputs) {
                if(ad.creative_inputs && ad.creative_inputs.length > 0) {
                  for(let creative of ad.creative_inputs) {
                    inputObject = this.formatExport(input.namestring.campaign_input_tag, packageInput.package_input_tag, placement.placement_input_tag, ad.ad_input_tag, creative.creative_input_tag, input);
                    data.push(inputObject);
                  }
                } else {
                  inputObject = this.formatExport(input.namestring.campaign_input_tag, packageInput.package_input_tag, placement.placement_input_tag, ad.ad_input_tag, null, input);
                  data.push(inputObject);
                }
              }
            } else {
              inputObject = this.formatExport(input.namestring.campaign_input_tag, packageInput.package_input_tag, placement.placement_input_tag, null, null, input);
              data.push(inputObject);
            }
          }
        } else {
          input.packageParent = packageInput;
          inputObject = this.formatExport(input.namestring.campaign_input_tag, packageInput.package_input_tag, null, null, null, input);
          data.push(inputObject);
        }
      }
      new Angular2Csv(data, 'Output', { headers: Object.keys(data[0])} );
      
    } else {
      inputObject = this.formatExport(input.campaignParent.campaign_input_tag, null, null, null, null, null);
      data.push(inputObject);
      new Angular2Csv(data, 'Output', { headers: Object.keys(data[0])} );
    }
  };

}