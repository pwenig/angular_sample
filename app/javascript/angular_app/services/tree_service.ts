import {Component, Injectable, Inject} from '@angular/core';

@Injectable()
export class TreeService {

  createdObject: any = {};
  constructor() {}

  createCampaignTree(campaignTag) {
    // Check to see if stored in localStorage
    var storedObject = JSON.parse(localStorage.getItem('inputs'));
    if(storedObject && storedObject['campaignInputs'] && storedObject['campaignInputs'].length > 0) {
      var campaignIndex = storedObject['campaignInputs'].findIndex(x => x['input'] == campaignTag.campaign_input_tag);
      if(campaignIndex == -1) {
        this.newCampaignTree(campaignTag);
      }
    } else {
      this.newCampaignTree(campaignTag);
    } 
  }

  newCampaignTree(campaignTag) {
    this.createdObject = {
      campaignInputs: [
        {
          input: campaignTag.campaign_input_tag,
          package_inputs: []
        }
      ]
    }
    var storedObject = JSON.parse(localStorage.getItem('inputs'));
    if(storedObject) {
      storedObject['campaignInputs'].unshift(this.createdObject['campaignInputs'][0]);
      localStorage.setItem('inputs', JSON.stringify(storedObject));
      
    } else {
      localStorage.setItem('inputs', JSON.stringify(this.createdObject));
    }
  }

  createPackageTree(packageTag) {
    var storedObject = JSON.parse(localStorage.getItem('inputs'));
    var campaignIndex = storedObject['campaignInputs'].findIndex(x => x['input'] == packageTag.campaign_input.campaign_input_tag);
    var packageIndex = storedObject['campaignInputs'][campaignIndex]['package_inputs'].findIndex(x => x['input'] == packageTag.package_input_tag);
    if(packageIndex == -1) {
      var packageObject = {
        input: packageTag.package_input_tag,
        placement_inputs: []
      }
      storedObject['campaignInputs'][campaignIndex]['package_inputs'].unshift(packageObject);
      var updatedObject = storedObject['campaignInputs'][campaignIndex];
      storedObject['campaignInputs'].splice([campaignIndex], 1);
      storedObject['campaignInputs'].unshift(updatedObject);
      localStorage.setItem('inputs', JSON.stringify(storedObject));
    }

  }

  createPlacementTree(placementTag) {
    var storedObject = JSON.parse(localStorage.getItem('inputs'));
    var campaignIndex = storedObject['campaignInputs'].findIndex(x => x['input'] == placementTag.package_input.campaign_input.campaign_input_tag);
    var packageIndex = storedObject['campaignInputs'][campaignIndex]['package_inputs'].findIndex(x => x['input'] == placementTag.package_input.package_input_tag);
    var placementIndex = storedObject['campaignInputs'][campaignIndex]['package_inputs'][packageIndex]['placement_inputs'].findIndex(x => x['input'] == placementTag.placement_input_tag);
    if(placementIndex == -1) {
      var placementObject = {
        input: placementTag.placement_input_tag,
        ad_inputs: []
      }
      storedObject['campaignInputs'][campaignIndex]['package_inputs'][packageIndex]['placement_inputs'].unshift(placementObject);
      var updatedObject = storedObject['campaignInputs'][campaignIndex];
      storedObject['campaignInputs'].splice([campaignIndex], 1);
      storedObject['campaignInputs'].unshift(updatedObject);
      localStorage.setItem('inputs', JSON.stringify(storedObject));
    }
  }

