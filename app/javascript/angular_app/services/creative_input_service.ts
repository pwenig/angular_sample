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
      creativeObj.creative_message.abbrev + '_' +
      creativeObj.custom + '_' +
      creativeObj.creative_version_number + '_' +
      creativeObj.abtest_label.abbrev + '_' +
      placementObj['width'] + 'x' +
      placementObj['height'] + '_' +
      creativeObj.start_year +
      creativeObj.start_month +
      creativeObj.start_day + '-' +
      creativeObj.end_year + 
      creativeObj.end_month +
      creativeObj.end_day
    return creativeString;

    } else {
      let creativeString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      adObj['creative_group']['abbrev'] + '_' +
      creativeObj.creative_message.abbrev + '_' +
      creativeObj.custom + '_' +
      creativeObj.creative_version + '_' +
      creativeObj.abtest_label.abbrev + '_' +
      creativeObj.video_length.name + '_' +
      creativeObj.start_year +
      creativeObj.start_month +
      creativeObj.start_day + '-' +
      creativeObj.end_year +
      creativeObj.end_month +
      creativeObj.end_day
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

  // updateInput
  updateInput(id, creativeInput): Observable<any> {
    let subject: Subject<any> = new Subject;
    this.http.put('/creative_inputs/' + id, creativeInput).subscribe(

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