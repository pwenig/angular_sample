import {Component, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PackageInputService {

  constructor(private http: HttpClient){}

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