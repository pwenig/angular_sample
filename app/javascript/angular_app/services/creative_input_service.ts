import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CreativeInputService {

  constructor(private http: HttpClient){}

  // Network_Program_Season_CreativeGroup_CreativeMessage_CreativeVersion-CustomDimension_
  // CreativeVersionNumber_A/BTestLabel_Size/Length_CreativeFlightDate
  createCreativeString(campaignObj, placementObj, adObj, creativeObj){
    if(placementObj['ad_type']['abbrev'] != 'SVD' && placementObj['ad_type']['abbrev'] != 'NSV') {
      let creativeString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      adObj['creative_group']['abbrev'] + '_' +
      creativeObj.creativeMessage.abbrev + '_' +
      creativeObj.custom + '_' +
      creativeObj.creativeVersion + '_' +
      creativeObj.abtestLabel.abbrev + '_' +
      placementObj['width'] + 'x' +
      placementObj['height'] + '_' +
      creativeObj.startMonth +
      creativeObj.startDay + '-' +
      creativeObj.endMonth +
      creativeObj.endDay
    return creativeString;

    } else {
      let creativeString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      adObj['creative_group']['abbrev'] + '_' +
      creativeObj.creativeMessage.abbrev + '_' +
      creativeObj.custom + '_' +
      creativeObj.creativeVersion + '_' +
      creativeObj.abtestLabel.abbrev + '_' +
      creativeObj.videoLength.name + '_' +
      creativeObj.startMonth +
      creativeObj.startDay + '-' +
      creativeObj.endMonth +
      creativeObj.endDay
    return creativeString;
    }
    
  }

  createInput(creativeInput): Observable<any> {
    let subject: Subject<any> = new Subject;
    this.http.post('/creative_inputs', creativeInput).subscribe(

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

  verifyInput(creativeInputString): Observable<any>{
    let subject: Subject<any> = new Subject;
    this.http.get('/creative_inputs/' + creativeInputString, {observe: 'response'}).subscribe(

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

  getInputs(): Observable<any>{
    let subject: Subject<any> = new Subject;
    this.http.get('/creative_inputs').subscribe(

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

}