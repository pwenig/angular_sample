import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CampaignInputService {

  constructor(private http: HttpClient){}

  // Campaign String format
  // Network_Program_Season_CampaignType_CustomDimension_CampaignFlightDate
  createCampaignString(campaignObj){
    let campaignString = campaignObj.network.abbrev + '_' + 
      campaignObj.program.abbrev + '_' +
      campaignObj.season.abbrev + '_' +
      campaignObj.campaignType.abbrev + '_' +
      campaignObj.custom + '_' +
      campaignObj.startYear +
      campaignObj.startMonth +
      campaignObj.startDay + '-' +
      campaignObj.endYear +
      campaignObj.endMonth +
      campaignObj.endDay
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

}