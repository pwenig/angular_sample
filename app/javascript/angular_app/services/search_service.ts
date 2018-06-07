import {Component, Injectable, Inject} from '@angular/core';

@Injectable()
export class SearchService {

  constructor() {}

  month: string;
  day: string;
  year: string;

  match_dates(input, queryString) {
    if(queryString.length > 7) {
      if( (Number(input['start_day']) == Number(this.day) && Number(input['start_month']) == Number(this.month) && Number(input['start_year']) == Number(this.year)) ||
      ( Number(input['end_day']) == Number(this.day) && Number(input['end_month']) == Number(this.month) && Number(input['end_year']) == Number(this.year)) ) {
        return true;
      } 
    }
  }

  searchCampaigns(queryString, campaigns) {

    let filteredNamestrings = [];
    queryString = queryString.toLowerCase();
    for(let campaign of campaigns) {
      // Check to see if a number and the min format (1/1/2020) has been entered
      if(!isNaN(Number(queryString.charAt(0))) && queryString.length > 7) {
        let splitString = queryString.split('/');
        this.month = splitString[0];
        this.day = splitString[1];
        this.year = splitString[2];
      }
      // Check campaign keys
      if(campaign.network.name.toLowerCase().includes(queryString) ||
        campaign.network.abbrev.toLowerCase().includes(queryString) ||
        campaign.program.name.toLowerCase().includes(queryString) ||
        campaign.program.abbrev.toLowerCase().includes(queryString) ||
        this.match_dates(campaign, queryString) || 
        campaign.custom.toLowerCase() == queryString) 
        {
          filteredNamestrings.push(campaign);
        } 

      // Check package_inputs
      if(campaign.package_inputs.length > 0) {
        campaign.filtered_package_inputs = [];
        for(let package_input of campaign.package_inputs) {
          if(package_input.publisher.name.toLowerCase().includes(queryString) || 
          package_input.publisher.abbrev.toLowerCase().includes(queryString) ||
          package_input.buy_method.name.toLowerCase().includes(queryString) ||
          package_input.buy_method.abbrev.toLowerCase().includes(queryString) ||
          package_input.inventory_type.name.toLowerCase().includes(queryString) ||
          package_input.inventory_type.abbrev.toLowerCase().includes(queryString) ||
          package_input.custom.toLowerCase() == queryString)
          {
            campaign.filtered_package_inputs.push(package_input);
            // Check if the campaign is already in the filteredNamestrings. If so, replace it. If not, add it.
            let campaignIndex = filteredNamestrings.indexOf(campaign);
            if(campaignIndex > -1 ) {
              filteredNamestrings[campaignIndex] = campaign;
            } else {
              filteredNamestrings.push(campaign);
            }
          }

          // Check placement_inputs
          if(package_input.placement_inputs.length > 0) {
            package_input.filtered_placement_inputs = [];
            for(let placement_input of package_input.placement_inputs) {
              if(placement_input.tactic.name.toLowerCase().includes(queryString) ||
              placement_input.tactic.abbrev.toLowerCase().includes(queryString) ||
              placement_input.device.name.toLowerCase().includes(queryString) ||
              placement_input.device.abbrev.toLowerCase().includes(queryString) ||
              placement_input.ad_type.name.toLowerCase().includes(queryString) ||
              placement_input.ad_type.abbrev.toLowerCase().includes(queryString))
              {
                package_input.filtered_placement_inputs.push(placement_input);
                let packageIndex = campaign.filtered_package_inputs.indexOf(package_input);
                if(packageIndex > -1) {
                  campaign.filtered_package_inputs[packageIndex] = package_input;
                } else {
                  campaign.filtered_package_inputs.push(package_input);
                }
                let campaignIndex = filteredNamestrings.indexOf(campaign);
                if(campaignIndex > -1 ) {
                  filteredNamestrings[campaignIndex] = campaign;
                } else {
                  filteredNamestrings.push(campaign);
                }
              }
              
              // Check ad_inputs
              if(placement_input.ad_inputs.length > 0) {
                placement_input.filtered_ad_inputs = [];
                for(let ad_input of placement_input.ad_inputs) {
                  if(ad_input.creative_group.name.toLowerCase().includes(queryString) || 
                  ad_input.creative_group.abbrev.toLowerCase().includes(queryString) || ad_input.custom.toLowerCase() == queryString) 
                  {
                    placement_input.filtered_ad_inputs.push(ad_input);
                    if(campaign.filtered_package_inputs && campaign.filtered_package_inputs.length > 0) {
                      for(let filtered_package of campaign.filtered_package_inputs) {
                        let placementIndex = filtered_package.filtered_placement_inputs.indexOf(placement_input);
                        if(placementIndex > -1) {
                          filtered_package.filtered_placement_inputs[placementIndex] = placement_input;
                        } else {
                          filtered_package.filtered_placement_inputs.push(placement_input);
                        }
                      }
                    } else {
                      package_input.filtered_placement_inputs.push(placement_input)
                      campaign.filtered_package_inputs.push(package_input);
                    }
                    let packageIndex = campaign.filtered_package_inputs.indexOf(package_input);
                    if(packageIndex > -1) {
                      campaign.filtered_package_inputs[packageIndex] = package_input;
                    } else {
                      campaign.filtered_package_inputs.push(package_input);
                    }
                    let campaignIndex = filteredNamestrings.indexOf(campaign);
                    if(campaignIndex > -1 ) {
                      filteredNamestrings[campaignIndex] = campaign;
                    } else {
                      filteredNamestrings.push(campaign);
                    }
                  }

                  // Check creatives
                  if(ad_input.creative_inputs.length > 0) {
                    ad_input.filtered_creative_inputs = [];
                    for(let creative_input of ad_input.creative_inputs) {
                      if(creative_input.creative_message.name.toLowerCase().includes(queryString) ||
                        creative_input.creative_message.abbrev.toLowerCase().includes(queryString) ||
                        this.match_dates(creative_input, queryString) || 
                        creative_input.custom.toLowerCase == queryString) 
                        {
                          ad_input.filtered_creative_inputs.push(creative_input);
                          // Check for filtered_ad_inputs
                          if(placement_input.filtered_ad_inputs && placement_input.filtered_ad_inputs.length > 0)
                          { 
                            let adIndex = placement_input.filtered_ad_inputs.indexOf(ad_input);
                            if(adIndex > -1) {
                              placement_input.filtered_ad_inputs[adIndex] = ad_input;
                            } else {
                              placement_input.filtered_ad_inputs.push(ad_input);
                            }
                          } else {
                            placement_input.filtered_ad_inputs.push(ad_input);
                          }
                          // Check for filtered placement_inputs
                          if(package_input.filtered_placement_inputs && package_input.filtered_placement_inputs.length >0) {
                            let placementIndex = package_input.filtered_placement_inputs.indexOf(placement_input);
                              if(placementIndex > -1) {
                                package_input.filtered_placement_inputs[placementIndex] = placement_input;
                              } else {
                                package_input.filtered_placement_inputs.push(placement_input);
                              }

                          } else {
                            package_input.filtered_placement_inputs.push(placement_input);
                          }
                          // Check for filtered package_inputs
                          if(campaign.filtered_package_inputs && campaign.filtered_package_inputs.length > 0) {
                            let packageIndex = campaign.filtered_package_inputs.indexOf(package_input);
                            if(packageIndex > -1) {
                              campaign.filtered_package_inputs[packageIndex] = package_input;
                            } else {
                              campaign.filtered_package_inputs.push(package_input);
                            }
                          } else {
                            campaign.filtered_package_inputs.push(package_input);;
                          }
                          let campaignIndex = filteredNamestrings.indexOf(campaign);
                          if(campaignIndex > -1 ) {
                            filteredNamestrings[campaignIndex] = campaign;
                          } else {
                            filteredNamestrings.push(campaign);
                          }
                        }
                    }
                  }
                }
              }
            }
          }
        }
      } 
    }
    return filteredNamestrings
    
  }

}