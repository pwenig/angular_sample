import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PlacementInputService {

  constructor(private http: HttpClient){}

  // Placement String format
  // If tentpole season:
  // Network_Program_Season_TentpoleDetails_Agency_Tactic_Device_Publisher_BuyMethod_AdType_
  // InventoryType_TargetingType_AudienceType-CustomDimension_Size_CampaignFlightDate
  createPlacementString(campaignObj, packageObj, placementObj){
    // Check for tentpole season
    if( campaignObj['season']['abbrev'] == 'TPL' && placementObj.adType.abbrev != 'SVD' && placementObj.adType.abbrev != 'NSV') {
      let placementString = campaignObj['network']['abbrev'] + '_' +
        campaignObj['program']['abbrev'] + '_' +
        campaignObj['season']['abbrev'] + '_' +
        placementObj.tentpole + '_' +
        packageObj['agency']['abbrev'] + '_' +
        placementObj.tactic.abbrev + '_' +
        placementObj.device.abbrev + '_' +
        packageObj['publisher']['abbrev'] + '_' +
        packageObj['buy_method']['abbrev'] + '_' +
        placementObj.adType.abbrev + '_' +
        placementObj.targetingType1.abbrev + '-' +
        placementObj.targetingType2.abbrev + '-' +
        placementObj.targetingType3.abbrev + '-' +
        placementObj.targetingType4.abbrev + '_' +
        placementObj.audience + '_' +
        placementObj.width + 'x' +
        placementObj.height + '_' +
        campaignObj['start_month'] +
        campaignObj['start_day'] + '-' +
        campaignObj['end_month'] +
        campaignObj['end_day']
      return placementString;
      // If not a tentpole season:
      // Network_Program_Season_Episode_Agency_Tactic_Device_Publisher_BuyMethod_AdType_
      // InventoryType_TargetingType_AudienceType-CustomDimension_Size_CampaignFlightDate
    } else if (campaignObj['season']['abbrev'] != 'TPL' && placementObj.adType.abbrev != 'SVD' && placementObj.adType.abbrev != 'NSV') {
      let placementString = campaignObj['network']['abbrev'] + '_' +
        campaignObj['program']['abbrev'] + '_' +
        campaignObj['season']['abbrev'] + '_' +
        placementObj.episodeStartDate.abbrev + '-' +
        placementObj.episodeEndDate.abbrev + '_' +
        packageObj['agency']['abbrev'] + '_' +
        placementObj.tactic.abbrev + '_' +
        placementObj.device.abbrev + '_' +
        packageObj['publisher']['abbrev'] + '_' +
        packageObj['buy_method']['abbrev'] + '_' +
        placementObj.adType.abbrev + '_' +
        placementObj.targetingType1.abbrev + '-' +
        placementObj.targetingType2.abbrev + '-' +
        placementObj.targetingType3.abbrev + '-' +
        placementObj.targetingType4.abbrev + '_' +
        placementObj.audience + '_' +
        placementObj.width + 'x' +
        placementObj.height + '_' +
        campaignObj['start_month'] +
        campaignObj['start_day'] + '-' +
        campaignObj['end_month'] +
        campaignObj['end_day']
      return placementString;
    }else if(campaignObj['season']['abbrev'] != 'TPL' && placementObj.adType.abbrev == 'SVD' || placementObj.adType.abbrev == 'NSV') {
      let placementString = campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      placementObj.episodeStartDate.abbrev + '-' +
      placementObj.episodeEndDate.abbrev + '_' +
      packageObj['agency']['abbrev'] + '_' +
      placementObj.tactic.abbrev + '_' +
      placementObj.device.abbrev + '_' +
      packageObj['publisher']['abbrev'] + '_' +
      packageObj['buy_method']['abbrev'] + '_' +
      placementObj.adType.abbrev + '_' +
      placementObj.targetingType1.abbrev + '-' +
      placementObj.targetingType2.abbrev + '-' +
      placementObj.targetingType3.abbrev + '-' +
      placementObj.targetingType4.abbrev + '_' +
      placementObj.audience + '_' +
      campaignObj['start_month'] +
      campaignObj['start_day'] + '-' +
      campaignObj['end_month'] +
      campaignObj['end_day']
    return placementString;
    }else if(campaignObj['season']['abbrev'] == 'TPL' && placementObj.adType.abbrev == 'SVD' || placementObj.adType.abbrev == 'NSV') {
      let placementString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      placementObj.tentpole + '_' +
      packageObj['agency']['abbrev'] + '_' +
      placementObj.tactic.abbrev + '_' +
      placementObj.device.abbrev + '_' +
      packageObj['publisher']['abbrev'] + '_' +
      packageObj['buy_method']['abbrev'] + '_' +
      placementObj.adType.abbrev + '_' +
      placementObj.targetingType1.abbrev + '-' +
      placementObj.targetingType2.abbrev + '-' +
      placementObj.targetingType3.abbrev + '-' +
      placementObj.targetingType4.abbrev + '_' +
      placementObj.audience + '_' +
      campaignObj['start_month'] +
      campaignObj['start_day'] + '-' +
      campaignObj['end_month'] +
      campaignObj['end_day']
    return placementString;
    }
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

}