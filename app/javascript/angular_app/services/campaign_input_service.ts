import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class CampaignInputService {

  result: any;
  private subject = new Subject<any>();

  constructor(private http: HttpClient){}

  // Creates a new Campaign Input 
  createInput(campaignInput): Observable<any> {

    let subject: Subject<any> = new Subject;
    this.http.post('/campaign_inputs', campaignInput).subscribe(

      (success) => {
        this.result = success;
        subject.next(this.result);
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
        subject.next(res.status);
      },

      (error) => {
        console.log('Error', error);
        subject.error(error);
      }

    )
    return subject.asObservable();
  }
  
}