  createAdTree(adTag) {
    var storedObject = JSON.parse(localStorage.getItem('inputs'));
    var campaignIndex = storedObject['campaignInputs'].findIndex(x => x['input'] == adTag.placement_input.package_input.campaign_input.campaign_input_tag);
    var packageIndex = storedObject['campaignInputs'][campaignIndex]['package_inputs'].findIndex(x => x['input'] == adTag.placement_input.package_input.package_input_tag);
    var placementIndex = storedObject['campaignInputs'][campaignIndex]['package_inputs'][packageIndex]['placement_inputs'].findIndex(x => x['input'] == adTag.placement_input.placement_input_tag);
    var adIndex = storedObject['campaignInputs'][campaignIndex]['package_inputs'][packageIndex]['placement_inputs'][placementIndex]['ad_inputs'].findIndex(x => x['input'] == adTag.ad_input_tag);
    if(adIndex == -1) {
      var adObject = {
        input: adTag.ad_input_tag,
        creative_inputs: []
      }
      storedObject['campaignInputs'][campaignIndex]['package_inputs'][packageIndex]['placement_inputs'][placementIndex]['ad_inputs'].unshift(adObject);
      var updatedObject = storedObject['campaignInputs'][campaignIndex];
      storedObject['campaignInputs'].splice([campaignIndex], 1);
      storedObject['campaignInputs'].unshift(updatedObject);
      localStorage.setItem('inputs', JSON.stringify(storedObject));
    }
  }

  createCreativeTree(creativeTag) {
    var storedObject = JSON.parse(localStorage.getItem('inputs'));
    var campaignIndex = storedObject['campaignInputs'].findIndex(x => x['input'] == creativeTag.ad_input.placement_input.package_input.campaign_input.campaign_input_tag);
    var packageIndex = storedObject['campaignInputs'][campaignIndex]['package_inputs'].findIndex(x => x['input'] == creativeTag.ad_input.placement_input.package_input.package_input_tag);
    var placementIndex = storedObject['campaignInputs'][campaignIndex]['package_inputs'][packageIndex]['placement_inputs'].findIndex(x => x['input'] == creativeTag.ad_input.placement_input.placement_input_tag);
    var adIndex = storedObject['campaignInputs'][campaignIndex]['package_inputs'][packageIndex]['placement_inputs'][placementIndex]['ad_inputs'].findIndex(x => x['input'] == creativeTag.ad_input.ad_input_tag);
    var creativeIndex = storedObject['campaignInputs'][campaignIndex]['package_inputs'][packageIndex]['placement_inputs'][placementIndex]['ad_inputs'][adIndex]['creative_inputs'].findIndex(x => x['input'] == creativeTag.creative_input_tag);
    // Need the entire creativeTag object to create the omniture code
    if(creativeIndex == -1) {
      var creativeObject = {
        input: creativeTag.creative_input_tag,
        object: creativeTag
      }
      storedObject['campaignInputs'][campaignIndex]['package_inputs'][packageIndex]['placement_inputs'][placementIndex]['ad_inputs'][adIndex]['creative_inputs'].unshift(creativeObject);
      var updatedObject = storedObject['campaignInputs'][campaignIndex];
      storedObject['campaignInputs'].splice([campaignIndex], 1);
      storedObject['campaignInputs'].unshift(updatedObject);
      localStorage.setItem('inputs', JSON.stringify(storedObject));
    }
  }

  // Creates a new tree
  newTree(creativeTag) {
    this.createdObject = {
      campaignInputs: [
        {
          input: creativeTag.ad_input.placement_input.package_input.campaign_input.campaign_input_tag,
          package_inputs: [
            {
              input: creativeTag.ad_input.placement_input.package_input.package_input_tag,
              placement_inputs: [
                {
                  input: creativeTag.ad_input.placement_input.placement_input_tag,
                  ad_inputs: [
                    {
                      input: creativeTag.ad_input.ad_input_tag,
                      creative_inputs: [
                        {
                          input: creativeTag.creative_input_tag
                        }
                      ]
                    }
                  ] 
                }
              ] 
            }
          ]
        }
      ]
    };
    var storedObject = JSON.parse(localStorage.getItem('inputs'));
    if(storedObject) {
      storedObject['campaignInputs'].unshift(this.createdObject['campaignInputs'][0]);
      localStorage.setItem('inputs', JSON.stringify(storedObject));
      
    } else {
      localStorage.setItem('inputs', JSON.stringify(this.createdObject));
    }
  }

}