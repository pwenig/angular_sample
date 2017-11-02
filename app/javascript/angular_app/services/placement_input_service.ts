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
    if( campaignObj['season']['abbrev'] == 'TPL') {
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
    } else {
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
  

  // Checks to see if a Package Input already exists
  verifyInput(placementInputString): Observable<any>{
    let subject: Subject<any> = new Subject;
    this.http.get('/package_inputs/' + placementInputString, { observe: 'response' }).subscribe(

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