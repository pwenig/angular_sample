import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AdInputService {

  constructor(private http: HttpClient){}

  // Ad String format
  // Network_Program_Season_CreativeGroup_Publisher_Size_CustomDimension
  createAdString(campaignObj, packageObj, placementObj, adObj) {
    if(placementObj.ad_type.abbrev != 'SVD' && placementObj.ad_type.abbrev != 'NSV') {
      let adString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      adObj.creativeGroup.abbrev + '_' +
      packageObj['publisher']['abbrev'] + '_' +
      placementObj.width + 'x' +
      placementObj.height + '_' +
      adObj.custom
    return adString;

    } else {
      let adString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      adObj.creativeGroup.abbrev + '_' +
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

}