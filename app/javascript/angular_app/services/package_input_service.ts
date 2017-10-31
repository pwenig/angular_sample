import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PackageInputService {

  constructor(private http: HttpClient){}

  // Package String format
  // Network_Program_Season_Agency_Publisher_BuyMethod_
  // InventoryType_CustomDimension
  createPackageString(campaignObj, packageObj){
    let packageString = campaignObj['network']['abbrev'] + '_' +
      campaignObj['program']['abbrev'] + '_' +
      campaignObj['season']['abbrev'] + '_' +
      packageObj.agency.abbrev + '_' +
      packageObj.publisher.abbrev + '_' +
      packageObj.buyMethod.abbrev + '_' +
      packageObj.inventoryType.abbrev + '_' +
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

  
}