import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {PackageInputService} from './package_input_service';
import {PlacementInputService} from './placement_input_service';
import {AdInputService} from './ad_input_service';
import {CreativeInputService} from './creative_input_service';

@Injectable()
export class CampaignInputService {

  constructor(private http: HttpClient, private _package: PackageInputService, private _placement: PlacementInputService, private _ad: AdInputService, private _creative: CreativeInputService){}

  // Campaign String format
  // Network_Program_Season_CampaignType_CustomDimension_CampaignFlightDate
  createCampaignString(campaignObj){
    let campaignString = campaignObj.network.abbrev + '_' + 
      campaignObj.program.abbrev + '_' +
      campaignObj.season.abbrev + '_' +
      campaignObj.campaignType.abbrev + '_' +
      campaignObj.custom + '_' +
      campaignObj.start_year +
      campaignObj.start_month +
      campaignObj.start_day + '-' +
      campaignObj.end_year +
      campaignObj.end_month +
      campaignObj.end_day
    return campaignString;
  }

  // Creates a new Campaign Input 
  createInput(campaignInput): Observable<any> {

    let subject: Subject<any> = new Subject;
    this.http.post('/campaign_inputs', campaignInput).subscribe(

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

  // Checks to see if a Campaign Input already exists
  verifyInput(campaignInput): Observable<any>{
    let subject: Subject<any> = new Subject;
    this.http.get('/campaign_inputs/' + campaignInput, { observe: 'response' }).subscribe(

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

  // Get all of the input objects for the heiarchy tree.
  getInputs(): Observable<any>{
    let subject: Subject<any> = new Subject;
    this.http.get('/campaign_inputs').subscribe(

      (res) => {
        subject.next(res);
      },
      (error) => {
        console.log('Error', error);
        subject.error(error);
      }
    )
    return subject.asObservable();
  }

  updateInput(currentCampaignInput, newCampaignInput, agency) {
    newCampaignInput.packageParams = [];
    newCampaignInput.placementParams = [];
    newCampaignInput.adParams = [];
    newCampaignInput.creativeParams = [];
    
    if(currentCampaignInput.package_inputs && currentCampaignInput.package_inputs.length > 0) {
      // Update package
      for(let packageInput of currentCampaignInput.package_inputs) {
        let packageNamestring = this._package.createPackageString(newCampaignInput, packageInput, agency);
        let packageParams = {
          id: packageInput.id,
          package_input_tag: packageNamestring
        }
        newCampaignInput.packageParams.push(packageParams);
        // Update placement
        if(packageInput.placement_inputs && packageInput.placement_inputs.length > 0) {
          for(let placementInput of packageInput.placement_inputs) {
            let placementNamestring = this._placement.createPlacementString(newCampaignInput, packageInput, placementInput);
            let placementParams = {
              id: placementInput.id,
              placement_input_tag: placementNamestring
            }
            newCampaignInput.placementParams.push(placementParams);
            // Update ad
            if(placementInput.ad_inputs && placementInput.ad_inputs.length > 0) {
              for(let adInput of placementInput.ad_inputs) {
                let adNamestring = this._ad.createAdString(newCampaignInput, packageInput, placementInput, adInput);
                let adParams = {
                  id: adInput.id,
                  ad_input_tag: adNamestring
                }
                newCampaignInput.adParams.push(adParams);
                // Update creative
                if(adInput.creative_inputs && adInput.creative_inputs.length > 0) {
                  for(let creativeInput of adInput.creative_inputs) {
                    let creativeNamestring = this._creative.createCreativeString(newCampaignInput, placementInput, adInput, creativeInput);
                    let creativeParams = {
                      id: creativeInput.id,
                      creative_input_tag: creativeNamestring
                    }
                    newCampaignInput.creativeParams.push(creativeParams);
                  }
                }
              }
            }
          }
        }
      }
    }
    let subject: Subject<any> = new Subject;
    this.http.put('/campaign_inputs/' + currentCampaignInput.id, newCampaignInput).subscribe(

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