import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { AdTypeService } from '../services/ad_type_service';
import {AdInputService} from '../services/ad_input_service';
import {CreativeInputService} from '../services/creative_input_service';
import { CampaignTypeService } from '../services/campaign_type_service';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable()
export class PlacementInputService {

  constructor(private http: HttpClient, private _adtype: AdTypeService, private _campaign: CampaignTypeService, private _ad: AdInputService, private _creative: CreativeInputService ){}

  // Placement String format
  // If tentpole season:
  // Network_Program_Season_TentpoleDetails_Agency_Tactic_Device_Publisher_BuyMethod_AdType_
  // InventoryType_TargetingType_AudienceType-CustomDimension_Size_CampaignFlightDate
  createPlacementString(campaignObj, packageObj, placementObj){
    let size = '';
    // Video ad type does not include width and height if null. Otherwise, X
    if(placementObj.height && placementObj.width) {
      size = placementObj.width + 'x' + placementObj.height
    } else {
      size = 'X';
    }
    // Non-video ad type includes width and height 
    let non_video_ad_type =
      packageObj['agency']['abbrev'] + '_' +
      placementObj.tactic.abbrev + '_' +
      placementObj.device.abbrev + '_' +
      packageObj['publisher']['abbrev'] + '_' +
      packageObj['buy_method']['abbrev'] + '_' +
      placementObj.ad_type.abbrev + '_' +
      packageObj.inventory_type.abbrev + '_' +
      placementObj.targeting_type_1.abbrev + '-' +
      placementObj.targeting_type_2.abbrev + '-' +
      placementObj.targeting_type_3.abbrev + '-' +
      placementObj.targeting_type_4.abbrev + '_' +
      placementObj.audience_type + '_' +
      size + '_' +
      campaignObj['start_year'] +
      campaignObj['start_month'] +
      campaignObj['start_day'] + '-' +
      campaignObj['end_year'] +
      campaignObj['end_month'] +
      campaignObj['end_day']
    
    let video_ad_type = 
      packageObj['agency']['abbrev'] + '_' +
      placementObj.tactic.abbrev + '_' +
      placementObj.device.abbrev + '_' +
      packageObj['publisher']['abbrev'] + '_' +
      packageObj['buy_method']['abbrev'] + '_' +
      placementObj.ad_type.abbrev + '_' +
      packageObj.inventory_type.abbrev + '_' +
      placementObj.targeting_type_1.abbrev + '-' +
      placementObj.targeting_type_2.abbrev + '-' +
      placementObj.targeting_type_3.abbrev + '-' +
      placementObj.targeting_type_4.abbrev + '_' +
      placementObj.audience_type + '_' +
      size + '_' +
      campaignObj['start_year'] +
      campaignObj['start_month'] +
      campaignObj['start_day'] + '-' +
      campaignObj['end_year'] +
      campaignObj['end_month'] +
      campaignObj['end_day']

    // Tentpole and not video
    if( this._campaign.tentpole(campaignObj) && !this._adtype.videoAdType(placementObj)) {
      let placementString = campaignObj['network']['abbrev'] + '_' +
        campaignObj['program']['abbrev'] + '_' +
        campaignObj['season']['abbrev'] + '_' +
        placementObj.tentpole_details + '_' +
        non_video_ad_type
      return placementString;

      // Not Tentpole and not video and not season n/a
    } else if (!this._campaign.tentpole(campaignObj) && !this._adtype.videoAdType(placementObj)) {
      let placementString = campaignObj['network']['abbrev'] + '_' +
        campaignObj['program']['abbrev'] + '_' +
        campaignObj['season']['abbrev'] + '_' +
        placementObj.episode_start.abbrev + '-' +
        placementObj.episode_end.abbrev + '_' +
        non_video_ad_type
      return placementString;

    // Not tentpole and video and not season n/a
    }else if(!this._campaign.tentpole(campaignObj) && this._adtype.videoAdType(placementObj)) {
      let placementString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      placementObj.episode_start.abbrev + '-' +
      placementObj.episode_end.abbrev + '_' +
      video_ad_type
    return placementString;

    // Tentpole and video
    }else if(this._campaign.tentpole(campaignObj) && this._adtype.videoAdType(placementObj)) {
      let placementString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      placementObj.tentpole_details + '_' +
      video_ad_type
    return placementString;
    } else {}
  }

  // Creates a new Package Input 
  createInput(placementInput): Observable<any> {
      let subject: Subject<any> = new Subject;
      this.http.post('/placement_inputs', placementInput).subscribe(
  
        (success) => {
          subject.next(success);
        },
  
        (error) => {
          console.log('Error', error);
          subject.error(error);
        }
      )
      return subject.asObservable();
    }
  

  // Checks to see if a Placement Input already exists
  verifyInput(placementInputString): Observable<any>{
    let subject: Subject<any> = new Subject;
    this.http.get('/placement_inputs/' + placementInputString, { observe: 'response' }).subscribe(

      (res) => { 
        subject.next(res.body);
      },

      (error) => {
        console.log('Error', error);
        subject.error(error);
      }

    )
    return subject.asObservable();
  }

  updateInput(currentPlacementInput, newPlacementInput, campaignObj, packageObj): Observable<any> {

    newPlacementInput.adParams = [];
    newPlacementInput.creativeParams = [];
    if(currentPlacementInput.ad_inputs && currentPlacementInput.ad_inputs.length > 0) {
      for(let adInput of currentPlacementInput.ad_inputs) {
        let adNamestring = this._ad.createAdString(campaignObj, packageObj, newPlacementInput, adInput);
        let adParams = {
          id: adInput.id,
          ad_input_tag: adNamestring
        }
        newPlacementInput.adParams.push(adParams);
        if(adInput.creative_inputs && adInput.creative_inputs.length > 0) {
          for(let creativeInput of adInput.creative_inputs) {
            let creativeNamestring = this._creative.createCreativeString(campaignObj, newPlacementInput, adInput, creativeInput );
            let creativeParams = {
              id: creativeInput.id,
              creative_input_tag: creativeNamestring
            }
            newPlacementInput.creativeParams.push(creativeParams);
          }
        }
      }
    }

    let subject: Subject<any> = new Subject;
    this.http.put('/placement_inputs/' + currentPlacementInput.id, newPlacementInput).subscribe(

      (success) => {
        subject.next(success);
      },
      (error) => {
        console.log('Error', error);
        subject.error(error);
      }
    )
    return subject.asObservable();
  }

}