import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {PlacementInputService} from './placement_input_service';
import {AdInputService} from './ad_input_service';
import {CreativeInputService} from './creative_input_service';

@Injectable()
export class PackageInputService {

  constructor(private http: HttpClient, private _placement: PlacementInputService, private _ad: AdInputService, private _creative: CreativeInputService){}

  // Package String format
  // Network_Program_Season_Agency_Publisher_BuyMethod_
  // InventoryType_CustomDimension
  createPackageString(campaignObj, packageObj, agency){
    let packageString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      agency['abbrev'] + '_' +
      packageObj.publisher.abbrev + '_' +
      packageObj.buy_method.abbrev + '_' +
      packageObj.inventory_type.abbrev + '_' +
      packageObj.custom
    return packageString;
  }

   // Creates a new Package Input 
  createInput(packageInput): Observable<any> {
  
    let subject: Subject<any> = new Subject;
    this.http.post('/package_inputs', packageInput).subscribe(

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
  verifyInput(packageInput): Observable<any>{
    let subject: Subject<any> = new Subject;
    this.http.get('/package_inputs/' + packageInput, { observe: 'response' }).subscribe(

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

  updateInput(currentPackageInput, newPackageInput, campaignObj) {
    newPackageInput.placementParams = [];
    newPackageInput.adParams = [];
    if(currentPackageInput.placement_inputs && currentPackageInput.placement_inputs.length > 0) {
      for(let placementInput of currentPackageInput.placement_inputs) {
        let placementNamestring = this._placement.createPlacementString(campaignObj, newPackageInput, placementInput);
        let placementParams = {
          id: placementInput.id,
          placement_input_tag: placementNamestring
        }
        newPackageInput.placementParams.push(placementParams);
        if(placementInput.ad_inputs && placementInput.ad_inputs.length > 0) {
          for(let adInput of placementInput.ad_inputs) {
           let adNamestring = this._ad.createAdString(campaignObj, newPackageInput, placementInput, adInput);
            let adParams = {
              id: adInput.id,
              ad_input_tag: adNamestring
            }
            newPackageInput.adParams.push(adParams);
          }
        }
      }
    }

    let subject: Subject<any> = new Subject;
    this.http.put('/package_inputs/' + currentPackageInput.id, newPackageInput).subscribe(

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