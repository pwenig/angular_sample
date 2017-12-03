import {Component, Injectable, Inject} from '@angular/core';
import { stagger } from '@angular/core/src/animation/dsl';

@Injectable()
export class TreeService {

  createdObject: any = {};
  constructor() {}

  createTree(creativeTag) {
    // Check to see if stored in localStorage
    var storedObject = JSON.parse(localStorage.getItem('inputs'));
    // Check to see if anything is stored. If not, create new
    if(storedObject && storedObject['campaignInputs'] && storedObject['campaignInputs'].length > 0) {
      var campaignIndex = storedObject['campaignInputs'].findIndex(x => x['input'] == creativeTag.ad_input.placement_input.package_input.campaign_input.campaign_input_tag);
      // Check to see if the campaign input already exists in the array.
      if(campaignIndex == -1) {
        // Does not exist. Create new.
        this.newTree(creativeTag);
        } else {
          // It exists. Find the difference.
        var packageIndex = storedObject['campaignInputs'][campaignIndex]['packageInputs'].findIndex(x => x['input'] == creativeTag.ad_input.placement_input.package_input.package_input_tag);
        // Check to see if package input already exists in the array.
        if(packageIndex == -1) {
          // Does not exist. Push it in.
          storedObject['campaignInputs'][campaignIndex]['packageInputs'].unshift(
            { input: creativeTag.ad_input.placement_input.package_input.package_input_tag,
              placementInputs: [
                {
                  input: creativeTag.ad_input.placement_input.placement_input_tag,
                  adInputs: [
                    {
                      input: creativeTag.ad_input.ad_input_tag,
                      creativeInputs: [
                        {
                          input: creativeTag.creative_input_tag
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          );
          localStorage.setItem('inputs', JSON.stringify(storedObject));
        } else {
          var placementIndex = storedObject['campaignInputs'][campaignIndex]['packageInputs'][packageIndex]['placementInputs'].findIndex(x => x['input'] == creativeTag.ad_input.placement_input.placement_input_tag);
          // Check to see if placement input already exists in the array.
          if(placementIndex == -1) {
            storedObject['campaignInputs'][campaignIndex]['packageInputs'][packageIndex]['placementInputs'].unshift(
              {
                input: creativeTag.ad_input.placement_input.placement_input_tag,
                adInputs: [
                  {
                    input: creativeTag.ad_input.ad_input_tag,
                    creativeInputs: [
                      {
                        input: creativeTag.creative_input_tag
                      }
                    ] 
                  }
                ] 
              }
            );
            localStorage.setItem('inputs', JSON.stringify(storedObject));
          } else {
            var adIndex = storedObject['campaignInputs'][campaignIndex]['packageInputs'][packageIndex]['placementInputs'][placementIndex]['adInputs'].findIndex(x => x['input'] == creativeTag.ad_input.ad_input_tag);
            // Check to see if ad input already exists in the array.
            if(adIndex == -1) {
              storedObject['campaignInputs'][campaignIndex]['packageInputs'][packageIndex]['placementInputs'][placementIndex]['adInputs'].unshift(
                {
                  input: creativeTag.ad_input.ad_input_tag,
                  creativeInputs: [
                    {
                      input: creativeTag.creative_input_tag
                    }
                  ]
                }
              );
              localStorage.setItem('inputs', JSON.stringify(storedObject));
            } else {
              var creativeIndex = storedObject['campaignInputs'][campaignIndex]['packageInputs'][packageIndex]['placementInputs'][placementIndex]['adInputs'][adIndex]['creativeInputs'].findIndex(x => x['input'] == creativeTag.creative_input_tag);
              // Check to see if creative input already exists in the array.
              if(creativeIndex == -1) {
                storedObject['campaignInputs'][campaignIndex]['packageInputs'][packageIndex]['placementInputs'][placementIndex]['adInputs'][adIndex]['creativeInputs'].unshift(
                  {
                    input: creativeTag.creative_input_tag
                  }
                );
                localStorage.setItem('inputs', JSON.stringify(storedObject));
              }
            }
          }
        }
      }
    } else {
      this.newTree(creativeTag);
    }
  }

  // Creates a new tree
  newTree(creativeTag) {
    this.createdObject = {
      campaignInputs: [
        {
          input: creativeTag.ad_input.placement_input.package_input.campaign_input.campaign_input_tag,
          packageInputs: [
            {
              input: creativeTag.ad_input.placement_input.package_input.package_input_tag,
              placementInputs: [
                {
                  input: creativeTag.ad_input.placement_input.placement_input_tag,
                  adInputs: [
                    {
                      input: creativeTag.ad_input.ad_input_tag,
                      creativeInputs: [
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