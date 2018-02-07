import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { CreativeInputService } from '../services/creative_input_service';


@Injectable()
export class AdInputService {

  constructor(private http: HttpClient, private _creative: CreativeInputService){}

  // Ad String format
  // Network_Program_Season_CreativeGroup_Publisher_Size_CustomDimension
  createAdString(campaignObj, packageObj, placementObj, adObj) {
    if(placementObj.ad_type.abbrev != 'SVD' && placementObj.ad_type.abbrev != 'NSV') {
      let adString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      adObj.creative_group.abbrev + '_' +
      packageObj['publisher']['abbrev'] + '_' +
      placementObj.width + 'x' +
      placementObj.height + '_' +
      adObj.custom
    return adString;

    } else {
      let adString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      adObj.creative_group.abbrev + '_' +
      packageObj['publisher']['abbrev'] + '_' +
      adObj.custom
    return adString;
    }
  }

  createInput(adInput): Observable<any> {

    let subject: Subject<any> = new Subject;
    this.http.post('/ad_inputs', adInput).subscribe(

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

  verifyInput(adInputString): Observable<any>{
    let subject: Subject<any> = new Subject;
    this.http.get('/ad_inputs/' + adInputString, { observe: 'response'}).subscribe(

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

  updateInput(currentAdInput, newAdInput, campaignObj, placementObj): Observable<any> {
    // Need to update the creative strings Send
    // with params
    newAdInput.creativeParams  = [];
    for(let creativeInput of currentAdInput.creative_inputs) {
    let namestring = this._creative.createCreativeString(campaignObj, placementObj, newAdInput, creativeInput);
        let creativeParams  = {
          id: creativeInput.id,
          creative_input_tag: namestring
        }
        newAdInput.creativeParams.push(creativeParams);
    }
   
    let subject: Subject<any> = new Subject;
    this.http.put('/ad_inputs/' + currentAdInput.id, newAdInput).subscribe(

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

